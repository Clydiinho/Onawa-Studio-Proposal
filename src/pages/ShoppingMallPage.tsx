import React, { useState, useEffect, useRef } from 'react';
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';
import AgenticFactory3D from '../components/AgenticFactory3D';
import LineSidebar from '../components/LineSidebar';
import { WHATSAPP_NUMBER } from '../data/config';
import { useLanguage } from '../data/language';
import {
  Tag, Film, Share2, Zap,
  ThumbsUp, MessageSquare, Heart, Bookmark, Send,
  CheckCircle2, Globe, Phone, MoreHorizontal, Volume2,
  MessageCircle, ShoppingBag, ShoppingCart, Calendar, Users,
  ArrowRight, Info,
} from 'lucide-react';

/**
 * SHOPPING MALL PROPOSAL PAGE
 *
 * Sibling of RetailStorePage: identical section sequence (hero → problem →
 * solution → proof → offers), identical design system, motion language and
 * interactions — retargeted at shopping centres, mall marketing teams and
 * property owners. Retail page data is NOT copied: campaigns, packages and
 * enquiries below are mall-specific. Package pricing is confirmed —
 * see MALL_PACKAGES (2 packages) before publishing.
 */

interface ShoppingMallPageProps {
  onNavigate: (page: 'home' | 'retail-store' | 'shopping-mall') => void;
}

// =============================================================================
// CAMPAIGN DEMO CONTENT — FICTIONAL SHOPPING CENTRE "ONAWA CENTRAL"
// Every mall, campaign, price, event and follower count here is demonstration
// content created by Onawa Studio (explicitly disclosed on-page in the Proof
// section). Stock imagery + footage; not real client work.
// =============================================================================

const makeMallCampaigns = (t: (en: string, af: string) => string) => [
  {
    id: 'mall-1',
    title: t(
      'Weekend Food Market // Live Music in the Food Court',
      'Naweek Kosmark // Regstreekse Musiek in die Koswerf'
    ),
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    video:
      'https://assets.mixkit.co/videos/preview/mixkit-fresh-vegetables-falling-in-water-41551-large.mp4',
    caption: t(
      'The Weekend Food Market is ON at Onawa Central! Forty stalls, live music from 6pm & the food court staying open late. Bring the whole crew. 🔥🛒',
      'Die Naweek Kosmark is AAN by Onawa Central! Veertig stalletjies, regstreekse musiek vanaf 6nm & die koswerf bly laat oop. Bring die hele gesin. 🔥🛒'
    ),
    hashtags: t(
      '#OnawaCentral #WeekendMarket #FoodCourt #LiveMusic #FamilyWeekend',
      '#OnawaCentral #NaweekMark #Koswerf #RegstreekseMusiek #GesinsNaweek'
    ),
    price: t('FRIDAY 4–9PM', 'VRYDAG 16:00–21:00'),
    likes: '2.1k',
    comments: '194',
    shares: '610',
    timestamp: t('3 hours ago', '3 ure gelede'),
  },
  {
    id: 'mall-2',
    title: t(
      'New Store Opening // The Bakehouse is NOW OPEN',
      'Nuwe Winkelopening // The Bakehouse is NOU OOP'
    ),
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
    video:
      'https://assets.mixkit.co/videos/preview/mixkit-baker-taking-bread-out-of-the-oven-43142-large.mp4',
    caption: t(
      'Good news, centre folk — The Bakehouse just opened its doors! First 200 visitors score a free pastry with any coffee. Welcome to the mall, neighbours. 🥐☕',
      'Goeie nuus, sentrumvriende — The Bakehouse het die deure oopgemaak! Die eerste 200 besoekers kry ’n gebakkie verniet by enige koffie. Welkom by die sentrum, bure. 🥐☕'
    ),
    hashtags: t(
      '#NowOpen #NewStore #TheBakehouse #OnawaCentral #FreshBakery',
      '#NouOop #NuweWinkel #TheBakehouse #OnawaCentral #VarsBakkery'
    ),
    price: t('LEVEL 2 · NEAR CINEMA', 'VLAK 2 · LANGS DIE BIOSKOOP'),
    likes: '1.8k',
    comments: '151',
    shares: '420',
    timestamp: t('Yesterday', 'Gister'),
  },
  {
    id: 'mall-3',
    title: t(
      'Restaurant Week // 20 Tables, 20 Set Menus',
      'Restourantweek // 20 Tafels, 20 Vaste Spyskaarte'
    ),
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
    video:
      'https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-vegetables-on-a-wooden-board-43141-large.mp4',
    caption: t(
      'Onawa Central Restaurant Week is here: 20 restaurants, 20 set-price specials, one delicious two-week run. Book early — tables are moving fast. 🍽️✨',
      'Die Onawa Central Restourantweek is hier: 20 restaurante, 20 vasteprys-spesiale, een heerlike twee weke lange geleentheid. Bespreek vroegtydig — tafels gaan vinnig. 🍽️✨'
    ),
    hashtags: t(
      '#RestaurantWeek #MallEats #TableForYou #OnawaCentral #FoodieFriday',
      '#RestourantWeek #SentrumKos #TafelVirJou #OnawaCentral #KosvriendVrydag'
    ),
    price: t('SET MENU N$150', 'VASTE SPYSKAART N$150'),
    likes: '3.4k',
    comments: '287',
    shares: '1.1k',
    timestamp: t('2 days ago', '2 dae gelede'),
  },
];

interface ReceiptItem {
  category: string;
  detail: string;
  subdetail?: string;
  isIncluded: boolean;
}

interface MallPackage {
  id: string;
  name: string;
  price: string;
  rawPrice: string;
  personality: string;
  visualMessage: string;
  shortDesc: string;
  supportingText: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder?: string;
  cardBorderClass?: string;
  trolleyTier: 'small' | 'medium' | 'full';
  barcode: string;
  buttonLabel: string;
  buttonAccentColor: string;
  inclusions: ReceiptItem[];
  pending: boolean;
}

/* =============================================================================
   MALL PACKAGES — CONFIRMED OFFER (2 packages)
   Replace these two objects only if Onawa Studio revises the offer.
============================================================================= */

const makeMallPackages = (t: (en: string, af: string) => string): MallPackage[] => [
  {
    id: 'mall-buzz',
    name: 'Mall Buzz',
    price: 'N$1,500',
    rawPrice: '1,500',
    personality: t('THE MALL FEED', 'DIE SENTRUMVOER'),
    visualMessage: t('THE MALL FEED', 'DIE SENTRUMVOER'),
    shortDesc: t(
      'Keep your mall visible, promote your tenants, and give people reasons to visit.',
      'Hou jou sentrum sigbaar, promoveer jou huurders, en gee mense redes om te kom kuier.'
    ),
    supportingText: t(
      'Ideal for malls that want consistent promotions and a stronger social media presence.',
      'Ideaal vir sentrums wat deurlopende promosies en ’n sterker sosiale media-teenwoordigheid wil hê.'
    ),
    accentColor: '#ccff00',
    badgeBg: 'bg-[#ccff00] text-black',
    cardBorderClass: '',
    trolleyTier: 'small',
    barcode: '0 15000 04150 6',
    buttonLabel: t('START THE BUZZ', 'BEGIN DIE GONS'),
    buttonAccentColor: 'text-[#ccff00] border-[#ccff00]/40',
    inclusions: [
      {
        category: t('PROMOTIONAL GRAPHICS', 'PROMOSIEGRAFIKA'),
        detail: '3 / ' + t('week', 'week'),
        isIncluded: true,
      },
      {
        category: t('MOTION GRAPHICS & REELS', 'MOTIONGRAFIKA & REELS'),
        detail: '4 / ' + t('month', 'maand'),
        isIncluded: true,
      },
      {
        category: t('TENANT PROMOS & STORE OPENINGS', 'HUURDERS-PROMOSIES & WINKELOPENINGS'),
        detail: t('Included', 'Ingesluit'),
        isIncluded: true,
      },
      {
        category: t('SEASONAL & SPECIAL-DAY PROMOS', 'SEISOEN- & SPESIALEDAG-PROMOSIES'),
        detail: t('Included', 'Ingesluit'),
        subdetail: t('Picked to the mall calendar', 'Afgestem op die sentrumkalender'),
        isIncluded: true,
      },
      {
        category: t('SOCIAL MEDIA SCHEDULING', 'SOSIALE MEDIA-SKEDULERING'),
        detail: t('INCLUDED FREE', 'INGESLUIT VERNIET'),
        subdetail: t('Schedules & publishes created content', 'Skeduleer & publiseer geskepte inhoud'),
        isIncluded: true,
      },
      {
        category: t('CHANNEL ADAPTATION', 'KANAALAANPASSING'),
        detail: 'FB · IG · WHATSAPP',
        subdetail: t('Content adapted per channel', 'Inhoud aangepas per kanaal'),
        isIncluded: true,
      },
      {
        category: t('MONTHLY CONTENT PLANNING', 'MAANDELIKSE INHOUDSBEPLANNING'),
        detail: t('Included', 'Ingesluit'),
        isIncluded: true,
      },
    ],
    pending: false,
  },
  {
    id: 'mall-buzz-web',
    name: 'Mall Buzz + Web',
    price: 'N$2,000',
    rawPrice: '2,000',
    personality: t('THE BUZZ + WEB', 'DIE GONS + WEB'),
    visualMessage: t('BUZZ + WEB', 'GONS + WEB'),
    shortDesc: t(
      'Everything in Mall Buzz, plus a website that connects visitors with your mall and gives prospective tenants a place to register their interest.',
      'Alles in Mall Buzz, plus ’n webwerf wat besoekers met jou sentrum verbind en voornemende huurders ’n plek gee om hul belangstelling aan te meld.'
    ),
    supportingText: t(
      'Ideal for malls that want stronger marketing and a website that helps attract potential new tenants.',
      'Ideaal vir sentrums wat sterker bemarking en ’n webwerf wil hê wat voornemende nuwe huurders lok.'
    ),
    accentColor: '#ff2a85',
    badgeBg: 'bg-[#DB0C36] text-white',
    cardBorderClass: 'border-2 border-pink-500/30',
    trolleyTier: 'medium',
    barcode: '0 20000 04200 9',
    buttonLabel: t('ADD THE WEBSITE', 'VOEG DIE WEBWERF BY'),
    buttonAccentColor: 'text-[#ff2a85] border-[#ff2a85]/40',
    inclusions: [
      {
        category: t('EVERYTHING IN MALL BUZZ', 'ALLES IN MALL BUZZ'),
        detail: t('ALL 7 SERVICES', 'AL 7 DIENSTE'),
        isIncluded: true,
      },
      {
        category: t('MALL WEBSITE', 'SENTRUMWEBWERF'),
        detail: t('Included', 'Ingesluit'),
        subdetail: t('Professionally designed & mobile-friendly', 'Professioneel ontwerp & mobielvriendelik'),
        isIncluded: true,
      },
      {
        category: t('ONLINE STORE & TENANT DIRECTORY', 'AANLYNWINKEL & HUURDERSGIDS'),
        detail: t('Included', 'Ingesluit'),
        isIncluded: true,
      },
      {
        category: t('HOURS, LOCATION & CONTACT', 'URE, LIGGING & KONTAK'),
        detail: t('Included', 'Ingesluit'),
        subdetail: t('Opening hours, map, phone & email', 'Openingsure, kaart, telefoon & e-pos'),
        isIncluded: true,
      },
      {
        category: t('EVENTS & ANNOUNCEMENT SECTION', 'GEBEURTENIS- & KENNISGEWINGSAFDELING'),
        detail: t('Included', 'Ingesluit'),
        subdetail: t('Events, promotions & mall notices', 'Gebeurtenisse, promosies & sentrumkennisgewings'),
        isIncluded: true,
      },
      {
        category: t('WHATSAPP & SOCIAL LINKS', 'WHATSAPP- & SOSIALE SKAKELS'),
        detail: t('Included', 'Ingesluit'),
        isIncluded: true,
      },
      {
        category: t('NEW TENANT SIGN-UP', 'NUWE HUURDER-REGISTRASIE'),
        detail: t('Included', 'Ingesluit'),
        subdetail: t(
          'Enquiries only — mall management reviews & contacts applicants',
          'Slegs navrae — sentrumbestuur beoordeel & kontak aansoekers'
        ),
        isIncluded: true,
      },
      {
        category: t('TENANT ENQUIRY FORM', 'HUURDER-NAVRAEVORM'),
        detail: t('Included', 'Ingesluit'),
        subdetail: t('Collects contact details & space requirements', 'Versamel kontakbesonderhede & ruimtebehoeftes'),
        isIncluded: true,
      },
      {
        category: t('HOSTING & MAINTENANCE', 'GASHEERDIENS & IN STAND HOUDING'),
        detail: t('Included', 'Ingesluit'),
        subdetail: t('Hosting, content updates & basic upkeep', 'Gasheerdiens, inhoudsopdaterings & basiese instandhouding'),
        isIncluded: true,
      },
    ],
    pending: false,
  },
];

// Sawtooth Receipt Perforated Edge Component
const SawtoothEdge: React.FC<{ position: 'top' | 'bottom'; color?: string }> = ({ position, color = '#f6f6f2' }) => {
  return (
    <div className={`w-full overflow-hidden leading-none h-3 ${position === 'top' ? 'rotate-180' : ''}`}>
      <svg
        className="w-full h-3"
        viewBox="0 0 1200 12"
        preserveAspectRatio="none"
        fill={color}
      >
        <path d="M0,12 L10,0 L20,12 L30,0 L40,12 L50,0 L60,12 L70,0 L80,12 L90,0 L100,12 L110,0 L120,12 L130,0 L140,12 L150,0 L160,12 L170,0 L180,12 L190,0 L200,12 L210,0 L220,12 L230,0 L240,12 L250,0 L260,12 L270,0 L280,12 L290,0 L300,12 L310,0 L320,12 L330,0 L340,12 L350,0 L360,12 L370,0 L380,12 L390,0 L400,12 L410,0 L420,12 L430,0 L440,12 L450,0 L460,12 L470,0 L480,12 L490,0 L500,12 L510,0 L520,12 L530,0 L540,12 L550,0 L560,12 L570,0 L580,12 L590,0 L600,12 L610,0 L620,12 L630,0 L640,12 L650,0 L660,12 L670,0 L680,12 L690,0 L700,12 L710,0 L720,12 L730,0 L740,12 L750,0 L760,12 L770,0 L780,12 L790,0 L800,12 L810,0 L820,12 L830,0 L840,12 L850,0 L860,12 L870,0 L880,12 L890,0 L900,12 L910,0 L920,12 L930,0 L940,12 L950,0 L960,12 L970,0 L980,12 L990,0 L1000,12 L1010,0 L1020,12 L1030,0 L1040,12 L1050,0 L1060,12 L1070,0 L1080,12 L1090,0 L1100,12 L1110,0 L1120,12 L1130,0 L1140,12 L1150,0 L1160,12 L1170,0 L1180,12 L1190,0 L1200,12 Z" />
      </svg>
    </div>
  );
};

// Barcode Graphic Component
const BarcodeGraphic: React.FC<{ code: string }> = ({ code }) => (
  <div className="flex flex-col items-center pt-3 pb-1 w-full">
    <div className="flex items-center gap-[2px] h-9 w-full justify-center opacity-85">
      {[2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2].map((w, i) => (
        <div key={i} className="bg-black h-full" style={{ width: `${w * 1.4}px` }} />
      ))}
    </div>
    <span className="font-mono text-[9px] tracking-[0.28em] text-zinc-600 mt-1">{code}</span>
  </div>
);

// Checkout scanner laser line — same reusable separation line as the retail page.
// `color` sets the sweep hue — pink by default, neon #ccff00 in the Solution section.
const ScannerLine: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#ff2a85' }) => (
  <div className={`relative h-[2px] w-full max-w-xs bg-zinc-300 overflow-hidden ${className}`}>
    <div
      className="absolute inset-y-0 left-0 w-1/3 scanner-sweep animate-[shimmer_2s_infinite]"
      style={{ '--sweep-color': color } as React.CSSProperties}
    />
  </div>
);

export const ShoppingMallPage: React.FC<ShoppingMallPageProps> = ({ onNavigate }) => {
  const { lang, t } = useLanguage();
  const [activePlatform, setActivePlatform] = useState<'facebook' | 'instagram' | 'tiktok' | 'whatsapp'>('facebook');
  const [selectedAssetIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isExpandedImage, setIsExpandedImage] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const heroRef = useRef<HTMLHeadingElement>(null);

  // Width fit for the hero's middle line: measures "Jou sentrum"'s width against
  // "HET MEER"'s natural width and writes the ratio into --title-fit.
  // Depends on lang: the headline words swap with the language switch.
  useEffect(() => {
    const h1 = heroRef.current;
    if (!h1) return;
    const target = h1.querySelector<HTMLElement>('.hero-title > span:first-child span');
    const fit = h1.querySelector<HTMLElement>('.title-fit-width');
    if (!target || !fit) return;

    let raf = 0;
    const textWidth = (el: HTMLElement) => {
      const r = document.createRange();
      r.selectNodeContents(el);
      return r.getBoundingClientRect().width;
    };
    const applyFit = () => {
      fit.style.setProperty('--title-fit', '1');
      const fitWidth = textWidth(fit);
      if (fitWidth <= 0) return;
      const ratio = textWidth(target) / fitWidth;
      const bounded = Math.min(2, Math.max(0.6, ratio));
      fit.style.setProperty('--title-fit', bounded.toFixed(4));
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(applyFit);
    };

    document.fonts.ready.then(schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(h1);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [lang]);

  const mallCampaigns = makeMallCampaigns(t);
  const mallPackages = makeMallPackages(t);
  const currentAsset = mallCampaigns[selectedAssetIndex];

  // Mall-specific WhatsApp enquiry: identifies the mall proposal. Same
  // wa.me convention (and same account) as the Retail Store page — no number
  // is hardcoded here either.
  const handleWhatsAppEnquiry = (pkgName: string, price: string) => {
    const message = t(
      `Hi Onawa Studio! We're a shopping mall — I'm interested in the ${pkgName} package at N$${price} per month. Can we chat about getting started?`,
      `Hallo Onawa Studio! Ons is ’n winkelsentrum — ek is belanggesteld in die ${pkgName}-pakkie teen N$${price} per maand. Kan ons gesels oor hoe om te begin?`
    );
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const features = [
    {
      id: 1,
      title: t('Tenant promo designs', 'Huurder-promosie-ontwerpe'),
      desc: t(
        'Make every store look worth the trip. Almost impossible to scroll past — well, we can\u2019t control thumbs.',
        'Maak elke winkel die reis werd. Amper onmoontlik om verby te swiep — wel, ons kan nie duime beheer nie.'
      ),
      icon: <Tag className="w-5 h-5 text-[#ccff00]" />,
      tag: t('01 // TENANTS', '01 // HUURDERS'),
      bgImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 2,
      title: t('Mall-wide campaigns', 'Sentrumwye veldtogte'),
      desc: t(
        'Seasonal takeovers, festive magic, back-to-school buzz. Planned, designed, delivered.',
        'Seisoen-oorneemings, feesmagie, terug-na-skool-gons. Beplan, ontwerp, afgelewer.'
      ),
      icon: <Share2 className="w-5 h-5 text-[#ccff00]" />,
      tag: t('02 // CAMPAIGNS', '02 // VELDTOGTE'),
      bgImage: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 3,
      title: t('Events & new openings', 'Gebeurtenisse & nuwe openings'),
      desc: t(
        'Opening countdowns, activations and event promos that pull people through the doors.',
        'Openingsaftellings, aktiverings en geleentheidpromosies wat mense deur die deure trek.'
      ),
      icon: <Calendar className="w-5 h-5 text-[#ccff00]" />,
      tag: t('03 // EVENT DEPT', '03 // GEBEURTENISDEPT'),
      bgImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 4,
      title: t('Motion graphics', 'Motion-grafika'),
      desc: t(
        'Because sometimes a big weekend deserves more than standing still.',
        'Want soms verdien ’n groot naweek meer as om stil te staan.'
      ),
      icon: <Film className="w-5 h-5 text-[#ccff00]" />,
      tag: t('04 // MOTION LAB', '04 // MOTION-LAB'),
      bgImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 5,
      title: t('Social content & publishing', 'Sosiale inhoud & publisering'),
      desc: t(
        "We create, caption, schedule and publish. Your centre's pages don't have to look like the doors are shut.",
        'Ons skep, skryf opskrifte, skeduleer en publiseer. Jou sentrum se bladsye hoef nie te lyk of die deure is toe nie.'
      ),
      icon: <Globe className="w-5 h-5 text-[#ccff00]" />,
      tag: t('05 // MULTI-FEED', '05 // MULTI-FEED'),
      bgImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1600&auto=format&fit=crop',
    },
  ];

  return (
    <div className="relative min-h-screen text-[#1c1c1e] selection:bg-[#ccff00] selection:text-black overflow-x-hidden">
      {/* =========================================================================
          BACKGROUND — the same white shader as the landing page (single shared
          stack, fixed so it stays behind the whole scroll; pointer-events-none
          and z-0 so every interaction layer sits above it).
      ========================================================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Shader className="w-full h-full">
          <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
          <ChromaFlow
            baseColor="#ffffff"
            downColor="#ff5f03"
            leftColor="#ff5f03"
            rightColor="#ff5f03"
            upColor="#ff5f03"
            momentum={13}
            radius={3.5}
          />
          <FlutedGlass
            aberration={0.61}
            angle={31}
            frequency={8}
            highlight={0.12}
            highlightSoftness={0}
            lightAngle={-90}
            refraction={4}
            shape="rounded"
            softness={1}
            speed={0.15}
          />
          <FilmGrain strength={0.05} />
        </Shader>
      </div>

      {/* Receipt Styling Definitions — same till-slip system as the retail page */}
      <style>{`
        /* Ink Stamp Overlay Styling */
        .stamp-mark {
          border: 3px double currentColor;
          text-shadow: 1px 1px 0px rgba(0,0,0,0.1);
          mask-image: radial-gradient(circle, rgba(0,0,0,0.9) 70%, rgba(0,0,0,0.5) 100%);
        }

        /* Dot-Matrix / Perforated Line */
        .receipt-perforation {
          background-image: linear-gradient(to right, #1a1917 40%, rgba(255,255,255,0) 0%);
          background-position: bottom;
          background-size: 7px 1.5px;
          background-repeat: repeat-x;
        }

        /* Laser Scanner Beam Overlay Effect */
        .laser-scanner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 25;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .receipt-paper:hover .laser-scanner-overlay {
          opacity: 1;
        }

        .laser-line {
          position: absolute;
          left: -5%;
          width: 110%;
          height: 3px;
          background: rgba(239, 68, 68, 0.95);
          box-shadow:
            0 0 12px #ef4444,
            0 0 24px #ef4444,
            0 0 35px rgba(239, 68, 68, 0.8),
            0 -10px 25px rgba(239, 68, 68, 0.3);
          top: -10px;
        }

        .receipt-paper:hover .laser-line {
          animation: laserScan 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes laserScan {
          0% {
            top: -10px;
          }
          50% {
            top: 100%;
          }
          100% {
            top: -10px;
          }
        }

        /* Thermal Register Button */
        .thermal-btn {
          background: linear-gradient(180deg, #2a2925 0%, #111110 100%);
          transition: all 0.2s ease;
        }

        .receipt-paper {
          background-color: #f6f6f2;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .receipt-paper:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.24);
          border-color: rgba(0, 0, 0, 0.1);
        }

        .text-thermal-ink {
          color: #1a1917;
        }

        .folded-corner {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 22px 22px 0;
          border-color: transparent #e2e2dc transparent transparent;
          box-shadow: -2px 2px 4px rgba(0,0,0,0.12);
          z-index: 20;
        }
      `}</style>

      {/* Global Decorative LineSidebar on the left side of the whole site */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto hidden 2xl:block">
        <div className="bg-white/60 backdrop-blur-xl border border-black/10 p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="text-[10px] font-mono text-[#4d7c0f] uppercase tracking-widest mb-3 text-center">ONAWA STUDIO</div>
          <LineSidebar
            items={[
              t('Mall Reality', 'Sentrumrealiteit'),
              t('Tenant Promos', 'Huurder-promosies'),
              t('Mall Campaigns', 'Sentrumveldtogte'),
              t('Events & Openings', 'Gebeurtenisse & Openings'),
              t('Motion Labs', 'Motion-Laboratoriums'),
              t('Social Feed', 'Sosiale Voer'),
              t('Centre Pricing', 'Sentrumpryse'),
            ]}
            accentColor="#DB0C36"
            textColor="#52525b"
            markerColor="#a1a1aa"
            showIndex={true}
            showMarker={true}
            proximityRadius={90}
            maxShift={20}
            falloff="smooth"
            markerLength={40}
            markerGap={8}
            tickScale={0.5}
            scaleTick={true}
            itemGap={16}
            fontSize={0.95}
            smoothing={100}
            defaultActive={0}
            onItemClick={(index, label) => {
              console.log('Sidebar click:', index, label);
            }}
          />
        </div>
      </div>

      {/* Main 3D Workshop Viewport with split layout — same machine, mall pipeline copy */}
      <main className="relative w-full h-screen overflow-hidden z-10">
        <AgenticFactory3D
          height="100%"
          embed={true}
          variant="mall"
        />

        {/* Left Side Content Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-stretch">
          <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-0 pb-6 sm:pb-10 flex flex-col h-full">
            {/* Hero title — centers in the space above the sidebar, biased slightly down */}
            <div className="max-w-xl lg:max-w-2xl pointer-events-auto flex-1 flex flex-col justify-center translate-y-6 lg:translate-y-10">
              <h1 ref={heroRef} className="hero-title text-[#1c1c1e] mb-8 sm:mb-10">
                <span className="block hero-line1">
                  <span className="color-salmon font-outfit whitespace-nowrap"><span className="font-glamour-initial">{t('Y', 'J')}</span>{t('our mall', 'ou sentrum')}</span>
                </span>
                <span className="block font-griffits color-heading uppercase title-fit-width">{t('HAS MORE', 'HET MEER')}</span>
                <span className="block hero-crossover">
                  <span className="color-heading font-outfit hero-smaller">{t('to', 'om')}</span>{' '}
                  <span className="color-salmon font-griffits"><span className="font-glamour-initial glamour-tight">{t('S', 't')}</span>{t('how.', 'e wys.')}</span>
                </span>
              </h1>
            </div>

            {/* Service list — pinned to the viewport bottom, aligned with the phases panel */}
            <div className="max-w-lg pointer-events-auto mt-auto">
              <LineSidebar
                  items={[
                    t('Tenant Promo Designs', 'Huurder-promosie-ontwerpe'),
                    t('Mall-wide Campaigns', 'Sentrumwye Veldtogte'),
                    t('Events & New Openings', 'Gebeurtenisse & Nuwe Openings'),
                    t('Omnichannel Social Media', 'Omnichannel Sosiale Media')
                  ]}
                  accentColor="#DB0C36"
                  textColor="#3f3f46"
                  markerColor="#52525b"
                  showIndex={true}
                  showMarker={true}
                  proximityRadius={100}
                  maxShift={30}
                  falloff="smooth"
                  markerLength={48}
                  markerGap={12}
                  tickScale={0.5}
                  scaleTick={true}
                  itemGap={16}
                  fontSize={1.05}
                  smoothing={100}
                  defaultActive={null}
                  onItemClick={(index, label) => console.log('Hero service:', index, label)}
                />
              </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          THE MALL REALITY SECTION (Same split layout: centre video left, copy right)
      ========================================================================= */}
      <section id="problem" className="relative z-20 py-28 sm:py-36 border-t border-black/10 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-[#ff2a85]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#ccff00]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Column: Centre Campaign Video */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border-2 border-black/10 shadow-[0_30px_60px_rgba(0,0,0,0.18)] aspect-[16/10] group">
                <video
                  src="https://assets.mixkit.co/videos/preview/mixkit-fresh-vegetables-falling-in-water-41551-large.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[#ccff00] font-mono text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                  <span>LIVE FOOTAGE // {t('WEEKEND FOOD MARKET', 'NAWEEK KOSMARK')}</span>
                </div>
              </div>
            </div>

            {/* Right Column: The Mall Reality Copy — copy left-aligned next to the video, pill stays right */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="mb-6 self-end inline-flex items-center gap-2.5 rounded-full bg-black/[0.04] px-3.5 py-1.5 ring-1 ring-black/10 backdrop-blur-md">
                <span className="inline-flex items-center text-xs font-semibold text-neutral-950 bg-[#ff2a85] rounded-full py-0.5 px-2 font-mono">
                  {t('REALITY', 'WERKELIKHEID')}
                </span>
                <span className="text-xs font-mono font-medium text-zinc-700 uppercase tracking-widest">
                  {t('The Mall Reality', 'Die Sentrumrealiteit')}
                </span>
              </div>

              <h2 className="type-title text-[#1c1c1e] mb-6">
                <span className="block">
                  <span className="fancy-initial">{t('F', 'V')}</span><span className="font-outfit font-medium">{t("oot traffic doesn't", 'oetverkeer kom')}</span>
                </span>
                <span className="block -mt-1.5 text-[#DB0C36]">
                  <span className="font-griffits">{t('Appear', 'nie')}</span>{' '}
                  <span className="font-outfit font-medium">{t('automatically.', 'vanself.')}</span>
                </span>
              </h2>

              <ScannerLine className="mb-8" />

              <div className="type-lead space-y-6 text-zinc-600 font-light leading-relaxed max-w-xl">
                <p className="text-[#1c1c1e] font-normal">
                  {t('Tenant specials. New store openings. Weekend events. School holiday madness. Another campaign due yesterday.', 'Huurder-spesiale. Nuwe winkelopenings. Naweek-gebeurtenisse. Skoolvakansie-waan. Nog ’n veldtog wat gister moes klaar wees.')}
                </p>
                <p className="text-zinc-500">
                  {t('Your mall is a town under one roof. Tenants count on you to keep the traffic flowing — but the designs, the opening countdowns, the event promos and a feed that never sleeps? That’s a whole other centre to run.', 'Jou sentrum is ’n dorp onder een dak. Huurders staar op jou om die verkeer laat vloei — maar die ontwerpe, die openingsaftellings, die geleentheidpromosies en ’n voer wat nooit rus nie? Dis ’n hele ander sentrum om te bestuur.')}
                </p>
                <p className="text-[#1c1c1e] font-medium text-lg sm:text-xl pt-4 border-t border-black/10">
                  {t('Good thing you don\'t have to do it all yourself.', 'Gelukkig hoef jy nie alles self te doen nie.')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Solution Section (Same neon-yellow engine: features list + live background switching) */}
      <section id="solution" className="relative z-20 py-28 sm:py-36 border-t border-black/10 overflow-hidden">
        {/* Dynamic Full Scale Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {features.map((feature, idx) => (
            <div
              key={feature.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                activeFeatureIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={feature.bgImage}
                alt={feature.title}
                className="w-full h-full object-cover filter brightness-95 contrast-105"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/45 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-20">
          <div className="max-w-3xl mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 mb-6">
              <Zap className="w-3.5 h-3.5 text-[#ccff00] animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-[#ccff00] uppercase font-semibold">
                {t('Autonomous Creative Department', 'Outonome Kreatiewe Departement')}
              </span>
            </div>

            <h2 className="type-title text-white mb-6">
              <span className="block">
                <span className="font-glamour-initial">{t('Y', 'J')}</span><span className="font-outfit font-medium">{t('ou provide the ', 'y stel die ')}</span><span className="font-griffits uppercase">{t('Space.', 'Ruimte.')}</span>
              </span>
              <span className="block -mt-1.5 text-[#ccff00] drop-shadow-[0_0_25px_rgba(204,255,0,0.4)]">
                <span className="font-outfit font-medium">{t('we make it ', 'ons maak dit ')}</span><span className="font-griffits uppercase">{t('the place.', 'die plek.')}</span>
              </span>
            </h2>

            <ScannerLine className="mb-8" color="#ccff00" />

            <p className="type-lead-oneline text-zinc-300 font-light">
              {t('Think of Onawa as your centre\'s creative department — covering tenants, campaigns and the mall itself.', 'Kyk na Onawa as jou sentrum se kreatiewe departement — huurders, veldtogte en die sentrum self.')
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            {/* Left Column: Menu with smaller text and line breakers */}
            <div className="lg:col-span-7 flex flex-col space-y-2">
              {features.map((feature, idx) => (
                <div
                  key={feature.id}
                  onMouseEnter={() => setActiveFeatureIndex(idx)}
                  className={`group relative py-3 px-2 transition-all duration-300 cursor-pointer border-b border-white/15 flex items-center justify-between ${
                    activeFeatureIndex === idx ? 'translate-x-2' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      activeFeatureIndex === idx ? 'bg-[#ccff00] text-black font-bold shadow-[0_0_12px_rgba(204,255,0,0.4)]' : 'bg-white/10 text-[#ccff00]'
                    }`}>
                      {feature.icon}
                    </div>
                    <div>
                      <span className="text-[0.625rem] font-mono text-zinc-400 block mb-0.5">
                        {feature.tag}
                      </span>
                      <h3 className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                        activeFeatureIndex === idx ? 'text-[#ccff00]' : 'text-white group-hover:text-zinc-200'
                      }`}>
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    activeFeatureIndex === idx ? 'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/10 rotate-90' : 'border-white/20 text-zinc-500'
                  }`}>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Description Text Card aligned down to match bottom of left list */}
            <div className="lg:col-span-5 flex justify-end">
              <div className="w-full max-w-md rounded-3xl bg-black/80 border border-white/20 p-7 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full bg-[#ccff00]/15 text-[#ccff00] font-mono text-xs font-bold border border-[#ccff00]/30">
                    {features[activeFeatureIndex].tag}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#ccff00]">
                    {features[activeFeatureIndex].icon}
                  </div>
                </div>

                <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                  {features[activeFeatureIndex].title}
                </h4>

                <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed mb-5">
                  {features[activeFeatureIndex].desc}
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>{t('ONAWA CREATIVE DEPT', 'ONAWA KREATIEWE DEPT')}</span>
                  <span className="text-[#ccff00]">{t('ACTIVE SELECTION', 'AKTIEWE KEUSE')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF SECTION (Interactive Social Media Showcase — fictional mall campaign) */}
      <section id="proof" className="relative z-20 py-28 sm:py-36 border-t border-black/10 overflow-hidden">
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#ff2a85]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#ccff00]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] border border-black/10 mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a85] shadow-[0_0_8px_#ff2a85] animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-[#DB0C36] uppercase font-semibold">
                {t('THE PROOF', 'DIE BEWYS')}
              </span>
            </div>

            <h2 className="type-title text-[#1c1c1e] mb-6">
              <span className="block">
                <span className="font-glamour-initial">{t('O', 'E')}</span><span className="font-outfit font-medium">{t('ne destination. ', 'en bestemming. ')}</span>
              </span>
              <span className="block -mt-1.5 text-[#DB0C36] font-griffits uppercase">{t('“ENDLESS STORIES.”', '“ONUITPUTLIKE STORIESE.”')}</span>
            </h2>

            <ScannerLine className="mx-auto mb-8" />

            <p className="type-lead text-zinc-600 font-light max-w-2xl mx-auto">
              {t('“A mall is full of good stories.', '“’N Sentrum spruis van goeie stories.')}<br />
              {t('See how good they could look on your socials.”', 'Kyk hoe goed hulle op jou sosiale media sou lyk.”')}
            </p>
          </div>

          {/* Interactive Platform Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
            <button
              type="button"
              onClick={() => setActivePlatform('facebook')}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                activePlatform === 'facebook'
                  ? 'bg-[#1877F2] text-white shadow-[0_0_25px_rgba(24,119,242,0.4)] scale-105'
                  : 'bg-white/70 hover:bg-white text-zinc-700 border border-black/10 shadow-sm'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#1877F2] font-bold text-xs">
                f
              </div>
              <span>Facebook</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePlatform('instagram')}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                activePlatform === 'instagram'
                  ? 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-[0_0_25px_rgba(253,29,29,0.4)] scale-105'
                  : 'bg-white/70 hover:bg-white text-zinc-700 border border-black/10 shadow-sm'
              }`}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePlatform('tiktok')}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                activePlatform === 'tiktok'
                  ? 'bg-zinc-900 border border-[#25F4EE] text-[#25F4EE] shadow-[0_0_25px_rgba(37,244,238,0.3)] scale-105'
                  : 'bg-white/70 hover:bg-white text-zinc-700 border border-black/10 shadow-sm'
              }`}
            >
              <Film className="w-5 h-5" />
              <span>TikTok</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePlatform('whatsapp')}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                activePlatform === 'whatsapp'
                  ? 'bg-[#25D366] text-black font-bold shadow-[0_0_25px_rgba(37,211,102,0.4)] scale-105'
                  : 'bg-white/70 hover:bg-white text-zinc-700 border border-black/10 shadow-sm'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Platform Preview Container */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-white/60 border border-black/10 p-4 sm:p-8 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] relative">

            {/* FACEBOOK PREVIEW */}
            {activePlatform === 'facebook' && (
              <div className="bg-[#242526] text-[#e4e6eb] rounded-2xl overflow-hidden shadow-xl border border-white/10 max-w-2xl mx-auto">
                <div className="relative h-44 sm:h-56 bg-gradient-to-r from-orange-800 to-rose-900 overflow-hidden">
                  <img
                    src={currentAsset.image}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-40 blur-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#242526] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6 flex items-end gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#242526] bg-orange-600 overflow-hidden shadow-xl flex items-center justify-center font-black text-2xl text-white">
                      OC
                    </div>
                    <div className="mb-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg sm:text-xl font-bold text-white">Onawa Central Mall</h3>
                        <CheckCircle2 className="w-4 h-4 text-[#1877F2] fill-white" />
                      </div>
                      <p className="text-xs text-zinc-400">Shopping Centre • 68K Followers</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white text-sm">
                        OC
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">Onawa Central Mall</h4>
                        <p className="text-xs text-zinc-400 flex items-center gap-1">
                          <span>{currentAsset.timestamp}</span> • <Globe className="w-3 h-3" />
                        </p>
                      </div>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-zinc-400 cursor-pointer" />
                  </div>

                  <p className="text-sm sm:text-base text-zinc-200 whitespace-pre-line leading-relaxed">
                    {currentAsset.caption} <span className="text-[#2d88ff]">{currentAsset.hashtags}</span>
                  </p>

                  <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] group cursor-pointer border border-white/10" onClick={() => setIsExpandedImage(true)}>
                    <img
                      src={currentAsset.image}
                      alt={currentAsset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[#ccff00] font-mono text-xs font-bold">
                      {t('THIS WEEKEND:', 'HIERDIE NAWEEK:')} {currentAsset.price}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-white/90 text-black text-xs font-bold font-mono shadow-lg">{t('Click to View Full Artwork', 'Klik om die Volle Kunswerk te Sien')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-700 text-xs text-zinc-400">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[10px]">👍</div>
                      <span>{currentAsset.likes}</span>
                    </div>
                    <div>
                      <span>{currentAsset.comments} {t('comments', 'kommentare')} • {currentAsset.shares} {t('shares', 'deelinge')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-zinc-700 text-sm font-medium text-zinc-300">
                    <button
                      type="button"
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer ${isLiked ? 'text-[#1877F2]' : ''}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{t('Like', 'Soos')}</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                      <MessageSquare className="w-4 h-4" />
                      <span>{t('Comment', 'Kommentaar')}</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                      <Share2 className="w-4 h-4" />
                      <span>{t('Share', 'Deel')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* INSTAGRAM PREVIEW */}
            {activePlatform === 'instagram' && (
              <div className="bg-black text-white rounded-2xl overflow-hidden shadow-xl border border-white/10 max-w-xl mx-auto">
                <div className="p-6 border-b border-zinc-800">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0">
                      <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center font-bold text-xl">
                        <img src={currentAsset.image} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-base sm:text-lg">onawacentral</h3>
                        <button type="button" className="px-4 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold hover:bg-zinc-700 transition-colors">
                          {t('Following', 'Volg')}
                        </button>
                      </div>
                      <div className="flex items-center gap-6 text-xs sm:text-sm text-zinc-300">
                        <span><strong>286</strong> {t('posts', 'plasings')}</span>
                        <span><strong>68K</strong> {t('followers', 'volgelinge')}</span>
                        <span><strong>310</strong> {t('following', 'volg')}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Onawa Central Mall</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      🛍 {t('The shops, food & fun your weekends deserve.', 'Die winkels, kos & pret wat jou naweke verdien.')}<br />
                      🎬 {t('Weekend markets, movie nights & mall moments.', 'Naweek-merke, fliek-aande & sentrum-oomblikke.')}<br />
                      📍 {t('Find us on the map below 👇', 'Vind ons op die kaart hieronder 👇')}
                    </p>
                    <a href="#mall" onClick={(e) => e.preventDefault()} className="text-xs text-[#ccff00] font-mono mt-1 block">
                      linktr.ee/onawacentral
                    </a>
                  </div>
                </div>

                <div className="border-t border-zinc-800">
                  <div className="flex items-center justify-between p-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-600">
                        <img src={currentAsset.image} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-xs sm:text-sm">onawacentral</span>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                  </div>

                  <div className="relative aspect-square bg-black overflow-hidden group cursor-pointer" onClick={() => setIsExpandedImage(true)}>
                    <img src={currentAsset.image} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[#ccff00] font-mono text-xs font-bold">
                      {currentAsset.price}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Heart className="w-6 h-6 hover:text-rose-500 transition-colors cursor-pointer text-rose-500 fill-rose-500" />
                        <MessageSquare className="w-6 h-6 hover:text-zinc-300 transition-colors cursor-pointer" />
                        <Send className="w-6 h-6 hover:text-zinc-300 transition-colors cursor-pointer" />
                      </div>
                      <Bookmark className="w-6 h-6 hover:text-zinc-300 transition-colors cursor-pointer" />
                    </div>
                    <div className="text-xs font-semibold">{currentAsset.likes} {t('likes', 'hou van dit')}</div>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                      <strong className="text-white mr-2">onawacentral</strong>
                      {currentAsset.caption} <span className="text-[#3897f0]">{currentAsset.hashtags}</span>
                    </p>
                    <p className="text-[0.6875rem] text-zinc-400 uppercase tracking-wider">{currentAsset.timestamp}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TIKTOK PREVIEW */}
            {activePlatform === 'tiktok' && (
              <div className="max-w-sm mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-800 relative aspect-[9/16] flex flex-col justify-between">
                <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-900">
                  <video
                    src={currentAsset.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
                </div>

                <div className="relative z-10 p-4 flex items-center justify-between text-white">
                  <div className="text-xs font-mono font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    {t('Following', 'Volg')}{' | '}<span className="text-[#25F4EE]">{t('For You', 'Vir Jou')}</span>
                  </div>
                  <Volume2 className="w-5 h-5 text-white/80" />
                </div>

                <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4 text-white">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-orange-600">
                      <img src={currentAsset.image} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FE2C55] text-white flex items-center justify-center text-xs font-bold">
                      +
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                      <Heart className="w-5 h-5 text-[#FE2C55] fill-[#FE2C55]" />
                    </div>
                    <span className="text-xs font-bold">45.2K</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold">1,204</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold">3,480</span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 animate-spin flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55]" />
                  </div>
                </div>

                <div className="relative z-10 p-5 space-y-3 text-white">
                  <div>
                    <h4 className="font-bold text-sm flex items-center gap-1.5">
                      @onawacentral <CheckCircle2 className="w-3.5 h-3.5 text-[#25F4EE] fill-white" />
                    </h4>
                    <p className="text-xs text-zinc-200 mt-1 line-clamp-2">
                      {currentAsset.caption} <span className="text-[#25F4EE]">{currentAsset.hashtags}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg w-fit">
                    <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
                    <span className="truncate max-w-[200px]">{t('Original Sound - Onawa Central', 'Oorspronklike Klank - Onawa Central')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* WHATSAPP PREVIEW */}
            {activePlatform === 'whatsapp' && (
              <div className="bg-[#0b141a] text-[#e9edef] rounded-2xl overflow-hidden shadow-xl border border-white/10 max-w-xl mx-auto">
                <div className="bg-[#1f2c34] p-4 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#25D366] text-black font-bold flex items-center justify-center text-lg overflow-hidden">
                      <img src={currentAsset.image} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm flex items-center gap-1">
                        Onawa Central Mall <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366] fill-black" />
                      </h4>
                      <p className="text-[11px] text-[#25D366]">{t('Online • Business Account', 'Aanlyn • Besigheidsrekening')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-300">
                    <Phone className="w-5 h-5 cursor-pointer" />
                    <MoreHorizontal className="w-5 h-5 cursor-pointer" />
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4 bg-[radial-gradient(#111b21_1px,transparent_1px)] bg-[size:16px_16px] min-h-[380px] flex flex-col justify-end">
                  <div className="bg-[#202c33] rounded-xl overflow-hidden border border-zinc-700 shadow-lg max-w-sm mx-auto w-full">
                    <div className="relative aspect-[4/3] bg-black">
                      <img src={currentAsset.image} alt="Status" className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded bg-[#25D366] text-black font-mono text-[11px] font-bold">
                        {t('WHATSAPP STATUS UPDATE', 'WHATSAPP STATUS-WERKENDING')}
                      </div>
                    </div>
                    <div className="p-3 text-xs text-zinc-300 font-mono">
                      🛍 {currentAsset.title} — {t("Tap for what's on this weekend.", 'Tik vir wat hierdie naweek aangaan.')}
                    </div>
                  </div>

                  <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tr-none max-w-md ml-auto shadow-md space-y-2">
                    <p className="text-xs sm:text-sm leading-relaxed">
                      🔔 <strong>{t('ONAWA CENTRAL BULLETIN:', 'ONAWA CENTRAL-NUUSBRIEF:')}</strong><br />
                      {currentAsset.caption}
                    </p>
                    <div className="p-2 rounded-lg bg-black/20 font-mono text-xs text-[#25D366] flex items-center justify-between">
                      <span>{t('This weekend:', 'Hierdie naweek:')} {currentAsset.price}</span>
                      <span>{t('Runs all weekend', 'Loop al die naweek')}</span>
                    </div>
                    <div className="text-[10px] text-zinc-300 text-right">09:42 AM ✓✓</div>
                  </div>
                </div>

                <div className="p-3 bg-[#1f2c34] flex items-center gap-3">
                  <div className="flex-1 bg-[#2a3942] px-4 py-2.5 rounded-full text-xs text-zinc-400">
                    {t('Reply to Onawa Central Mall...', 'Antwoord op Onawa Central Mall...')}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-black font-bold">
                    <Send className="w-4 h-4 text-black" />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Expanded Artwork Lightbox Modal */}
          {isExpandedImage && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="relative max-w-4xl w-full bg-zinc-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                <div className="p-4 bg-zinc-950 flex items-center justify-between border-b border-zinc-800">
                  <span className="font-mono text-xs text-[#ccff00] uppercase tracking-wider">
                    {t('DEMO CAMPAIGN ASSET //', 'DEMO-VELDTOGBATE //')} {currentAsset.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsExpandedImage(false)}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white font-mono cursor-pointer"
                  >
                    {t('CLOSE [X]', 'MAAK TOE [X]')}
                  </button>
                </div>
                <div className="p-6 flex items-center justify-center bg-black">
                  <img src={currentAsset.image} alt="Expanded" className="max-h-[70vh] object-contain rounded-xl shadow-2xl" />
                </div>
                <div className="p-4 bg-zinc-950 text-center text-xs text-zinc-400">
                  {currentAsset.caption}
                </div>
              </div>
            </div>
          )}

          {/* Demo-content disclosure */}
          <p className="text-center font-mono text-[10px] tracking-widest text-zinc-500 uppercase mt-8">
            {t('Demo content — fictional mall “Onawa Central”. Sample campaigns by Onawa Studio, not client work.', 'Demoinhoud — fiktiewe sentrum “Onawa Central”. Proefveldtogte deur Onawa Studio, nie kliëntewerk nie.')}
          </p>

        </div>
      </section>

      {/* =========================================================================
          OFFER SECTION — RECEIPT-INSPIRED PACKAGE DESIGN (2 confirmed packages)
      ========================================================================= */}
      <section id="offers" className="relative z-20 py-28 sm:py-36 border-t border-black/10 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ccff00]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#ff2a85]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">

          {/* Section Introduction */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] border border-black/10 mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00] animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-[#4d7c0f] uppercase font-semibold">
                {t("YOUR CENTRE'S MONTHLY CREATIVE MENU", 'JOU SENTRUM SE MAANDELIKSE KREATIEWE SPYSKAART')}
              </span>
            </div>

            <h2 className="type-section text-[#1c1c1e] mb-6">
              <span className="block">
                <span className="fancy-initial">{t('G', 'G')}</span><span className="font-outfit font-medium">{t('ood creative, ', 'oeie kreatiwiteit, ')}</span><span className="font-griffits uppercase">{t('all floors.', 'alle vlakke.')}</span>
              </span>
              <span className="block mt-0.5 font-outfit font-medium text-[#4d7c0f]">{t('tenant promos. mall moments.', 'huurder-promosies. sentrum-oomblikke.')}</span>
            </h2>

            <p className="type-lead text-zinc-600 font-light max-w-2xl mx-auto mb-3">
              {t('“Pick your package, and let\'s get your centre looking like the main event.”', '“Kies jou pakkie, en laat ons jou sentrum laat lyk soos die hoofgebeurtenis.”')}
            </p>

            <p className="type-ui font-mono text-zinc-500 uppercase tracking-wider">
              {t('Two packages. One creative partner. No long-term contract.', 'Twee pakkette. Een kreatiewe vennoot. Geen langtermynkontrak nie.')}
            </p>

            {/* Subtle Checkout Scanner Laser Line Visual Graphic */}
            <ScannerLine className="mt-8 mx-auto" />
          </div>

          {/* ==================== 2 TILL SLIP OFFER CARDS SIDE BY SIDE ==================== */}
          <main className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 items-start pt-6 max-w-4xl mx-auto mb-20">
            {mallPackages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className={`receipt-paper receipt-fold text-thermal-ink font-mono p-5 sm:p-6 relative select-none rounded-sm ${pkg.cardBorderClass}`}
              >
                {/* Laser Scanner Animation Overlay */}
                <div className="laser-scanner-overlay">
                  <div className="laser-line" />
                </div>

                {/* Realistic Folded Corner */}
                <div className="folded-corner" />

                {/* Sawtooth Top Edge */}
                <div className="mb-4 -mx-5 sm:-mx-6 -mt-5 sm:-mt-6">
                  <SawtoothEdge position="top" color="#f6f6f2" />
                </div>

                {/* Receipt Header */}
                <div className="text-center font-mono pb-4 mb-4 space-y-1">
                  <div className="font-black text-sm tracking-widest text-zinc-950 uppercase">
                    ONAWA STUDIO TILL
                  </div>
                  <div className="text-[10px] text-zinc-600 tracking-wider">
                    {t('MALL #0400 // CENTRE OFFICE // TAX INVOICE', 'SENTRUM #0400 // SENTRUMKANTOOR // BELASTINGFAKTUUR')}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {t('AUTONOMOUS CREATIVE PIPELINE', 'OUTONOME KREATIEWE PYPLYN')}
                  </div>

                  {/* Visual Message Pill */}
                  <div className="pt-2">
                    <span className={`inline-block px-3 py-1 rounded-sm text-[11px] font-bold tracking-widest uppercase ${pkg.badgeBg}`}>
                      {pkg.visualMessage}
                    </span>
                  </div>
                </div>

                {/* Perforation Divider */}
                <div className="receipt-perforation w-full h-[2px] mb-4" />

                {/* Basket / Trolley Visual Illustration Header */}
                <div className="flex items-center justify-between bg-zinc-200/60 p-3 rounded-lg mb-5 border border-zinc-300">
                  <div className="flex items-center gap-3">
                    {pkg.trolleyTier === 'small' && (
                      <div className="w-11 h-11 rounded-lg bg-black text-[#ccff00] flex items-center justify-center font-bold shadow-xs">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                    {pkg.trolleyTier === 'medium' && (
                      <div className="w-11 h-11 rounded-lg bg-[#ff2a85] text-white flex items-center justify-center font-bold shadow-xs">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                    )}
                    {pkg.trolleyTier === 'full' && (
                      <div className="w-11 h-11 rounded-lg bg-black text-[#25F4EE] border border-[#25F4EE] flex items-center justify-center font-bold shadow-xs">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-mono font-bold text-base text-zinc-950 leading-tight">
                        {pkg.name}
                      </h3>
                      <p className="text-[11px] font-mono text-zinc-600">
                        {pkg.shortDesc}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-500">
                    ITEM #{idx + 1}
                  </span>
                </div>

                {/* Itemised Services with Perforated Lines */}
                <div className="space-y-3 font-mono text-xs mb-5">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-semibold border-b border-zinc-300 pb-1 uppercase tracking-wider">
                    <span>{t('SCAN ITEM', 'SKAN ITEM')}</span>
                    <span>{t('ALLOWANCE', 'TOELAE')}</span>
                  </div>

                  {pkg.inclusions.map((item, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-baseline justify-between gap-1 leading-snug text-zinc-900">
                        <span className="shrink-0 font-medium">{item.category}</span>
                        <span className="flex-1 border-b border-dotted border-zinc-400 mx-1 mb-1" />
                        <span className={`shrink-0 font-bold ${item.detail === 'TBC' ? 'bg-zinc-300/80 px-1 rounded text-zinc-600' : 'text-zinc-950'}`}>
                          {item.detail}
                        </span>
                      </div>
                      {item.subdetail && (
                        <div className="text-[10px] text-zinc-500 italic pl-1">
                          ↳ {item.subdetail}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Perforation Line before Totals */}
                <div className="receipt-perforation w-full h-[2px] mb-4" />

                {/* Totals — confirmed pricing, same receipt format as the retail page */}
                <div className="pt-1 mb-5 font-mono space-y-1.5">
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span>{t('REGULAR SUBTOTAL:', 'GEREELDE SUBTOTAAL:')}</span>
                    <span>N${pkg.rawPrice}.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span>{t('LONG-TERM CONTRACT:', 'LANGTERMYNKONTRAK:')}</span>
                    <span className="text-emerald-700 font-bold">{t('N$0.00 (NONE)', 'N$0.00 (GEEN)')}</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-zinc-300 text-zinc-950">
                    <span className="font-black text-sm tracking-wider uppercase">{t('MONTHLY TOTAL:', 'MAANDELIKSE TOTAAL:')}</span>
                    <span className="font-black text-2xl sm:text-3xl tracking-tight">
                      {pkg.price}<span className="text-xs font-normal text-zinc-600">/{t('MO', 'MA')}</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 italic pt-1">
                    {pkg.supportingText}
                  </p>
                </div>

                {/* Thermal Register Action Button */}
                <button
                  type="button"
                  onClick={() => handleWhatsAppEnquiry(pkg.name, pkg.rawPrice)}
                  className={`thermal-btn w-full py-3.5 px-4 rounded-xl font-mono font-bold text-xs sm:text-sm tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-lg border hover:scale-[1.02] active:scale-[0.98] ${pkg.buttonAccentColor}`}
                >
                  <span>{pkg.buttonLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Barcode Graphic */}
                <BarcodeGraphic code={pkg.barcode} />

                <div className="text-center font-mono text-[9px] text-zinc-500 mt-2 mb-2">
                  {t('THANK YOU FOR VISITING ONAWA CENTRAL', 'DANKIE DAT JY ONAWA CENTRAL SOEKEN')}
                </div>

                {/* Sawtooth Bottom Edge */}
                <div className="mt-4 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6">
                  <SawtoothEdge position="bottom" color="#f6f6f2" />
                </div>
              </div>
            ))}
          </main>

          {/* Terms, Scope & Turnaround Policy Card */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/60 border border-black/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-2.5 mb-4 font-mono text-xs font-semibold text-[#4d7c0f] uppercase tracking-wider">
                <Info className="w-4 h-4" />
                <span>{t('TERMS OF ENGAGEMENT & WORKING PROCESS', 'VOORWAARDES VAN VERSKANSING & WERKSPROSES')}</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm font-mono text-zinc-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#4d7c0f] shrink-0 font-bold">•</span>
                  <span>{t('Requests are handled one at a time to ensure maximum focus and creative quality.', 'Versoeke word een vir een hanteer om maksimum fokus en kreatiewe gehalte te verseker.')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4d7c0f] shrink-0 font-bold">•</span>
                  <span>{t('Please allow at least one day before your intended release date for standard turnaround.', 'Laat asseblief ten minste een dag voor jou beoogde vrystellingsdatum vir standaard deurlooptyd.')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4d7c0f] shrink-0 font-bold">•</span>
                  <span>{t('Rush requests depend on studio availability and may incur an additional expediting fee.', 'Haastige versoeke hang af van die ateljee se beskikbaarheid en kan ’n bykomende versneltarief insluit.')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4d7c0f] shrink-0 font-bold">•</span>
                  <span>{t('Printing costs are not included. All deliverables are provided as production-ready digital and high-resolution print files.', 'Drukkoste is nie ingesluit nie. Alle aflewerings word verskaf as produksiegereed digitale en hoë-resolusie druklêers.')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4d7c0f] shrink-0 font-bold">•</span>
                  <span>{t('Social media management covers scheduling and publishing the created designs; paid advertising budgets, customer service and community management are not included.', 'Sosiale media-bestuur dek skedulering en publisering van die geskepte ontwerpe; betaalde advertensiebegrotings, kliëntediens en gemeenskapsbestuur is nie ingesluit nie.')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Shared Terms & Reassurance Grid (4 Icon Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <div className="p-5 rounded-2xl bg-white/60 border border-black/10 flex items-start gap-3.5 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="w-9 h-9 rounded-xl bg-[#ccff00]/20 border border-[#ccff00]/50 flex items-center justify-center text-[#4d7c0f] shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-[#1c1c1e] uppercase tracking-wider mb-1">
                  {t('MONTH-TO-MONTH', 'MAAND-TOT-MAAND')}
                </h4>
                <p className="text-xs text-zinc-500 leading-snug font-light">
                  {t('No long-term contract. Cancel or pause whenever your centre needs.', 'Geen langtermynkontrak nie. Kanselleer of pouseer wanneer jou sentrum dit nodig het.')}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/60 border border-black/10 flex items-start gap-3.5 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="w-9 h-9 rounded-xl bg-[#ff2a85]/10 border border-[#ff2a85]/30 flex items-center justify-center text-[#DB0C36] shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-[#1c1c1e] uppercase tracking-wider mb-1">
                  {t('ONE CREATIVE PARTNER', 'EEN KREATIEWE VENNOOT')}
                </h4>
                <p className="text-xs text-zinc-500 leading-snug font-light">
                  {t('Your dedicated ongoing design, motion and content department.', 'Jou toegewyde deurlopende ontwerp-, motion- en inhoudsdepartement.')}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/60 border border-black/10 flex items-start gap-3.5 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="w-9 h-9 rounded-xl bg-[#25F4EE]/15 border border-[#25F4EE]/40 flex items-center justify-center text-[#0e8c8c] shrink-0 mt-0.5">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-[#1c1c1e] uppercase tracking-wider mb-1">
                  {t('MULTI-CHANNEL', 'MULTI-KANAAL')}
                </h4>
                <p className="text-xs text-zinc-500 leading-snug font-light">
                  {t('Facebook, Instagram and WhatsApp — content adapted per package.', 'Facebook, Instagram en WhatsApp — inhoud aangepas per pakkie.')}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/60 border border-black/10 flex items-start gap-3.5 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-[#1c1c1e] uppercase tracking-wider mb-1">
                  {t('TENANTS INCLUDED', 'HUURDERS INGESLUIT')}
                </h4>
                <p className="text-xs text-zinc-500 leading-snug font-light">
                  {t('One centre, every tenant promotion — per package tier.', 'Een sentrum, elke huurder-promosie — per pakkie-vlak.')}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ShoppingMallPage;
