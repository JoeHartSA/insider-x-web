"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/motion/gsap";
import { KineticHeading } from "@/components/ui/KineticHeading";

type Runner = {
  id: string;
  label: string;
  finalMs: number;
  color: string;
  glow: string;
  rank: number;
};

const RUNNERS: Runner[] = [
  { id: "ix", label: "Insider-X", finalMs: 184, color: "#5be9ff", glow: "rgba(91,233,255,0.55)", rank: 1 },
  { id: "ax", label: "Axiom", finalMs: 247, color: "#a89fc4", glow: "rgba(168,159,196,0.35)", rank: 2 },
  { id: "tr", label: "Trojan", finalMs: 312, color: "#a89fc4", glow: "rgba(168,159,196,0.35)", rank: 3 },
  { id: "ph", label: "Photon", finalMs: 389, color: "#a89fc4", glow: "rgba(168,159,196,0.35)", rank: 4 },
];

/**
 * Speed Showdown — pinned drag-strip race.
 *
 * Scroll drives a single timeline:
 *   0.00 → 0.20  : starter lights tick down 3 · 2 · 1
 *   0.20 → 0.85  : runners accelerate (eased), trail length grows with speed
 *   0.85 → 1.00  : final numbers reveal, winning streak flares
 *
 * Numbers are GSAP-ticked through a proxy object so they animate cleanly.
 */
export function SpeedShowdown() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const numbersRef = useRef<Record<string, HTMLSpanElement | null>>({});

  useLayoutEffect(() => {
    registerGsap();
  }, []);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const gsap = registerGsap();
      const isMobile =
        typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

      const ctx = gsap.context(() => {
        // On mobile we don't pin (a pinned section consumes 1.8 viewports of
        // swipe budget which feels frozen). Instead, play the race once when
        // the section enters view, anchored to actual seconds.
        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power3.out" },
          scrollTrigger: isMobile
            ? {
                trigger: root,
                start: "top 70%",
                toggleActions: "play none none none",
              }
            : {
                trigger: root,
                start: "top top",
                end: "+=180%",
                pin: true,
                pinSpacing: true,
                scrub: 0.6,
                anticipatePin: 1,
              },
        });

        // Starter lights — three pips
        tl.fromTo(
          ".starter .pip",
          { opacity: 0.2, scale: 0.9 },
          { opacity: 1, scale: 1, stagger: 0.06, duration: 0.2, ease: "power2.out" },
          0,
        );
        tl.to(".starter .pip", { opacity: 0.25, duration: 0.05 }, 0.18);
        tl.fromTo(
          ".starter .go",
          { opacity: 0, scale: 0.8, color: "#5be9ff" },
          { opacity: 1, scale: 1.2, duration: 0.12, ease: "back.out(2)" },
          0.2,
        );

        // Race: each runner's progress percentage maps onto its lane.
        // Total race progress goes 0 -> 1 over the middle of the timeline.
        // Final finish time → lane fill: faster = first to 100%.
        RUNNERS.forEach((r) => {
          // Time scale: insider-x reaches 100% at relative t=1, others slower proportional to their latency.
          const finishAt = r.finalMs / RUNNERS[0].finalMs; // 1.0 for ix, >1 for others
          // Map finish to scroll time within [0.22, 0.92] window.
          const startT = 0.22;
          const windowLen = 0.7;
          const reachAt = startT + windowLen * Math.min(1, finishAt);

          tl.fromTo(
            `[data-lane="${r.id}"] .runner`,
            { xPercent: 0 },
            { xPercent: 100, ease: "power3.out" },
            startT,
          ).to(`[data-lane="${r.id}"] .runner`, { xPercent: 100, duration: 0 }, reachAt - 0.001);

          tl.fromTo(
            `[data-lane="${r.id}"] .lane-fill`,
            { scaleX: 0 },
            { scaleX: 1, ease: "power3.out" },
            startT,
          );

          // PnL/finish flash when the runner crosses the line
          tl.fromTo(
            `[data-lane="${r.id}"] .finish-flash`,
            { opacity: 0 },
            { opacity: 1, duration: 0.05 },
            reachAt - 0.01,
          ).to(
            `[data-lane="${r.id}"] .finish-flash`,
            { opacity: r.id === "ix" ? 0.7 : 0.2, duration: 0.3, ease: "power2.out" },
            reachAt,
          );

          // Number count-up
          const numEl = numbersRef.current[r.id];
          if (numEl) {
            const proxy = { v: 0 };
            tl.to(
              proxy,
              {
                v: r.finalMs,
                duration: 0.6,
                ease: "power2.out",
                onUpdate: () => {
                  numEl.textContent = `${Math.round(proxy.v)}ms`;
                },
              },
              startT,
            );
          }
        });

        // Winner laurel reveals at the end
        tl.fromTo(
          ".winner-tag",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.95,
        );
      }, root);

      return () => ctx.revert();
    },
    { scope: sectionRef },
  );

  // Cleanup any stale ScrollTriggers if the page re-mounts under hot-reload
  useEffect(() => {
    return () => {
      const ST = (window as unknown as { ScrollTrigger?: { getAll: () => { kill: () => void }[] } })
        .ScrollTrigger;
      ST?.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="speed"
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden bg-[color:var(--color-ix-bg)]"
      aria-label="Speed comparison vs Axiom, Trojan and Photon"
    >
      {/* glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 50%, rgba(123,91,255,0.18), transparent 70%), radial-gradient(40% 30% at 80% 30%, rgba(91,233,255,0.12), transparent 70%)",
        }}
      />

      <div className="mx-auto flex min-h-[100svh] w-full max-w-[1400px] flex-col justify-center gap-10 px-5 py-24 sm:px-8">
        <header className="flex flex-col gap-3">
          <span className="eyebrow">02 · Speed showdown</span>
          <KineticHeading
            as="h2"
            text="Sub-second is the new floor."
            highlight="Sub-second"
            highlightClassName="gradient-text-fleet"
            className="display-2 max-w-[20ch]"
          />
          <p className="max-w-[58ch] text-[color:var(--color-ix-fg-muted)] text-pretty">
            Quote-to-fill measured against live Solana traffic, identical pairs, identical RPC
            providers. We&apos;re first by a length and a half — and the gap widens at congestion
            peaks.
          </p>
        </header>

        {/* Starter lights */}
        <div className="starter flex items-center gap-3">
          <span className="eyebrow opacity-70">Starter</span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="pip size-2.5 rounded-full bg-[color:var(--color-ix-amber)]"
                style={{ boxShadow: "0 0 12px rgba(255,209,102,0.7)" }}
              />
            ))}
            <span className="go ml-3 font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--color-ix-cyan)]">
              Go
            </span>
          </div>
        </div>

        {/* Lanes */}
        <ol className="flex flex-col gap-3">
          {RUNNERS.map((r) => (
            <li
              key={r.id}
              data-lane={r.id}
              className="relative grid grid-cols-[78px_1fr_84px] items-center gap-2 sm:grid-cols-[160px_1fr_140px] sm:gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[color:var(--color-ix-fg-dim)]">
                  0{r.rank}
                </span>
                <span
                  className={
                    r.id === "ix"
                      ? "text-base font-medium text-white"
                      : "text-base text-[color:var(--color-ix-fg-muted)]"
                  }
                >
                  {r.label}
                </span>
              </div>

              {/* Lane */}
              <div className="relative h-9 overflow-hidden rounded-full sm:h-12">
                {/* Stripes background — pure CSS for the strip surface */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full opacity-60"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 24px, transparent 24px 48px)",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 lane-fill rounded-full origin-left"
                  style={{
                    width: "100%",
                    background: `linear-gradient(90deg, ${r.glow}, transparent 80%)`,
                  }}
                />

                {/* Runner */}
                <div
                  className="runner absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
                  style={{ willChange: "transform" }}
                >
                  <div
                    className="relative flex h-10 items-center pl-1"
                    style={{ filter: r.id === "ix" ? "drop-shadow(0 0 14px " + r.glow + ")" : "" }}
                  >
                    {/* Trail */}
                    <div
                      aria-hidden
                      className="absolute right-full top-1/2 h-[2px] -translate-y-1/2"
                      style={{
                        width: r.id === "ix" ? 160 : 90,
                        background: `linear-gradient(to left, ${r.color}, transparent)`,
                        opacity: r.id === "ix" ? 0.95 : 0.55,
                      }}
                    />
                    {/* Head */}
                    <span
                      className="block size-3 rounded-full"
                      style={{
                        background: r.color,
                        boxShadow: `0 0 18px ${r.glow}`,
                      }}
                    />
                  </div>
                </div>

                {/* Finish flash */}
                <div
                  className="finish-flash absolute inset-y-0 right-0 w-px"
                  style={{
                    background: r.color,
                    boxShadow: `0 0 22px ${r.glow}, 0 0 60px ${r.glow}`,
                    opacity: 0,
                  }}
                />
              </div>

              {/* Number */}
              <div className="flex items-center justify-end gap-2">
                <span
                  ref={(el) => {
                    numbersRef.current[r.id] = el;
                  }}
                  className="font-mono text-sm tabular-nums sm:text-2xl"
                  style={{ color: r.id === "ix" ? "#fff" : "rgba(168,159,196,0.85)" }}
                >
                  0ms
                </span>
                {r.id === "ix" && (
                  <span className="winner-tag inline-flex items-center gap-1 rounded-full bg-[color:var(--color-ix-cyan)]/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ix-cyan)]">
                    <span
                      className="size-1 rounded-full bg-[color:var(--color-ix-cyan)]"
                      style={{ boxShadow: "0 0 8px #5be9ff" }}
                    />
                    Pole
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* Methodology footnote */}
        <details className="group max-w-[58ch] text-xs text-[color:var(--color-ix-fg-dim)]">
          <summary
            data-cursor="cta"
            className="cursor-pointer list-none text-[color:var(--color-ix-fg-muted)] underline-offset-4 hover:underline"
          >
            <span className="font-mono">↳</span> methodology
          </summary>
          <p className="mt-2 leading-relaxed">
            Median quote-to-fill measured across 24h of live Solana traffic on identical pairs
            (SOL/USDC, WIF/SOL, BONK/SOL, JLP/SOL), routed through each platform&apos;s public
            client. RPC providers held constant. Sample size n ≥ 12,000 per platform. Full traces
            and reproducible scripts in the docs.
          </p>
        </details>
      </div>
    </section>
  );
}
