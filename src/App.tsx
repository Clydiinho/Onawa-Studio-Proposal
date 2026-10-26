/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';
import { InteractiveFolders } from './components/InteractiveFolders';
import { Navbar } from './components/Navbar';
import { RetailStorePage } from './pages/RetailStorePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'retail-store'>('home');

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#retail-store') {
        setCurrentPage('retail-store');
      } else {
        setCurrentPage('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (page: 'home' | 'retail-store') => {
    setCurrentPage(page);
    if (page === 'retail-store') {
      window.location.hash = '#retail-store';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (currentPage === 'retail-store') {
    return <RetailStorePage onNavigate={navigateTo} />;
  }

  return (
    <div className="min-h-screen bg-[#EFEFEF] text-gray-900 selection:bg-gray-900 selection:text-white font-sans antialiased">
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

        {/* Navigation (z-20, relative) */}
        <Navbar activePage="home" onNavigate={navigateTo} />

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
              <InteractiveFolders onOpenRetailStore={() => navigateTo('retail-store')} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
