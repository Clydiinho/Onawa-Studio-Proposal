/// <reference types="node" />
/**
 * Language-aware TTS endpoint (Vercel AI Gateway → ElevenLabs eleven-v3).
 *
 * GET /api/tts?text=...&lang=en|af
 *
 * - GET (not POST) so the browser HTTP-caches each narration line:
 *   repeat views are instant and cost ~0 credits.
 * - Voice is selected per language via TTS_VOICE_ID_EN / TTS_VOICE_ID_AF.
 * - While TTS_VOICE_ID_AF is unset, Afrikaans requests fail fast (500);
 *   the site's voice scripts keep `af` empty until the narration is ready.
 *
 * Auth: AI_GATEWAY_API_KEY environment variable. Set it in Vercel project
 * settings (Apply to: Production, Preview, Development).
 *
 * NOTE (SDK): installed `ai` v7 exposes stable `generateSpeech` (the
 * `experimental_generateSpeech` alias is deprecated) and the gateway provider
 * via `createGateway` from 'ai' itself. The `@ai-sdk/ai-gateway` package name
 * does not exist on the npm registry; `@ai-sdk/gateway` is installed
 * transitively by `ai` and `createGateway`/`gateway` re-export its provider.
 * Model must be built with `.speech(...)` — the plain callable shorthand
 * `gateway('elevenlabs/eleven-v3')` resolves a LANGUAGE model, not a
 * speech model.
 */
import { generateSpeech, createGateway } from 'ai';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  const lang = searchParams.get('lang') === 'af' ? 'af' : 'en';

  if (!text) return new Response('text required', { status: 400 });

  const voiceId =
    lang === 'af' ? process.env.TTS_VOICE_ID_AF : process.env.TTS_VOICE_ID_EN;
  if (!voiceId) return new Response('voice id missing', { status: 500 });

  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) return new Response('AI_GATEWAY_API_KEY not configured', { status: 500 });

  // Created per-request so a missing/rotated key never breaks module load.
  const gateway = createGateway({ apiKey });

  try {
    const result = await generateSpeech({
      model: gateway.speech('elevenlabs/eleven-v3'),
      voice: voiceId,
      text,
      outputFormat: 'mp3',
    });

    // Copy into a fresh ArrayBuffer-backed array: TS 7's DOM lib only accepts
    // `Uint8Array<ArrayBuffer>` as a Response body, and the SDK result is
    // typed `Uint8Array<ArrayBufferLike>`. (Cheap single pass over a few hundred KB.)
    const body = new Uint8Array(result.audio.uint8Array);

    return new Response(body, {
      headers: {
        'Content-Type': 'audio/mp3',
        // Immutable: narration text is part of the URL, so the same URL is
        // always the same audio — safe to cache for a year.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    // Surface gateway/TTS failures in the Vercel function logs AND in the
    // response body (AI SDK error messages contain model id/status, no
    // secrets, so this is safe to expose) — makes deployed debugging possible.
    console.error(`[tts] lang=${lang} text=${text.slice(0, 80)}...`, err);
    const detail = err instanceof Error ? err.message.slice(0, 300) : String(err);
    return new Response(`tts generation failed: ${detail}`, { status: 502 });
  }
}
