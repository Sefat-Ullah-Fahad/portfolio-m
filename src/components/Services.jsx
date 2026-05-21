'use client';

import React, { useLayoutEffect, useRef, useCallback, useState, useEffect } from 'react';
import Lenis from 'lenis';

// ==========================================
// 1. DATA
// ==========================================
const servicesData = [
  {
    title: "Full-Stack Web Development",
    shortTitle: "End-to-End Solutions",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    features: ["Custom Web Application Architecture", "Robust Backend Design (MongoDB/MySQL)", "RESTful API & Next.js SSR/SSG", "Interactive & Responsive Frontend", "High-Performance Deployment"]
  },
  {
    title: "Pixel-Perfect Frontend",
    shortTitle: "Figma to React/Next.js",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop",
    features: ["Figma to Pixel-Perfect Conversion", "Mobile-First Responsive Design", "Clean Code Architecture", "Cross-Browser Compatibility", "Tailwind CSS Integration"]
  },
  {
    title: "Creative Web Animations",
    shortTitle: "Interactive UI/UX",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    features: ["Scroll-driven Animations", "Smooth Page Transitions", "Micro-interactions", "Optimized 60fps Performance", "Framer Motion Integration"]
  }
];

// ==========================================
// 2. SCROLL STACK ENGINE
// ==========================================
export const ScrollStackItem = ({ children }) => (
  <div className="scroll-stack-card w-full min-h-[450px] my-10 p-8 md:p-12 rounded-[40px] bg-[#120F17]/80 backdrop-blur-2xl border border-white/10 shadow-2xl origin-top will-change-transform">
    {children}
  </div>
);

const ScrollStack = ({ children }) => {
  const scrollerRef = useRef(null);

  useLayoutEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    const updateCards = () => {
      const scrollTop = window.scrollY;
      const cards = document.querySelectorAll('.scroll-stack-card');
      cards.forEach((card, i) => {
        const trigger = card.offsetTop - (150 + i * 50);
        if (scrollTop >= trigger) {
          const progress = Math.min((scrollTop - trigger) / 600, 1);
          const scale = 1 - progress * 0.05;
          // সরাসরি transform সেট করা হয়েছে (CSS transition রিমুভড)
          card.style.transform = `translateY(${Math.min(scrollTop - trigger, 0)}px) scale(${scale})`;
        } else {
          card.style.transform = `translateY(0px) scale(1)`;
        }
      });
    };

    lenis.on('scroll', updateCards);
    return () => lenis.destroy();
  }, []);

  return <div ref={scrollerRef} className="relative w-full px-4 md:px-20 pb-40">{children}</div>;
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function Services() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Hydration error ফিক্সের জন্য

  return (
    <section className="bg-[#03000a] text-white py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto mb-20 text-center">
        <h2 className="text-5xl md:text-6xl font-black">Services & <span className="text-purple-500">Solutions</span></h2>
      </div>

      <ScrollStack>
        {servicesData.map((service, index) => (
          <ScrollStackItem key={index}>
            <div className="flex flex-col lg:flex-row gap-8 h-full">
              {/* Image Side */}
              <div className="w-full lg:w-2/5 h-64 lg:h-auto rounded-3xl overflow-hidden border border-white/10">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              </div>
              
              {/* Text Side */}
              <div className="w-full lg:w-3/5 flex flex-col justify-center">
                <span className="text-purple-400 font-bold text-xs uppercase tracking-widest mb-3">{service.shortTitle}</span>
                <h3 className="text-3xl font-bold mb-6">{service.title}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}