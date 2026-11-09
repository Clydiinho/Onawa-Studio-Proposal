/**
 * PROOF — real client media used by the social-platform mockups.
 *
 * Source masters live in /public/assets/proof/. Everything referenced here is a
 * web-optimised copy in /public/assets/proof/web/ (long edge ≤1600 px for
 * stills; H.264 + faststart + no audio for clips). Keeping the manifest in one
 * place means the retail and mall proof sections always show the same work.
 */

export interface ProofImage {
  kind: 'image';
  id: string;
  src: string;
  alt: string;
}

export interface ProofVideo {
  kind: 'video';
  id: string;
  src: string;
  poster: string;
  alt: string;
  /** Seconds — shown as a duration badge, and used to pace the feed. */
  duration: number;
}

export type ProofMedia = ProofImage | ProofVideo;

const img = (id: string, file: string, alt: string): ProofImage => ({
  kind: 'image',
  id,
  src: `/assets/proof/web/${file}`,
  alt,
});

const vid = (id: string, file: string, duration: number, alt: string): ProofVideo => ({
  kind: 'video',
  id,
  src: `/assets/proof/web/${file}.mp4`,
  poster: `/assets/proof/web/${file}.jpg`,
  alt,
  duration,
});

/* ---------------------------------------------------------------------------
   Stills — SPAR / Tops / Choppies campaign artwork, portrait print formats.
--------------------------------------------------------------------------- */

const promos: ProofImage[] = Array.from({ length: 16 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return img(`promo-${n}`, `promo-${n}.jpg`, 'Retail campaign artwork');
});

const choppies: ProofImage[] = [
  img('choppies-post', 'choppies-post.jpg', 'Choppies birthday campaign artwork'),
  img('choppies-leaflet', 'choppies-leaflet.jpg', 'Choppies birthday leaflet'),
];

/** All stills, ordered so the carousel opens on the strongest artwork and
 *  alternates formats/brands instead of running two near-identical ads together. */
export const proofImages: ProofImage[] = [
  promos[0],
  choppies[0],
  promos[3],
  promos[10],
  promos[7],
  choppies[1],
  promos[5],
  promos[12],
  promos[1],
  promos[14],
  promos[8],
  promos[4],
  promos[2],
  promos[13],
  promos[6],
  promos[15],
  promos[11],
  promos[9],
];

/* ---------------------------------------------------------------------------
   Clips — real motion work. `special-offer-promo` (426×240) and
   `spar-ushakati-intro` (400×400) are intentionally left out of the reel
   carousels: they are too soft at 400 px tall. They still appear in TikTok.
--------------------------------------------------------------------------- */

export const proofVideos: ProofVideo[] = [
  vid('tops-promo', 'tops-promo', 17, 'Tops liquor promotion'),
  vid('choppies-price-promo', 'choppies-price-promo', 9, 'Choppies price promotion'),
  vid('black-friday-promo', 'black-friday-promo', 15, 'Black Friday promotion'),
  vid('spar-super-sales', 'spar-super-sales', 12, 'SPAR super sales leaflet'),
  vid('ready-made-meals', 'ready-made-meals', 5, 'Ready-made meals promotion'),
  vid('spar-store-promo', 'spar-store-promo', 15, 'SPAR grocery promotion'),
  vid('spar-bata-shoes', 'spar-bata-shoes', 7, 'SPAR Bata school shoes promotion'),
  vid('super-veggies', 'super-veggies', 21, 'Super Veggies promotion'),
  vid('spar-pepsi-promo', 'spar-pepsi-promo', 7, 'SPAR Pepsi promotion'),
  vid('spar-rewards', 'spar-rewards', 15, 'SPAR Rewards promotion'),
  vid('special-offer-promo', 'special-offer-promo', 24, 'SPAR special offer list'),
  vid('spar-ushakati-intro', 'spar-ushakati-intro', 14, 'SPAR Ongwediva intro'),
];

/** Reels: the clips with enough resolution to fill a phone screen. */
export const reelVideos: ProofVideo[] = proofVideos.filter(
  (v) => v.id !== 'special-offer-promo' && v.id !== 'spar-ushakati-intro'
);

/** TikTok opens on the vertical clips, then mixes the square ones. */
export const tiktokVideos: ProofVideo[] = proofVideos;

/* ---------------------------------------------------------------------------
   WhatsApp thread — three stills and three clips, posted separately.
--------------------------------------------------------------------------- */

export const whatsappImages: ProofImage[] = [
  proofImages[0],
  proofImages[2],
  proofImages[5],
];

export const whatsappVideos: ProofVideo[] = [
  proofVideos.find((v) => v.id === 'ready-made-meals')!,
  proofVideos.find((v) => v.id === 'spar-bata-shoes')!,
  proofVideos.find((v) => v.id === 'choppies-price-promo')!,
];

/** Interleaved order for the chat thread. */
export const whatsappThread: ProofMedia[] = [
  whatsappImages[0],
  whatsappVideos[0],
  whatsappImages[1],
  whatsappVideos[1],
  whatsappImages[2],
  whatsappVideos[2],
];

export const formatDuration = (seconds: number) => {
  const s = Math.max(1, Math.round(seconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
};
