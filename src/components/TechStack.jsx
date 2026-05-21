'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';

// Real Icons Import (HTML & CSS fixed via FontAwesome for absolute stability)
import { FaHtml5, FaCss3Alt } from "react-icons/fa";
import { 
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiVuedotjs,
  SiTailwindcss, SiBootstrap, SiNodedotjs, SiExpress, SiMongodb, SiSupabase, SiMysql,
  SiGreensock, SiFramer, SiRedux, SiGraphql, SiFirebase, SiGit, 
  SiDocker, SiFigma, SiVercel, SiWordpress, SiJsonwebtokens
} from 'react-icons/si';
import { TbApi } from "react-icons/tb";

// ==========================================
// 1. SHADER CODE FOR THREADS BACKGROUND
// ==========================================
const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;

#define PI 3.1415926538

const int u_line_count = 40;
const float u_line_width = 7.0;
const float u_line_blur = 10.0;

float Perlin2D(vec2 P) {
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
    vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    Pt += vec2(26.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
    grad_results *= 1.4142135623730950;
    vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
               * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
    vec4 blend2 = vec4(blend, vec2(1.0 - blend));
    return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
    return (1.0 / max(resolution.x, resolution.y)) * count;
}

float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
    float split_offset = (perc * 0.4);
    float split_point = 0.1 + split_offset;

    float amplitude_normal = smoothstep(split_point, 0.7, st.x);
    float amplitude_strength = 0.5;
    float finalAmplitude = amplitude_normal * amplitude_strength
                           * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

    float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
    float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;

    float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
        st.x * 0.3
    );

    float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;

    float line_start = smoothstep(
        y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        y,
        st.y
    );

    float line_end = smoothstep(
        y,
        y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        st.y
    );

    return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0,
        1.0
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;

    float line_strength = 1.0;
    for (int i = 0; i < u_line_count; i++) {
        float p = float(i) / float(u_line_count);
        line_strength *= (1.0 - lineFn(
            uv,
            u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
            p,
            (PI * 1.0) * p,
            uMouse,
            iTime,
            uAmplitude,
            uDistance
        ));
    }

    float colorVal = 1.0 - line_strength;
    fragColor = vec4(uColor * colorVal, colorVal);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

// ==========================================
// 2. INTERNAL THREADS COMPONENT
// ==========================================
const Threads = ({ color = [1, 1, 1], amplitude = 1, distance = 0, enableMouseInteraction = false, ...rest }) => {
  const containerRef = useRef(null);
  const animationFrameId = useRef();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
        },
        uColor: { value: new Color(...color) },
        uAmplitude: { value: amplitude },
        uDistance: { value: distance },
        uMouse: { value: new Float32Array([0.5, 0.5]) }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      program.uniforms.iResolution.value.r = clientWidth;
      program.uniforms.iResolution.value.g = clientHeight;
      program.uniforms.iResolution.value.b = clientWidth / clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    let currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];

    function handleMouseMove(e) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse = [x, y];
    }
    function handleMouseLeave() {
      targetMouse = [0.5, 0.5];
    }
    if (enableMouseInteraction) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    function update(t) {
      if (enableMouseInteraction) {
        const smoothing = 0.05;
        currentMouse[0] += smoothing * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += smoothing * (targetMouse[1] - currentMouse[1]);
        program.uniforms.uMouse.value[0] = currentMouse[0];
        program.uniforms.uMouse.value[1] = currentMouse[1];
      } else {
        program.uniforms.uMouse.value[0] = 0.5;
        program.uniforms.uMouse.value[1] = 0.5;
      }
      program.uniforms.iTime.value = t * 0.001;

      renderer.render({ scene: mesh });
      animationFrameId.current = requestAnimationFrame(update);
    }
    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', resize);

      if (enableMouseInteraction) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [color, amplitude, distance, enableMouseInteraction]);

  return <div ref={containerRef} className="w-full h-full relative" {...rest} />;
};

// ==========================================
// 3. SKILLS DATA (Real brand colors mapped)
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
  { name: 'Framer Motion', icon: SiFramer, color: '#0055FF' },
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

const skillCardClassName =
  'group relative flex flex-col items-center justify-center h-28 md:h-32 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/5 hover:bg-white/[0.08] hover:border-white/15 hover:shadow-[0_0_40px_-5px_rgba(147,51,234,0.25)] transition-all duration-300 cursor-pointer overflow-hidden';

// ==========================================
// 4. MAIN EXPORT COMPONENT
// ==========================================
export default function TechStack() {
  return (
    <section id="stack" className="relative w-full min-h-screen bg-[#030108] text-white py-24 px-4 md:px-8 overflow-hidden z-10 flex flex-col justify-center">
      
      {/* Background Threads Layer using exact configuration requested */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Threads
          amplitude={3.2}
          distance={0.5}
          enableMouseInteraction={true}
          color={[1, 1, 1]} 
        />
      </div>

      {/* Main Container Layout Box */}
      <div className="max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        
        {/* Header Section */}
        <div className="mb-20 pointer-events-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-purple-500"></div>
            <span className="text-sm font-bold tracking-widest text-purple-400 uppercase bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full">
              Tech Stack
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Technologies I <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Work With</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl text-base md:text-lg">
            A curated set of modern technologies I use to build production-grade, fast, scalable, and user-friendly web applications.
          </p>
        </div>

        {/* Fully Responsive Grid Layout (Original Color Icons) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6 pointer-events-auto">
          {techSkills.map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.02 }}
              >
                <div className={skillCardClassName}>
                  {/* Brand Icon Component (Always colorful & visible) */}
                  <div className="transform transition-all duration-300 group-hover:-translate-y-3 group-hover:scale-110">
                    <IconComponent
                      style={{ color: skill.color }}
                      className="w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-95 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>

                  {/* Text Label revealed on hover */}
                  <div className="absolute bottom-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-xs md:text-sm font-medium text-purple-200 tracking-wide">
                      {skill.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}