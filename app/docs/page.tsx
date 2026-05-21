import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Docs",
  description: "Insider-X developer documentation, SDK, and API reference.",
};

const TOPICS = [
  {
    title: "Getting started",
    summary: "Install, authenticate, fire your first 50 wallets in 10 minutes.",
    href: "#",
  },
  {
    title: "Fleet API",
    summary: "Programmatic control of every wallet, group, and order.",
    href: "#",
  },
  {
    title: "Order graphs",
    summary: "Compose limit, DCA, and trailing into a single signed graph.",
    href: "#",
  },
  {
    title: "MEV protection",
    summary: "How private bundles and decoys work under the hood.",
    href: "#",
  },
  {
    title: "Speed benchmarks",
    summary: "Reproducible methodology + raw 30-day trace dumps.",
    href: "#",
  },
  {
    title: "Webhooks & events",
    summary: "Subscribe to fills, liquidations, fee-rebate events.",
    href: "#",
  },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Docs"
        title="Read the manual. Then ignore it."
        highlight="manual."
        subtitle="Everything you need to wire Insider-X into your stack. We're still finalising the public docs — early-access readers get a private link with full source."
      />
      <section className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              data-cursor="cta"
              className="group block"
            >
              <GlassCard className="h-full p-6 transition-all group-hover:border-[color:var(--color-ix-cyan)]/40">
                <div className="flex items-center justify-between">
                  <h3 className="text-base text-white">{t.title}</h3>
                  <span className="text-[color:var(--color-ix-fg-dim)] transition-transform group-hover:translate-x-1 group-hover:text-[color:var(--color-ix-cyan)]">
                    →
                  </span>
                </div>
                <p className="mt-2 text-sm text-[color:var(--color-ix-fg-muted)]">{t.summary}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
