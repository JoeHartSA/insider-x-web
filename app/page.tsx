import { Hero } from "@/components/sections/Hero";
import { SpeedShowdown } from "@/components/sections/SpeedShowdown";
import { Fleet500 } from "@/components/sections/Fleet500";
import { FleetMobile } from "@/components/sections/FleetMobile";
import { Markets } from "@/components/sections/Markets";
import { Features } from "@/components/sections/Features";
import { Rewards } from "@/components/sections/Rewards";
import { Stats } from "@/components/sections/Stats";
import { Comparison } from "@/components/sections/Comparison";
import { Security } from "@/components/sections/Security";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { CtaFinal } from "@/components/sections/CtaFinal";

export default function Home() {
  return (
    <>
      <Hero />
      <SpeedShowdown />
      <Fleet500 />
      <FleetMobile />
      <Markets />
      <Features />
      <Rewards />
      <Stats />
      <Comparison />
      <Security />
      <Testimonials />
      <Faq />
      <CtaFinal />
    </>
  );
}
