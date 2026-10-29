import React, { useState, useEffect, useRef } from 'react';
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';
import AgenticFactory3D from '../components/AgenticFactory3D';
import LineSidebar from '../components/LineSidebar';
import {
  Tag, FileText, Film, Share2, Zap,
  ThumbsUp, MessageSquare, Heart, Bookmark, Send, Play, 
  CheckCircle2, Globe, Phone, MoreHorizontal, Volume2,
  MessageCircle, ShoppingBag, ShoppingCart, Calendar, Users, 
  Check, ArrowRight, Printer, XCircle, Info, Layers
} from 'lucide-react';

interface RetailStorePageProps {
  onNavigate: (page: 'home' | 'retail-store') => void;
}

const CAMPAIGN_ASSETS = [
  {
    id: 'campaign-1',
    title: 'Weekend Fresh Produce // 50% Off Organic Greens',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-fresh-vegetables-falling-in-water-41551-large.mp4',
    caption: 'Fresh produce just landed at Onawa Fresh! Crisp organic greens, hand-picked berries & weekend savings you can taste. Stock up before Sunday! 🛒✨',
    hashtags: '#FreshProduce #WeekendSpecials #OnawaFresh #GroceryDeals #FarmToTable',
    price: '$2.99 /kg',
    likes: '1.4k',
    comments: '128',
    shares: '482',
    timestamp: '2 hours ago',
  },
  {
    id: 'campaign-2',
    title: 'Payday Butcher & Meat Market Madness',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=1200&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-vegetables-on-a-wooden-board-43141-large.mp4',
    caption: 'Payday madness is here! Premium cuts, succulent steaks & butcher bundles ready for the weekend grill. Don’t miss out on our biggest drop yet. 🔥🥩',
    hashtags: '#PaydaySpecials #ButcherQuality #GrillMaster #OnawaMarket #WeekendVibes',
    price: '$9.99 /pack',
    likes: '2.8k',
    comments: '245',
    shares: '890',
    timestamp: '4 hours ago',
  },
  {
    id: 'campaign-3',
    title: 'Bakery Morning Warmth & Artisan Bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-baker-taking-bread-out-of-the-oven-43142-large.mp4',
    caption: 'Fresh out of the oven! Artisan sourdough, golden croissants & morning roast coffee waiting for you. Rise and shine with Onawa Bakery. 🥐☕',
    hashtags: '#FreshBakery #MorningCoffee #ArtisanBread #OnawaFresh #BreakfastGoals',
    price: '$3.49 each',
    likes: '954',
    comments: '86',
    shares: '150',
    timestamp: 'Yesterday',
  },
];

interface ReceiptItem {
  category: string;
  detail: string;
  subdetail?: string;
  isIncluded: boolean;
  isUnlimited?: boolean;
}

interface RetailPackage {
  id: string;
  name: string;
  price: string;
  rawPrice: string;
  personality: string;
  visualMessage: string;
  shortDesc: string;
  accentColor: string;
  badgeBg: string;
  stamp?: string;
  stampBorder?: string;
  stampText?: string;
  cardBorderClass?: string;
  trolleyTier: 'small' | 'medium' | 'full';
  barcode: string;
  buttonLabel: string;
  buttonAccentColor: string;
  inclusions: ReceiptItem[];
  notInBasket?: string[];
}

const RETAIL_PACKAGES: RetailPackage[] = [
  {
    id: 'okalaaitie',
    name: 'OkaLaaitie',
    price: 'N$850',
    rawPrice: '850',
    personality: 'THE ESSENTIALS',
    visualMessage: 'THE ESSENTIALS',
    shortDesc: "Your store's creative starter basket.",
    accentColor: '#ccff00',
    badgeBg: 'bg-[#ccff00] text-black',
    cardBorderClass: '',
    trolleyTier: 'small',
    barcode: '0 85000 12042 1',
    buttonLabel: 'PICK MY BASKET',
    buttonAccentColor: 'text-[#ccff00] border-[#ccff00]/40',
    inclusions: [
      {
        category: 'DIGITAL & PRINT GRAPHICS',
        detail: '3 requests / week',
        isIncluded: true,
      },
      {
        category: 'LEAFLET DESIGN',
        detail: '1 leaflet / week',
        subdetail: 'Max 20 items per leaflet',
        isIncluded: true,
      },
      {
        category: 'SEASONAL CAMPAIGNS',
        detail: 'Included',
        subdetail: 'Holiday & seasonal event graphics',
        isIncluded: true,
      },
      {
        category: 'SOCIAL MEDIA MANAGEMENT',
        detail: 'INCLUDED FREE',
        subdetail: 'Schedules & publishes created designs',
        isIncluded: true,
      },
    ],
    notInBasket: [
      'Motion graphic reels (1 reel / week in Omtat, Unlimited in Mekulu)',
      'Higher weekly design allowance (5 requests / week in Omtat)',
      'Higher weekly leaflet allowance (2 leaflets / week in Omtat)',
      'Digital & print-ready supporting materials (shelf talkers, nametags, notices, house rules)',
      'Unlimited design, motion reels & leaflets (available in Mekulu)',
    ],
  },
  {
    id: 'omtat',
    name: 'Omtat',
    price: 'N$1,500',
    rawPrice: '1,500',
    personality: 'THE EXTRA AISLE',
    visualMessage: 'THE EXTRA AISLE',
    shortDesc: 'More room in the basket. More creative on the shelves.',
    accentColor: '#ff2a85',
    badgeBg: 'bg-[#DB0C36] text-white',
    cardBorderClass: 'border-2 border-pink-500/30',
    stamp: 'MORE REQUESTS. MORE FORMATS. MORE FLEXIBILITY.',
    stampBorder: 'border-pink-500 text-pink-600',
    stampText: 'text-pink-600',
    trolleyTier: 'medium',
    barcode: '0 15000 23098 7',
    buttonLabel: 'UPGRADE MY CREATIVE',
    buttonAccentColor: 'text-[#ff2a85] border-[#ff2a85]/40',
    inclusions: [
      {
        category: 'DIGITAL & PRINT GRAPHICS',
        detail: '5 requests / week',
        isIncluded: true,
      },
      {
        category: 'MOTION GRAPHIC REELS',
        detail: '1 motion reel / week',
        isIncluded: true,
      },
      {
        category: 'LEAFLET DESIGN',
        detail: '2 leaflets / week',
        subdetail: 'Max 20 items per leaflet each',
        isIncluded: true,
      },
      {
        category: 'DIGITAL & PRINT-READY MATERIALS',
        detail: 'Included',
        subdetail: 'Shelf talkers, nametags, notices, vacancy & house rules',
        isIncluded: true,
      },
      {
        category: 'SEASONAL CAMPAIGNS',
        detail: 'Included',
        subdetail: 'Full seasonal campaign packages',
        isIncluded: true,
      },
      {
        category: 'SOCIAL MEDIA MANAGEMENT',
        detail: 'INCLUDED FREE',
        subdetail: 'Schedules & publishes created designs',
        isIncluded: true,
      },
    ],
  },
  {
    id: 'mekulu',
    name: 'Mekulu',
    price: 'N$2,500',
    rawPrice: '2,500',
    personality: 'THE FULL TROLLEY',
    visualMessage: 'THE FULL TROLLEY',
    shortDesc: 'Your creative needs? Load them up.',
    accentColor: '#25F4EE',
    badgeBg: 'bg-black text-[#25F4EE] border border-[#25F4EE]',
    cardBorderClass: 'border-2 border-cyan-500/40',
    stamp: 'MAXIMUM CREATIVE',
    stampBorder: 'border-cyan-600 text-cyan-600',
    stampText: 'text-cyan-600',
    trolleyTier: 'full',
    barcode: '0 25000 99420 5',
    buttonLabel: 'LOAD UP THE TROLLEY',
    buttonAccentColor: 'text-[#25F4EE] border-[#25F4EE]/40',
    inclusions: [
      {
        category: 'DIGITAL & PRINT GRAPHICS',
        detail: 'UNLIMITED',
        subdetail: 'Queue-based continuous design pipeline',
        isIncluded: true,
        isUnlimited: true,
      },
      {
        category: 'MOTION GRAPHIC REELS',
        detail: 'UNLIMITED',
        subdetail: 'Automated 4K motion videos & reels',
        isIncluded: true,
        isUnlimited: true,
      },
      {
        category: 'LEAFLET DESIGN',
        detail: 'UNLIMITED',
        subdetail: 'Unlimited digital & print promotional leaflets',
        isIncluded: true,
        isUnlimited: true,
      },
      {
        category: 'DIGITAL & PRINT-READY MATERIALS',
        detail: 'UNLIMITED',
        subdetail: 'Shelf talkers, nametags, notices, house rules & signage',
        isIncluded: true,
        isUnlimited: true,
      },
      {
        category: 'SEASONAL CAMPAIGNS',
        detail: 'Included',
        subdetail: 'Priority seasonal campaign releases',
        isIncluded: true,
      },
      {
        category: 'SOCIAL MEDIA MANAGEMENT',
        detail: 'INCLUDED FREE',
        subdetail: 'Active scheduling & omnichannel publishing',
        isIncluded: true,
      },
    ],
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

// Checkout scanner laser line — reusable separation line.
// Track is a thin zinc bar; a colored shimmer sweeps across it on loop.
// w-full + max-w-xs keeps a width even inside flex columns (fit-content would collapse to 0).
// `color` sets the sweep hue — pink by default, neon #ccff00 in the Solution section.
const ScannerLine: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#ff2a85' }) => (
  <div className={`relative h-[2px] w-full max-w-xs bg-zinc-300 overflow-hidden ${className}`}>
    <div
      className="absolute inset-y-0 left-0 w-1/3 scanner-sweep animate-[shimmer_2s_infinite]"
      style={{ '--sweep-color': color } as React.CSSProperties}
    />
  </div>
);

export const RetailStorePage: React.FC<RetailStorePageProps> = ({ onNavigate }) => {
  const [activePlatform, setActivePlatform] = useState<'facebook' | 'instagram' | 'tiktok' | 'whatsapp'>('facebook');
  const [selectedAssetIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isExpandedImage, setIsExpandedImage] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const heroRef = useRef<HTMLHeadingElement>(null);

  // Width fit for "DESERVES": ratio of "Your store"'s width to "DESERVES"'s
  // natural width, written into --title-fit and consumed by .title-fit-width.
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
      // clamp the ratio: optically honest match, but never explodes or shrinks into unreadable territory
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
  }, []);

  const currentAsset = CAMPAIGN_ASSETS[selectedAssetIndex];

  const handleWhatsAppEnquiry = (pkgName: string, price: string) => {
    const message = `Hi Onawa Studio! I'm interested in the ${pkgName} package at N$${price} per month for my store. Can we chat about getting started?`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const features = [
    {
      id: 1,
      title: 'Promotional designs',
      desc: "Make those prices impossible to ignore. Well, almost. We can't control your customers.",
      icon: <Tag className="w-5 h-5 text-[#ccff00]" />,
      tag: '01 // PROMOS',
      bgImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Digital leaflets',
      desc: 'Your specials, neatly packed and ready to share. No paper cuts required.',
      icon: <FileText className="w-5 h-5 text-[#ccff00]" />,
      tag: '02 // CIRCULARS',
      bgImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Motion graphics',
      desc: 'Because sometimes a special deserves more than standing still.',
      icon: <Film className="w-5 h-5 text-[#ccff00]" />,
      tag: '03 // MOTION LAB',
      bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 4,
      title: 'Social content & publishing',
      desc: "We create, caption, schedule and publish. Your pages don't have to look like the lights are off.",
      icon: <Share2 className="w-5 h-5 text-[#ccff00]" />,
      tag: '04 // MULTI-FEED',
      bgImage: 'https://images.unsplash.com/photo-1534536281715-e28d76684b5d?q=80&w=1600&auto=format&fit=crop',
    },
    {
      id: 5,
      title: 'Websites & Apps',
      desc: "For if a store wants its own custom branded website or mobile ordering app.",
      icon: <Globe className="w-5 h-5 text-[#ccff00]" />,
      tag: '05 // DIGITAL STORE',
      bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
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

      {/* Receipt Styling Definitions from attached code */}
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
            items={['Retail Reality', 'Promos & Ads', 'Digital Leaflets', 'Motion Labs', 'Social Feed', 'Websites & Apps', 'Receipt Pricing']}
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

      {/* Main 3D Workshop Viewport with split layout */}
      <main className="relative w-full h-screen overflow-hidden z-10">
        <AgenticFactory3D
          height="100%"
          embed={true}
        />

        {/* Left Side Content Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-stretch">
          <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-0 pb-6 sm:pb-10 flex flex-col h-full">
            {/* Hero title — centers in the space above the sidebar, biased slightly down */}
            <div className="max-w-xl lg:max-w-2xl pointer-events-auto flex-1 flex flex-col justify-center translate-y-6 lg:translate-y-10">
              <h1 ref={heroRef} className="hero-title text-[#1c1c1e] mb-8 sm:mb-10">
                <span className="block hero-line1">
                  <span className="color-salmon font-outfit whitespace-nowrap"><span className="font-glamour-initial">Y</span>our store</span>
                </span>
                <span className="block font-griffits color-heading uppercase title-fit-width">DESERVES</span>
                <span className="block hero-crossover">
                  <span className="color-heading font-outfit hero-smaller">it's</span>{' '}
                  <span className="hero-own color-salmon font-outfit">own</span>{' '}
                  <span className="color-salmon font-griffits"><span className="font-glamour-initial glamour-tight">C</span>reative team</span>
                </span>
              </h1>
            </div>

            {/* Service list — pinned to the viewport bottom, aligned with the phases panel */}
            <div className="max-w-lg pointer-events-auto mt-auto">
              <LineSidebar
                  items={[
                    'Promos & Weekly Deals',
                    'Print & Digital Leaflets',
                    'Automated 4K Video',
                    'Omnichannel Social Media'
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
          THE RETAIL REALITY SECTION (Upgraded Split Layout with Staff Planning Video on Left & Right-Aligned Text)
      ========================================================================= */}
      <section id="problem" className="relative z-20 py-28 sm:py-36 border-t border-black/10 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-[#ff2a85]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#ccff00]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Supermarket Staff Planning Video */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border-2 border-black/10 shadow-[0_30px_60px_rgba(0,0,0,0.18)] aspect-[16/10] group">
                <video
                  src="/Supermarket_staff_planning.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[#ccff00] font-mono text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                  <span>LIVE FOOTAGE // RETAIL WORKFLOW</span>
                </div>
              </div>
            </div>

            {/* Right Column: The Retail Reality Copy — copy left-aligned next to the video, pill stays right */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="mb-6 self-end inline-flex items-center gap-2.5 rounded-full bg-black/[0.04] px-3.5 py-1.5 ring-1 ring-black/10 backdrop-blur-md">
                <span className="inline-flex items-center text-xs font-semibold text-neutral-950 bg-[#ff2a85] rounded-full py-0.5 px-2 font-mono">
                  REALITY
                </span>
                <span className="text-xs font-mono font-medium text-zinc-700 uppercase tracking-widest">
                  The Retail Reality
                </span>
              </div>

              <h2 className="type-title text-[#1c1c1e] mb-6">
                <span className="block">
                  <span className="fancy-initial">S</span><span className="font-outfit font-medium">pecials don't</span>
                </span>
                <span className="block -mt-1.5 text-[#DB0C36]">
                  <span className="font-griffits">Promote</span>{' '}
                  <span className="font-outfit font-medium">themselves.</span>
                </span>
              </h2>

              <ScannerLine className="mb-8" />

              <div className="type-lead space-y-6 text-zinc-600 font-light leading-relaxed max-w-xl">
                <p className="text-[#1c1c1e] font-normal">
                  New prices. Weekend specials. Fresh stock. Payday madness. Another leaflet due yesterday.
                </p>
                <p className="text-zinc-500">
                  Your store never runs out of things to promote. But coming up with the designs, getting them ready and keeping your pages active? That's a whole other shopping list.
                </p>
                <p className="text-[#1c1c1e] font-medium text-lg sm:text-xl pt-4 border-t border-black/10">
                  Good thing you don't have to do it all yourself.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Solution Section (Neon Yellow-Green Theme with Clear Background Images & React Bits LineSidebar) */}
      <section id="solution" className="relative z-20 py-28 sm:py-36 border-t border-black/10 overflow-hidden">
        {/* Dynamic Full Scale Background Image (Clear, No Gradient Overlay) */}
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
                Autonomous Creative Department
              </span>
            </div>

            <h2 className="type-title text-white mb-6">
              <span className="block">
                <span className="font-glamour-initial">Y</span><span className="font-outfit font-medium">ou sell the </span><span className="font-griffits uppercase">Goods.</span>
              </span>
              <span className="block -mt-1.5 text-[#ccff00] drop-shadow-[0_0_25px_rgba(204,255,0,0.4)]">
                <span className="font-outfit font-medium">we make them </span><span className="font-griffits uppercase">look good.</span>
              </span>
            </h2>

            <ScannerLine className="mb-8" color="#ccff00" />

            <p className="type-lead-oneline text-zinc-300 font-light">
              Think of Onawa as your creative department — without another desk to squeeze into the office.
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
                  <span>ONAWA CREATIVE DEPT</span>
                  <span className="text-[#ccff00]">ACTIVE SELECTION</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF SECTION (Interactive Social Media Portfolio Showcase) */}
      <section id="proof" className="relative z-20 py-28 sm:py-36 border-t border-black/10 overflow-hidden">
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#ff2a85]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#ccff00]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] border border-black/10 mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a85] shadow-[0_0_8px_#ff2a85] animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-[#DB0C36] uppercase font-semibold">
                THE PROOF
              </span>
            </div>

            <h2 className="type-title text-[#1c1c1e] mb-6">
              <span className="block">
                <span className="font-glamour-initial">L</span><span className="font-outfit font-medium">ess talk. more </span>
              </span>
              <span className="block -mt-1.5 text-[#DB0C36] font-griffits uppercase">“WHO MADE THAT?”</span>
            </h2>

            <ScannerLine className="mx-auto mb-8" />

            <p className="type-lead text-zinc-600 font-light max-w-2xl mx-auto">
              “Your specials deserve more than a price tag.<br />
              See how good they could look on your socials.”
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
                <div className="relative h-44 sm:h-56 bg-gradient-to-r from-emerald-800 to-teal-900 overflow-hidden">
                  <img 
                    src={currentAsset.image} 
                    alt="Cover" 
                    className="w-full h-full object-cover opacity-40 blur-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#242526] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6 flex items-end gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#242526] bg-emerald-600 overflow-hidden shadow-xl flex items-center justify-center font-black text-2xl text-white">
                      OF
                    </div>
                    <div className="mb-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg sm:text-xl font-bold text-white">Onawa Fresh Market</h3>
                        <CheckCircle2 className="w-4 h-4 text-[#1877F2] fill-white" />
                      </div>
                      <p className="text-xs text-zinc-400">Supermarket Chain • 48K Followers</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
                        OF
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">Onawa Fresh Market</h4>
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
                      SPECIAL: {currentAsset.price}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-white/90 text-black text-xs font-bold font-mono shadow-lg">Click to View Full Artwork</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-700 text-xs text-zinc-400">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[10px]">👍</div>
                      <span>1.4K</span>
                    </div>
                    <div>
                      <span>{currentAsset.comments} comments • {currentAsset.shares} shares</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-zinc-700 text-sm font-medium text-zinc-300">
                    <button 
                      type="button" 
                      onClick={() => setIsLiked(!isLiked)} 
                      className={`flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer ${isLiked ? 'text-[#1877F2]' : ''}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Like</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                      <MessageSquare className="w-4 h-4" />
                      <span>Comment</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
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
                        <h3 className="font-bold text-base sm:text-lg">onawafresh.market</h3>
                        <button type="button" className="px-4 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold hover:bg-zinc-700 transition-colors">
                          Following
                        </button>
                      </div>
                      <div className="flex items-center gap-6 text-xs sm:text-sm text-zinc-300">
                        <span><strong>142</strong> posts</span>
                        <span><strong>48.5K</strong> followers</span>
                        <span><strong>210</strong> following</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Onawa Fresh Market</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      🛒 Your weekly grocery destination.<br />
                      🌿 Autonomous weekly deals & 4K leaflets.<br />
                      📍 Visit your nearest store below 👇
                    </p>
                    <a href="#store" onClick={(e) => e.preventDefault()} className="text-xs text-[#ccff00] font-mono mt-1 block">
                      linktr.ee/onawafresh
                    </a>
                  </div>
                </div>

                <div className="border-t border-zinc-800">
                  <div className="flex items-center justify-between p-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-600">
                        <img src={currentAsset.image} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-xs sm:text-sm">onawafresh.market</span>
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
                    <div className="text-xs font-semibold">2,845 likes</div>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                      <strong className="text-white mr-2">onawafresh.market</strong>
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
                    Following | <span className="text-[#25F4EE]">For You</span>
                  </div>
                  <Volume2 className="w-5 h-5 text-white/80" />
                </div>

                <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4 text-white">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-emerald-600">
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
                      @onawafresh.market <CheckCircle2 className="w-3.5 h-3.5 text-[#25F4EE] fill-white" />
                    </h4>
                    <p className="text-xs text-zinc-200 mt-1 line-clamp-2">
                      {currentAsset.caption} <span className="text-[#25F4EE]">{currentAsset.hashtags}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg w-fit">
                    <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
                    <span className="truncate max-w-[200px]">Original Sound - Onawa Creative Lab</span>
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
                        Onawa Fresh Market <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366] fill-black" />
                      </h4>
                      <p className="text-[11px] text-[#25D366]">Online • Business Account</p>
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
                        WHATSAPP STATUS UPDATE
                      </div>
                    </div>
                    <div className="p-3 text-xs text-zinc-300 font-mono">
                      🔥 {currentAsset.title} — Tap to view catalog.
                    </div>
                  </div>

                  <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tr-none max-w-md ml-auto shadow-md space-y-2">
                    <p className="text-xs sm:text-sm leading-relaxed">
                      🔔 <strong>ONAWA VIP BULLETIN:</strong><br />
                      {currentAsset.caption}
                    </p>
                    <div className="p-2 rounded-lg bg-black/20 font-mono text-xs text-[#25D366] flex items-center justify-between">
                      <span>Deal Price: {currentAsset.price}</span>
                      <span>Valid till Sunday</span>
                    </div>
                    <div className="text-[10px] text-zinc-300 text-right">09:42 AM ✓✓</div>
                  </div>
                </div>

                <div className="p-3 bg-[#1f2c34] flex items-center gap-3">
                  <div className="flex-1 bg-[#2a3942] px-4 py-2.5 rounded-full text-xs text-zinc-400">
                    Reply to Onawa Fresh Market...
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
                    HD CAMPAIGN ASSET // {currentAsset.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsExpandedImage(false)}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white font-mono cursor-pointer"
                  >
                    CLOSE [X]
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

        </div>
      </section>

      {/* =========================================================================
          OFFER SECTION — RECEIPT-INSPIRED PACKAGE DESIGN
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
                YOUR MONTHLY CREATIVE SHOPPING LIST
              </span>
            </div>

            <h2 className="type-section text-[#1c1c1e] mb-6">
              <span className="block">
                <span className="fancy-initial">G</span><span className="font-outfit font-medium">ood </span><span className="font-griffits uppercase">creative.</span>
              </span>
              <span className="block mt-0.5 font-outfit font-medium text-[#4d7c0f]">scanned. sorted.</span>
            </h2>

            <p className="type-lead text-zinc-600 font-light max-w-2xl mx-auto mb-3">
              “Pick your package, and let’s get your store looking like the main event.”
            </p>

            <p className="type-ui font-mono text-zinc-500 uppercase tracking-wider">
              Three packages. One creative partner. No long-term contract.
            </p>

            {/* Subtle Checkout Scanner Laser Line Visual Graphic */}
            <ScannerLine className="mt-8 mx-auto" />
          </div>

          {/* ==================== 3 TILL SLIP OFFER CARDS NEXT TO EACH OTHER ==================== */}
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 lg:gap-8 items-start pt-6 max-w-6xl mx-auto mb-20">
            {RETAIL_PACKAGES.map((pkg, idx) => (
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

                {/* Rubber Stamp Mark (if present) */}
                {pkg.stamp && (
                  <div 
                    className={`stamp-mark absolute top-12 right-3 z-20 ${pkg.stampBorder} ${pkg.stampText} font-mono font-black text-[10px] px-2 py-0.5 rounded tracking-wider uppercase rotate-[10deg] shadow-sm bg-white/70 backdrop-blur-xs select-none max-w-[170px] text-center leading-tight`}
                  >
                    ★ {pkg.stamp} ★
                  </div>
                )}

                {/* Receipt Header */}
                <div className="text-center font-mono pb-4 mb-4 space-y-1">
                  <div className="font-black text-sm tracking-widest text-zinc-950 uppercase">
                    ONAWA STUDIO TILL
                  </div>
                  <div className="text-[10px] text-zinc-600 tracking-wider">
                    STORE #0042 // REGISTER #03 // TAX INVOICE
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    AUTONOMOUS CREATIVE PIPELINE
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
                    <span>SCAN ITEM</span>
                    <span>ALLOWANCE</span>
                  </div>

                  {pkg.inclusions.map((item, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-baseline justify-between gap-1 leading-snug text-zinc-900">
                        <span className="shrink-0 font-medium">{item.category}</span>
                        <span className="flex-1 border-b border-dotted border-zinc-400 mx-1 mb-1" />
                        <span className={`shrink-0 font-bold ${
                          item.isUnlimited 
                            ? 'text-[#ff2a85] bg-rose-100 px-1 rounded font-black text-xs' 
                            : item.detail.includes('FREE') 
                            ? 'text-emerald-700' 
                            : 'text-zinc-950'
                        }`}>
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

                {/* OkaLaaitie: Explicit "NOT IN THIS BASKET" Section */}
                {pkg.notInBasket && (
                  <div className="mb-5 p-3 rounded-lg bg-zinc-200/80 border border-dashed border-zinc-400 font-mono">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-zinc-500" />
                        NOT IN THIS BASKET
                      </span>
                      <span className="text-[9px] text-zinc-500 uppercase">NEXT AISLE</span>
                    </div>
                    <ul className="space-y-1.5 text-[10px] text-zinc-600">
                      {pkg.notInBasket.map((exclusion, exIdx) => (
                        <li key={exIdx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-zinc-400 shrink-0 font-bold">✕</span>
                          <span>{exclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Perforation Line before Totals */}
                <div className="receipt-perforation w-full h-[2px] mb-4" />

                {/* Receipt Calculation & Total Section */}
                <div className="pt-1 mb-5 font-mono space-y-1.5">
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span>REGULAR SUBTOTAL:</span>
                    <span>N${pkg.rawPrice}.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span>LONG-TERM CONTRACT:</span>
                    <span className="text-emerald-700 font-bold">N$0.00 (NONE)</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span>PRINT PRODUCTION:</span>
                    <span className="text-zinc-500">EXCLUDED (DIGITAL)</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-zinc-300 text-zinc-950">
                    <span className="font-black text-sm tracking-wider uppercase">MONTHLY TOTAL:</span>
                    <span className="font-black text-2xl sm:text-3xl tracking-tight">
                      {pkg.price}<span className="text-xs font-normal text-zinc-600">/MO</span>
                    </span>
                  </div>
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
                  THANK YOU FOR SHOPPING WITH ONAWA FRESH
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
                <span>TERMS OF ENGAGEMENT & WORKING PROCESS</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm font-mono text-zinc-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#4d7c0f] shrink-0 font-bold">•</span>
                  <span>Requests are handled one at a time to ensure maximum focus and creative quality.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4d7c0f] shrink-0 font-bold">•</span>
                  <span>Please allow at least one day before your intended release date for standard turnaround.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4d7c0f] shrink-0 font-bold">•</span>
                  <span>Rush requests depend on studio availability and may incur an additional expediting fee.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4d7c0f] shrink-0 font-bold">•</span>
                  <span>Printing costs are not included. All deliverables are provided as production-ready digital and high-resolution print files.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4d7c0f] shrink-0 font-bold">•</span>
                  <span>Social media management covers scheduling and publishing the created designs; paid advertising budgets, customer service and community management are not included.</span>
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
                  MONTH-TO-MONTH
                </h4>
                <p className="text-xs text-zinc-500 leading-snug font-light">
                  No long-term contract. Cancel or pause whenever your store needs.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/60 border border-black/10 flex items-start gap-3.5 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="w-9 h-9 rounded-xl bg-[#ff2a85]/10 border border-[#ff2a85]/30 flex items-center justify-center text-[#DB0C36] shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-[#1c1c1e] uppercase tracking-wider mb-1">
                  ONE CREATIVE PARTNER
                </h4>
                <p className="text-xs text-zinc-500 leading-snug font-light">
                  Your dedicated ongoing design, motion and content department.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/60 border border-black/10 flex items-start gap-3.5 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="w-9 h-9 rounded-xl bg-[#25F4EE]/15 border border-[#25F4EE]/40 flex items-center justify-center text-[#0e8c8c] shrink-0 mt-0.5">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-[#1c1c1e] uppercase tracking-wider mb-1">
                  FOUR PLATFORMS
                </h4>
                <p className="text-xs text-zinc-500 leading-snug font-light">
                  Facebook, Instagram, TikTok and WhatsApp, per package tier.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/60 border border-black/10 flex items-start gap-3.5 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-[#1c1c1e] uppercase tracking-wider mb-1">
                  PRINTING EXCLUDED
                </h4>
                <p className="text-xs text-zinc-500 leading-snug font-light">
                  Digital creative services only unless separately quoted.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default RetailStorePage;
