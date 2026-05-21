import About from "@/components/about";
import Hero from "@/components/hero";
// import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Hero></Hero>
      <About></About>
      <TechStack></TechStack>
      {/* <Services></Services> */}
    </main>
  );
}
