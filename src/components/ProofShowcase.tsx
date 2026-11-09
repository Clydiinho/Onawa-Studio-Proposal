import React, { useEffect, useRef, useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Globe,
  Heart,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Play,
  Send,
  Share2,
  ThumbsUp,
  Volume2,
  X,
} from 'lucide-react';
import { useLanguage } from '../data/language';
import {
  formatDuration,
  proofImages,
  reelVideos,
  tiktokVideos,
  whatsappThread,
  type ProofImage,
  type ProofMedia,
  type ProofVideo,
} from '../lib/proofAssets';

/* =============================================================================
   PROOF SHOWCASE
   Four platform mockups (Facebook, Instagram, TikTok, WhatsApp) built around the
   real client artwork in /assets/proof/web. Shared by the retail and mall
   proposal pages so both tell the same story with the same media.

   Realism rules:
   - Still artwork is never cropped: it is shown whole over a blurred copy of
     itself (the "photo viewer" treatment), so prices and logos stay readable.
   - Clips are muted and only play while they are the active slide (carousels)
     or while they are on screen (TikTok scroller, WhatsApp thread).
   - Media only mounts when its platform tab is open, so nothing downloads
     until a visitor actually looks at a platform.
============================================================================= */

export interface ProofProfile {
  name: string;
  handle: string;
  followers: string;
  bio: string;
}

interface ProofShowcaseProps {
  profile: ProofProfile;
  /** Retail pages talk shelves and specials; the mall page talks stores and footfall. */
  variant?: 'retail' | 'mall';
}

type Platform = 'facebook' | 'instagram' | 'tiktok' | 'whatsapp';

interface ProofCopy {
  imageCaption: string;
  videoCaption: string;
  tagsImage: string;
  tagsVideo: string;
}

const makeProofCopy = (t: (en: string, af: string) => string, variant: 'retail' | 'mall'): ProofCopy =>
  variant === 'mall'
    ? {
        imageCaption: t(
          'Every centre has a story worth stopping for. 🏬✨ Campaign artwork that makes shoppers look twice and walk in — planned, designed and published in days, not months. Which storefront should we light up next? 👀',
          'Elke sentrum het ’n storie wat ’n mens laat stop. 🏬✨ Veldtogkunswerk wat kopers twee keer laat kyk en laat instap — beplan, ontwerp en gepubliseer in dae, nie maande nie. Watter winkelfront verlig ons volgende? 👀'
        ),
        videoCaption: t(
          'Footfall you can feel. 🎬🚶 Reels that turn a passing scroll into a Saturday visit — seasonal takeovers, launches and events that actually get watched. Sound on. 🔊',
          'Voetverkeer wat jy kan voel. 🎬🚶 Reels wat ’n verbygaande swiep in ’n Saterdag-besoek omskep — seisoen-oorneemings, bekendstellings en gebeure wat regtig gekyk word. Klank aan. 🔊'
        ),
        tagsImage: t(
          '#MallMarketing #RetailCampaigns #ShoppingCentre #FootfallMarketing #OnawaStudio',
          '#Sentrumbemarking #Veldtogte #Winkelsentrum #Voetverkeer #OnawaStudio'
        ),
        tagsVideo: t(
          '#MotionGraphics #Reels #MallContent #CampaignVideo #OnawaStudio',
          '#MotionGrafika #Reels #SentrumInhoud #VeldtogVideo #OnawaStudio'
        ),
      }
    : {
        imageCaption: t(
          'From shelf to feed. 🛒✨ Every special gets the full treatment — clean layouts, prices you can read at a glance, and artwork that stops the scroll. Which aisle should we make famous next? 👀',
          'Van rak tot voer. 🛒✨ Elke spesiale kry die volle behandeling — skoon uitlegte, pryse wat jy met een oogopslag lees, en kunswerk wat die swiep stop. Watter gang maak ons volgende beroemd? 👀'
        ),
        videoCaption: t(
          'Lights, motion, specials. 🎬🛍️ A price drop should move — reels that hit as hard as your weekend queue. Sound on for the full effect. 🔊',
          'Ligte, beweging, spesiale. 🎬🛍️ ’n Prysverlaging moet beweeg — reels wat net so hard slaan soos jou naweek-tou. Klank aan vir die volle effek. 🔊'
        ),
        tagsImage: t(
          '#RetailMarketing #PromoDesign #WeekendSpecials #ShopLocal #OnawaStudio',
          '#WinkelBemarking #PromoOntwerp #NaweekSpesiale #KoopPlaaslik #OnawaStudio'
        ),
        tagsVideo: t(
          '#MotionGraphics #Reels #RetailContent #PromoVideo #OnawaStudio',
          '#MotionGrafika #Reels #WinkelInhoud #PromoVideo #OnawaStudio'
        ),
      };

const AVATAR = '/Onawa icon@2x.png';

/* -------------------------------------------------------------------------- */
/* Media surfaces                                                             */
/* -------------------------------------------------------------------------- */

/** Still artwork: whole image on a blurred copy of itself. */
function ImageSurface({ media, priority = false }: { media: ProofImage; priority?: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-zinc-950">
      <img
        src={media.src}
        alt=""
        aria-hidden="true"
        loading={priority ? 'eager' : 'lazy'}
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-2xl"
      />
      <img
        src={media.src}
        alt={media.alt}
        loading={priority ? 'eager' : 'lazy'}
        className="relative z-10 max-h-full max-w-full object-contain"
      />
    </div>
  );
}

/** True when the element is completely outside the viewport, or the tab is
 *  hidden. Defaults to `false` (playing) so a missed event can only ever leave
 *  a clip running, never leave a mockup frozen. */
function useOffScreen(ref: React.RefObject<HTMLElement | null>) {
  const [offScreen, setOffScreen] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setOffScreen(rect.bottom <= 0 || rect.top >= window.innerHeight || document.visibilityState === 'hidden');
    };
    check();
    // Capture: scroll does not bubble, but inner scrollers (the phone feeds and
    // mockup panels) still need to re-run this when they move.
    window.addEventListener('scroll', check, { passive: true, capture: true });
    window.addEventListener('resize', check);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.removeEventListener('scroll', check, true);
      window.removeEventListener('resize', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, [ref]);

  return offScreen;
}

/** Footage: whole clip on a blurred copy of its poster frame. */
function VideoSurface({
  media,
  active = false,
  suppressed = false,
  showPlayBadge = false,
  showDuration = true,
  onOpen,
  label,
}: {
  media: ProofVideo;
  active?: boolean;
  /** Set by the parent when the mockup has been scrolled out of view. */
  suppressed?: boolean;
  /** Static thumbnails (WhatsApp) advertise the tap target instead of autoplaying. */
  showPlayBadge?: boolean;
  /** TikTok draws its own chrome over the clip, so the badge would clash. */
  showDuration?: boolean;
  onOpen: (media: ProofMedia) => void;
  label?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const shouldPlay = active && !suppressed;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (shouldPlay) {
      void el.play().catch(() => {});
    } else {
      el.pause();
      try {
        el.currentTime = 0;
      } catch {
        /* seeking can fail before metadata loads — harmless */
      }
    }
  }, [shouldPlay]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-zinc-950">
      <img
        src={media.poster}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-2xl"
      />
      <video
        ref={videoRef}
        src={media.src}
        poster={media.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={media.alt}
        onClick={() => onOpen(media)}
        className="relative z-10 max-h-full max-w-full cursor-pointer object-contain"
      />
      {showDuration && (
        <span className="pointer-events-none absolute left-3 top-3 rounded bg-black/65 px-2 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur">
          {formatDuration(media.duration)}
        </span>
      )}
      {showPlayBadge && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/45 text-white shadow-xl backdrop-blur-sm">
            <Play className="h-6 w-6 fill-current" />
          </span>
        </div>
      )}
      {label && (
        <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
          <Play className="h-3 w-3 fill-current" /> {label}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Carousel                                                                   */
/* -------------------------------------------------------------------------- */

function Carousel({
  items,
  aspect,
  onOpen,
  showDots = true,
  label,
}: {
  items: ProofMedia[];
  aspect: string;
  onOpen: (media: ProofMedia) => void;
  showDots?: boolean;
  label?: string;
}) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const offScreen = useOffScreen(rootRef);

  const goTo = (next: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(items.length - 1, next));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
    // Also set it directly: a background/hidden tab can move the track without
    // delivering scroll events, and arrow clicks must never leave the counter stale.
    setIndex(clamped);
  };

  return (
    <div ref={rootRef} className="group/carousel relative overflow-hidden bg-zinc-950">
      <div
        ref={trackRef}
        onScroll={(event) => {
          const el = event.currentTarget;
          const next = Math.round(el.scrollLeft / el.clientWidth);
          setIndex((current) => (current === next ? current : next));
        }}
        className={`flex snap-x snap-mandatory overflow-x-auto no-scrollbar ${aspect}`}
      >
        {items.map((media, i) => (
          <div key={media.id} className="relative h-full min-w-full snap-center">
            {media.kind === 'video' ? (
              <VideoSurface media={media} active={i === index} suppressed={offScreen} onOpen={onOpen} label={label} />
            ) : (
              <button
                type="button"
                onClick={() => onOpen(media)}
                className="block h-full w-full cursor-pointer text-left"
                aria-label={media.alt}
              >
                <ImageSurface media={media} priority={i === 0} />
              </button>
            )}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          {index > 0 && (
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous"
              className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-0 shadow-lg backdrop-blur transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {index < items.length - 1 && (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next"
              className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-0 shadow-lg backdrop-blur transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          <span className="pointer-events-none absolute right-2 top-2 z-20 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur">
            {index + 1}/{items.length}
          </span>
          {showDots && items.length <= 8 && (
            <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {items.map((media, i) => (
                <span
                  key={media.id}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === index ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Facebook                                                                   */
/* -------------------------------------------------------------------------- */

function PostActions({ tint }: { tint: string }) {
  return (
    <div className={`grid grid-cols-3 gap-1 border-t border-white/10 pt-2 text-sm font-medium ${tint}`}>
      <button type="button" className="flex items-center justify-center gap-2 rounded-lg py-2 transition-colors hover:bg-white/5">
        <ThumbsUp className="h-4 w-4" /> Like
      </button>
      <button type="button" className="flex items-center justify-center gap-2 rounded-lg py-2 transition-colors hover:bg-white/5">
        <MessageSquare className="h-4 w-4" /> Comment
      </button>
      <button type="button" className="flex items-center justify-center gap-2 rounded-lg py-2 transition-colors hover:bg-white/5">
        <Share2 className="h-4 w-4" /> Share
      </button>
    </div>
  );
}

function FacebookPanel({
  profile,
  copy,
  onOpen,
}: {
  profile: ProofProfile;
  copy: ProofCopy;
  onOpen: (media: ProofMedia) => void;
}) {
  const { t } = useLanguage();

  const { imageCaption, videoCaption, tagsImage, tagsVideo } = copy;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="no-scrollbar max-h-[680px] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#242526] text-[#e4e6eb] shadow-xl">
        {/* Cover */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-r from-orange-800 to-rose-900 sm:h-44">
          <img src={proofImages[0].src} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-40 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#242526] via-transparent to-transparent" />
          <div className="absolute bottom-3 left-5 flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-[#242526] bg-white shadow-xl">
              <img src={AVATAR} alt={profile.name} className="h-full w-full object-cover" />
            </div>
            <div className="mb-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-white sm:text-xl">{profile.name}</h3>
                <CheckCircle2 className="h-4 w-4 fill-white text-[#1877F2]" />
              </div>
              <p className="text-xs text-zinc-400">{profile.bio} • {profile.followers}</p>
            </div>
          </div>
        </div>

        {/* Photo carousel post */}
        <article className="border-b border-white/10 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white">
                <img src={AVATAR} alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{profile.name}</h4>
                <p className="flex items-center gap-1 text-xs text-zinc-400">
                  <span>{t('2 hours ago', '2 ure gelede')}</span> • <Globe className="h-3 w-3" />
                </p>
              </div>
            </div>
            <MoreHorizontal className="h-5 w-5 cursor-pointer text-zinc-400" />
          </div>

          <p className="mb-3 whitespace-pre-line text-sm leading-relaxed text-zinc-200 sm:text-base">
            {imageCaption} <span className="text-[#2d88ff]">{tagsImage}</span>
          </p>

          <Carousel items={proofImages} aspect="aspect-[4/5]" onOpen={onOpen} />

          <div className="flex items-center justify-between border-t border-zinc-700 pt-3 text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1877F2] text-[10px] text-white">👍</div>
              <span>2.4K</span>
            </div>
            <span>186 {t('comments', 'kommentare')} • 74 {t('shares', 'deelinge')}</span>
          </div>

          <PostActions tint="text-zinc-300" />
        </article>

        {/* Reel carousel post */}
        <article className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white">
                <img src={AVATAR} alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{profile.name}</h4>
                <p className="flex items-center gap-1 text-xs text-zinc-400">
                  <span>{t('Yesterday', 'Gister')}</span> • <Globe className="h-3 w-3" />
                </p>
              </div>
            </div>
            <MoreHorizontal className="h-5 w-5 cursor-pointer text-zinc-400" />
          </div>

          <p className="mb-3 whitespace-pre-line text-sm leading-relaxed text-zinc-200 sm:text-base">
            {videoCaption} <span className="text-[#2d88ff]">{tagsVideo}</span>
          </p>

          <Carousel items={reelVideos} aspect="aspect-[4/5]" onOpen={onOpen} label={t('Reel', 'Reel')} />

          <div className="flex items-center justify-between border-t border-zinc-700 pt-3 text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1877F2] text-[10px] text-white">👍</div>
              <span>3.1K</span>
            </div>
            <span>242 {t('comments', 'kommentare')} • 118 {t('shares', 'deelinge')}</span>
          </div>

          <PostActions tint="text-zinc-300" />
        </article>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Instagram                                                                  */
/* -------------------------------------------------------------------------- */

function InstagramPanel({
  profile,
  copy,
  onOpen,
}: {
  profile: ProofProfile;
  copy: ProofCopy;
  onOpen: (media: ProofMedia) => void;
}) {
  const { t } = useLanguage();

  const { imageCaption, videoCaption, tagsImage, tagsVideo } = copy;

  const head = (time: string) => (
    <div className="flex items-center justify-between px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="rounded-full bg-gradient-to-tr from-[#fd1d1d] via-[#e1306c] to-[#fcb045] p-[2px]">
          <img src={AVATAR} alt="" className="h-8 w-8 rounded-full border-2 border-white object-cover" />
        </span>
        <div>
          <p className="text-xs font-semibold text-zinc-900">{profile.handle}</p>
          <p className="text-[10px] text-zinc-500">{time}</p>
        </div>
      </div>
      <MoreHorizontal className="h-4 w-4 text-zinc-700" />
    </div>
  );

  const actions = (
    <div className="flex items-center justify-between px-3 pt-2">
      <div className="flex items-center gap-4 text-zinc-900">
        <Heart className="h-6 w-6" />
        <MessageCircle className="h-6 w-6" />
        <Send className="h-6 w-6" />
      </div>
      <Bookmark className="h-6 w-6 text-zinc-900" />
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <span className="text-sm font-bold text-zinc-900">{profile.handle}</span>
        <div className="flex items-center gap-4 text-zinc-700">
          <Play className="h-4 w-4" />
          <Send className="h-4 w-4" />
        </div>
      </div>

      <div className="no-scrollbar max-h-[700px] overflow-y-auto overscroll-contain">
        {/* Carousel post */}
        <article className="border-b border-zinc-200 pb-3">
          {head(t('2 hours ago', '2 ure gelede'))}
          <Carousel items={proofImages} aspect="aspect-[4/5]" onOpen={onOpen} />
          {actions}
          <div className="space-y-1 px-3 pt-2 text-[13px] leading-snug text-zinc-900">
            <p className="font-semibold">2,418 {t('likes', 'hou van dit')}</p>
            <p>
              <span className="font-semibold">{profile.handle}</span> {imageCaption}{' '}
              <span className="text-[#00376b]">{tagsImage}</span>
            </p>
            <p className="text-zinc-500">{t('View all 87 comments', 'Sien al 87 kommentare')}</p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-400">
              {t('2 hours ago', '2 ure gelede')}
            </p>
          </div>
        </article>

        {/* Reel carousel post */}
        <article className="pb-3">
          {head(t('Yesterday', 'Gister'))}
          <div className="relative">
            <Carousel items={reelVideos} aspect="aspect-[9/16]" onOpen={onOpen} showDots={false} />
            <span className="pointer-events-none absolute left-3 top-10 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
              {t('Reels', 'Reels')}
            </span>
          </div>
          {actions}
          <div className="space-y-1 px-3 pt-2 text-[13px] leading-snug text-zinc-900">
            <p className="font-semibold">3,102 {t('likes', 'hou van dit')}</p>
            <p>
              <span className="font-semibold">{profile.handle}</span> {videoCaption}{' '}
              <span className="text-[#00376b]">{tagsVideo}</span>
            </p>
            <p className="text-zinc-500">{t('View all 64 comments', 'Sien al 64 kommentare')}</p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-400">
              {t('Yesterday', 'Gister')}
            </p>
          </div>
        </article>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-2.5 text-zinc-800">
        <span className="text-lg">⌂</span>
        <Play className="h-5 w-5" />
        <Send className="h-5 w-5" />
        <img src={AVATAR} alt="" className="h-6 w-6 rounded-full object-cover" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TikTok                                                                     */
/* -------------------------------------------------------------------------- */

function TikTokPanel({
  profile,
  onOpen,
}: {
  profile: ProofProfile;
  onOpen: (media: ProofMedia) => void;
}) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  // Keep one clip looping while the phone is on screen; stop once it is scrolled away.
  const offScreen = useOffScreen(frameRef);

  const captions = [
    t('POV: your promo actually looks good 👀', 'POV: jou promosie lyk regtig goed 👀'),
    t('Specials that stop the scroll 🛒🔥', 'Spesiale wat die swiep stop 🛒🔥'),
    t('Your shelf, but make it cinema 🎬', 'Jou rak, maar fliek-gehalte 🎬'),
    t('When the price drop hits different 💸', 'Wanneer die prysval anders voel 💸'),
    t('Weekend mode: activated ⚡', 'Naweekmodus: geaktiveer ⚡'),
    t('This is what your feed could look like ✨', 'So kan jou voer lyk ✨'),
    t('Motion beats static. Every time. 🎥', 'Beweging klop staties. Elke keer. 🎥'),
    t('One product. Zero boring frames. 🛍️', 'Een produk. Zero vervelige rame. 🛍️'),
  ];

  const goTo = (next: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(tiktokVideos.length - 1, next));
    el.scrollTo({ top: clamped * el.clientHeight, behavior: 'smooth' });
    setIndex(clamped);
  };

  return (
    <div
      ref={frameRef}
      className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-zinc-800 bg-black shadow-2xl"
    >
      <div
        ref={scrollerRef}
        onScroll={(event) => {
          const el = event.currentTarget;
          const next = Math.round(el.scrollTop / el.clientHeight);
          setIndex((current) => (current === next ? current : next));
        }}
        className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto overscroll-contain"
      >
        {tiktokVideos.map((video, i) => (
          <section key={video.id} className="relative h-full w-full snap-start overflow-hidden">
            <VideoSurface media={video} active={i === index} suppressed={offScreen} showDuration={false} onOpen={onOpen} />

            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black/60 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-64 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

            <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 py-3 text-white">
              <span className="h-5 w-5" aria-hidden="true" />
              <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-mono font-bold backdrop-blur-md">
                {t('Following', 'Volg')}{' | '}
                <span className="text-[#25F4EE]">{t('For You', 'Vir Jou')}</span>
              </div>
              <Volume2 className="h-5 w-5 text-white/90 drop-shadow" />
            </div>

            <div className="absolute bottom-24 right-3 z-10 flex flex-col items-center gap-4 text-white">
              <div className="relative">
                <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-white">
                  <img src={AVATAR} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="absolute -bottom-2 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-[#FE2C55] text-xs font-bold text-white">
                  +
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md">
                  <Heart className="h-5 w-5 fill-[#FE2C55] text-[#FE2C55]" />
                </div>
                <span className="text-xs font-bold">45.2K</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-bold">1,204</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md">
                  <Share2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-bold">3,480</span>
              </div>

              <div className="flex h-10 w-10 animate-spin items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55]" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-10 space-y-2 p-4 text-white">
              <h4 className="flex items-center gap-1.5 text-sm font-bold">
                {profile.handle} <CheckCircle2 className="h-3.5 w-3.5 fill-white text-[#25F4EE]" />
              </h4>
              <p className="line-clamp-2 text-xs text-zinc-100">{captions[i % captions.length]}</p>
              <div className="flex w-fit items-center gap-2 rounded-lg bg-white/10 px-2.5 py-1.5 font-mono text-[10px] backdrop-blur-md">
                <span className="h-2 w-2 animate-ping rounded-full bg-[#ccff00]" />
                <span className="max-w-[210px] truncate">
                  {t('Original Sound - Onawa Studio', 'Oorspronklike Klank - Onawa Studio')}
                </span>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1.5">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous video"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-opacity disabled:opacity-25"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === tiktokVideos.length - 1}
          aria-label="Next video"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-opacity disabled:opacity-25"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* WhatsApp                                                                   */
/* -------------------------------------------------------------------------- */

function WhatsAppPanel({
  profile,
  onOpen,
}: {
  profile: ProofProfile;
  onOpen: (media: ProofMedia) => void;
}) {
  const { t } = useLanguage();

  const messages = [
    t(
      '🔥 Weekend specials are live. Tap the leaflet before the shelves empty.',
      '🔥 Naweek-spesiale is lewendig. Tik die pamflet voor die rakke leeg is.'
    ),
    t(
      '🎬 New promo just dropped — watch it before you shop.',
      '🎬 Nuwe promosie het net geval — kyk dit voor jy inkopies doen.'
    ),
    t(
      '🛒 Combo deals just landed. Bigger baskets, smaller totals.',
      '🛒 Kombopakkette het net aangekom. Groter mandjies, kleiner totaal.'
    ),
    t(
      '📦 Stock-up season is here. Here’s what’s moving fastest.',
      '📦 Opvoorraad-seisoen is hier. Hier is wat die vinnigste beweeg.'
    ),
    t(
      '✨ Fresh artwork, same great prices. See what’s in store.',
      '✨ Vars kunswerk, dieselfde goeie pryse. Sien wat in die winkel is.'
    ),
    t(
      '🎥 One last look — then come see it in person.',
      '🎥 Een laaste kykie — kom sien dit dan in persoon.'
    ),
  ];

  const times = ['09:41', '09:43', '09:46', '09:48', '09:50', '09:52'];

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b141a] text-[#e9edef] shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#1f2c34] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white text-lg font-bold text-black">
            <img src={AVATAR} alt="" className="h-full w-full object-cover" />
          </div>
          <div>
            <h4 className="flex items-center gap-1 text-sm font-bold">
              {profile.name} <CheckCircle2 className="h-3.5 w-3.5 fill-black text-[#25D366]" />
            </h4>
            <p className="text-[11px] text-[#25D366]">{t('Online • Business Account', 'Aanlyn • Besigheidsrekening')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-zinc-300">
          <Play className="h-5 w-5" />
          <MoreHorizontal className="h-5 w-5" />
        </div>
      </div>

      <div className="no-scrollbar h-[520px] space-y-3 overflow-y-auto overscroll-contain bg-[radial-gradient(#111b21_1px,transparent_1px)] bg-[size:16px_16px] p-4">
        <div className="mx-auto w-fit rounded bg-[#182229] px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-400">
          {t('Today', 'Vandag')}
        </div>

        {whatsappThread.map((media, i) => (
          <div key={media.id} className="flex justify-start">
            <div className="w-[82%] max-w-sm overflow-hidden rounded-xl rounded-tl-none border border-white/5 bg-[#202c33] shadow-lg">
              <div className="relative aspect-[4/5] bg-black">
                {media.kind === 'image' ? (
                  <button
                    type="button"
                    onClick={() => onOpen(media)}
                    aria-label={media.alt}
                    className="block h-full w-full cursor-pointer"
                  >
                    <ImageSurface media={media} />
                  </button>
                ) : (
                  <VideoSurface media={media} showPlayBadge onOpen={onOpen} />
                )}
              </div>
              <div className="p-2.5 text-xs text-zinc-200">
                <p>{messages[i]}</p>
                <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-zinc-400">
                  {times[i]} <span className="text-[#53bdeb]">✓✓</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <p className="pt-1 text-center text-[10px] text-zinc-500">
          {t('Messages are end-to-end encrypted', 'Boodskappe is end-tot-end geënkripteer')}
        </p>
      </div>

      <div className="flex items-center gap-3 bg-[#1f2c34] p-3">
        <div className="flex-1 rounded-full bg-[#2a3942] px-4 py-2.5 text-xs text-zinc-400">
          {t('Reply to ', 'Antwoord op ')}{profile.name}...
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a884] font-bold text-black">
          <Send className="h-4 w-4 text-black" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Lightbox                                                                   */
/* -------------------------------------------------------------------------- */

function Lightbox({ media, onClose }: { media: ProofMedia; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative flex max-h-[86vh] max-w-5xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
        {media.kind === 'image' ? (
          <img src={media.src} alt={media.alt} className="max-h-[86vh] w-auto rounded-xl object-contain shadow-2xl" />
        ) : (
          <video
            src={media.src}
            poster={media.poster}
            controls
            autoPlay
            playsInline
            className="max-h-[86vh] w-auto rounded-xl shadow-2xl"
          />
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shell                                                                      */
/* -------------------------------------------------------------------------- */

export default function ProofShowcase({ profile, variant = 'retail' }: ProofShowcaseProps) {
  const { t } = useLanguage();
  const copy = makeProofCopy(t, variant);
  const [platform, setPlatform] = useState<Platform>('facebook');
  const [lightbox, setLightbox] = useState<ProofMedia | null>(null);

  const platformButton = (id: Platform, label: string, activeClass: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => setPlatform(id)}
      className={`flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
        platform === id ? `${activeClass} scale-105` : 'border border-black/10 bg-white/70 text-zinc-700 shadow-sm hover:bg-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div>
      {/* Platform switcher */}
      <div className="mb-14 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {platformButton(
          'facebook',
          'Facebook',
          'bg-[#1877F2] text-white shadow-[0_0_25px_rgba(24,119,242,0.4)]',
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#1877F2]">f</div>
        )}

        {platformButton(
          'instagram',
          'Instagram',
          'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-[0_0_25px_rgba(253,29,29,0.4)]',
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        )}

        {platformButton(
          'tiktok',
          'TikTok',
          'bg-zinc-900 border border-[#25F4EE] text-[#25F4EE] shadow-[0_0_25px_rgba(37,244,238,0.3)]',
          <Play className="h-5 w-5" />
        )}

        {platformButton(
          'whatsapp',
          'WhatsApp',
          'bg-[#25D366] font-bold text-black shadow-[0_0_25px_rgba(37,211,102,0.4)]',
          <MessageCircle className="h-5 w-5" />
        )}
      </div>

      {/* Preview stage */}
      <div className="relative mx-auto max-w-4xl rounded-3xl border border-black/10 bg-white/60 p-4 shadow-[0_30px_60px_rgba(0,0,0,0.12)] backdrop-blur-2xl sm:p-8">
        {platform === 'facebook' && <FacebookPanel profile={profile} copy={copy} onOpen={setLightbox} />}
        {platform === 'instagram' && <InstagramPanel profile={profile} copy={copy} onOpen={setLightbox} />}
        {platform === 'tiktok' && <TikTokPanel profile={profile} onOpen={setLightbox} />}
        {platform === 'whatsapp' && <WhatsAppPanel profile={profile} onOpen={setLightbox} />}
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-zinc-500">
        {t(
          'Real campaign work created and published by Onawa Studio. Swipe, scroll and tap any post to see it full size.',
          'Regte veldtogwerk wat deur Onawa Studio geskep en gepubliseer is. Swiep, rol en tik enige plasing om dit volgrootte te sien.'
        )}
      </p>

      {lightbox && <Lightbox media={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}
