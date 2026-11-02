# Voice-Over Guide — Gemini TTS (pre-generated, free, zero runtime API)

The website's voice tour plays **committed audio files** — the deployed site
never calls any TTS API, so visitors cost nothing and playback works even when
the Google API is down or out of quota.

## How it works

```
src/lib/voiceScripts.ts          narration copy (EN + AF), one entry per section
src/lib/voiceConfig.ts           model, voices, audio paths
scripts/generate-audio.ts        the ONLY place TTS runs (local, .env key)
public/audio/english/*.mp3       ← committed files every visitor replays
public/audio/afrikaans/*.mp3     ← same, Afrikaans
```

Language follows the site-wide ENGLISH/AFRIKAANS toggle
(`localStorage: onawa_lang`). English is the default. If Afrikaans narration
is missing, the player shows "AF AUDIO PENDING" and never substitutes English
audio.

## Setup (local, one time)

1. Create `.env` (already gitignored):

   ```
   GOOGLE_API_KEY=<key from https://aistudio.google.com/api-keys>
   ```

2. Commands:

   | Command | What it does | Cost |
   |---|---|---|
   | `npm run voice:list` | dump real voice-library candidates (language/gender/accent/persona) for casting | 0 API calls |
   | `npm run voice:sample` | exactly **two** short audition lines into `voice-samples/` (gitignored) — listen before approving | 2 calls |
   | `npm run voice:generate` | full library into `public/audio/…`. Resumable: existing files are skipped (`--force` to redo) | skipped per existing file |

   If the free quota is exhausted, generation **stops with a clear error** and
   resumes where it left off on a later run. It never switches to a paid
   service, and the committed audio keeps playing for visitors regardless.

## Regenerating audio

Only needed when narration copy, voice choice or model changes
(`src/lib/voiceScripts.ts` / `voiceConfig.ts`):

```bash
npm run voice:generate -- --force      # or edit + plain regenerate (resumable)
git add public/audio
git commit -m "voice: refresh narration audio"
```

## Model & facts (verified from official docs, Nov 2026)

- Model: `gemini-3.8-flash-tts` (English + Afrikaans supported).
- Free tier: generation free of charge (rate-limited per AI Studio dashboard).
- Audio: WAV (24 kHz, mono, 16-bit) → MP3 96 kbps mono via `lamejs`
  (dev-only dependency, never shipped to visitors).
