'use client';

import StarBorder from '@/components/StarBorder';
import { SITE } from '@/lib/site';

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative w-full bg-[#030108] text-white py-20 sm:py-24 px-4 sm:px-6 scroll-mt-28"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="contact-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Let&apos;s{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Work Together
          </span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-base md:text-lg mb-8">
          Have a project in mind? Reach out and let&apos;s build something fast, scalable, and impactful.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl mx-auto">
          <StarBorder
            as="a"
            href={`mailto:${SITE.email}`}
            color="#c084fc"
            speed="5s"
            className="rounded-full w-full sm:w-auto"
          >
            <span className="block px-8 py-3.5 bg-white text-black font-bold rounded-full hover:bg-purple-500 hover:text-white transition-all shadow-lg text-center text-sm sm:text-base break-all sm:break-normal">
              {SITE.email}
            </span>
          </StarBorder>
          <StarBorder
            as="a"
            href={`tel:${SITE.phone.replace(/\s/g, '')}`}
            color="#a855f7"
            speed="5s"
            className="rounded-full w-full sm:w-auto"
          >
            <span className="block px-8 py-3.5 border border-white/20 text-white font-semibold rounded-full hover:border-purple-500/50 hover:bg-purple-500/10 transition-all text-center">
              {SITE.phone}
            </span>
          </StarBorder>
        </div>
      </div>
    </section>
  );
}
