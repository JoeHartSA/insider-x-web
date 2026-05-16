"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { KineticHeading } from "@/components/ui/KineticHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { SceneFrame } from "@/components/three/SceneFrame";
import { detectDeviceTier, coinCount } from "@/lib/three/device-tier";
import { Reveal } from "@/components/ui/Reveal";
import { useIsMobile } from "@/lib/motion/use-is-mobile";

const CoinShowerScene = dynamic(
  () => import("@/components/three/CoinShower").then((m) => m.CoinShowerScene),
  { ssr: false },
);

/** Static SVG coin-shower poster used on mobile / when scene boots slowly. */
function CoinShowerPoster() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 100%, rgba(255,206,99,0.28), transparent 70%), radial-gradient(40% 50% at 100% 20%, rgba(255,73,200,0.18), transparent 70%), #0c0518",
        }}
      />
      {/* deterministic coin disks */}
      <svg viewBox="0 0 400 360" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="coin-g" cx="35%" cy="35%" r="65%">
            <stop offset="0" stopColor="#fff1c4" />
            <stop offset="0.4" stopColor="#ffce63" />
            <stop offset="1" stopColor="#7a4a00" />
          </radialGradient>
        </defs>
        {Array.from({ length: 40 }).map((_, i) => {
          const seed = (i * 9301 + 49297) % 233280;
          const r = seed / 233280;
          const x = 40 + r * 320;
          const y = 200 + Math.sin(i * 1.3) * 50 + (i % 5) * 12;
          const rad = 14 + ((i * 7) % 5);
          const rot = (r - 0.5) * 60;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
              <ellipse cx="0" cy="0" rx={rad} ry={rad * 0.92} fill="url(#coin-g)" />
              <ellipse cx="0" cy="-2" rx={rad - 5} ry={(rad - 5) * 0.85} fill="none" stroke="#a06b18" strokeWidth="0.6" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const TIERS = [
  { id: "bronze", name: "Bronze", req: "< 250 SOL/30d", cashback: "10%", color: "#c87a3a" },
  { id: "silver", name: "Silver", req: "250 SOL/30d", cashback: "20%", color: "#cfd5e0" },
  { id: "gold", name: "Gold", req: "1,000 SOL/30d", cashback: "30%", color: "#ffd166" },
  { id: "plat", name: "Platinum", req: "5,000 SOL/30d", cashback: "40%", color: "#5be9ff" },
  { id: "diamond", name: "Diamond", req: "20,000 SOL/30d", cashback: "50%", color: "#ff49c8" },
];

function useCountdown(secondsLeft: number) {
  const [t, setT] = useState(secondsLeft);
  useEffect(() => {
    setT(secondsLeft);
    const id = setInterval(() => setT((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return { h, m, s };
}

function getResetSeconds() {
  if (typeof window === "undefined") return 8 * 3600;
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(24, 0, 0, 0);
  return Math.max(60, Math.floor((+next - +now) / 1000));
}

export function Rewards() {
  const [tile, setTile] = useState(200);
  const [paidOut, setPaidOut] = useState(0);
  const { h, m, s } = useCountdown(getResetSeconds());
  const isMobile = useIsMobile();

  useEffect(() => {
    setTile(coinCount(detectDeviceTier()));
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setPaidOut((v) => v + Math.random() * 0.4);
    }, 1200);
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
            "radial-gradient(60% 60% at 50% 30%, rgba(255,209,102,0.15), transparent 70%), radial-gradient(50% 60% at 80% 80%, rgba(255,73,200,0.12), transparent 70%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1fr]">
        {/* LEFT: copy + tier ladder + jackpot */}
        <div className="flex flex-col gap-6">
          <span className="eyebrow">05 · Rewards</span>
          <KineticHeading
            as="h2"
            text="The house pays you. Not the other way around."
            highlight="pays you."
            highlightClassName="gradient-text-fleet"
            className="display-2 max-w-[22ch] text-balance"
          />
          <p className="max-w-[55ch] text-pretty text-[color:var(--color-ix-fg-muted)]">
            Up to 50% cashback. 50% lifetime referral split. A daily SOL jackpot funded by 5% of
            routing fees and paid out at midnight UTC. The more you trade, the louder the gold
            rains.
          </p>

          {/* Live counters */}
          <div className="grid gap-3 sm:grid-cols-2">
            <GlassCard className="p-5">
              <div className="eyebrow opacity-70">24h paid out</div>
              <div className="numerals-tabular mt-1 font-mono text-3xl text-[color:var(--color-ix-amber)]">
                {(412.7 + paidOut).toFixed(2)}{" "}
                <span className="text-base text-[color:var(--color-ix-fg-muted)]">SOL</span>
              </div>
              <div className="mt-1 text-xs text-[color:var(--color-ix-fg-dim)]">
                Across cashback · referrals · jackpot
              </div>
            </GlassCard>
            <GlassCard className="p-5">
              <div className="eyebrow opacity-70">Daily SOL jackpot · resets in</div>
              <div className="numerals-tabular mt-1 flex items-baseline gap-2 font-mono text-3xl text-white">
                <span>{String(h).padStart(2, "0")}</span>
                <span className="text-[color:var(--color-ix-fg-dim)]">:</span>
                <span>{String(m).padStart(2, "0")}</span>
                <span className="text-[color:var(--color-ix-fg-dim)]">:</span>
                <span>{String(s).padStart(2, "0")}</span>
              </div>
              <div className="mt-1 text-xs text-[color:var(--color-ix-fg-dim)]">
                Current pot · 281.4 SOL
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

        {/* RIGHT: 3D coin shower (mobile uses static poster) */}
        <div className="relative h-[420px] w-full overflow-hidden rounded-[var(--radius-xl)] glass sm:h-[640px]">
          {isMobile ? (
            <CoinShowerPoster />
          ) : (
            <SceneFrame
              className="h-full w-full"
              camera={{ position: [0, 1.8, 5.2], fov: 38 }}
              fallback={<CoinShowerPoster />}
            >
              <CoinShowerScene count={tile} />
            </SceneFrame>
          )}

          {/* HUD badge */}
          <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full glass-strong px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-ix-amber)]">
            <span className="size-1.5 rounded-full bg-[color:var(--color-ix-amber)]" />
            Live · paid every block
          </div>

          {/* Bottom legend */}
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between text-[10px] text-[color:var(--color-ix-fg-dim)]">
            <span>Each coin = 0.001 SOL paid in last 60s</span>
            <span className="font-mono">deterministic · seed 2024</span>
          </div>
        </div>
      </div>
    </section>
  );
}
