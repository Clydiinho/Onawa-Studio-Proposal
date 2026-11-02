/// <reference types="node" />
/**
 * Pre-generates the voice-guide narration as static MP3s (no runtime TTS).
 *
 * Usage:
 *   1. Create a local `.env` (gitignored) with:
 *        ELEVENLABS_API_KEY=...      (from elevenlabs.io -> Profile -> API keys)
 *        TTS_VOICE_ID_EN=...         (the narrator voice for English)
 *        TTS_VOICE_ID_AF=...         (optional, Afrikaans narrator voice)
 *        # Optional per-language model override. Default: eleven_multilingual_v2.
 *        # NOTE: Afrikaans is likely only supported by `eleven_v3` — check
 *        # elevenlabs.io/docs/models for your plan's model/language coverage.
 *        TTS_MODEL_EN=eleven_multilingual_v2
 *        TTS_MODEL_AF=eleven_v3
 *   2. Run:  npm run voice:generate
 *   3. Files land in public/voice/<page>-<lineId>-<lang>.mp3; commit them.
 *      Re-run only when narration text changes (existing files are skipped;
 *      pass --force to regenerate).
 *
 * Runs entirely free on the ElevenLabs free tier (10k chars/month) — the
 * whole tour is ~3.9k characters once. Deployed playback then serves plain
 * static files (CDN-cached) with zero API usage at runtime.
 */
import 'dotenv/config';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { home, retail, mall, type Script } from '../src/lib/voiceScripts';

const AUDIO_DIR = join(process.cwd(), 'public', 'voice');
const FORCE = process.argv.includes('--force');

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error('ELEVENLABS_API_KEY missing — add it to .env (see header of scripts/generate-voice.ts).');
  process.exit(1);
}

const scripts: Record<string, Script> = { home, retail, mall };

interface Job { file: string; voiceId: string; text: string; lang: 'en' | 'af'; }
const jobs: Job[] = [];

for (const [page, script] of Object.entries(scripts)) {
  for (const lang of ['en', 'af'] as const) {
    const voiceId = lang === 'af' ? process.env.TTS_VOICE_ID_AF : process.env.TTS_VOICE_ID_EN;
    if (!voiceId) continue;
    const intro = lang === 'af' ? script.introAf : script.introEn;
    const lines = (lang === 'af' ? script.af : script.en).map(l => ({ id: l.id, text: l.text }));
    // Only generate a language whose section lines exist (af stays empty by
    // design until its narration is approved — then the toggle switches on).
    if (lines.length === 0) continue;
    if (intro && intro.trim().length > 0) {
      jobs.push({ file: `${page}-intro-${lang}.mp3`, voiceId, text: intro, lang });
    }
    for (const l of lines) jobs.push({ file: `${page}-${l.id}-${lang}.mp3`, voiceId, text: l.text, lang });
  }
}

const toRun = FORCE ? jobs : jobs.filter(j => !existsSync(join(AUDIO_DIR, j.file)));

console.log(AUDIO_DIR);
if (toRun.length === 0) {
  console.log('All narration files already generated — nothing to do (use --force to regenerate).');
  console.log(`(${jobs.length} total lines available)`);
  process.exit(0);
}

console.log(`Generating ${toRun.length} narration file(s)...`);
let totalChars = 0;
let failed = 0;

for (const job of toRun) {
  const model = (job.lang === 'af' ? process.env.TTS_MODEL_AF : process.env.TTS_MODEL_EN) ?? 'eleven_multilingual_v2';
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${job.voiceId}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({ text: job.text, model_id: model }),
    }
  );

  if (!res.ok) {
    failed++;
    console.error(`\n✗ ${job.file} — HTTP ${res.status}`);
    console.error((await res.text()).slice(0, 400));
    continue;
  }

  const bytes = Buffer.from(await res.arrayBuffer());
  mkdirSync(AUDIO_DIR, { recursive: true });
  writeFileSync(join(AUDIO_DIR, job.file), bytes);
  totalChars += job.text.length;
  console.log(`✓ ${job.file} (${(bytes.length / 1024).toFixed(0)} KB)`);

  // Free tier has low concurrency limits — pace the requests.
  await new Promise(r => setTimeout(r, 400));
}

console.log(`\nDone. ${toRun.length - failed} generated (~${totalChars} characters).`);
if (failed > 0) console.error(`${failed} line(s) FAILED — fix the error above and re-run (already-generated files are skipped).`);
