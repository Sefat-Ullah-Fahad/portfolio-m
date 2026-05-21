import React from "react";
import Image from "next/image";
import StarBorder from "@/components/StarBorder";

const projectsData = [
  {
    id: 1,
    title: "Zero Olympiad",
    shortDescription: "Zero Olympiad empowers students to become Global Citizens by mastering the UN's 17 SDGs. From Zero Poverty to Zero Hunger, we prepare future leaders.",
    screenshot: "https://res.cloudinary.com/dsga4gyw9/image/upload/v1779348906/Zero-Olympiad-Cultivating-Global-Leaders-from-Bangladesh-05-21-2026_01_22_PM_jjcs6w.png",
    url: "https://www.zeroolympiad.com/",
    role: "Full-Stack Developer",
    duration: "4 Weeks",
    highlights: [
      "Clean and modern UI with fluid dark aesthetics",
      "Robust state management and authentication",
      "Optimized for global performance & SEO scaling"
    ],
    technologies: ["Next.js", "Tailwind", "NextAuth.js", "Redux Toolkit", "GSAP", "Framer Motion", "Node.js", "Express.js", "Supabase"]
  },
  {
    id: 2,
    title: "GLTS : Global Leadership",
    shortDescription: "Transform your potential into global excellence with GLTS by Faatiha Aayat. An exclusive professional development program for strategic leadership and public speaking.",
    screenshot: "https://res.cloudinary.com/dsga4gyw9/image/upload/v1779348881/GLTS-Global-Leadership-Training-Skills-Faatiha-Aayat-05-21-2026_01_23_PM_gdwluf.png",
    url: "https://glts.faatihaaayat.com/",
    role: "Full-Stack Developer",
    duration: "3 Weeks",
    highlights: [
      "Interactive UI/UX with smooth scroll animations",
      "Secure backend architecture with custom middleware",
      "Dynamic data binding and responsive scaling"
    ],
    technologies: ["Next.js", "Tailwind", "Supabase Auth", "Redux Toolkit", "GSAP", "Framer Motion", "Node.js", "Express.js", "Supabase"]
  }
];

export default function ProjectSection() {
  return (
    <section id="projects" className="bg-[#07080d] py-24 px-4 sm:px-6 lg:px-8 min-h-screen text-white scroll-mt-28">
      <div className="max-w-7xl w-full mx-auto">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
           <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-purple-500"></div>
            <span className="text-sm font-bold tracking-widest text-purple-400 uppercase bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full">
              My Project
            </span>
            </div>
          <h2 className="text-3xl lg:text-5xl font-bold mt-4 tracking-tight">
            Featured <span className="bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#ec4899] bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-[#94a3b8] mt-3 text-base max-w-xl">
            A curated selection of my recent full-stack applications, blending complex logic with sleek user experiences.
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {projectsData.map((project) => (
            <div 
              key={project.id}
              className="group relative flex flex-col md:flex-row bg-[#111322] border border-white/[0.04] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/[0.08] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(139,92,246,0.05)]"
            >
              {/* Left Side: Info Content (All Techs Added Here Now) */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between relative z-10 md:w-1/2">
                <div>
                  <span className="text-[10px] tracking-wider uppercase font-bold text-[#ec4899] bg-[#ec4899]/10 px-2.5 py-1 rounded-md border border-[#ec4899]/20">
                    Featured Project
                  </span>
                  
                  <h3 className="text-2xl font-bold mt-4 tracking-tight text-white group-hover:text-[#d946ef] transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  {/* Neon Divider Line */}
                  <div className="w-10 h-[2px] bg-gradient-to-r from-[#6366f1] to-[#ec4899] my-4" />
                  
                  <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
                    {project.shortDescription}
                  </p>

                  {/* Role & Duration */}
                  <div className="grid grid-cols-2 gap-4 py-4 my-4 border-t border-b border-white/[0.05]">
                    <div>
                      <p className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">Role</p>
                      <p className="text-xs font-medium text-slate-200 mt-1">{project.role}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">Duration</p>
                      <p className="text-xs font-medium text-slate-200 mt-1">{project.duration}</p>
                    </div>
                  </div>

                  {/* Project Highlights Checklist */}
                  <ul className="space-y-2 mb-5">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <svg className="w-4 h-4 text-[#a855f7] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="line-clamp-1">{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies Used Section (Moved to Left Side Properly) */}
                  <div className="mb-6 pt-2">
                    <p className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold mb-2.5">
                      Technologies Used
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] bg-[#1e1b4b]/40 text-slate-300 px-2 py-1 rounded border border-white/[0.05] font-medium transition-all duration-300 group-hover:border-[#a855f7]/30 hover:text-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* View Project Button */}
                <StarBorder
                  as="a"
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  color="#6366f1"
                  speed="5s"
                  className="rounded-xl w-full sm:w-auto"
                >
                  <span className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-xs font-medium bg-[#1e1b4b] hover:bg-gradient-to-r hover:from-[#6366f1] hover:to-[#a855f7] border border-[#4338ca] hover:border-transparent text-white rounded-xl transition-all duration-300 shadow-lg group/btn">
                    View Project
                    <svg className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </StarBorder>
              </div>

              {/* Right Side: Clean Image Container */}
              <div className="relative md:w-1/2 min-h-[250px] sm:min-h-[350px] bg-[#0c0d16] p-4 flex items-center justify-center group-hover:bg-[#0f101b] transition-colors duration-300">
                {/* Background Gradient Accent */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6366f1]/10 via-transparent to-[#ec4899]/5 opacity-60 pointer-events-none" />
                
                {/* Image Frame */}
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/[0.05] transition-transform duration-500 group-hover:scale-[1.01] shadow-2xl">
                  <Image 
                    src={project.screenshot} 
                    alt={`${project.title} Screenshot`}
                    fill
                    sizes="(max-w-768px) 100vw, 50vw"
                    className="object-cover object-top filter brightness-[0.85] group-hover:brightness-100 transition-all duration-300"
                  />
                </div>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}