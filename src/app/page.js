import dynamic from "next/dynamic";
import Hero from "@/components/hero";
import StatsSection from "@/components/StatsSection";
import ProjectSection from "@/components/ProjectSection";
import ExperienceTimeline from "@/components/ExperienceTimeline";

const About = dynamic(() => import("@/components/about"), {
  loading: () => null,
});

const TechStack = dynamic(() => import("@/components/TechStack"), {
  loading: () => null,
});

const Services = dynamic(() => import("@/components/Services"), {
  loading: () => null,
});

export default function Home() {
  return (
    <main>
      <Hero></Hero>
      <StatsSection></StatsSection>
      <About></About>
      <TechStack></TechStack>
      <Services></Services>
      <ProjectSection></ProjectSection>
      <ExperienceTimeline></ExperienceTimeline>
    </main>
  );
}
