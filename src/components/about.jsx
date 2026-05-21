"use client";

import React, { useEffect, useRef, memo } from "react";
import Image from "next/image";
import StarBorder from "@/components/StarBorder";
import { useSectionVisible } from "@/lib/useSectionVisible";
import { scrollToSectionId } from "@/lib/navScroll";

// ==========================================
// 1. DotField Background (Optimized)
// ==========================================

// ==========================================
// 2. About Section
// ==========================================
export default function About() {
  const sectionRef = useRef(null);
  const isVisible = useSectionVisible(sectionRef);
  const profileImg =
    "https://res.cloudinary.com/dsga4gyw9/image/upload/v1778241339/WhatsApp_Image_2026-05-03_at_8.31.37_PM_nh3ddd.jpg";

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-[#03000a] text-white py-24 px-6 md:px-12 lg:px-20 overflow-hidden scroll-mt-28"
    >
      <div className="container max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left: Image Container (Optimized with Next/Image) */}
        <div className="flex justify-center items-center">
          <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 transition-transform duration-500 hover:scale-[1.02]">
            <Image
              src={profileImg}
              alt="Md Sefat Ullah Fahad"
              layout="intrinsic"
              width={420}
              height={525}
              priority
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="space-y-6">
          <div>
            <h3 className="text-purple-400 font-bold uppercase tracking-[0.2em] text-xs mb-3">
              About My Journey
            </h3>
            <h2 className="text-4xl md:text-5xl font-black">
              Full-Stack Developer <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                & Accountant
              </span>
            </h2>
          </div>

          <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-purple-500 pl-6">
            I am <strong className="text-white">Md Sefat Ullah Fahad</strong>,
            bridging the logic of code with the precision of finance at{" "}
            <span className="text-blue-400 font-semibold">Experivia</span>. I
            build scalable web apps while managing complex financial workflows
            with absolute precision.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all">
              <h4 className="text-purple-400 font-bold text-sm mb-1">
                Academic Background
              </h4>
              <p className="text-xs text-gray-400">
                Alim 2nd Year student, mastering the balance of Islamic studies
                and technical discipline.
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all">
              <h4 className="text-blue-400 font-bold text-sm mb-1">
                Dev Philosophy
              </h4>
              <p className="text-xs text-gray-400">
                Tech-agnostic, performance-focused, and obsessed with turning
                complex logic into smooth UI/UX.
              </p>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <StarBorder
              as="a"
              href="#contact"
              color="#a855f7"
              speed="5s"
              className="rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                scrollToSectionId("contact");
              }}
            >
              {/* <span className="block px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-purple-500 hover:text-white transition-all shadow-lg hover:shadow-purple-500/20">
                Work With Me
              </span> */}
            </StarBorder>
          </div>
        </div>
      </div>
    </section>
  );
}
