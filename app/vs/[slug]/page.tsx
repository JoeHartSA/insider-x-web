import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VS_PAGES } from "@/content/vs";
import { PageHero } from "@/components/layout/PageHero";
import { SpeedShowdown } from "@/components/sections/SpeedShowdown";
import { Comparison } from "@/components/sections/Comparison";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(VS_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = VS_PAGES[slug];
  if (!page) return {};
  return {
    title: `Insider-X vs ${page.competitor}`,
    description: `How Insider-X compares to ${page.competitor} on speed, parallel wallets, cashback, MEV protection, and order types.`,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = VS_PAGES[slug];
  if (!page) notFound();

  return (
    <>
      <PageHero
        eyebrow={`vs ${page.competitor}`}
        title={`Insider-X vs ${page.competitor}.`}
        highlight={`vs ${page.competitor}`}
        subtitle={page.tagline}
      />

      <section className="relative w-full bg-[color:var(--color-ix-bg)] py-24">
        <div className="mx-auto grid w-full max-w-[1400px] gap-6 px-5 sm:grid-cols-2 sm:px-8">
          {page.bullets.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <GlassCard className="h-full p-7">
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-ix-cyan)]">
                  {String(i + 1).padStart(2, "0")} · Edge
                </div>
                <h3 className="display-3 mt-2 text-white">{b.title}</h3>
                <p className="mt-3 text-pretty text-[color:var(--color-ix-fg-muted)]">{b.copy}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <SpeedShowdown />
      <Comparison />
      <CtaFinal />
    </>
  );
}
