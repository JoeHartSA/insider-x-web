"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SceneFrame } from "@/components/three/SceneFrame";
import { KineticHeading } from "@/components/ui/KineticHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { VENUES, type Venue } from "@/content/venues";

const ConstellationGraph = dynamic(
  () => import("@/components/three/ConstellationGraph").then((m) => m.ConstellationGraph),
  { ssr: false },
);

const CATEGORY_LABEL: Record<Venue["category"], string> = {
  amm: "AMM",
  perps: "Perps",
  memes: "Memes",
  aggregator: "Aggregator",
  orderbook: "CLOB",
};

export function Markets() {
  const [hovered, setHovered] = useState<Venue | null>(null);

  return (
    <section
      id="markets"
      className="relative isolate w-full overflow-hidden bg-[color:var(--color-ix-bg)] py-32"
      aria-label="Markets covered"
    >
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1fr]">
        <header className="flex flex-col justify-center gap-5">
          <span className="eyebrow">04 · Markets</span>
          <KineticHeading
            as="h2"
            text="Every corner of Solana, on one ledger."
            highlight="one ledger."
            highlightClassName="gradient-text-fleet"
            className="display-2 max-w-[18ch]"
          />
          <p className="max-w-[55ch] text-pretty text-[color:var(--color-ix-fg-muted)]">
            We don&apos;t just route to the popular AMMs. We&apos;re wired into pump.fun bonds,
            Raydium pools, Meteora dynamic vaults, Jupiter routing, Drift perpetuals, Phoenix
            order books, and the long tail beyond. Every order picks the best path automatically.
          </p>

          {/* Hover detail panel */}
          <GlassCard className="mt-2 p-5">
            {hovered ? (
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="eyebrow">{CATEGORY_LABEL[hovered.category]}</div>
                  <h3 className="display-3 mt-1 text-white">{hovered.name}</h3>
                </div>
                <div className="text-right">
                  <div className="eyebrow opacity-70">24h volume</div>
                  <div className="numerals-tabular font-mono text-2xl text-[color:var(--color-ix-cyan)]">
                    {hovered.vol24h}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-6 text-sm text-[color:var(--color-ix-fg-dim)]">
                <span>Hover a node to inspect a venue</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
                  {VENUES.length} integrated
                </span>
              </div>
            )}

            {/* Category legend */}
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-[color:var(--color-ix-fg-muted)]">
              {Object.entries(CATEGORY_LABEL).map(([k, label]) => {
                const color =
                  k === "amm"
                    ? "#5be9ff"
                    : k === "perps"
                    ? "#ff49c8"
                    : k === "memes"
                    ? "#ffd166"
                    : k === "aggregator"
                    ? "#7b5bff"
                    : "#2bff9a";
                return (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-ix-border)] px-2 py-1"
                  >
                    <span className="size-1.5 rounded-full" style={{ background: color }} />
                    {label}
                  </span>
                );
              })}
            </div>
          </GlassCard>
        </header>

        {/* Constellation scene — desktop only, the SceneFrame chunk is
            skipped entirely on mobile (mobile gets the accordion below). */}
        <div className="relative hidden h-[640px] w-full overflow-hidden rounded-[var(--radius-xl)] lg:block">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(123,91,255,0.18), transparent 70%)",
            }}
          />
          <SceneFrame
            className="h-full w-full"
            camera={{ position: [0, 0, 7], fov: 45 }}
            fallback={<div className="aurora-fallback h-full w-full" />}
          >
            <color attach="background" args={["#06010c"]} />
            <ambientLight intensity={0.6} />
            <ConstellationGraph onHover={setHovered} />
          </SceneFrame>
        </div>
      </div>

      {/* Mobile accordion list */}
      <div className="mx-auto mt-12 grid w-full max-w-[1400px] gap-3 px-5 sm:px-8 lg:hidden">
        {VENUES.map((v) => (
          <div
            key={v.id}
            className="flex items-center justify-between rounded-2xl border border-[color:var(--color-ix-border)] bg-[color:var(--color-ix-surface)]/40 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className="size-2 rounded-full"
                style={{
                  background:
                    v.category === "amm"
                      ? "#5be9ff"
                      : v.category === "perps"
                      ? "#ff49c8"
                      : v.category === "memes"
                      ? "#ffd166"
                      : v.category === "aggregator"
                      ? "#7b5bff"
                      : "#2bff9a",
                }}
              />
              <div>
                <div className="text-sm text-white">{v.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ix-fg-dim)]">
                  {CATEGORY_LABEL[v.category]}
                </div>
              </div>
            </div>
            <div className="font-mono text-xs text-[color:var(--color-ix-cyan)]">{v.vol24h}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
