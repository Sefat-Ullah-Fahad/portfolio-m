import dynamic from "next/dynamic";
import Hero from "@/components/hero";

const StatsSection = dynamic(() => import("@/components/StatsSection"), {
  loading: () => null,
});

const About = dynamic(() => import("@/components/about"), {
  loading: () => null,
});

const TechStack = dynamic(() => import("@/components/TechStack"), {
  loading: () => null,
});

const Services = dynamic(() => import("@/components/Services"), {
  loading: () => null,
});

const ProjectSection = dynamic(() => import("@/components/ProjectSection"), {
  loading: () => null,
});

const ExperienceTimeline = dynamic(() => import("@/components/ExperienceTimeline"), {
  loading: () => null,
});

const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => null,
});

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsSection />
      <About />
      <TechStack />
      <Services />
      <ProjectSection />
      <ExperienceTimeline />
      <Contact />
    </main>
  );
}
