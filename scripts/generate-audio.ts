/// <reference types="node" />
/**
 * generate-audio.ts — Gemini TTS voice-narration generator.
 *
 * The visitor-facing site NEVER calls an API: it plays committed MP3 files.
 * This script is the only place where Google's Gemini TTS is used, locally,
 * with the key from `.env` (gitignored).
 *
 * Commands:
 *   npm run voice:list      — list real voice-library candidates for casting
 *                             (Extended/prebuilt voices with language, gender,
 *                             accent, persona metadata).
 *   npm run voice:sample    — generate EXACTLY two audition lines (one per
 *                             voice persona) into `voice-samples/` (gitignored,
 *                             never committed). For user listen/approval.
 *   npm run voice:generate  — generate the full narration library into
 *                             `public/audio/english|afrikaans/`. Resumable:
 *                             existing files are skipped; use --force to
 *                             regenerate. Quota failures STOP generation with
 *                             a clear error — never silently anything else.
 *
 * Setup:
 *   1. Create `.env` (gitignored) containing `GOOGLE_API_KEY=` (Google AI
 *      Studio → Get API key).
 *      Optional voice overrides: GOOGLE_VOICE_EN=..., GOOGLE_VOICE_AF=...
 *   2. Run the command for the mode you want.
 *
 * Docs verified (ai.google.dev, Nov 2026): gemini-3.8-flash-tts supports
 * English AND Afrikaans; unary requests return WAV (24 kHz mono, 16-bit PCM),
 * which this script encodes to MP3 via lamejs (dev-only, LGPL-3.0).
 */
import 'dotenv/config';
import {
  existsSync,
  mkdirSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { GoogleGenAI } from '@google/genai';
import {
  AUDIO_DIR_REL,
  AUDIO_SAMPLE_RATE,
  MP3_BITRATE_KBPS,
  SAMPLES_DIR_REL,
  TTS_MODEL,
  VOICE_AF,
  VOICE_EN,
  type VoicePersona,
} from '../src/lib/voiceConfig';
import { home, retail, mall, type Script } from '../src/lib/voiceScripts';

const req = createRequire(import.meta.url);

/* ── lamejs (dev-only MP3 encoder) ─────────────────────────────────────────── */
type Mp3EncoderCtor = new (channels: number, sampleRate: number, bitrate: number) => {
  encodeBuffer(data: Int16Array): Uint8Array;
  flush(): Uint8Array;
};
// lamejs expects its internal modules as globals (known upstream issue #86).
(globalThis as Record<string, unknown>).MPEGMode = req('lamejs/src/js/MPEGMode');
(globalThis as Record<string, unknown>).Lame = req('lamejs/src/js/Lame');
(globalThis as Record<string, unknown>).BitStream = req('lamejs/src/js/BitStream');
const lamejs = req('lamejs') as { Mp3Encoder: Mp3EncoderCtor };

/* ── helpers ───────────────────────────────────────────────────────────────── */
const FORCE = process.argv.includes('--force');
const SAMPLE = process.argv.includes('--sample');
const LIST_VOICES = process.argv.includes('--list-voices');

/**
 * API keys, most preferred first. Free-tier daily quota attaches to each Google
 * PROJECT, so an extra key created in a second AI Studio project carries its
 * own daily allowance for the SAME model and voices. Rotation is always loud:
 * every switch is announced in the log, never silent.
 */
const apiKeys = [
  process.env.GOOGLE_API_KEY,
  process.env.GOOGLE_API_KEY_2,
  process.env.GOOGLE_API_KEY_3,
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
].filter((k): k is string => Boolean(k?.trim()));
let keyIndex = 0;
const model = process.env.GOOGLE_MODEL?.trim() || TTS_MODEL;
const voiceFor: Record<'en' | 'af', VoicePersona> = {
  en: process.env.GOOGLE_VOICE_EN ? { ...VOICE_EN, voice: process.env.GOOGLE_VOICE_EN.trim() } : VOICE_EN,
  af: process.env.GOOGLE_VOICE_AF ? { ...VOICE_AF, voice: process.env.GOOGLE_VOICE_AF.trim() } : VOICE_AF,
};

function requireKey(): void {
  if (apiKeys.length === 0) {
    console.error(
      'GOOGLE_API_KEY missing — create a local .env (gitignored) with\n' +
        '  GOOGLE_API_KEY=<key from aistudio.google.com/api-keys>\n' +
        'Optional extra keys (each from a separate Google project, each with its\n' +
        'own daily free quota): GOOGLE_API_KEY_2, GOOGLE_API_KEY_3.\n' +
        'No key, no generation.'
    );
    process.exit(1);
  }
}

/** Detect quota exhaustion so we STOP with a clear error instead of limping on. */
function isQuotaError(err: unknown): boolean {
  const msg = String((err as { message?: string })?.message ?? err);
  return /\b429\b|RESOURCE_EXHAUSTED|quota/i.test(msg);
}

/** Per-minute throttling (retry shortly) vs per-day exhaustion (switch key / stop). */
function isPerMinuteLimit(err: unknown): boolean {
  return /per minute/i.test(String((err as { message?: string })?.message ?? err));
}

/** Parse "retry in 1h2m3s" from the API error; default to just over a minute. */
function retryDelayMs(err: unknown): number {
  const msg = String((err as { message?: string })?.message ?? err);
  const m = msg.match(/retry in (?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
  if (!m) return 65_000;
  const ms = (Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0)) * 1000;
  return ms > 0 ? ms : 65_000;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * WAV (Unisys RIFF) payload extraction: returns the raw 16-bit mono PCM.
 * Gemini TTS unary responses are complete WAV files per the docs; we locate
 * the fmt + data chunks robustly instead of assuming a fixed 44-byte header.
 */
function wavToPcm(wav: Buffer): { pcm: Buffer; sampleRate: number } {
  if (wav.toString('ascii', 0, 4) !== 'RIFF') throw new Error('TTS response is not a WAV file');
  const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
  let offset = 12;
  let sampleRate = AUDIO_SAMPLE_RATE;
  let bitsPerSample = 16;
  const u32 = (o: number) => wav.readUInt32LE(o);
  while (offset + 8 <= wav.length) {
    const id = wav.toString('ascii', offset, offset + 4);
    const size = u32(offset + 4);
    if (id === 'fmt ') {
      sampleRate = u32(offset + 12);
      bitsPerSample = wav.readUInt16LE(offset + 22);
    } else if (id === 'data') {
      const pcm = wav.subarray(offset + 8, offset + 8 + size);
      if (bitsPerSample !== 16) throw new Error(`unexpected PCM width: ${bitsPerSample}-bit`);
      return { pcm, sampleRate };
    }
    offset += 8 + size + (size % 2);
  }
  throw new Error('WAV data chunk not found');
}

/** Encode mono 16-bit PCM → MP3 (lamejs). */
function pcmToMp3(pcm: Buffer, sampleRate: number): Buffer {
  const encoder = new lamejs.Mp3Encoder(1, sampleRate, MP3_BITRATE_KBPS);
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.byteLength / 2));
  const CHUNK = 1152;
  const parts: Buffer[] = [];
  for (let i = 0; i < samples.length; i += CHUNK) {
    const out = encoder.encodeBuffer(samples.subarray(i, i + CHUNK));
    if (out.length > 0) parts.push(Buffer.from(out));
  }
  const tail = encoder.flush();
  if (tail.length > 0) parts.push(Buffer.from(tail));
  return Buffer.concat(parts);
}

/** One Gemini TTS request → MP3 bytes. Pure generation, no file IO. */
async function generateLine(text: string, persona: VoicePersona, key: string): Promise<Buffer> {
  const ai = new GoogleGenAI({ apiKey: key });
  // Legacy TTS models (e.g. 3.1 preview) reject speech_metadata; only the
  // 3.8 family accepts turn-level style control.
  const supportsStyle = !/3\.1|2\.5/.test(model);
  const interaction = await ai.interactions.create({
    model,
    input: [
      {
        type: 'user_input',
        content: [
          {
            type: 'text',
            text,
            ...(supportsStyle
              ? { annotations: [{ type: 'speech_metadata', style: persona.style }] }
              : {}),
          },
        ],
      },
    ],
    response_format: { type: 'audio' },
    generation_config: {
      speech_config: [{ voice: persona.voice }],
    },
  });
  const data = interaction.output_audio?.data;
  if (!data) throw new Error('TTS response contained no audio data');
  const { pcm, sampleRate } = wavToPcm(Buffer.from(data, 'base64'));
  return pcmToMp3(pcm, sampleRate);
}

interface Job {
  file: string;      // <dir>/<file>
  text: string;
  persona: VoicePersona;
  lang: 'en' | 'af';
}

/* ── --list-voices: real casting data (no guessing) ────────────────────────── */
async function listVoices(): Promise<void> {
  requireKey();
  const ai = new GoogleGenAI({ apiKey: apiKeys[0] });
  for (const query of [
    { lang: 'en', title: 'ENGLISH — female candidates' },
    { lang: 'af', title: 'AFRIKAANS — male candidates' },
  ]) {
    console.log(`\n=== ${query.title} ===`);
    const res = await (ai as unknown as {
      voices: {
        list: (q: Record<string, unknown>) => Promise<{ voices?: Array<Record<string, unknown>> }>;
      };
    }).voices.list({
      language_code: [query.lang],
      gender: query.lang === 'en' ? ['female'] : ['male'],
      type: ['prebuilt'],
      page_size: 200,
    });
    for (const v of res.voices ?? []) {
      const row = [
        String(v.display_name ?? v.id ?? '?'),
        String(v.language_code ?? ''),
        String(v.accent ?? '—'),
        String(v.gender ?? '—'),
        `pitch=${String(v.pitch ?? '—')}`,
        String(v.description ?? '').slice(0, 90),
      ].join(' | ');
      console.log(row);
    }
    if (!res.voices?.length) console.log('(no prebuilt voices returned — check AI Studio voice library)');
  }
}

/* ── job building ──────────────────────────────────────────────────────────── */
const scripts: Record<string, Script> = { home, retail, mall };

function fullJobs(): Job[] {
  const jobs: Job[] = [];
  for (const [page, script] of Object.entries(scripts)) {
    for (const lang of ['en', 'af'] as const) {
      const intro = lang === 'af' ? script.introAf : script.introEn;
      const lines = lang === 'af' ? script.af : script.en;
      // A language whose narration copy is not yet written is simply skipped —
      // the site handles the missing assets gracefully. Note: intro-only pages
      // (home) have empty `lines` but a real intro — never drop those.
      const hasNarration = lines.length > 0;
      const hasIntro = intro.trim().length > 0;
      if (!hasNarration && !hasIntro) continue;
      if (hasIntro) {
        jobs.push({
          file: `${page}-intro.mp3`,
          text: intro,
          persona: voiceFor[lang],
          lang,
        });
      }
      for (const line of lines) {
        jobs.push({ file: `${page}-${line.id}.mp3`, text: line.text, persona: voiceFor[lang], lang });
      }
    }
  }
  return jobs;
}

/** Exactly the two audition lines — this mode never generates anything else. */
function sampleJobs(): Job[] {
  const enText =
    "Welcome to Onawa Studio. I'm your personal guide. Shall I show you what we could do for you, section by section? Take a look around — I'll walk you through it.";
  const afText =
    "Welkom by Onawa Studio. Ek is jou persoonlike gids. Wys ons jou wat ons vir jou kan doen, afdeling vir afdeling? Neem jou tyd — ek loop jou deur alles.";
  return [
    { file: 'en-sample.mp3', text: enText, persona: voiceFor.en, lang: 'en' },
    { file: 'af-sample.mp3', text: afText, persona: voiceFor.af, lang: 'af' },
  ];
}

/* ── main ──────────────────────────────────────────────────────────────────── */
async function run(): Promise<void> {
  if (LIST_VOICES) return listVoices();

  requireKey();
  const jobs = SAMPLE ? sampleJobs() : fullJobs();
  const pending = SAMPLE
    ? jobs // samples always regenerate so casting iterations are cheap and fresh
    : jobs.filter((j) => !existsSync(join(AUDIO_DIR_REL[j.lang], j.file)));


  if (pending.length === 0) {
    console.log('All narration files already generated — nothing to do (use --force to regenerate).');
    console.log(`(${jobs.length} lines total, committed files reused for every visitor)`);
    return;
  }

  console.log(`Generating ${pending.length} file(s) with ${model}...`);
  console.log(
    `Keys available: ${apiKeys.length} (daily quota is per Google project; ` +
      'switches are announced here, never silent).'
  );
  let generated = 0;
  let failed = 0;

  for (const job of pending) {
    const dir = SAMPLE ? SAMPLES_DIR_REL : AUDIO_DIR_REL[job.lang];
    const absPath = join(dir, job.file);
    mkdirSync(dir, { recursive: true });

    // Retry loop: per-minute throttling waits and retries; daily exhaustion
    // rotates to the next key (each key = its own project = its own daily free
    // allowance) and retries THIS file. Stop loudly when every key is drained.
    let rpmWaits = 0;
    for (;;) {
      try {
        const mp3 = await generateLine(job.text, job.persona, apiKeys[keyIndex]);
        writeFileSync(absPath, mp3);
        generated++;
        console.log(`✓ ${job.file}  ${(mp3.length / 1024).toFixed(0)} KB  [${job.persona.voice}]`);
        break;
      } catch (err) {
        if (isQuotaError(err) && isPerMinuteLimit(err)) {
          rpmWaits++;
          if (rpmWaits > 6) {
            failed++;
            console.error(`\n✗ ${job.file} — per-minute limit persisted after ${rpmWaits - 1} waits; skipping.`);
            break;
          }
          const wait = retryDelayMs(err) + 1500;
          console.log(
            `\n→ Per-minute limit hit; waiting ${Math.ceil(wait / 1000)}s, then retrying ${job.file}...`
          );
          await sleep(wait);
          continue;
        }
        if (isQuotaError(err) && keyIndex < apiKeys.length - 1) {
          keyIndex++;
          console.log(
            `\n→ Daily cap reached on key #${keyIndex}. Switching to key #${keyIndex + 1} ` +
              `(own project, same model ${model}, same voices). Retrying ${job.file}...`
          );
          continue;
        }
        if (isQuotaError(err)) {
          console.error(`\n✗ FREE QUOTA EXHAUSTED on ALL ${apiKeys.length} key(s) while generating ${job.file}.`);
          console.error(String(err).slice(0, 400));
          console.error(
            'Generation stopped on purpose. Committed audio keeps playing for every visitor; ' +
              're-run npm run voice:generate later (existing files are skipped, so it resumes).'
          );
          process.exit(1);
        }
        failed++;
        console.error(`\n✗ ${job.file} — ${String(err).slice(0, 400)}`);
        break;
      }
    }
    // Pace the free-tier requests; TTS models have low per-minute limits.
    await sleep(2500);
  }

  console.log(`\nDone: ${generated} generated${failed ? `, ${failed} FAILED` : ''}.`);
  if (SAMPLE) {
    console.log(`Two audition files are ready in ./${SAMPLES_DIR_REL}/ — listen, then approve or recast.`);
    console.log('Nothing has been committed and no other narration was generated.');
  }
  if (failed > 0) process.exitCode = 1;
}

await run();


