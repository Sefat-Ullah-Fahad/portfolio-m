'use client';

import React from 'react';

// Real Icons Import
import { FaHtml5, FaCss3Alt } from "react-icons/fa";
import { 
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiVuedotjs,
  SiTailwindcss, SiBootstrap, SiNodedotjs, SiExpress, SiMongodb, SiSupabase, SiMysql,
  SiGreensock, SiFramer, SiRedux, SiGraphql, SiFirebase, SiGit, 
  SiDocker, SiFigma, SiVercel, SiWordpress, SiJsonwebtokens
} from 'react-icons/si';
import { TbApi } from "react-icons/tb";

// ==========================================
// 1. GLARE HOVER COMPONENT (Integrated)
// ==========================================
const GlareHover = ({
  width = '100%',
  height = '100%',
  background = 'rgba(255, 255, 255, 0.02)', // Glassy base
  borderRadius = '16px',
  borderColor = 'rgba(255, 255, 255, 0.05)',
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.3,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = '',
  style = {}
}) => {
  const hex = glareColor.replace('#', '');
  let rgba = glareColor;
  
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const vars = {
    '--gh-width': width,
    '--gh-height': height,
    '--gh-bg': background,
    '--gh-br': borderRadius,
    '--gh-angle': `${glareAngle}deg`,
    '--gh-duration': `${transitionDuration}ms`,
    '--gh-size': `${glareSize}%`,
    '--gh-rgba': rgba,
    '--gh-border': borderColor
  };

  return (
    <div
      className={`glare-hover ${playOnce ? 'glare-hover--play-once' : ''} ${className}`}
      style={{ ...vars, ...style }}
    >
      {children}
    </div>
  );
};

// ==========================================
// 2. SKILLS DATA
// ==========================================
const techSkills = [
  { name: 'HTML5', icon: FaHtml5, color: '#E34F26' },      
  { name: 'CSS3', icon: FaCss3Alt, color: '#1572B6' },     
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'React.js', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
  { name: 'Vue.js', icon: SiVuedotjs, color: '#4FC08D' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3' },
  { name: 'GSAP', icon: SiGreensock, color: '#88CE02' },
  { name: 'Framer', icon: SiFramer, color: '#0055FF' },
  { name: 'Redux', icon: SiRedux, color: '#764ABC' },
  { name: 'GraphQL', icon: SiGraphql, color: '#E10098' },
  { name: 'JWT Auth', icon: SiJsonwebtokens, color: '#A855F7' }, 
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'Express.js', icon: SiExpress, color: '#FFFFFF' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E' },
  { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
  { name: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
  { name: 'REST API', icon: TbApi, color: '#00E676' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
  { name: 'Vercel', icon: SiVercel, color: '#FFFFFF' },
  { name: 'WordPress', icon: SiWordpress, color: '#21759B' },
];

// ==========================================
// 3. MAIN TECH STACK COMPONENT
// ==========================================
export default function TechStack() {
  return (
    <section id="stack" className="relative w-full min-h-screen bg-[#030108] text-white py-24 px-4 md:px-8 overflow-hidden z-10 flex flex-col justify-center">
      
      {/* Required CSS for GlareHover Component */}
      <style dangerouslySetInnerHTML={{ __html: `
        .glare-hover {
          width: var(--gh-width); height: var(--gh-height); background: var(--gh-bg);
          border-radius: var(--gh-br); border: 1px solid var(--gh-border);
          overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center;
          transition: border-color 0.3s ease;
        }
        .glare-hover::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient( var(--gh-angle), hsla(0, 0%, 0%, 0) 60%, var(--gh-rgba) 70%, hsla(0, 0%, 0%, 0), hsla(0, 0%, 0%, 0) 100% );
          transition: var(--gh-duration) ease;
          background-size: var(--gh-size) var(--gh-size), 100% 100%;
          background-repeat: no-repeat;
          background-position: -100% -100%, 0 0;
          z-index: 10;
        }
        .glare-hover:hover {
          cursor: pointer;
          border-color: rgba(255, 255, 255, 0.2);
        }
        .glare-hover:hover::before {
          background-position: 100% 100%, 0 0;
        }
        .glare-hover--play-once::before { transition: none; }
        .glare-hover--play-once:hover::before { transition: var(--gh-duration) ease; background-position: 100% 100%, 0 0; }
        
        /* Static Background Pattern */
        .static-pattern-bg {
          background-image: radial-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}} />

      {/* Static Background Pattern (No Animation) */}
      <div className="absolute inset-0 z-0 static-pattern-bg"></div>
      
      {/* Subtle Glow Accents */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container Layout Box */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header Section */}
        <div className="mb-20 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-purple-500"></div>
            <span className="text-sm font-bold tracking-widest text-purple-400 uppercase bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full">
              Tech Stack
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Technologies I <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Work With</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl text-base md:text-lg mx-auto md:mx-0">
            A curated set of modern technologies I use to build production-grade, fast, scalable, and user-friendly web applications.
          </p>
        </div>

        {/* Fully Responsive Grid Layout with GlareHover */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
          {techSkills.map((skill, index) => {
            const IconComponent = skill.icon;
            
            return (
              <div key={index} className="w-full h-28 md:h-32 group">
                <GlareHover
                  glareColor={skill.color} // Dynamic glare color based on tech brand!
                  glareOpacity={0.4}
                  glareAngle={-45}
                  glareSize={250}
                  transitionDuration={600}
                  className="backdrop-blur-md" // Adds the glassy effect to the card
                >
                  <div className="flex flex-col items-center justify-center w-full h-full relative z-0">
                    
                    {/* Brand Icon */}
                    <div className="transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110">
                      <IconComponent 
                        style={{ color: skill.color }} 
                        className="w-10 h-10 md:w-12 md:h-12 drop-shadow-md opacity-90 group-hover:opacity-100 transition-all duration-300" 
                      />
                    </div>

                    {/* Text Label revealed on hover */}
                    <div className="absolute bottom-3 md:bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                      <span className="text-xs md:text-sm font-semibold tracking-wide" style={{ color: skill.color }}>
                        {skill.name}
                      </span>
                    </div>

                  </div>
                </GlareHover>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}