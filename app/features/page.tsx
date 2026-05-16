import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Features } from "@/components/sections/Features";
import { Comparison } from "@/components/sections/Comparison";
import { CtaFinal } from "@/components/sections/CtaFinal";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Multi-wallet command center, sniper engine with MEV shield, advanced order types — every Insider-X capability in one place.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Every weapon. One cockpit."
        highlight="One cockpit."
        subtitle="The full Insider-X toolkit — multi-wallet command, sniping, MEV shielding, and on-chain advanced orders."
      />
      <Features />
      <Comparison />
      <CtaFinal />
    </>
  );
}
