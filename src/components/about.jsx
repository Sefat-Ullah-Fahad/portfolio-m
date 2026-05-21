'use client';

import React, { useEffect, useRef, useState, memo } from 'react';
import Image from 'next/image';

// ==========================================
// 1. DotField Background (Optimized)
// ==========================================
const DotField = memo(({
  dotRadius = 2, dotSpacing = 20, cursorRadius = 300, bulgeStrength = 60
}) => {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const sizeRef = useRef({ w: 0, h: 0, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    
    function doResize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width; canvas.height = rect.height;
      sizeRef.current = { w: rect.width, h: rect.height, offsetX: rect.left, offsetY: rect.top };
      const step = dotRadius + dotSpacing;
      const cols = Math.floor(rect.width / step);
      const rows = Math.floor(rect.height / step);
      dotsRef.current = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dotsRef.current.push({ ax: c * step + step/2, ay: r * step + step/2, sx: c * step, sy: r * step });
        }
      }
    }

    window.addEventListener('resize', doResize);
    window.addEventListener('mousemove', (e) => {
      mouseRef.current = { x: e.clientX - sizeRef.current.offsetX, y: e.clientY - sizeRef.current.offsetY };
    });
    
    doResize();
    function tick() {
      ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);
      ctx.fillStyle = 'rgba(129, 75, 255, 0.15)';
      dotsRef.current.forEach(d => {
        const dx = mouseRef.current.x - d.ax; const dy = mouseRef.current.y - d.ay;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < cursorRadius) {
          const push = (1 - dist / cursorRadius) * bulgeStrength;
          d.sx = d.ax - (dx / dist) * push; d.sy = d.ay - (dy / dist) * push;
        } else {
          d.sx += (d.ax - d.sx) * 0.1; d.sy += (d.ay - d.sy) * 0.1;
        }
        ctx.beginPath(); ctx.arc(d.sx, d.sy, dotRadius, 0, Math.PI * 2); ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    const raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', doResize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
});
DotField.displayName = 'DotField';

// ==========================================
// 2. About Section
// ==========================================
export default function About() {
  const profileImg = "https://res.cloudinary.com/dsga4gyw9/image/upload/v1778241339/WhatsApp_Image_2026-05-03_at_8.31.37_PM_nh3ddd.jpg";

  return (
    <section id="about" className="relative w-full bg-[#03000a] text-white py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      <DotField />

      <div className="container max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left: Image Container (Optimized with Next/Image) */}
        <div className="flex justify-center items-center">
           <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 transition-transform duration-500 hover:scale-[1.02]">
             <Image 
               src={profileImg} 
               alt="Md Sefat Ullah Fahad" 
               fill
               priority
               sizes="(max-width: 768px) 100vw, 420px"
               className="object-cover object-center"
             />
           </div>
        </div>

        {/* Right: Content */}
        <div className="space-y-6">
          <div>
            <h3 className="text-purple-400 font-bold uppercase tracking-[0.2em] text-xs mb-3">About My Journey</h3>
            <h2 className="text-4xl md:text-5xl font-black">
              Full-Stack Developer <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">& Accountant</span>
            </h2>
          </div>

          <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-purple-500 pl-6">
            I am <strong className="text-white">Md Sefat Ullah Fahad</strong>, bridging the logic of code with the precision of finance at <span className="text-blue-400 font-semibold">Experivia</span>. 
            I build scalable web apps while managing complex financial workflows with absolute precision.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all">
               <h4 className="text-purple-400 font-bold text-sm mb-1">Academic Background</h4>
               <p className="text-xs text-gray-400">Alim 2nd Year student, mastering the balance of Islamic studies and technical discipline.</p>
             </div>
             <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all">
               <h4 className="text-blue-400 font-bold text-sm mb-1">Dev Philosophy</h4>
               <p className="text-xs text-gray-400">Tech-agnostic, performance-focused, and obsessed with turning complex logic into smooth UI/UX.</p>
             </div>
          </div>
          
          <div className="pt-4 flex gap-4">
            <a href="#contact" className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-purple-500 hover:text-white transition-all shadow-lg hover:shadow-purple-500/20">
              Work With Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}