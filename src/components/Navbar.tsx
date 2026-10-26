import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Menu, X, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  activePage?: 'home' | 'retail-store';
  onNavigate?: (page: 'home' | 'retail-store') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage = 'home', onNavigate }) => {
  const [londonTime, setLondonTime] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setLondonTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNav = (e: React.MouseEvent, page: 'home' | 'retail-store') => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onNavigate?.(page);
  };

  return (
    <>
      <div className="relative z-30 w-full max-w-[1440px] mx-auto p-2 sm:p-3">
        <header className="bg-white rounded-full p-[5px] flex items-center justify-between shadow-xs">
          {/* LEFT: Logo & Nav Links */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={(e) => handleNav(e, 'home')}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center shrink-0 cursor-pointer hover:bg-black transition-colors"
              aria-label="Axion Studio - Back to Home"
            >
              <span className="text-white text-[10px] sm:text-[11px] font-bold tracking-tight">
                AX
              </span>
            </button>

            {/* If on Retail Store page, show a back/context indicator */}
            {activePage === 'retail-store' ? (
              <div className="flex items-center gap-2 ml-3 sm:ml-5">
                <button
                  type="button"
                  onClick={(e) => handleNav(e, 'home')}
                  className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-gray-700 hover:text-black transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
                <span className="hidden md:inline-block text-xs font-semibold text-[#ff5f03] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/60">
                  Retail Store
                </span>
              </div>
            ) : null}

            <nav className="hidden md:flex items-center gap-6 ml-6 text-[14px] text-gray-900">
              <button
                type="button"
                onClick={(e) => handleNav(e, 'home')}
                className={`transition-colors duration-300 cursor-pointer ${
                  activePage === 'home' ? 'font-semibold text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Projects
              </button>
              <button
                type="button"
                onClick={(e) => handleNav(e, 'retail-store')}
                className={`transition-colors duration-300 cursor-pointer flex items-center gap-1.5 ${
                  activePage === 'retail-store' ? 'font-semibold text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>Retail Studio</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f03]" />
              </button>
              <a
                href="#journal"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
              >
                Journal
              </a>
              <a
                href="#connect"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
              >
                Connect
              </a>
            </nav>
          </div>

          {/* RIGHT: Status, Time & Strategy CTA (Desktop) */}
          <div className="hidden md:flex items-center">
            <span className="text-[13px] text-gray-600 hidden lg:inline-block mr-5 whitespace-nowrap">
              Taking on projects for Q1 2026
            </span>

            <div className="flex items-center gap-1.5 text-[13px] text-gray-600 mr-4 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>{londonTime ? `${londonTime} in London` : 'London'}</span>
            </div>

            <button
              type="button"
              className="bg-gray-900 text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 flex items-center gap-3 group cursor-pointer"
            >
              {/* Text Roll Animation */}
              <div className="overflow-hidden h-[20px] flex flex-col justify-start">
                <span className="h-[20px] flex items-center leading-none transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                  Book a strategy call
                </span>
                <span className="h-[20px] flex items-center leading-none transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                  Book a strategy call
                </span>
              </div>

              {/* Rotating Arrow in Circle */}
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                <ArrowRight className="w-3.5 h-3.5 text-gray-900 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45" />
              </div>
            </button>
          </div>

          {/* MOBILE: Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden bg-gray-900 text-white rounded-full p-2.5 flex items-center justify-center cursor-pointer ml-auto mr-1"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <div className="relative z-10 bg-white rounded-2xl mx-3 mb-3 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 animate-in slide-in-from-bottom duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
            {/* Header inside sheet */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span>{londonTime ? `${londonTime} in London` : 'London'}</span>
                <span>·</span>
                <span>Q1 2026 Open</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Large Nav Links */}
            <nav className="flex flex-col gap-4 py-2">
              <button
                type="button"
                onClick={(e) => handleNav(e, 'home')}
                className="text-[28px] sm:text-[32px] font-medium text-left text-gray-900 hover:text-gray-500 transition-colors"
              >
                Home / Overview
              </button>
              <button
                type="button"
                onClick={(e) => handleNav(e, 'retail-store')}
                className="text-[28px] sm:text-[32px] font-medium text-left text-[#ff5f03] flex items-center justify-between transition-colors"
              >
                <span>I'm a Retail Store</span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-orange-100 rounded-full text-[#ff5f03]">3D Factory</span>
              </button>
              <a
                href="#journal"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[28px] sm:text-[32px] font-medium text-gray-900 hover:text-gray-500 transition-colors"
              >
                Journal
              </a>
              <a
                href="#connect"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[28px] sm:text-[32px] font-medium text-gray-900 hover:text-gray-500 transition-colors"
              >
                Connect
              </a>
            </nav>

            {/* Mobile CTA */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full bg-[#F26522] text-white text-base font-medium rounded-full py-3.5 px-6 flex items-center justify-between group cursor-pointer"
            >
              <span>Start a project</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <ArrowRight className="w-4 h-4 text-[#F26522]" />
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
