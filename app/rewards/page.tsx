import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Rewards } from "@/components/sections/Rewards";
import { Comparison } from "@/components/sections/Comparison";
import { CtaFinal } from "@/components/sections/CtaFinal";

export const metadata: Metadata = {
  title: "Rewards",
  description:
    "Up to 50% cashback, 50% lifetime referral split, and a daily SOL jackpot. The house pays you on Insider-X.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Rewards"
        title="The house pays you."
        highlight="pays you."
        subtitle="Cashback ladders, referral splits, and a SOL jackpot paid at midnight UTC every day."
      />
      <Rewards />
      <Comparison />
      <CtaFinal />
    </>
  );
}
