/**
 * voiceConfig.ts — single source of truth for the Gemini TTS voice system.
 *
 * Generation-time ONLY: this file is consumed by `scripts/generate-audio.ts`
 * and (for asset paths) by the VoicePresentation component. The deployed site
 * itself never calls any API — it only plays committed files from
 * `public/audio/english/` and `public/audio/afrikaans/`.
 *
 * Model verified from official Google docs (ai.google.dev, Nov 2026):
 *  - `gemini-3.8-flash-tts`  — 130+ languages incl. English AND Afrikaans;
 *    studio-grade fidelity. Free-of-charge on the Free tier.
 *  - `gemini-3.8-flash-lite-tts` — cheaper workhorse, 100+ languages,
 *    Afrikaans included. Kept here as the fallback switch.
 * Output: WAV (24 kHz, mono, 16-bit PCM) → encoded to MP3 by the generation
 * script via lamejs (dev-only dependency).
 */

/** The TTS model used for generation (switch to flash-lite only if quota demands). */
export const TTS_MODEL = 'gemini-3.8-flash-tts';

/** Sample rate of Gemini TTS audio output (docs default). */
export const AUDIO_SAMPLE_RATE = 24000;

/** MP3 bitrate for the committed narration files (mono voice, 96 kbps is transparent). */
export const MP3_BITRATE_KBPS = 96;

/**
 * The two narrator voices.
 *
 * CASTING PENDING — these descriptions are the two personas from the project
 * brief; the concrete voice IDs only lock in after the user has personally
 * listened to and approved the two sample lines produced by
 * `npm run voice:sample`. `script` is the turn-level delivery style
 * (`speech_metadata.style` in the official Gemini 3.8 TTS API).
 */
export interface VoicePersona {
  /** Prebuilt or Extended Voice Library voice name/ID (env-overridable). */
  voice: string;
  /** Turn-level delivery style passed as speech_metadata.style. */
  style: string;
  /** Human label for logs and the sample player. */
  label: string;
}

export const VOICE_EN: VoicePersona = {
  voice: 'en-za-training-6',
  style: 'warm, friendly and confident, conversational and lightly playful — a charming young presenter, not theatrical',
  label: 'English — 25yo Cape Town English female, young/warm/soothing presenter (Extended Library en-za-training-6)',
};

export const VOICE_AF: VoicePersona = {
  voice: 'nl-nl-assistant-3',
  style: 'warm, relaxed and friendly, natural conversational Afrikaans — clear pronunciation, no newsreader formality',
  label: 'Afrikaans — youthful Dutch-branch male rendering native-family Afrikaans (Extended Library nl-nl-assistant-3)',
};

/** Committed audio asset layout: /public/audio/<folder>/<page>-<lineId>.mp3 */
export const AUDIO_DIR_REL = {
  en: 'public/audio/english',
  af: 'public/audio/afrikaans',
} as const;

/** Sample-output directory for the two audition lines (gitignored, never committed). */
export const SAMPLES_DIR_REL = 'voice-samples';

/** Browser URL for a committed narration file. */
export function audioUrl(page: string, lineId: string, lang: 'en' | 'af'): string {
  return `/audio/${lang === 'af' ? 'afrikaans' : 'english'}/${page}-${lineId}.mp3`;
}
