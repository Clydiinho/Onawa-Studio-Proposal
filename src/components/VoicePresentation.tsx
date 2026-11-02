'use client';
/**
 * VoicePresentation — pre-generated, static-only guided sales tour.
 *
 * NOT a chatbot: no chat UI, no composer, no API calls. It plays committed
 * MP3 files from /public/audio/<english|afrikaans>/ produced by
 * `npm run voice:generate` (see scripts/generate-audio.ts).
 *
 * Contracts (from the project brief):
 *  - Language follows the SITE-WIDE EN/AF toggle (localStorage `onawa_lang`),
 *    never a separate voice-only switch.
 *  - If the page language is Afrikaans but no Afrikaans narration has been
 *    generated (script.af empty), the player shows "AF AUDIO PENDING" and
 *    stays quiet — English audio is NEVER substituted.
 *  - Browsers block gestureless autoplay: the tour tries to start (homepage
 *    welcome) and if playback is refused, a discreet START PRESENTATION
 *    button appears. Nothing bypasses browser policy.
 *  - Narration auto-pauses when the section being narrated leaves the
 *    visitor's view; resuming is manual. No force-scroll, no auto-navigation.
 *  - Single audio element — overlapping/duplicate playback is impossible.
 *  - Section leaving/arriving uses the existing section anchor ids
 *    (problem/solution/proof/offers on both proposal pages); the short
 *    closing "next steps" line auto-follows the packages section.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Script, VoiceLine } from '../lib/voiceScripts';
import { audioUrl } from '../lib/voiceConfig';
import { useLanguage } from '../data/language';

export type VoicePage = 'home' | 'retail' | 'mall';

interface Props {
  page: VoicePage;
  script: Script;
  /** Home page: attempt the welcome automatically on landing. */
  autoStart?: boolean;
  /** Optional selector of cards/buttons to pulse gently while the welcome mentions them. */
  pulseSelector?: string;
}

type Status = 'idle' | 'playing' | 'paused' | 'blocked' | 'done';

export function VoicePresentation({ page, script, autoStart = false, pulseSelector }: Props) {
  const { lang } = useLanguage();
  const afReady = script.af.length > 0;
  const langReady = lang === 'en' || afReady;

  const lines: VoiceLine[] = useMemo(() => {
    if (lang === 'af' && !afReady) return [];
    const intro = lang === 'af' ? script.introAf : script.introEn;
    const body = lang === 'af' ? script.af : script.en;
    const all: VoiceLine[] = [];
    if (intro.trim().length > 0) all.push({ id: 'intro', label: 'Welcome', text: intro });
    all.push(...body);
    return all;
  }, [lang, afReady, script]);

  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [label, setLabel] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lineRef = useRef<VoiceLine | null>(null);
  const playedRef = useRef<Set<string>>(new Set());
  const statusRef = useRef<Status>('idle');
  const speakingRef = useRef(false);
  statusRef.current = status;

  /* ── visual feedback helpers (subtle, CSS-only, Onawa identity) ── */
  const glowSection = useCallback((id: string | undefined) => {
    document.querySelectorAll<HTMLElement>('.vp-glow').forEach((el) => el.classList.remove('vp-glow'));
    if (!id || id === 'intro') return;
    document.getElementById(id)?.classList.add('vp-glow');
  }, []);

  const pulseNodes = useCallback(
    (on: boolean) => {
      if (!pulseSelector) return;
      document.querySelectorAll<HTMLElement>(pulseSelector).forEach((el) => {
        el.classList.toggle('vp-pulse', on);
      });
    },
    [pulseSelector]
  );

  const stopAudio = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
      audioRef.current = null;
    }
    speakingRef.current = false;
    pulseNodes(false);
    glowSection(undefined);
  }, [pulseNodes, glowSection]);

  /* ── core playback ── */
  const speak = useCallback(
    (line: VoiceLine) => {
      if (!langReady) {
        setLabel('AF AUDIO COMING SOON');
        return;
      }
      stopAudio();
      lineRef.current = line;
      playedRef.current.add(line.id);
      setLabel(line.label);

      const audio = new Audio(audioUrl(page, line.id, lang));
      audio.muted = muted;
      audioRef.current = audio;

      audio.addEventListener('play', () => {
        speakingRef.current = true;
        setStatus('playing');
        glowSection(line.id);
        if (line.id === 'intro') pulseNodes(true);
      });
      audio.addEventListener('ended', () => {
        speakingRef.current = false;
        setStatus('idle');
        glowSection(undefined);
        if (line.id === 'intro') pulseNodes(false);
        // The approved short closing line follows the packages section.
        if (line.id === 'offers') {
          const closing = lines.find((l) => l.id === 'next-steps');
          if (closing && !playedRef.current.has('next-steps')) {
            speak(closing);
            return;
          }
        }
        if (line.id === 'next-steps') setStatus('done');
      });
      audio.addEventListener('error', () => {
        // Missing committed asset: skip this line gracefully — NEVER swap in
        // a different language's audio.
        if (audioRef.current !== audio) return;
        speakingRef.current = false;
        playedRef.current.add(line.id);
        setStatus('idle');
        setLabel(lang === 'af' ? 'AF AUDIO PENDING' : 'AUDIO PENDING');
        glowSection(undefined);
        if (line.id === 'intro') pulseNodes(false);
      });
      audio.play().catch((err: unknown) => {
        if ((err as DOMException)?.name === 'NotAllowedError') setStatus('blocked');
      });
    },
    [glowSection, lang, langReady, lines, muted, page, pulseNodes, stopAudio]
  );

  /* ── controls ── */
  const start = useCallback(() => {
    setStarted(true);
    const introLine = lines.find((l) => l.id === 'intro');
    if (introLine) speak(introLine);
  }, [lines, speak]);

  const pauseOrResume = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch(() => setStatus('blocked'));
    } else {
      a.pause();
    }
  }, []);

  const replaySection = useCallback(() => {
    const line = lineRef.current;
    if (!line) return;
    // Replay = restart from the beginning of the SAME section's audio.
    playedRef.current.delete(line.id);
    speak(line);
  }, [speak]);

  const skip = useCallback(() => {
    const current = lineRef.current;
    stopAudio();
    if (current) playedRef.current.add(current.id);
    if (current?.id === 'offers') {
      const closing = lines.find((l) => l.id === 'next-steps');
      if (closing && !playedRef.current.has('next-steps')) {
        speak(closing);
        return;
      }
    }
    const order = lines.map((l) => l.id);
    const from = current ? order.indexOf(current.id) : -1;
    const next = lines.slice(from + 1).find((l) => !playedRef.current.has(l.id));
    if (next) {
      // Only continue if the next section is actually on screen — the tour
      // never narrates content the visitor cannot see. If it isn't in view
      // yet, scrolling to it will trigger it (it stays unplayed).
      const el = document.getElementById(next.id);
      const inView = el ? el.getBoundingClientRect().top < window.innerHeight * 0.95 : false;
      if (inView) speak(next);
      else {
        setLabel('Ready');
        setStatus('idle');
      }
    } else setStatus('done');
  }, [lines, speak, stopAudio]);


  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  const endTour = useCallback(() => {
    stopAudio();
    lineRef.current = null;
    playedRef.current.clear();
    setStarted(false);
    setStatus('idle');
    setLabel(null);
  }, [stopAudio]);

  const retryTap = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.play()
      .then(() => setStatus('playing'))
      .catch(() => setStatus('blocked'));
  }, []);

  /* ── effects ── */
  // Language switch mid-tour: stop immediately — audio must never echo a
  // language different from the text on screen.
  useEffect(() => {
    stopAudio();
    if (lang === 'af' && !afReady) setLabel('AF AUDIO COMING SOON');
  }, [lang, afReady, stopAudio]);

  // Unmount: kill audio (page switches must not leave narration talking).
  useEffect(() => stopAudio, [stopAudio]);

  // Homepage welcome: attempt to begin on landing (autoplay policy may
  // refuse — the START PRESENTATION pill appears in that case).
  useEffect(() => {
    if (autoStart && !started) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  // In-view sequencing + auto-pause when the narrated section leaves view.
  useEffect(() => {
    if (!started) return;
    const targets = lines.filter((l) => l.id !== 'intro' && l.id !== 'next-steps');
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (!entry.isIntersecting) {
            // Narrated section scrolled out of the visitor's control → pause
            // (manual resume; no force-scroll, no auto-navigation).
            if (lineRef.current?.id === id && speakingRef.current) audioRef.current?.pause();
            continue;
          }
          if (playedRef.current.has(id)) continue;
          const line = targets.find((l) => l.id === id);
          if (line) speak(line);
        }
      },
      { threshold: 0.3 }
    );
    targets.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [started, lines, speak]);

  /* ── render ── */
  if (!started) {
    return (
      <button
        onClick={start}
        className="fixed bottom-5 left-5 z-[60] inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#1c1c1e] text-white text-xs font-mono tracking-wider shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] hover:bg-[#DB0C36] transition-colors cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" /> START PRESENTATION
      </button>
    );
  }

  const playing = status === 'playing';

  return (
    <>
      <style>{`
        @keyframes vpWave { 0%,100% { transform: scaleY(.35); } 50% { transform: scaleY(1); } }
        .vp-wave { display:inline-flex; align-items:center; gap:2px; height:14px; }
        .vp-wave span { display:block; width:2px; border-radius:1px; background:#ccff00; height:14px; transform-origin:center; }
        .vp-wave.on span { animation: vpWave 1s ease-in-out infinite; }
        .vp-wave.on span:nth-child(2) { animation-delay:.12s; }
        .vp-wave.on span:nth-child(3) { animation-delay:.24s; }
        .vp-wave.on span:nth-child(4) { animation-delay:.36s; }
        .vp-wave:not(.on) span { transform: scaleY(.35); transition: transform .4s ease; }
        @keyframes vpPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(204,255,0,.45); } 55% { box-shadow: 0 0 0 14px rgba(204,255,0,0); } }
        .vp-pulse { animation: vpPulse 1.9s ease-in-out infinite; }
        .vp-glow { box-shadow: 0 0 0 2px rgba(204,255,0,.28), 0 0 34px rgba(204,255,0,.14) !important; transition: box-shadow .7s ease; }
      `}</style>

      <div className="fixed bottom-5 left-5 z-[60] flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1c1c1e]/85 backdrop-blur-md text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] border border-white/10 max-w-[calc(100vw-2.5rem)]">
        <span className={`vp-wave ${playing ? 'on' : ''}`} aria-hidden="true">
          <span /><span /><span /><span />
        </span>
        {(status === 'blocked') ? (
          <button
            onClick={retryTap}
            className="text-[11px] font-mono font-bold tracking-wider text-[#ccff00] truncate cursor-pointer"
          >
            START PRESENTATION
          </button>
        ) : (
          <span className="text-[11px] font-mono tracking-wider text-zinc-300 truncate max-w-[110px] sm:max-w-[150px]">
            {label ?? 'Ready'}
          </span>
        )}
        <span className="w-px h-4 bg-white/15 mx-0.5" />
        <button
          onClick={pauseOrResume}
          disabled={status === 'idle' || status === 'done'}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center cursor-pointer"
          aria-label={status === 'paused' ? 'Resume narration' : 'Pause narration'}
        >
          {status === 'paused' ? '▶' : '⏸'}
        </button>
        <button
          onClick={replaySection}
          disabled={!lineRef.current}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center cursor-pointer"
          aria-label="Replay this section"
        >
          ↺
        </button>
        <button
          onClick={skip}
          disabled={status === 'done'}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center cursor-pointer"
          aria-label="Skip narration"
        >
          ⏭
        </button>
        <button
          onClick={toggleMute}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
          aria-label={muted ? 'Unmute narration' : 'Mute narration'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button
          onClick={endTour}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#DB0C36] flex items-center justify-center cursor-pointer"
          aria-label="End presentation"
        >
          ⏹
        </button>
      </div>
    </>
  );
}

export default VoicePresentation;
