"use client";

import React, { useState, useEffect, useRef } from 'react';
import StarBorder from '@/components/StarBorder';
import { NAV_SECTIONS } from '@/lib/navSections';
import {
  NAV_ACTIVE_NONE,
  getNavActiveIndexFromScroll,
  getSectionScrollTop,
  scrollToSectionId,
} from '@/lib/navScroll';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Gooey Navigation State and Refs
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollLockRef = useRef(null);
  const scrollUnlockTimerRef = useRef(null);

  // Configuration Props for Gooey Effect
  const animationTime = 600;
  const particleCount = 12;
  const particleDistances = [80, 10];
  const particleR = 100;
  const timeVariance = 250;
  const colors = [1, 2, 3, 4, 1, 2]; 

  const navLinks = NAV_SECTIONS;

  const navigateToSection = (id, index) => {
    const element = document.getElementById(id);
    if (!element) return;

    scrollLockRef.current = index;
    setActiveIndex(index);
    scrollToSectionId(id);
    setIsOpen(false);

    clearTimeout(scrollUnlockTimerRef.current);
    scrollUnlockTimerRef.current = setTimeout(() => {
      scrollLockRef.current = null;
    }, 1000);
  };

  // Scroll spy — locked while smooth-scrolling after a nav click
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (scrollLockRef.current !== null && scrollLockRef.current >= 0) {
        const locked = scrollLockRef.current;
        const el = document.getElementById(navLinks[locked]?.id);
        if (el) {
          const targetTop = getSectionScrollTop(navLinks[locked].id);
          if (Math.abs(window.scrollY - targetTop) > 24) {
            setActiveIndex(locked);
            return;
          }
        }
        scrollLockRef.current = null;
      }

      const nextIndex = getNavActiveIndexFromScroll();
      setActiveIndex((prev) => (prev !== nextIndex ? nextIndex : prev));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(scrollUnlockTimerRef.current);
    };
  }, [navLinks]);

  // Gooey Particle helper functions
  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = element => {
    if (!element) return;
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        
        requestAnimationFrame(() => {
          element.classList.add('active');
        });

        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Safe fallback
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = element => {
    if (!containerRef.current || !filterRef.current || !textRef.current || !element) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e, index, id) => {
    e.preventDefault();
    const liEl = e.currentTarget.parentElement;
    if (!liEl) return;

    setActiveIndex(index);
    updateEffectPosition(liEl);

    if (filterRef.current) {
      filterRef.current.style.opacity = '1';
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach((p) => filterRef.current.removeChild(p));
    }

    if (textRef.current) {
      textRef.current.style.opacity = '1';
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    if (filterRef.current) {
      makeParticles(filterRef.current);
    }

    navigateToSection(id, index);
  };

  const handleKeyDown = (e, index, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e, index, id);
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;

    if (activeIndex < 0) {
      textRef.current?.classList.remove('active');
      if (filterRef.current) filterRef.current.style.opacity = '0';
      if (textRef.current) textRef.current.style.opacity = '0';
      return;
    }

    if (filterRef.current) filterRef.current.style.opacity = '1';
    if (textRef.current) textRef.current.style.opacity = '1';

    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }

    const resizeObserver = new ResizeObserver(() => {
      if (activeIndex < 0) return;
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentActiveLi) updateEffectPosition(currentActiveLi);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  // Handle body scroll locking when mobile slide menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    // FIX 1: Keeps the original floating layout structure with w-[92%] and top-4 positioning
    <nav className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.25rem)] sm:w-[calc(100%-2rem)] max-w-7xl z-[80] transition-all duration-300">
      
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --linear-ease: cubic-bezier(0.25, 1, 0.5, 1);
          --color-1: #a855f7;
          --color-2: #ec4899;
          --color-3: #3b82f6;
          --color-4: #22c55e;
        }

        .gooey-nav-container {
          position: relative;
        }

        .gooey-nav-container nav {
          display: flex;
          position: relative;
          transform: translate3d(0, 0, 0.01px);
        }

        .gooey-nav-container nav ul {
          display: flex;
          gap: 0.35rem; /* Tighter item gaps on smaller laptops/tablets to prevent row wraps */
          list-style: none;
          padding: 0;
          margin: 0;
          position: relative;
          z-index: 3;
        }

        @media (min-width: 1140px) {
          .gooey-nav-container nav ul {
            gap: 1.2rem; /* Normal roomy gap restored on larger desktop monitors */
          }
        }

        .gooey-nav-container nav ul li {
          border-radius: 9999px;
          position: relative;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .gooey-nav-container nav ul li a {
          display: inline-block;
          padding: 0.5rem 1rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.2s ease;
          white-space: nowrap; /* Forces text to stay flat on single line */
        }

        .gooey-nav-container nav ul li a:hover {
          color: white;
        }

        .gooey-nav-container nav ul li.active a {
          color: transparent !important;
          pointer-events: none;
        }

        .gooey-nav-container nav ul li::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: white;
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s ease;
          z-index: -1;
        }

        .gooey-nav-container nav ul li.active::after {
          opacity: 1;
          transform: scale(1);
        }

        .gooey-nav-container .effect {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          opacity: 1;
          pointer-events: none;
          display: grid;
          place-items: center;
          z-index: 1;
        }

        .gooey-nav-container .effect.text {
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          transition: color 0.3s ease;
          z-index: 4;
        }

        .gooey-nav-container .effect.text.active {
          color: black;
        }

        .gooey-nav-container .effect.filter {
          filter: blur(5px) contrast(20);
          mix-blend-mode: screen;
        }

        .gooey-nav-container .effect.filter::after {
          content: '';
          position: absolute;
          inset: 0;
          background: white;
          transform: scale(0);
          opacity: 0;
          z-index: -1;
          border-radius: 9999px;
        }

        .gooey-nav-container .effect.active::after {
          animation: pill 0.3s ease both;
        }

        @keyframes pill {
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .particle, .point {
          display: block;
          opacity: 0;
          width: 14px;
          height: 14px;
          border-radius: 100%;
          transform-origin: center;
        }

        .particle {
          --time: 600ms;
          position: absolute;
          top: calc(50% - 7px);
          left: calc(50% - 7px);
          animation: particle var(--time) ease-out 1;
        }

        .point {
          background: var(--color);
          opacity: 1;
          animation: point var(--time) ease-out 1;
        }

        @keyframes particle {
          0% {
            transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
            opacity: 1;
          }
          70% {
            transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.1), calc(var(--end-y) * 1.1));
            opacity: 1;
          }
          100% {
            transform: rotate(calc(var(--rotate))) translate(calc(var(--end-x) * 0.2), calc(var(--end-y) * 0.2));
            opacity: 0;
          }
        }

        @keyframes point {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(var(--scale)); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
      `}} />

      {/* FIX 2: Restored your exact original rounded pill shape container configuration */}
      <div className={`bg-[#12071f]/40 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 flex items-center justify-between gap-3 transition-all duration-300 ${
        isScrolled ? 'shadow-xl shadow-black/30 border-white/20 bg-[#0c0517]/70' : 'shadow-lg shadow-black/10'
      }`}>
        
        {/* Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 min-w-0" onClick={() => {
          navigateToSection('home', 0);
        }}>
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400 animate-spin shrink-0" style={{ animationDuration: '8s' }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="50" rx="15" ry="40" stroke="currentColor" strokeWidth="4" transform="rotate(30 50 50)" />
            <ellipse cx="50" cy="50" rx="15" ry="40" stroke="currentColor" strokeWidth="4" transform="rotate(90 50 50)" />
            <ellipse cx="50" cy="50" rx="15" ry="40" stroke="currentColor" strokeWidth="4" transform="rotate(150 50 50)" />
            <circle cx="50" cy="50" r="5" fill="currentColor" />
          </svg>
          <span className="text-white font-bold text-base sm:text-lg tracking-wider truncate">Fahad.dev</span>
        </div>

        {/* Desktop Gooey Navigation System (Desktop view kicks in perfectly on laptop breakpoints - lg) */}
        <div className="hidden lg:block">
          <div className="gooey-nav-container" ref={containerRef}>
            <nav>
              <ul ref={navRef}>
                {navLinks.map((link, index) => (
                  <li key={link.id} className={activeIndex >= 0 && activeIndex === index ? 'active' : ''}>
                    <a 
                      href={`#${link.id}`} 
                      onClick={e => handleClick(e, index, link.id)} 
                      onKeyDown={e => handleKeyDown(e, index, link.id)}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <span className="effect filter" ref={filterRef} />
            <span className="effect text" ref={textRef} />
          </div>
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <StarBorder
            as="a"
            href="#contact"
            color="#c084fc"
            speed="5s"
            thickness={1}
            className="rounded-full"
            onClick={(e) => {
              e.preventDefault();
              scrollLockRef.current = NAV_ACTIVE_NONE;
              setActiveIndex(NAV_ACTIVE_NONE);
              scrollToSectionId('contact');
            }}
          >
            <span className="block bg-white text-black hover:bg-white/90 px-6 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 shadow-md shadow-white/10">
              Hire Me
            </span>
          </StarBorder>
        </div>

        {/* Hamburger Icon for Mobile & Tablet viewports */}
        <div className="lg:hidden flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-purple-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg transition-colors duration-200 p-2"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      {/* Slide-in mobile drawer */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed top-0 right-0 z-[70] h-[100dvh] w-[min(320px,88vw)] bg-[#0c061a]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-white/10 shrink-0">
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Navigation</p>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:text-purple-300 hover:border-purple-500/40 transition-colors duration-200"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection(link.id, index);
                }}
                className={`text-base font-semibold transition-colors duration-200 ${
                  activeIndex >= 0 && activeIndex === index
                    ? 'text-purple-400 pl-2 border-l-2 border-purple-500'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className="shrink-0 px-5 sm:px-6 pb-6 pt-4 border-t border-white/10 safe-area-pb">
          <StarBorder
            as="a"
            href="#contact"
            color="#e2378f"
            speed="5s"
            thickness={1}
            className="rounded-xl w-full"
            onClick={(e) => {
              e.preventDefault();
              scrollLockRef.current = NAV_ACTIVE_NONE;
              setActiveIndex(NAV_ACTIVE_NONE);
              scrollToSectionId('contact');
              setIsOpen(false);
            }}
          >
            <span className="bg-gradient-to-r from-[#814bff] to-[#e2378f] text-white text-center block w-full py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20">
              Hire Me
            </span>
          </StarBorder>
        </div>
      </div>
   </nav>
  );
}