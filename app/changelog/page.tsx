import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What's new in Insider-X — every release, in one place.",
};

const ENTRIES = [
  {
    v: "0.9.4",
    date: "2026-05-12",
    notes: [
      "Fleet view now supports keyboard-driven multi-select (⌘+click + ⇧+arrow).",
      "MEV decoy fingerprint randomised on every order — bot-cluster detection up 38%.",
      "Median fill latency improved from 198ms → 184ms.",
    ],
  },
  {
    v: "0.9.3",
    date: "2026-04-29",
    notes: [
      "Added Drift & Zeta perpetuals routing.",
      "Daily SOL jackpot tier multipliers for Diamond rolled out.",
      "iOS Safari WebGL2 fallback for the Fleet scene.",
    ],
  },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Changelog"
        title="What's new on Insider-X."
        highlight="What's new"
        subtitle="Every shipped change, in one place."
      />
      <section className="mx-auto w-full max-w-[1000px] px-5 py-16 sm:px-8">
        <div className="space-y-4">
          {ENTRIES.map((e) => (
            <GlassCard key={e.v} className="p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-mono text-lg text-white">v{e.v}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-ix-fg-dim)]">
                  {e.date}
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-ix-fg-muted)]">
                {e.notes.map((n) => (
                  <li key={n} className="flex gap-3">
                    <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-[color:var(--color-ix-cyan)]" />
                    {n}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </section>
    </>
  );
}
