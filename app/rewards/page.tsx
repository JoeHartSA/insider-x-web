import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Rewards } from "@/components/sections/Rewards";
import { Comparison } from "@/components/sections/Comparison";
import { CtaFinal } from "@/components/sections/CtaFinal";

export const metadata: Metadata = {
  title: "Rewards",
  description:
    "Fees from 0.1% — up to 5× cheaper than the field. Stack 50% cashback, a 50% lifetime referral split and tiered discounts that compound with every trade.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Rewards"
        title="The house pays you."
        highlight="pays you."
        subtitle="Fees from 0.1% — up to 5× cheaper than the field. Cashback ladders and referral splits that compound with your volume."
      />
      <Rewards />
      <Comparison />
      <CtaFinal />
    </>
  );
}
