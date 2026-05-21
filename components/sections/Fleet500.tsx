"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import { registerGsap } from "@/lib/motion/gsap";
import { detectDeviceTier, fleetTileCount } from "@/lib/three/device-tier";
import { playSubBassHit } from "@/lib/audio/synth";
import { soundBus } from "@/lib/audio/sound-bus";
import { KineticHeading } from "@/components/ui/KineticHeading";
import { SceneFrame } from "@/components/three/SceneFrame";
import type { FleetState } from "@/components/three/FleetField";

const FleetField = dynamic(
  () => import("@/components/three/FleetField").then((m) => m.FleetField),
  { ssr: false },
);

/**
 * Static poster shown while the FleetField chunk is loading. Matches the
 * scene's color signature so the transition isn't jarring.
 */
function FleetPoster() {
  return (
    <div className="relative h-full w-full overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 65%, rgba(123,91,255,0.25), transparent 70%), radial-gradient(40% 40% at 80% 30%, rgba(91,233,255,0.18), transparent 70%), #06010c",
        }}
      />
      {/* faint perspective grid */}
      <div
        className="absolute inset-x-0 bottom-0 h-[60%]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(91,233,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(91,233,255,0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,0.85), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,0.85), transparent 100%)",
          transform: "perspective(800px) rotateX(60deg)",
          transformOrigin: "bottom",
        }}
      />
    </div>
  );
}

/**
 * Fleet500 — the showpiece section.
 *
 * Pinned for ~3 viewports of scroll. The scroll progress drives a single shared
 * FleetState object, which the WebGL scene reads each frame. Beats:
 *
 *   0.00–0.18  : tile chaos → forming text "FLEET"-style mark (we use the morph)
 *   0.18–0.45  : tiles slot into the lattice
 *   0.45–0.60  : tiles breathe; "FIRE" button arms
 *   0.60–0.78  : FIRE shockwave + PnL counter ticks
 *   0.78–1.00  : camera pulls back, tagline locks in
 */
export function Fleet500() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pnlRef = useRef<HTMLSpanElement | null>(null);
  const fireBtnRef = useRef<HTMLButtonElement | null>(null);
  const overlayCopyRef = useRef<HTMLDivElement | null>(null);

  const [tileCount, setTileCount] = useState(500);

  const sceneState = useRef<FleetState>({
    morph: 0,
    fire: -1,
    hover: -1,
    pull: 0,
    burst: 0,
  });

  // PnL count proxy, scrub-driven so it matches scroll position even when scrubbing back.
  const pnlProxy = useRef({ v: 0 });

  useLayoutEffect(() => {
    registerGsap();
    setTileCount(fleetTileCount(detectDeviceTier()));
  }, []);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const gsap = registerGsap();

      const ctx = gsap.context(() => {
        const isMobile =
          typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: isMobile ? "+=120%" : "+=160%",
            pin: !isMobile,
            pinSpacing: !isMobile,
            scrub: 0.5,
            anticipatePin: 1,
          },
        });

        // Tiles stream in early and fast so the section has rolling motion
        // for the entire scroll, not a slow assemble-then-stop pattern.
        tl.to(sceneState.current, { morph: 1, duration: 0.25, ease: "power2.out" }, 0);

        // Beat copy reveals
        tl.fromTo(
          ".beat-1",
          { opacity: 1, y: 0 },
          { opacity: 0, y: -16, duration: 0.05, ease: "power2.out" },
          0.30,
        );
        tl.fromTo(
          ".beat-2",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
          0.31,
        );
        tl.to(".beat-2", { opacity: 0, y: -16, duration: 0.05 }, 0.5);
        tl.fromTo(
          ".fire-cta",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.05 },
          0.32,
        );

        // FIRE moment — auto-fire if user hasn't clicked by 0.55
        tl.call(
          () => {
            if (sceneState.current.fire < 0) {
              sceneState.current.fire = 0;
              if (soundBus.isEnabled()) playSubBassHit();
              const btn = fireBtnRef.current;
              if (btn) {
                btn.dataset.fired = "1";
              }
            }
          },
          undefined,
          0.55,
        );

        // Drive `fire` forward from 0 → 1.4 (one-shot shockwave)
        tl.to(
          sceneState.current,
          {
            fire: 1.4,
            duration: 0.2,
            ease: "power1.out",
          },
          0.55,
        );

        // PnL counter tick (visual flash) — proxy from 0 → 17820 SOL
        tl.to(
          pnlProxy.current,
          {
            v: 17820,
            duration: 0.22,
            ease: "power3.out",
            onUpdate: () => {
              if (pnlRef.current) {
                pnlRef.current.textContent = `+${Math.round(pnlProxy.current.v).toLocaleString()}`;
              }
            },
          },
          0.55,
        );

        // Fade FIRE CTA out, swap to final tagline — but tile field keeps
        // rolling. No camera pull-back; section ends with continuous motion.
        tl.to(".fire-cta", { opacity: 0, y: -16, duration: 0.05 }, 0.78);
        tl.fromTo(
          ".beat-final",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.1 },
          0.80,
        );
      }, root);

      return () => ctx.revert();
    },
    { scope: sectionRef },
  );

  useEffect(() => {
    return () => {
      const ST = (window as unknown as { ScrollTrigger?: { getAll: () => { kill: () => void }[] } })
        .ScrollTrigger;
      ST?.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Manual FIRE (user-driven before auto-fire kicks in)
  const handleFire = () => {
    if (sceneState.current.fire < 0) {
      sceneState.current.fire = 0;
      if (soundBus.isEnabled()) playSubBassHit();
    }
  };

  return (
    <section
      id="fleet"
      ref={sectionRef}
      className="relative isolate hidden w-full overflow-hidden bg-[color:var(--color-ix-bg-2)] md:block"
      aria-label="500 wallets in parallel"
    >
      {/* WebGL scene fills the full pinned viewport */}
      <div className="absolute inset-0 -z-0">
        <SceneFrame
          className="h-[100svh] w-full"
          camera={{ position: [0, 1.55, 2.6], fov: 38 }}
          preloadMargin="100% 0px 100% 0px"
          fallback={<FleetPoster />}
        >
          <FleetField count={tileCount} state={sceneState.current} onFire={() => {}} />
        </SceneFrame>
      </div>

      {/* Foreground HUD — sits over the scene */}
      <div className="relative z-10 mx-auto flex h-[100svh] w-full max-w-[1400px] flex-col px-5 py-24 sm:px-8">
        {/* top: eyebrow + PnL meter */}
        <div className="flex items-start justify-between gap-6">
          <span className="eyebrow">03 · The Fleet</span>

          <div className="flex flex-col items-end gap-1">
            <span className="eyebrow opacity-70">Fleet PnL · last fire</span>
            <span
              ref={pnlRef}
              className="font-mono text-3xl tabular-nums text-[color:var(--color-ix-green)] sm:text-4xl"
              style={{ textShadow: "0 0 18px rgba(43,255,154,0.4)" }}
            >
              +0
            </span>
            <span className="text-xs text-[color:var(--color-ix-fg-dim)]">USDC</span>
          </div>
        </div>

        {/* middle: tile count badge */}
        <div className="flex flex-1 items-end justify-center">
          <div className="grid place-items-center text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-ix-fg-dim)]">
              Wallets active
            </div>
            <div className="numerals-tabular gradient-text-fleet font-medium leading-none text-[clamp(4rem,16vw,9vw)] md:text-[9vw]">
              {tileCount}
            </div>
          </div>
        </div>

        {/* bottom: rotating copy + fire CTA + final tagline */}
        <div ref={overlayCopyRef} className="relative grid h-[140px] place-items-center text-center">
          <div className="beat-1 absolute inset-0 grid place-items-center">
            <p className="max-w-[40ch] text-[color:var(--color-ix-fg-muted)] text-pretty">
              Watch your fleet assemble. No queueing. No staggered signing.
            </p>
          </div>
          <div className="beat-2 absolute inset-0 grid place-items-center opacity-0">
            <p className="max-w-[40ch] text-[color:var(--color-ix-fg-muted)] text-pretty">
              Each tile is a wallet. Each wallet is signed locally. All {tileCount} fire on the same beat.
            </p>
          </div>

          <button
            ref={fireBtnRef}
            type="button"
            onClick={handleFire}
            data-cursor="cta"
            className="fire-cta absolute bottom-0 inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium tracking-[0.18em] uppercase opacity-0 transition-transform hover:scale-[1.04] focus-visible:scale-[1.04]"
            style={{
              background: "linear-gradient(135deg, #5be9ff 0%, #7b5bff 50%, #ff49c8 100%)",
              color: "#000",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.08), 0 30px 70px -20px rgba(255,73,200,0.55), 0 0 40px rgba(91,233,255,0.35)",
            }}
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/40 opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-black" />
            </span>
            Fire the fleet
          </button>

          <div className="beat-final absolute inset-0 grid place-items-center opacity-0">
            <KineticHeading
              text="One click. Five hundred wallets. Zero delay."
              highlight="Zero delay."
              highlightClassName="gradient-text-fleet"
              className="display-3 max-w-[24ch] text-balance text-white"
            />
          </div>
        </div>
      </div>

      {/* Bottom progress indicator */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-ix-fg-dim)]">
        Scroll through the fleet
      </div>
    </section>
  );
}
