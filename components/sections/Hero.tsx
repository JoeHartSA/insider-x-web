"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { SceneFrame } from "@/components/three/SceneFrame";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { KineticHeading } from "@/components/ui/KineticHeading";
import { LiveTickerChip } from "./LiveTickerChip";
import { VenueMarquee } from "./VenueMarquee";
import { Loader } from "./Loader";

const HeroIgnition = dynamic(
  () => import("@/components/three/HeroIgnition").then((m) => m.HeroIgnition),
  { ssr: false },
);

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden">
      <Loader />

      {/* 3D scene (or aurora fallback) */}
      <div className="absolute inset-0 -z-10">
        {reduced ? (
          <div className="aurora-fallback h-full w-full" />
        ) : (
          <SceneFrame
            className="h-full w-full"
            camera={{ position: [0, 0, 5], fov: 38 }}
            fallback={<div className="aurora-fallback h-full w-full" />}
          >
            <HeroIgnition />
          </SceneFrame>
        )}
        {/* dark vignette layer so the type stays readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 35%, transparent 0%, rgba(5,0,8,0.55) 70%, rgba(5,0,8,0.85) 100%)",
          }}
        />
      </div>

      {/* Foreground content */}
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1400px] flex-col justify-center gap-10 px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="space-y-4">
          <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ix-border)] bg-[color:var(--color-ix-surface)]/60 px-3 py-1 backdrop-blur">
            <span className="size-1.5 rounded-full bg-[color:var(--color-ix-cyan)]" />
            Now in private beta · Solana
          </span>

          <KineticHeading
            as="h1"
            className="font-display font-medium tracking-[-0.04em] leading-[0.95] text-balance text-white text-[clamp(2.5rem,9vw,7.5rem)] max-w-[20ch]"
            text="Command a fleet of 500 wallets. Trade faster than light."
            highlight="500 wallets"
            highlightClassName="gradient-text-fleet"
          />

          <p className="max-w-[58ch] text-pretty text-base leading-relaxed text-[color:var(--color-ix-fg-muted)] sm:text-lg">
            Insider-X is the fastest execution engine on Solana. Sub-200ms quote-to-fill across
            pump.fun, Raydium, Jupiter, Drift and every alt-market that matters — orchestrated
            from a single cockpit.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <MagneticButton
            href="#waitlist"
            variant="primary"
            wrapperClassName="w-full sm:w-auto"
            className="w-full sm:w-auto"
          >
            Get early access
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M3 7h8m0 0L8 4m3 3L8 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>
          <MagneticButton
            href="#fleet"
            variant="secondary"
            wrapperClassName="w-full sm:w-auto"
            className="w-full sm:w-auto"
          >
            Watch the fleet fire
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M5 3l5 4-5 4V3z" fill="currentColor" />
            </svg>
          </MagneticButton>
        </div>

        {/* live ticker — own row so it never wraps awkwardly under the CTAs */}
        <LiveTickerChip className="self-start" />

        <div className="mt-auto pt-12">
          <p className="eyebrow mb-3 opacity-70">Routing live across</p>
          <VenueMarquee />
        </div>
      </div>

      {/* Scroll affordance */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.32em] text-[color:var(--color-ix-fg-dim)] uppercase">
        Scroll
        <span className="ml-2 inline-block h-px w-12 align-middle bg-gradient-to-r from-[color:var(--color-ix-fg-dim)] to-transparent" />
      </div>
    </section>
  );
}
