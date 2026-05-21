import { Hero } from "@/components/sections/Hero";
import { SpeedShowdown } from "@/components/sections/SpeedShowdown";
import { Fleet500 } from "@/components/sections/Fleet500";
import { FleetMobile } from "@/components/sections/FleetMobile";
import { RugProtection } from "@/components/sections/RugProtection";
import { Features } from "@/components/sections/Features";
import { Rewards } from "@/components/sections/Rewards";
import { Comparison } from "@/components/sections/Comparison";
import { Security } from "@/components/sections/Security";
import { Faq } from "@/components/sections/Faq";
import { CtaFinal } from "@/components/sections/CtaFinal";

export default function Home() {
  return (
    <>
      <Hero />
      <SpeedShowdown />
      <Fleet500 />
      <FleetMobile />
      <RugProtection />
      <Features />
      <Rewards />
      <Comparison />
      <Security />
      <Faq />
      <CtaFinal />
    </>
  );
}
