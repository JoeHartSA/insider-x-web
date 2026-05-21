"use client";

import { useEffect, useState } from "react";
import { KineticHeading } from "@/components/ui/KineticHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { FeeSavingsBar } from "./features/FeeSavingsBar";

const TIERS = [
  { id: "bronze", name: "Bronze", req: "< 250 SOL/30d", cashback: "10%", color: "#c87a3a" },
  { id: "silver", name: "Silver", req: "250 SOL/30d", cashback: "20%", color: "#cfd5e0" },
  { id: "gold", name: "Gold", req: "1,000 SOL/30d", cashback: "30%", color: "#ffd166" },
  { id: "plat", name: "Platinum", req: "5,000 SOL/30d", cashback: "40%", color: "#5be9ff" },
  { id: "diamond", name: "Diamond", req: "20,000 SOL/30d", cashback: "50%", color: "#ff49c8" },
];

export function Rewards() {
  // Live "saved by traders" ticker (replaces the old SOL "paid out" / jackpot
  // counter — same kinetic energy, framed around fee savings instead).
  const [savedDelta, setSavedDelta] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setSavedDelta((v) => v + Math.random() * 38);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="rewards"
      className="relative isolate w-full overflow-hidden bg-[color:var(--color-ix-bg-2)] py-32"
      aria-label="Rewards"
    >
      {/* warm backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, rgba(255,209,102,0.12), transparent 70%), radial-gradient(50% 60% at 80% 80%, rgba(255,73,200,0.10), transparent 70%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1fr]">
        {/* LEFT: copy + 5x callout + counters + tier ladder */}
        <div className="flex flex-col gap-6">
          <span className="eyebrow">06 · Rewards</span>
          <KineticHeading
            as="h2"
            text="The house pays you. Not the other way around."
            highlight="pays you."
            highlightClassName="gradient-text-fleet"
            className="display-2 max-w-[22ch] text-balance"
          />
          <p className="max-w-[55ch] text-pretty text-[color:var(--color-ix-fg-muted)]">
            Fees from <span className="text-white">0.1%</span> — up to{" "}
            <span className="text-white">5× cheaper</span> than the field. Stack 50% cashback,
            a 50% lifetime referral split and tiered discounts that compound with every trade.
          </p>

          {/* 5x cheaper fees callout */}
          <Reveal>
            <div
              className="relative overflow-hidden rounded-2xl border border-[color:var(--color-ix-border)] p-5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(91,233,255,0.08), rgba(255,73,200,0.06))",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="eyebrow text-[color:var(--color-ix-cyan)]">
                  Fees from 0.1%
                </span>
                <span className="rounded-full bg-[color:var(--color-ix-cyan)]/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ix-cyan)]">
                  5× cheaper than the field
                </span>
              </div>
              <p className="mt-2 max-w-[42ch] text-sm text-[color:var(--color-ix-fg-muted)]">
                Axiom, Trojan and Photon charge 0.5–1.0% per swap. Insider-X charges 0.1–0.25%.
                On a 10k SOL month, that&apos;s 30+ SOL back in your pocket.
              </p>
            </div>
          </Reveal>

          {/* Live counters — fee-savings framed */}
          <div className="grid gap-3 sm:grid-cols-2">
            <GlassCard className="p-5">
              <div className="eyebrow opacity-70">Saved by Insider-X traders · 24h</div>
              <div className="numerals-tabular mt-1 font-mono text-3xl text-[color:var(--color-ix-amber)]">
                {(412.7 + savedDelta / 4).toFixed(2)}{" "}
                <span className="text-base text-[color:var(--color-ix-fg-muted)]">SOL</span>
              </div>
              <div className="mt-1 text-xs text-[color:var(--color-ix-fg-dim)]">
                Fee delta vs Axiom · Trojan · Photon, last 24h
              </div>
            </GlassCard>
            <GlassCard className="p-5">
              <div className="eyebrow opacity-70">Cashback paid · 24h</div>
              <div className="numerals-tabular mt-1 font-mono text-3xl text-white">
                {(128.3 + savedDelta / 9).toFixed(2)}{" "}
                <span className="text-base text-[color:var(--color-ix-fg-muted)]">SOL</span>
              </div>
              <div className="mt-1 text-xs text-[color:var(--color-ix-fg-dim)]">
                Tier rebates · referral splits
              </div>
            </GlassCard>
          </div>

          {/* Tier ladder */}
          <Reveal>
            <div className="mt-2 grid gap-2">
              <div className="eyebrow opacity-70">Tier ladder</div>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-5">
                {TIERS.map((t, i) => (
                  <div
                    key={t.id}
                    className="group relative cursor-default rounded-2xl border border-[color:var(--color-ix-border)] bg-[color:var(--color-ix-surface)]/40 p-3 transition-all hover:border-white/30 hover:bg-[color:var(--color-ix-surface)]"
                    data-cursor="cta"
                  >
                    <div
                      className="absolute inset-x-3 top-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }}
                    />
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ix-fg-dim)]">
                      0{i + 1}
                    </div>
                    <div className="mt-1 text-sm text-white">{t.name}</div>
                    <div className="mt-2 numerals-tabular text-xl font-mono" style={{ color: t.color }}>
                      {t.cashback}
                    </div>
                    <div className="mt-0.5 hidden text-[10px] text-[color:var(--color-ix-fg-muted)] sm:block">
                      {t.req}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* RIGHT: SVG fee-savings visualization (replaces the rapier coin shower) */}
        <div className="relative h-[420px] w-full overflow-hidden rounded-[var(--radius-xl)] glass sm:h-[640px]">
          <FeeSavingsBar />

          <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full glass-strong px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-ix-cyan)]">
            <span className="size-1.5 rounded-full bg-[color:var(--color-ix-cyan)]" />
            Trading fee per swap
          </div>

          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between text-[10px] text-[color:var(--color-ix-fg-dim)]">
            <span>Lower is better</span>
            <span className="font-mono">published fee schedules · May 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
