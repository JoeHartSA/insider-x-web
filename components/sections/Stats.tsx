"use client";

import { SplitFlapNumber } from "@/components/ui/SplitFlapNumber";
import { Reveal } from "@/components/ui/Reveal";

const TILES = [
  { label: "Tokens routed", value: "1,284,392", suffix: "" },
  { label: "Wallets connected", value: "92,481", suffix: "" },
  { label: "24h volume", value: "418", suffix: "M" },
  { label: "Median fill", value: "184", suffix: "ms" },
];

export function Stats() {
  return (
    <section className="relative w-full overflow-hidden border-y border-[color:var(--color-ix-border)] bg-[color:var(--color-ix-bg)] py-24">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow text-center">Live across the platform</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {TILES.map((t) => (
            <div key={t.label} className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-ix-fg-dim)]">
                {t.label}
              </div>
              <SplitFlapNumber
                className="mt-3 inline-block font-display text-5xl font-medium text-white sm:text-6xl"
                value={t.value}
                suffix={t.suffix}
                duration={1.6}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
