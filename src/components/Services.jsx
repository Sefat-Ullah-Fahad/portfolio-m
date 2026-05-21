'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';
import { useSectionVisible } from '@/lib/useSectionVisible';

// ==========================================
// SERVICES DATA
// ==========================================
const SERVICES_DATA = [
  {
    id: 'full-stack-web-development',
    title: 'Full-Stack Web Development',
    shortTitle: 'End-to-End Solutions',
    description:
      'Building secure, scalable, and high-performance full-stack web applications from scratch using the MERN stack and Next.js.',
    features: [
      'MERN & Next.js',
      'RESTful APIs',
      'Database Design',
      'Authentication',
      'Scalable Architecture',
      'Production Deploy',
      'Code Review',
      'Maintenance',
      'Performance Tuning',
    ],
    image:
      'https://res.cloudinary.com/dsga4gyw9/image/upload/v1779340426/ChatGPT_Image_May_21_2026_11_13_25_AM_yefnjf.png',
    imageAlt: 'Full-stack web development dashboard mockup',
  },
  {
    id: 'pixel-perfect-frontend',
    title: 'Pixel-Perfect Frontend',
    shortTitle: 'Figma to React/Next.js',
    description:
      'Converting Figma, Adobe XD, or any reference design into 100% identical, fully responsive, and clean-coded frontend interfaces.',
    features: [
      'Figma to Code',
      'Responsive Design',
      'React / Next.js',
      'Tailwind CSS',
      'Cross-browser',
      'Components',
      'Accessibility',
      'Mobile-first',
      'Clean Code',
    ],
    image:
      'https://res.cloudinary.com/dsga4gyw9/image/upload/v1779340572/ChatGPT_Image_May_21_2026_11_15_55_AM_qufiyk.png',
    imageAlt: 'Pixel-perfect frontend UI design mockup',
  },
  {
    id: 'creative-web-animations',
    title: 'Creative Web Animations',
    shortTitle: 'Interactive UI/UX',
    description:
      'Crafting dynamic scroll-based animations and smooth transitions using GSAP, ScrollTrigger, and Framer Motion to elevate user engagement.',
    features: [
      'GSAP Animations',
      'ScrollTrigger',
      'Framer Motion',
      'Page Transitions',
      'Micro-interactions',
      'Lottie Integration',
      '3D Effects',
      'Loading States',
      'Engaging UX',
    ],
    image:
      'https://res.cloudinary.com/dsga4gyw9/image/upload/v1779340795/ChatGPT_Image_May_21_2026_11_19_43_AM_nopmif.png',
    imageAlt: 'Creative web animation interactive UI mockup',
  },
  {
    id: 'performance-seo-optimization',
    title: 'Performance & SEO Optimization',
    shortTitle: 'Speed & Visibility',
    description:
      'Optimizing loading speeds and Core Web Vitals using Next.js rendering methods (SSR/SSG) to ensure lightning-fast performance and SEO-friendly structures.',
    features: [
      'Core Web Vitals',
      'SSR / SSG',
      'Meta Tags',
      'Image Optimization',
      'Lazy Loading',
      'Sitemap',
      'Schema Markup',
      'Lighthouse Score',
      'Fast Load Times',
    ],
    image:
      'https://res.cloudinary.com/dsga4gyw9/image/upload/v1779344496/ChatGPT_Image_May_21_2026_12_21_19_PM_crpsrk.png',
    imageAlt: 'Performance and SEO analytics dashboard mockup',
  },
  {
    id: 'wordpress-development',
    title: 'WordPress Development',
    shortTitle: 'CMS & Custom Sites',
    description:
      'Developing custom WordPress websites, landing pages, and blogs that are fully editable, responsive, and easy for clients to manage.',
    features: [
      'Custom Themes',
      'Plugin Dev',
      'Landing Pages',
      'Blog Setup',
      'WooCommerce',
      'SEO Plugins',
      'Admin Training',
      'Security',
      'Speed Optimization',
    ],
    image:
      'https://res.cloudinary.com/dsga4gyw9/image/upload/v1779344637/ChatGPT_Image_May_21_2026_12_23_35_PM_j9hiem.png',
    imageAlt: 'WordPress CMS website mockup',
  },
  {
    id: 'custom-web-applications',
    title: 'Custom Web Applications',
    shortTitle: 'Dashboards & E-Commerce',
    description:
      'Developing tailored web solutions, including secure authentication, complex state management, custom dashboards, and e-commerce platforms.',
    features: [
      'Dashboards',
      'E-commerce',
      'Auth Systems',
      'State Management',
      'Payment Integration',
      'Real-time Data',
      'Admin Panels',
      'API Integration',
      'Custom Workflows',
    ],
    image:
      'https://res.cloudinary.com/dsga4gyw9/image/upload/v1779344746/ChatGPT_Image_May_21_2026_12_25_25_PM_tpoh9f.png',
    imageAlt: 'Custom web application dashboard mockup',
  },
];

// ==========================================
// BORDER GLOW (React Bits — official source)
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
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ];
  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100);
      return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
    })
    .join(', ');
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}
function easeInCubic(x) {
  return x * x * x;
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
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
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '270 80 70',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorAngle, setCursorAngle] = useState(45);
  const [edgeProximity, setEdgeProximity] = useState(0);
  const [sweepActive, setSweepActive] = useState(false);

  const getCenterOfElement = useCallback((el) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback(
    (el, x, y) => {
      const [cx, cy] = getCenterOfElement(el);
      const dx = x - cx;
      const dy = y - cy;
      let kx = Infinity;
      let ky = Infinity;
      if (dx !== 0) kx = cx / Math.abs(dx);
      if (dy !== 0) ky = cy / Math.abs(dy);
      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    },
    [getCenterOfElement]
  );

  const getCursorAngle = useCallback(
    (el, x, y) => {
      const [cx, cy] = getCenterOfElement(el);
      const dx = x - cx;
      const dy = y - cy;
      if (dx === 0 && dy === 0) return 0;
      const radians = Math.atan2(dy, dx);
      let degrees = radians * (180 / Math.PI) + 90;
      if (degrees < 0) degrees += 360;
      return degrees;
    },
    [getCenterOfElement]
  );

  const handlePointerMove = useCallback(
    (e) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setEdgeProximity(getEdgeProximity(card, x, y));
      setCursorAngle(getCursorAngle(card, x, y));
    },
    [getEdgeProximity, getCursorAngle]
  );

  useEffect(() => {
    if (!animated) return;
    const angleStart = 110;
    const angleEnd = 465;
    setSweepActive(true);
    setCursorAngle(angleStart);

    animateValue({ duration: 500, onUpdate: (v) => setEdgeProximity(v / 100) });
    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) => {
        setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart);
      },
    });
    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) => {
        setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart);
      },
    });
    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => setEdgeProximity(v / 100),
      onEnd: () => setSweepActive(false),
    });
  }, [animated]);

  const colorSensitivity = edgeSensitivity + 20;
  const isVisible = isHovered || sweepActive;
  const borderOpacity = isVisible
    ? Math.max(0, (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity))
    : 0;
  const glowOpacity = isVisible
    ? Math.max(0, (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity))
    : 0;

  const meshGradients = buildMeshGradients(colors);
  const borderBg = meshGradients.map((g) => `${g} border-box`);
  const fillBg = meshGradients.map((g) => `${g} padding-box`);
  const angleDeg = `${cursorAngle.toFixed(3)}deg`;

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        setEdgeProximity(0);
      }}
      className={`relative grid isolate border border-white/15 w-full ${className}`}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: 'translate3d(0, 0, 0.01px)',
        boxShadow:
          'rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 16px 32px, rgba(0,0,0,0.1) 0 32px 64px',
      }}
    >
      <div
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={{
          border: '1px solid transparent',
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
            ...borderBg,
          ].join(', '),
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
            'linear-gradient(to bottom, black, black)',
            'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
            'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
            `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          ].join(', '),
          WebkitMaskImage: [
            'linear-gradient(to bottom, black, black)',
            'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
            'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
            `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          ].join(', '),
          maskComposite: 'subtract, add, add, add, add, add',
          WebkitMaskComposite:
            'source-out, source-over, source-over, source-over, source-over, source-over',
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
          style={{
            inset: `${glowRadius}px`,
            boxShadow: buildBoxShadow(glowColor, glowIntensity),
          }}
        />
      </span>

      <div className="flex flex-col relative z-[1] w-full overflow-hidden rounded-[inherit]">
        {children}
      </div>
    </div>
  );
};

// ==========================================
// FLOATING LINES BACKGROUND (React Bits)
// ==========================================
const floatingVertexShader = `
precision highp float;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const floatingFragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);
  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;
  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) return baseColor;
  if (lineGradientCount == 1) return lineGradient[0];
  float clampedT = clamp(t, 0.0, 0.9999);
  float scaled = clampedT * float(lineGradientCount - 1);
  int idx = int(floor(scaled));
  float f = fract(scaled);
  int idx2 = min(idx + 1, lineGradientCount - 1);
  return mix(lineGradient[idx], lineGradient[idx2], f) * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;
  float x_offset = offset;
  float x_movement = time * 0.1;
  float amp = sin(offset + time * 0.2) * 0.3;
  float y = sin(uv.x + x_offset + x_movement) * amp;
  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius);
    y += (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
  }
  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  if (parallax) baseUv += parallaxOffset;

  vec3 col = vec3(0.0);
  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }

  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += getLineColor(t, b) * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi, baseUv, mouseUv, interactive
      ) * 0.2;
    }
  }
  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += getLineColor(t, b) * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi, baseUv, mouseUv, interactive
      );
    }
  }
  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += getLineColor(t, b) * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi, baseUv, mouseUv, interactive
      ) * 0.1;
    }
  }
  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;

function hexToVec3(hex, Vector3) {
  let value = hex.trim();
  if (value.startsWith('#')) value = value.slice(1);
  let r = 255;
  let g = 255;
  let b = 255;
  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16);
    g = parseInt(value[1] + value[1], 16);
    b = parseInt(value[2] + value[2], 16);
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }
  return new Vector3(r / 255, g / 255, b / 255);
}

function FloatingLines({
  active = true,
  linesGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'screen',
}) {
  const containerRef = useRef(null);
  const targetMouseRef = useRef({ x: -1000, y: -1000 });
  const currentMouseRef = useRef({ x: -1000, y: -1000 });
  const targetInfluenceRef = useRef(0);
  const currentInfluenceRef = useRef(0);
  const targetParallaxRef = useRef({ x: 0, y: 0 });
  const currentParallaxRef = useRef({ x: 0, y: 0 });

  const getLineCount = (waveType) => {
    if (typeof lineCount === 'number') return lineCount;
    if (!enabledWaves.includes(waveType)) return 0;
    return lineCount[enabledWaves.indexOf(waveType)] ?? 6;
  };

  const getLineDistance = (waveType) => {
    if (typeof lineDistance === 'number') return lineDistance;
    if (!enabledWaves.includes(waveType)) return 0.1;
    return lineDistance[enabledWaves.indexOf(waveType)] ?? 0.1;
  };

  const topLineCount = enabledWaves.includes('top') ? getLineCount('top') : 0;
  const middleLineCount = enabledWaves.includes('middle') ? getLineCount('middle') : 0;
  const bottomLineCount = enabledWaves.includes('bottom') ? getLineCount('bottom') : 0;
  const topLineDistance = enabledWaves.includes('top') ? getLineDistance('top') * 0.01 : 0.01;
  const middleLineDistance = enabledWaves.includes('middle') ? getLineDistance('middle') * 0.01 : 0.01;
  const bottomLineDistance = enabledWaves.includes('bottom') ? getLineDistance('bottom') * 0.01 : 0.01;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !active) return;

    let mounted = true;
    let raf = 0;
    let cleanup = () => {};

    (async () => {
      const {
        Mesh,
        OrthographicCamera,
        PlaneGeometry,
        Scene,
        ShaderMaterial,
        Vector2,
        Vector3,
        WebGLRenderer,
      } = await import('three');

      if (!mounted || !containerRef.current) return;

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0, 0, 0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },
      enableTop: { value: enabledWaves.includes('top') },
      enableMiddle: { value: enabledWaves.includes('middle') },
      enableBottom: { value: enabledWaves.includes('bottom') },
      topLineCount: { value: topLineCount },
      middleLineCount: { value: middleLineCount },
      bottomLineCount: { value: bottomLineCount },
      topLineDistance: { value: topLineDistance },
      middleLineDistance: { value: middleLineDistance },
      bottomLineDistance: { value: bottomLineDistance },
      topWavePosition: {
        value: new Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4),
      },
      middleWavePosition: {
        value: new Vector3(middleWavePosition?.x ?? 5.0, middleWavePosition?.y ?? 0.0, middleWavePosition?.rotate ?? 0.2),
      },
      bottomWavePosition: {
        value: new Vector3(bottomWavePosition?.x ?? 2.0, bottomWavePosition?.y ?? -0.7, bottomWavePosition?.rotate ?? 0.4),
      },
      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },
      parallax: { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },
      lineGradient: {
        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1)),
      },
      lineGradientCount: { value: 0 },
    };

    if (linesGradient?.length) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      uniforms.lineGradientCount.value = stops.length;
      stops.forEach((hex, i) => {
        const color = hexToVec3(hex, Vector3);
        uniforms.lineGradient.value[i].set(color.x, color.y, color.z);
      });
    }

    const material = new ShaderMaterial({ uniforms, vertexShader: floatingVertexShader, fragmentShader: floatingFragmentShader });
    const geometry = new PlaneGeometry(2, 2);
    scene.add(new Mesh(geometry, material));
    const timeOrigin = performance.now();

    const setSize = () => {
      if (!mounted) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height, 1);
    };
    setSize();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(setSize) : null;
    ro?.observe(container);

    const handlePointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dpr = renderer.getPixelRatio();
      targetMouseRef.current.x = x * dpr;
      targetMouseRef.current.y = (rect.height - y) * dpr;
      targetInfluenceRef.current = 1.0;
      if (parallax) {
        targetParallaxRef.current.x =
          ((x - rect.width / 2) / rect.width) * parallaxStrength;
        targetParallaxRef.current.y =
          (-(y - rect.height / 2) / rect.height) * parallaxStrength;
      }
    };
    const handlePointerLeave = () => {
      targetInfluenceRef.current = 0.0;
    };

    if (interactive) {
      renderer.domElement.addEventListener('pointermove', handlePointerMove);
      renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    }

    const renderLoop = () => {
      if (!mounted) return;
      uniforms.iTime.value = (performance.now() - timeOrigin) / 1000;
      if (interactive) {
        const cm = currentMouseRef.current;
        const tm = targetMouseRef.current;
        cm.x += (tm.x - cm.x) * mouseDamping;
        cm.y += (tm.y - cm.y) * mouseDamping;
        uniforms.iMouse.value.set(cm.x, cm.y);
        currentInfluenceRef.current +=
          (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
        uniforms.bendInfluence.value = currentInfluenceRef.current;
      }
      if (parallax) {
        const cp = currentParallaxRef.current;
        const tp = targetParallaxRef.current;
        cp.x += (tp.x - cp.x) * mouseDamping;
        cp.y += (tp.y - cp.y) * mouseDamping;
        uniforms.parallaxOffset.value.set(cp.x, cp.y);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    cleanup = () => {
      mounted = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      if (interactive) {
        renderer.domElement.removeEventListener('pointermove', handlePointerMove);
        renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.parentElement?.removeChild(renderer.domElement);
    };
    })();

    return () => {
      cleanup();
    };
  }, [
    active,
    linesGradient,
    enabledWaves,
    lineCount,
    lineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    mouseDamping,
    parallax,
    parallaxStrength,
  ]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{ mixBlendMode }}
      aria-hidden="true"
    />
  );
}

// ==========================================
// SERVICE CARD (3-col grid — vertical layout)
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
      animated={false}
      colors={['#c084fc', '#f472b6', '#38bdf8']}
      className="h-full"
    >
      <article itemScope itemType="https://schema.org/Service" className="flex flex-col h-full">
        {/* Image — top, fixed aspect for grid */}
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

        {/* Text content */}
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
// MAIN SERVICES SECTION
// ==========================================
export default function Services() {
  const sectionRef = useRef(null);
  const isVisible = useSectionVisible(sectionRef);

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
      ref={sectionRef}
      id="services"
      className="relative w-full bg-[#030108] text-white py-20 sm:py-24 overflow-hidden"
      aria-labelledby="services-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Dark base + FloatingLines background */}
      <div className="absolute inset-0 z-0 bg-[#030108]" aria-hidden="true" />
      <div className="absolute inset-0 z-0 opacity-50 sm:opacity-60 md:opacity-65">
        <FloatingLines
          active={isVisible}
          linesGradient={['#2e1065', '#4c1d95', '#6d28d9', '#7c3aed', '#a855f7', '#38bdf8']}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[8, 12, 16]}
          lineDistance={[10, 8, 6]}
          animationSpeed={0.7}
          interactive={true}
          bendRadius={5.0}
          bendStrength={-0.4}
          parallax={true}
          parallaxStrength={0.15}
          mixBlendMode="screen"
        />
      </div>
      <div
        className="absolute inset-0 z-[1] pointer-events-none bg-[#030108]/82 sm:bg-[#030108]/78"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Cards grid — 1 / 2 / 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {SERVICES_DATA.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
