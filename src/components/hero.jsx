'use client'; // Custom state, typewriter effects ebong WebGL canvas dynamic rendering-er jonno

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; 
import { FaEye, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTelegramPlane } from 'react-icons/fa';
import StarBorder from '@/components/StarBorder';
import { useSectionVisible } from '@/lib/useSectionVisible';
import { scrollToSectionId } from '@/lib/navScroll';
import Link from 'next/link';

// Native WebGL-based LightRays
const NativeLightRays = ({
  active = true,
  raysColor = "#a855f7", raysSpeed = 1.2, lightSpread = 0.5, rayLength = 1.5,
  pulsating = true, fadeDistance = 1.0, saturation = 0.8, followMouse = true,
  mouseInfluence = 0.15, noiseAmount = 0.08, distortion = 0.06
}) => {
  const containerRef = useRef(null);
  const glRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animFrameRef = useRef(null);

  const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1.0, 1.0, 1.0];
  };

  useEffect(() => {
    if (!containerRef.current || !active) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(canvas);

    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) return;
    glRef.current = gl;

    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec2 rayPos;
      uniform vec2 rayDir;
      uniform vec3 raysColor;
      uniform float raysSpeed;
      uniform float lightSpread;
      uniform float rayLength;
      uniform float pulsating;
      uniform float fadeDistance;
      uniform float saturation;
      uniform vec2 mousePos;
      uniform float mouseInfluence;
      uniform float noiseAmount;
      uniform float distortion;
      varying vec2 vUv;

      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
        vec2 sourceToCoord = coord - raySource;
        vec2 dirNorm = normalize(sourceToCoord);
        float cosAngle = dot(dirNorm, rayRefDirection);
        float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
        float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
        float distance = length(sourceToCoord);
        float maxDistance = iResolution.x * rayLength;
        float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
        float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
        float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;
        float baseStrength = clamp(
          (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
          (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
          0.0, 1.0
        );
        return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
      }

      void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
        vec2 finalRayDir = rayDir;
        if (mouseInfluence > 0.0) {
          vec2 mouseScreenPos = mousePos * iResolution.xy;
          vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
          finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
        }
        float r1 = rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
        float r2 = rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);
        vec4 finalColor = vec4(1.0) * (r1 * 0.5 + r2 * 0.4);

        if (noiseAmount > 0.0) {
          float n = noise(coord * 0.01 + iTime * 0.1);
          finalColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
        }

        float brightness = 1.0 - (coord.y / iResolution.y);
        finalColor.x *= 0.1 + brightness * 0.8;
        finalColor.y *= 0.3 + brightness * 0.6;
        finalColor.z *= 0.5 + brightness * 0.5;

        if (saturation != 1.0) {
          float gray = dot(finalColor.rgb, vec3(0.299, 0.587, 0.114));
          finalColor.rgb = mix(vec3(gray), finalColor.rgb, saturation);
        }

        finalColor.rgb *= raysColor;
        gl_FragColor = vec4(finalColor.rgb, finalColor.a * 0.35); 
      }
    `;

    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    glRef.current.program = program;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
      3, -1,
      -1, 3
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const updateSize = () => {
      const wCSS = containerRef.current.clientWidth;
      const hCSS = containerRef.current.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = wCSS * dpr;
      canvas.height = hCSS * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    const uLocations = {
      iTime: gl.getUniformLocation(program, 'iTime'),
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      rayPos: gl.getUniformLocation(program, 'rayPos'),
      rayDir: gl.getUniformLocation(program, 'rayDir'),
      raysColor: gl.getUniformLocation(program, 'raysColor'),
      raysSpeed: gl.getUniformLocation(program, 'raysSpeed'),
      lightSpread: gl.getUniformLocation(program, 'lightSpread'),
      rayLength: gl.getUniformLocation(program, 'rayLength'),
      pulsating: gl.getUniformLocation(program, 'pulsating'),
      fadeDistance: gl.getUniformLocation(program, 'fadeDistance'),
      saturation: gl.getUniformLocation(program, 'saturation'),
      mousePos: gl.getUniformLocation(program, 'mousePos'),
      mouseInfluence: gl.getUniformLocation(program, 'mouseInfluence'),
      noiseAmount: gl.getUniformLocation(program, 'noiseAmount'),
      distortion: gl.getUniformLocation(program, 'distortion'),
    };

    let running = true;

    const render = (time) => {
      if (!running || !glRef.current || !canvas) return;
      gl.useProgram(program);

      const smooth = 0.93;
      smoothMouseRef.current.x = smoothMouseRef.current.x * smooth + mouseRef.current.x * (1 - smooth);
      smoothMouseRef.current.y = smoothMouseRef.current.y * smooth + mouseRef.current.y * (1 - smooth);

      const rgbColor = hexToRgb(raysColor);
      const w = canvas.width;
      const h = canvas.height;

      gl.uniform1f(uLocations.iTime, time * 0.001);
      gl.uniform2f(uLocations.iResolution, w, h);
      gl.uniform2f(uLocations.rayPos, w * 0.5, -0.2 * h); 
      gl.uniform2f(uLocations.rayDir, 0.0, 1.0); 
      gl.uniform3f(uLocations.raysColor, rgbColor[0], rgbColor[1], rgbColor[2]);
      gl.uniform1f(uLocations.raysSpeed, raysSpeed);
      gl.uniform1f(uLocations.lightSpread, lightSpread);
      gl.uniform1f(uLocations.rayLength, rayLength);
      gl.uniform1f(uLocations.pulsating, pulsating ? 1.0 : 0.0);
      gl.uniform1f(uLocations.fadeDistance, fadeDistance);
      gl.uniform1f(uLocations.saturation, saturation);
      gl.uniform2f(uLocations.mousePos, smoothMouseRef.current.x, smoothMouseRef.current.y);
      gl.uniform1f(uLocations.mouseInfluence, mouseInfluence);
      gl.uniform1f(uLocations.noiseAmount, noiseAmount);
      gl.uniform1f(uLocations.distortion, distortion);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    const handleMouseMove = (e) => {
      if (!followMouse) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      running = false;
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [active, raysColor, raysSpeed, lightSpread, rayLength, pulsating, fadeDistance, saturation, mouseInfluence, noiseAmount, distortion, followMouse]);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10 opacity-60" />;
};

export default function Hero() {
  const sectionRef = useRef(null);
  const isVisible = useSectionVisible(sectionRef, { initial: true });

  const words = ['Node.js Developer', 'UI/UX Implementer', 'React.js Developer', 'Next.js Engineer'];
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  const activeWord = words[wordIndex];

  useEffect(() => {
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
  }, [displayText, isDeleting, wordIndex, typingSpeed]);

  const socialLinks = [
    { icon: <FaGithub className="w-5 h-5" />, url: 'https://github.com/Sefat-Ullah-Fahad', name: 'GitHub' },
    { icon: <FaLinkedin className="w-5 h-5" />, url: 'https://www.linkedin.com/in/md-fahad-3a0910396/', name: 'LinkedIn' },
    { icon: <FaFacebook className="w-5 h-5" />, url: 'https://www.facebook.com/sefat.ullah.fahad', name: 'Facebook' },
    { icon: <FaInstagram className="w-5 h-5" />, url: 'https://www.instagram.com/sifatullahfahad/', name: 'Instagram' },
    
  ];

  return (
    // FIX 1: Removed lg:min-h-[850px] and added explicit top padding (pt-28 md:pt-36) to clear the navbar
    <section ref={sectionRef} id="home" className="relative min-h-[100dvh] w-full bg-[#060112] overflow-hidden flex items-center justify-center pt-28 md:pt-36 lg:pt-36 pb-16">
      
      <NativeLightRays
        active={isVisible}
        raysColor="#a855f7"
        raysSpeed={1.3}
        lightSpread={0.65}
        rayLength={1.4}
        pulsating={true}
        saturation={0.9}
        noiseAmount={0.06}
        distortion={0.04}
      />

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
        .premium-visual-grid {
          background-size: 50px 50px;
          background-image:
            linear-gradient(to right, rgba(129, 75, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(129, 75, 255, 0.08) 1px, transparent 1px);
        }
      `}} />

      <div className="absolute inset-0 premium-visual-grid pointer-events-none z-0" />

      <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] glow-overlay-purple pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] md:w-[650px] h-[350px] md:h-[650px] glow-overlay-pink pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[30%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] glow-overlay-green pointer-events-none z-0 hidden lg:block" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-8 w-full mt-4 lg:mt-0">
        
        {/* FIX 2: Text Container uses flex-col to keep all items perfectly aligned to start on lg screens */}
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
            <StarBorder
              as="a"
              href="#contact"
              color="#a855f7"
              speed="5s"
              className="rounded-xl w-full sm:w-auto mt-2 sm:mt-0"
              onClick={(e) => {
                e.preventDefault();
                scrollToSectionId('contact');
              }}
            >
              {/* <span className="bg-[#120722]/80 border border-[#a855f7]/40 hover:bg-[#a855f7]/10 text-white flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3.5 rounded-xl text-sm md:text-base font-semibold tracking-wide transition-all transform hover:-translate-y-0.5 w-full sm:w-auto">
                <FaTelegramPlane className="w-5 h-5" />
                Get In Touch
              </span> */}
            </StarBorder>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 pt-4 md:pt-6 text-gray-500">
            {socialLinks.map((social, idx) => (
              <Link key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 p-2" title={social.name}>
                {social.icon}
              </Link>
            ))}
            <span className="text-gray-500 hover:text-white  transition-colors duration-300 flex items-center gap-1.5 p-2" title="Discord: fahad_5562">
              <span className="text-xs font-semibold">Discord: fahad_5562</span>
            </span>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center relative w-full select-none mt-8 lg:mt-0">
          
          <div className="hidden sm:block absolute top-[5%] left-[5%] w-2 h-2 bg-purple-500 rounded-full opacity-70 animate-ping"></div>
          <div className="hidden sm:block absolute bottom-[5%] right-[5%] w-2 h-2 bg-pink-500 rounded-full opacity-70 animate-ping" style={{ animationDelay: '1.5s' }}></div>

          <div className="relative w-[260px] h-[260px] sm:w-[310px] sm:h-[310px] md:w-[360px] md:h-[360px] flex items-center justify-center">
            
            <div className="absolute inset-4 sm:inset-8 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl sm:blur-2xl z-0" />

            <div className="absolute inset-0 animate-rotate-cw z-1 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="48" 
                  stroke="url(#purplePinkGradient)" 
                  strokeWidth="1.2" 
                  strokeDasharray="5, 4" 
                  fill="none" 
                  opacity="0.85"
                />
                <defs>
                  <linearGradient id="purplePinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#814bff" />
                    <stop offset="100%" stopColor="#e2378f" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="absolute inset-3 sm:inset-4 animate-rotate-ccw z-1 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="46" 
                  stroke="url(#cyanBlueGradient)" 
                  strokeWidth="1" 
                  strokeDasharray="8, 5" 
                  fill="none" 
                  opacity="0.65"
                />
                <defs>
                  <linearGradient id="cyanBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

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
      
      <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 opacity-60 flex-col items-center gap-2 text-gray-500">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold">Scroll</span>
        <div className="w-1 h-1 bg-white/80 rounded-full animate-bounce"></div>
      </div>
    </section>
  );
}