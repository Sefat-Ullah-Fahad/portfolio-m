'use client'; // Custom state, typewriter effects ebong pure JS rendering-er jonno

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; 
import { FaEye, FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import StarBorder from '@/components/StarBorder';
import { scrollToSectionId } from '@/lib/navScroll';
import Link from 'next/link';

export default function Hero() {
  const words = ['Node.js Developer', 'UI/UX Implementer', 'React.js Developer', 'Next.js Engineer'];
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);
  const [mounted, setMounted] = useState(false);

  const activeWord = words[wordIndex];

  // Hydration Safe: Run only on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Typewriter Effect Logic
  useEffect(() => {
    if (!mounted) return;

    let timer;
    const currentWord = words[wordIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        setTypingSpeed(80);

        if (displayText === currentWord) {
          timer = setTimeout(() => {
            setIsDeleting(true);
            setTypingSpeed(50);
          }, 2000);
          return;
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        setTypingSpeed(50);

        if (displayText === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          setTypingSpeed(150);
        }
      }
    };

    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex, typingSpeed, mounted, words]);

  const socialLinks = [
    { icon: <FaGithub className="w-5 h-5" />, url: 'https://github.com/Sefat-Ullah-Fahad', name: 'GitHub' },
    { icon: <FaLinkedin className="w-5 h-5" />, url: 'https://www.linkedin.com/in/md-fahad-3a0910396/', name: 'LinkedIn' },
    { icon: <FaFacebook className="w-5 h-5" />, url: 'https://www.facebook.com/sefat.ullah.fahad', name: 'Facebook' },
    { icon: <FaInstagram className="w-5 h-5" />, url: 'https://www.instagram.com/sifatullahfahad/', name: 'Instagram' },
  ];

  if (!mounted) return null; // Pre-render blank to prevent hydration errors

  return (
    <section id="home" className="relative min-h-[100dvh] w-full bg-[#060112] overflow-hidden flex items-center justify-center pt-28 md:pt-36 lg:pt-36 pb-16">
      
      {/* Required CSS for Rotating Borders and Static Pattern */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rotate-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotate-counter-clockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-rotate-cw {
          animation: rotate-clockwise 25s linear infinite;
        }
        .animate-rotate-ccw {
          animation: rotate-counter-clockwise 20s linear infinite;
        }
        .glow-overlay-purple {
          background: radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(0,0,0,0) 70%);
        }
        .glow-overlay-green {
          background: radial-gradient(circle, rgba(34,197,94,0.14) 0%, rgba(0,0,0,0) 65%);
        }
        .glow-overlay-pink {
          background: radial-gradient(circle, rgba(236,72,153,0.12) 0%, rgba(0,0,0,0) 60%);
        }
        /* Static Grid Background */
        .premium-visual-grid {
          background-size: 50px 50px;
          background-image:
            linear-gradient(to right, rgba(129, 75, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(129, 75, 255, 0.08) 1px, transparent 1px);
        }
      `}} />

      {/* Static Grid Background */}
      <div className="absolute inset-0 premium-visual-grid pointer-events-none z-0" />

      {/* Subtle Glowing Background Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] glow-overlay-purple pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] md:w-[650px] h-[350px] md:h-[650px] glow-overlay-pink pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[30%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] glow-overlay-green pointer-events-none z-0 hidden lg:block" />

      {/* Main Container Layout */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-8 w-full mt-4 lg:mt-0">
        
        {/* Left Side: Text Content */}
        <div className="flex-1 space-y-5 md:space-y-6 text-center lg:text-left w-full flex flex-col items-center lg:items-start">
          
          <h1 className="text-4xl sm:text-5xl md:text-[4.5rem] lg:text-[5rem] font-extrabold tracking-tight leading-[1.15] md:leading-[1.12] text-white">
            Building Digital<br />
            <span className="bg-gradient-to-r from-[#814bff] via-[#e2378f] to-[#f97316] bg-clip-text text-transparent">
              Experiences<br />
            </span>
            That Matter
          </h1>

          <div className="text-lg sm:text-xl md:text-2xl text-gray-300 font-medium h-8 md:h-10 flex justify-center lg:justify-start items-center">
            <span>I am a&nbsp;</span>
            <span className={`transition-colors duration-500 font-bold ${
              activeWord.includes('Node.js') ? 'text-blue-400' :
              activeWord.includes('UI/UX') ? 'text-purple-400' :
              activeWord.includes('React') ? 'text-cyan-400' :
              'text-[#f97316]'
            }`}>
              {displayText}
              <span className="animate-pulse ml-0.5 text-white">|</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-400 font-medium px-2 lg:px-0">
            Currently at <Link href="https://exprovia.com" target="_blank" rel="noopener noreferrer" className="text-red-400 font-semibold hover:underline">Experivia</Link> — crafting production-grade apps
          </p>

          <p className="text-[#22c55e] text-sm sm:text-base font-semibold tracking-wide px-2 lg:px-0">
            Turning ideas into scalable digital products.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 pt-2 md:pt-4 w-full px-4 sm:px-0">
            <StarBorder
              as="a"
              href="#projects"
              color="#a855f7"
              speed="5s"
              className="rounded-xl w-full sm:w-auto"
              onClick={(e) => {
                e.preventDefault();
                scrollToSectionId('projects');
              }}
            >
              <span className="bg-[#a855f7] hover:bg-[#c084fc] text-white flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3.5 rounded-xl text-sm md:text-base font-bold tracking-wide transition-all shadow-lg shadow-[#a855f7]/30 transform hover:-translate-y-0.5 w-full sm:w-auto">
                <FaEye className="w-5 h-5 animate-pulse" />
                View My Work
              </span>
            </StarBorder>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 pt-4 md:pt-6 text-gray-500">
            {socialLinks.map((social, idx) => (
              <Link key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 p-2" title={social.name}>
                {social.icon}
              </Link>
            ))}
            <span className="text-gray-500 hover:text-white transition-colors duration-300 flex items-center gap-1.5 p-2" title="Discord: fahad_5562">
              <span className="text-xs font-semibold">Discord: fahad_5562</span>
            </span>
          </div>
        </div>

        {/* Right Side: Image and Rotating Rings */}
        <div className="flex-1 flex justify-center items-center relative w-full select-none mt-8 lg:mt-0">
          
          <div className="hidden sm:block absolute top-[5%] left-[5%] w-2 h-2 bg-purple-500 rounded-full opacity-70 animate-ping"></div>
          <div className="hidden sm:block absolute bottom-[5%] right-[5%] w-2 h-2 bg-pink-500 rounded-full opacity-70 animate-ping" style={{ animationDelay: '1.5s' }}></div>

          <div className="relative w-[260px] h-[260px] sm:w-[310px] sm:h-[310px] md:w-[360px] md:h-[360px] flex items-center justify-center">
            
            <div className="absolute inset-4 sm:inset-8 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl sm:blur-2xl z-0" />

            {/* Rotating SVG Ring 1 */}
            <div className="absolute inset-0 animate-rotate-cw z-1 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" stroke="url(#purplePinkGradient)" strokeWidth="1.2" strokeDasharray="5, 4" fill="none" opacity="0.85" />
                <defs>
                  <linearGradient id="purplePinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#814bff" />
                    <stop offset="100%" stopColor="#e2378f" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Rotating SVG Ring 2 */}
            <div className="absolute inset-3 sm:inset-4 animate-rotate-ccw z-1 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" stroke="url(#cyanBlueGradient)" strokeWidth="1" strokeDasharray="8, 5" fill="none" opacity="0.65" />
                <defs>
                  <linearGradient id="cyanBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Center Image */}
            <div className="relative w-[190px] h-[190px] sm:w-[230px] sm:h-[230px] md:w-[270px] md:h-[270px] rounded-full p-1.5 bg-gradient-to-tr from-[#814bff]/40 via-[#e2378f]/30 to-transparent z-10 shadow-2xl">
              <div className="relative w-full h-full rounded-full bg-[#060112] overflow-hidden flex items-center justify-center border border-white/20">
                <Image 
                  src="https://res.cloudinary.com/dsga4gyw9/image/upload/v1775988954/aar8witu94exzyxbxfd6.jpg" 
                  alt="Md Sefat Ullah Fahad Profile" 
                  fill
                  sizes="(max-width: 640px) 190px, (max-width: 768px) 230px, 270px"
                  priority 
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute top-[8%] right-[12%] w-2 sm:w-3 h-2 sm:h-3 bg-pink-500 rounded-full border border-white/50 shadow-[0_0_10px_#e2378f] animate-pulse z-20"></div>
            <div className="absolute bottom-[20%] left-[5%] w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 bg-purple-500 rounded-full border border-white/50 shadow-[0_0_10px_#814bff] animate-pulse z-20"></div>

          </div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 opacity-60 flex-col items-center gap-2 text-gray-500">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold">Scroll</span>
        <div className="w-1 h-1 bg-white/80 rounded-full animate-bounce"></div>
      </div>
    </section>
  );
}