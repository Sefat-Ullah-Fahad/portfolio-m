import React from "react";

const statsData = [
  { id: 1, number: "15+", label: "Projects Completed" },
  { id: 2, number: "8+", label: "Happy Clients" },
  { id: 3, number: "1+", label: "Years of Experience" },
  { id: 4, number: "12+", label: "Technologies Mastered" },
  { id: 5, number: "500+", label: "GitHub Contributions" },
];

export default function StatsSection() {
  return (
    <section id="skills" className="bg-[#07080d] py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center scroll-mt-28">
      <div className="max-w-7xl w-full mx-auto">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              className="group relative overflow-hidden rounded-2xl bg-[#111322] border border-white/[0.04] p-6 min-h-[160px] flex flex-col items-center justify-center text-center transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-white/[0.08] hover:shadow-[0_15px_30px_rgba(139,92,246,0.1)]"
            >
              {/* Top Gradient Border Line (100% Match) */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899]" />

              {/* Subtle Background SVG Pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-300">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern
                      id={`dot-${stat.id}`}
                      x="0"
                      y="0"
                      width="16"
                      height="16"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="2" cy="2" r="1" fill="#ffffff" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#dot-${stat.id})`} />
                </svg>
              </div>

              {/* Hover Glow Effect Layer */}
              <div className="absolute -inset-px bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

              {/* Card Content */}
              <div className="relative z-10">
                {/* Gradient Number */}
                <h3 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#ec4899] bg-clip-text text-transparent mb-3 select-none">
                  {stat.number}
                </h3>
                {/* Description Label */}
                <p className="text-sm lg:text-base text-[#94a3b8] font-medium tracking-wide group-hover:text-[#cbd5e1] transition-colors duration-300">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}