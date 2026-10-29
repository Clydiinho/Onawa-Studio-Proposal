/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';
import { InteractiveFolders } from './components/InteractiveFolders';
import { PillNav } from './components/PillNav';
import { RetailStorePage } from './pages/RetailStorePage';
import { ShoppingMallPage } from './pages/ShoppingMallPage';

export type ProposalPage = 'home' | 'retail-store' | 'shopping-mall';

// Checkout scanner laser line — same separation device as the proposal pages.
// Track is a thin zinc bar; a pink shimmer sweeps across it on loop.
// `color` sets the sweep hue — pink by default, neon #ccff00 in the Solution section.
const ScannerLine: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#ff2a85' }) => (
  <div className={`relative h-[2px] w-full max-w-xs bg-zinc-300 overflow-hidden ${className}`}>
    <div
      className="absolute inset-y-0 left-0 w-1/3 scanner-sweep animate-[shimmer_2s_infinite]"
      style={{ '--sweep-color': color } as React.CSSProperties}
    />
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<ProposalPage>('home');

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#retail-store') {
        setCurrentPage('retail-store');
      } else if (window.location.hash === '#shopping-mall') {
        setCurrentPage('shopping-mall');
      } else {
        setCurrentPage('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (page: ProposalPage) => {
    setCurrentPage(page);
    if (page === 'retail-store') {
      window.location.hash = '#retail-store';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'shopping-mall') {
      window.location.hash = '#shopping-mall';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    // The campaign pages are the only ones with these section anchors; from the
    // landing page, nav clicks land on the Retail Store proposal as before.
    if (currentPage === 'home') {
      setCurrentPage('retail-store');
      window.location.hash = '#retail-store';
    }
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 160);
  };

  return (
    <>
      {/* Site-wide Floating Nav: logo far-left, menu pill centred (proposal pages
          only), Get Started far-right. Clicking the logo returns to the landing page. */}
      <div className="fixed top-4 inset-x-0 z-50 pointer-events-auto flex items-center justify-between px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
          aria-label="Onawa Studio — back to home"
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-[rgba(38,35,46,0.66)] backdrop-blur-xl shadow-[0_22px_44px_-20px_rgba(0,0,0,0.8),0_6px_16px_-8px_rgba(0,0,0,0.5)] outline-none cursor-pointer transition-[transform,box-shadow] duration-300 ease-out hover:scale-110 hover:shadow-[0_28px_52px_-20px_rgba(0,0,0,0.85),0_8px_20px_-8px_rgba(0,0,0,0.55)]"
        >
          <img
            src="/jj logo icon.png"
            alt="Onawa Studio"
            className="w-[38px] h-[38px] object-contain"
            draggable={false}
          />
        </a>
        {currentPage !== 'home' && (
          <PillNav
          items={[
            {
              label: 'Problem',
              href: '#problem',
              onClick: (e: React.MouseEvent) => { e.preventDefault(); scrollToSection('problem'); },
            },
            {
              label: 'Solution',
              href: '#solution',
              onClick: (e: React.MouseEvent) => { e.preventDefault(); scrollToSection('solution'); },
            },
            {
              label: 'Proof',
              href: '#proof',
              onClick: (e: React.MouseEvent) => { e.preventDefault(); scrollToSection('proof'); },
            },
            {
              label: 'Offers',
              href: '#offers',
              onClick: (e: React.MouseEvent) => { e.preventDefault(); scrollToSection('offers'); },
            },
          ]}
          theme="dark"
          layout="split"
          surface="glass"
          itemStyle="pill"
          hoverEffect="fill"
          indicator="dot"
          highlightColor="#f24032"
          highlightTextColor="#ffffff"
          />
        )}
        <button
          type="button"
          onClick={() => scrollToSection('offers')}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#ccff00] transition-colors shadow-lg cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {currentPage === 'retail-store' ? (
        <RetailStorePage onNavigate={navigateTo} />
      ) : currentPage === 'shopping-mall' ? (
        <ShoppingMallPage onNavigate={navigateTo} />
      ) : (
    <div className="min-h-screen bg-[#EFEFEF] text-gray-900 selection:bg-gray-900 selection:text-white font-sans antialiased text-base leading-[1.5]">
      {/* =========================================================================
          SECTION 1: HERO (Full viewport height)
      ========================================================================= */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#EFEFEF]">
        {/* Full-screen animated shader overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
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

        {/* Navigation is rendered site-wide at App level (fixed PillNav) */}

        {/* Spacer to push content to the bottom of the viewport */}
        <div className="flex-1" />

        {/* Hero Content (z-20) */}
        <div className="relative z-20 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-12 sm:pb-16 lg:pb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-8">
            {/* Left Column: Hero Text */}
            <div className="max-w-2xl">
              <span className="text-[13px] sm:text-[14px] text-gray-900 tracking-wide mb-5 sm:mb-8 font-medium block">
                DESIGN • MOTION • DIGITAL • WEBSITE
              </span>

              <ScannerLine className="mb-5 sm:mb-8" />

              <h1 className="leading-[1.02] tracking-[-0.03em] text-gray-900">
                <span className="block font-black tracking-[-0.03em] text-[clamp(2.2rem,8vw,5rem)] sm:text-[clamp(3.2rem,6.2vw,5.5rem)]">
                  WHAT ARE
                </span>
                <span className="flex flex-wrap sm:flex-nowrap items-baseline gap-3 sm:gap-4 mt-1 sm:mt-1.5">
                  <span className="font-['Instrument_Serif','Newsreader',Georgia,serif] italic font-normal tracking-[-0.01em] text-[clamp(2.6rem,9vw,5.8rem)] sm:text-[clamp(3.6rem,7vw,6.2rem)] leading-[0.98]">
                    YOU?
                  </span>
                  <span className="font-sans font-medium text-gray-700 not-italic tracking-tight text-[16px] sm:text-[19px] lg:text-[21px] leading-snug sm:leading-tight max-w-[340px] pb-1 sm:pb-2">
                    Choose the option that best describes your business.
                  </span>
                </span>
              </h1>
            </div>

            {/* Right Column: 2x Interactive Folders */}
            <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-end">
              <InteractiveFolders
                onOpenRetailStore={() => navigateTo('retail-store')}
                onOpenShoppingMall={() => navigateTo('shopping-mall')}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
      )}
    </>
  );
}
