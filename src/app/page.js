import dynamic from "next/dynamic";
import Hero from "@/components/hero";

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
      <About></About>
      <TechStack></TechStack>
      <Services></Services>
    </main>
  );
}
