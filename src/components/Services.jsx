'use client';

import React, { useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';

// ==========================================
// 1. SERVICES DATA
// ==========================================
const SERVICES_DATA = [
  {
    id: 'full-stack-web-development',
    title: 'Full-Stack Web Development',
    shortTitle: 'End-to-End Solutions',
    description: 'Building secure, scalable, and high-performance full-stack web applications from scratch using the MERN stack and Next.js.',
    features: ['MERN & Next.js', 'RESTful APIs', 'Database Design', 'Authentication', 'Scalable Architecture', 'Production Deploy', 'Code Review', 'Maintenance', 'Performance Tuning'],
    image: 'https://res.cloudinary.com/dsga4gyw9/image/upload/v1779340426/ChatGPT_Image_May_21_2026_11_13_25_AM_yefnjf.png',
    imageAlt: 'Full-stack web development dashboard mockup',
  },
  {
    id: 'pixel-perfect-frontend',
    title: 'Pixel-Perfect Frontend',
    shortTitle: 'Figma to React/Next.js',
    description: 'Converting Figma, Adobe XD, or any reference design into 100% identical, fully responsive, and clean-coded frontend interfaces.',
    features: ['Figma to Code', 'Responsive Design', 'React / Next.js', 'Tailwind CSS', 'Cross-browser', 'Components', 'Accessibility', 'Mobile-first', 'Clean Code'],
    image: 'https://res.cloudinary.com/dsga4gyw9/image/upload/v1779340572/ChatGPT_Image_May_21_2026_11_15_55_AM_qufiyk.png',
    imageAlt: 'Pixel-perfect frontend UI design mockup',
  },
  {
    id: 'creative-web-animations',
    title: 'Creative Web Animations',
    shortTitle: 'Interactive UI/UX',
    description: 'Crafting dynamic scroll-based animations and smooth transitions using GSAP, ScrollTrigger, and Framer Motion to elevate user engagement.',
    features: ['GSAP Animations', 'ScrollTrigger', 'Framer Motion', 'Page Transitions', 'Micro-interactions', 'Lottie Integration', '3D Effects', 'Loading States', 'Engaging UX'],
    image: 'https://res.cloudinary.com/dsga4gyw9/image/upload/v1779340795/ChatGPT_Image_May_21_2026_11_19_43_AM_nopmif.png',
    imageAlt: 'Creative web animation interactive UI mockup',
  },
  {
    id: 'performance-seo-optimization',
    title: 'Performance & SEO Optimization',
    shortTitle: 'Speed & Visibility',
    description: 'Optimizing loading speeds and Core Web Vitals using Next.js rendering methods (SSR/SSG) to ensure lightning-fast performance and SEO-friendly structures.',
    features: ['Core Web Vitals', 'SSR / SSG', 'Meta Tags', 'Image Optimization', 'Lazy Loading', 'Sitemap', 'Schema Markup', 'Lighthouse Score', 'Fast Load Times'],
    image: 'https://res.cloudinary.com/dsga4gyw9/image/upload/v1779344496/ChatGPT_Image_May_21_2026_12_21_19_PM_crpsrk.png',
    imageAlt: 'Performance and SEO analytics dashboard mockup',
  },
  {
    id: 'wordpress-development',
    title: 'WordPress Development',
    shortTitle: 'CMS & Custom Sites',
    description: 'Developing custom WordPress websites, landing pages, and blogs that are fully editable, responsive, and easy for clients to manage.',
    features: ['Custom Themes', 'Plugin Dev', 'Landing Pages', 'Blog Setup', 'WooCommerce', 'SEO Plugins', 'Admin Training', 'Security', 'Speed Optimization'],
    image: 'https://res.cloudinary.com/dsga4gyw9/image/upload/v1779344637/ChatGPT_Image_May_21_2026_12_23_35_PM_j9hiem.png',
    imageAlt: 'WordPress CMS website mockup',
  },
  {
    id: 'custom-web-applications',
    title: 'Custom Web Applications',
    shortTitle: 'Dashboards & E-Commerce',
    description: 'Developing tailored web solutions, including secure authentication, complex state management, custom dashboards, and e-commerce platforms.',
    features: ['Dashboards', 'E-commerce', 'Auth Systems', 'State Management', 'Payment Integration', 'Real-time Data', 'Admin Panels', 'API Integration', 'Custom Workflows'],
    image: 'https://res.cloudinary.com/dsga4gyw9/image/upload/v1779344746/ChatGPT_Image_May_21_2026_12_25_25_PM_tpoh9f.png',
    imageAlt: 'Custom web application dashboard mockup',
  },
];

// ==========================================
// 2. BORDER GLOW (Hover Effect Kept Intact)
// ==========================================
function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildBoxShadow(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers = [
    [0, 0, 0, 1, 100, true], [0, 0, 1, 0, 60, true], [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true], [0, 0, 15, 0, 30, true], [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true], [0, 0, 1, 0, 60, false], [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false], [0, 0, 15, 0, 30, false], [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ];
  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100);
      return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
    })
    .join(', ');
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors) {
  const gradients = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

const BorderGlow = ({
  children, className = '', edgeSensitivity = 30, glowColor = '270 80 70', backgroundColor = '#120F17',
  borderRadius = 28, glowRadius = 40, glowIntensity = 1.0, coneSpread = 25,
  colors = ['#c084fc', '#f472b6', '#38bdf8'], fillOpacity = 0.5,
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorAngle, setCursorAngle] = useState(45);
  const [edgeProximity, setEdgeProximity] = useState(0);

  const getCenterOfElement = useCallback((el) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx; const dy = y - cy;
    let kx = Infinity; let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx; const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    let degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const handlePointerMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    setEdgeProximity(getEdgeProximity(card, x, y));
    setCursorAngle(getCursorAngle(card, x, y));
  }, [getEdgeProximity, getCursorAngle]);

  const colorSensitivity = edgeSensitivity + 20;
  const isVisible = isHovered;
  const borderOpacity = isVisible ? Math.max(0, (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity)) : 0;
  const glowOpacity = isVisible ? Math.max(0, (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity)) : 0;
  const meshGradients = buildMeshGradients(colors);
  const borderBg = meshGradients.map((g) => `${g} border-box`);
  const fillBg = meshGradients.map((g) => `${g} padding-box`);
  const angleDeg = `${cursorAngle.toFixed(3)}deg`;

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => { setIsHovered(false); setEdgeProximity(0); }}
      className={`relative grid isolate border border-white/15 w-full ${className}`}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: 'translate3d(0, 0, 0.01px)',
        boxShadow: 'rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 16px 32px, rgba(0,0,0,0.1) 0 32px 64px',
      }}
    >
      <div
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={{
          border: '1px solid transparent',
          background: [`linear-gradient(${backgroundColor} 0 100%) padding-box`, 'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box', ...borderBg].join(', '),
          opacity: borderOpacity,
          maskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out',
        }}
      />
      <div
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={{
          border: '1px solid transparent',
          background: fillBg.join(', '),
          maskImage: [
            'linear-gradient(to bottom, black, black)', 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
            'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)', 'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)', 'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
            `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          ].join(', '),
          WebkitMaskImage: [
            'linear-gradient(to bottom, black, black)', 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
            'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)', 'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)', 'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
            `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          ].join(', '),
          maskComposite: 'subtract, add, add, add, add, add',
          WebkitMaskComposite: 'source-out, source-over, source-over, source-over, source-over, source-over',
          opacity: borderOpacity * fillOpacity,
          mixBlendMode: 'soft-light',
          transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out',
        }}
      />
      <span
        className="absolute pointer-events-none z-[1] rounded-[inherit]"
        style={{
          inset: `${-glowRadius}px`,
          maskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          opacity: glowOpacity,
          mixBlendMode: 'plus-lighter',
          transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out',
        }}
      >
        <span
          className="absolute rounded-[inherit]"
          style={{ inset: `${glowRadius}px`, boxShadow: buildBoxShadow(glowColor, glowIntensity) }}
        />
      </span>
      <div className="flex flex-col relative z-[1] w-full overflow-hidden rounded-[inherit]">
        {children}
      </div>
    </div>
  );
};

// ==========================================
// 3. SERVICE CARD
// ==========================================
function ServiceCard({ service }) {
  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="270 80 70"
      backgroundColor="#120F17"
      borderRadius={20}
      glowRadius={32}
      glowIntensity={0.9}
      coneSpread={25}
      colors={['#c084fc', '#f472b6', '#38bdf8']}
      className="h-full"
    >
      <article itemScope itemType="https://schema.org/Service" className="flex flex-col h-full">
        <div className="relative w-full aspect-[16/10] shrink-0 bg-[#0a090d] overflow-hidden">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center"
            itemProp="image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120F17] via-transparent to-transparent pointer-events-none" />
        </div>
        <div className="flex flex-col flex-1 gap-3 sm:gap-4 p-4 sm:p-5 bg-[#141218]">
          <header>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-purple-400 mb-1 block">
              {service.shortTitle}
            </span>
            <h3 itemProp="name" className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">
              {service.title}
            </h3>
          </header>
          <p itemProp="description" className="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
            {service.description}
          </p>
          <ul className="flex flex-col gap-1.5 sm:gap-2 mt-auto" aria-label={`${service.title} features`}>
            {service.features.slice(0, 5).map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-300">
                <FaCheck className="w-3 h-3 shrink-0 text-purple-400" aria-hidden="true" />
                <span className="truncate">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </BorderGlow>
  );
}

// ==========================================
// 4. MAIN SERVICES SECTION
// ==========================================
export default function Services() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Web Development Services by Md Sefat Ullah Fahad',
    itemListElement: SERVICES_DATA.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        provider: {
          '@type': 'Person',
          name: 'Md Sefat Ullah Fahad',
          jobTitle: 'Full Stack Developer',
        },
      },
    })),
  };

  return (
    <section
      id="services"
      className="relative w-full bg-[#090314] text-white py-20 sm:py-24 overflow-hidden scroll-mt-28"
      aria-labelledby="services-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hexagon Background Image Setup with the provided Cloudinary URL */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] mix-blend-luminosity pointer-events-none" 
    style={{
  backgroundImage: "url('https://res.cloudinary.com/dsga4gyw9/image/upload/v1779458632/zigzag-lines-pattern-black-background_1017-37483_uyyokv.avif')",
  backgroundSize: '400px', /* এখানে 300px, 400px বা 50% দিয়ে দেখতে পারেন কোনটা ভালো লাগে */
  backgroundPosition: 'center',
  backgroundRepeat: 'repeat' /* পুরো স্ক্রিন জুড়ে প্যাটার্নটি বারবার আসবে */
}}
        aria-hidden="true" 
      />
      
      {/* Soft gradient overlay to blend the edges and text better */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[#090314]/80 via-transparent to-[#090314]/90"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-purple-500" />
            <span className="text-sm font-bold tracking-widest text-purple-400 uppercase bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full">
              Services
            </span>
          </div>
          <h2
            id="services-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            What I{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Offer
            </span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl text-base md:text-lg">
            Professional web development services tailored to build fast, scalable, and
            user-friendly digital experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {SERVICES_DATA.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}