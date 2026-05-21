'use client'; // Custom state, typewriter effects ebong WebGL canvas dynamic rendering-er jonno

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; 
import { FaEnvelope, FaEye, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTelegramPlane } from 'react-icons/fa';
import StarBorder from '@/components/StarBorder';
import { useSectionVisible } from '@/lib/useSectionVisible';
import { scrollToSectionId } from '@/lib/navScroll';

// // Custom SVG Icons
// const GithubIcon = () => (
//   <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
//     <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"/>
//   </svg>
// );

// const LinkedinIcon = () => (
//   <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
//     <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
//   </svg>
// );

// const FacebookIcon = () => (
//   <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
//     <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
//   </svg>
// );

// const InstagramIcon = () => (
//   <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
//     <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.9c-41.4 0-75-33.6-75-75s33.6-75 75-75 75 33.6 75 75-33.6 75-75 75zm134.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zM400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-16.4 310c0 38.7-31.3 70-70 70H134.4c-38.7 0-70-31.3-70-70V168c0-38.7 31.3-70 70-70h179.2c38.7 0 70 31.3 70 70v174z"/>
//   </svg>
// );

// const EnvelopeIcon = () => (
//   <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
//     <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7l224 171.4c16.2 12.4 38.5 12.4 54.7 0l224-171.4zM256 336c11.3 0 22.6-4.3 31.3-13l221.7-170c3.9-3 4.3-8.8 1-12.3l-24-25.7c-3.1-3.3-8.3-3.7-11.8-.7L256 251.7 81.9 114.4c-3.5-3-8.7-2.6-11.8.7l-24 25.7c-3.3 3.5-2.9 9.3 1 12.3l221.7 170c8.7 8.7 20 13 31.3 13z"/>
//   </svg>
// );

// const EyeIcon = () => (
//   <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="w-5 h-5 animate-pulse" xmlns="http://www.w3.org/2000/svg">
//     <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.71 135.59 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"/>
//   </svg>
// );

// const TelegramIcon = () => (
//   <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
//     <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"/>
//   </svg>
// );

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
            Currently at <a href="https://exprovia.com" target="_blank" rel="noopener noreferrer" className="text-red-400 font-semibold hover:underline">Experivia</a> — crafting production-grade apps
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
              <span className="bg-[#120722]/80 border border-[#a855f7]/40 hover:bg-[#a855f7]/10 text-white flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3.5 rounded-xl text-sm md:text-base font-semibold tracking-wide transition-all transform hover:-translate-y-0.5 w-full sm:w-auto">
                <FaTelegramPlane className="w-5 h-5" />
                Get In Touch
              </span>
            </StarBorder>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 pt-4 md:pt-6 text-gray-500">
            {socialLinks.map((social, idx) => (
              <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 p-2" title={social.name}>
                {social.icon}
              </a>
            ))}
            <span className="text-gray-500 hover:text-white cursor-pointer transition-colors duration-300 flex items-center gap-1.5 p-2" title="Discord: fahad_5562">
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