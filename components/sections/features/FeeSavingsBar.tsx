"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * FeeSavingsBar — animated SVG stacked-bar showing per-swap fees.
 *
 * Four horizontal lanes. Insider-X is short (0.1–0.25%), competitors are
 * long (0.5–1.0%). On scroll-in, the bars sweep right to their full width
 * and a "saved" counter ticks up next to the Insider-X bar.
 *
 * Loops a subtle pulse so the visual never reads as static.
 */

type Lane = {
  id: string;
  label: string;
  min: number;
  max: number;
  isUs: boolean;
  color: string;
};

const LANES: Lane[] = [
  { id: "ix", label: "Insider-X", min: 0.1, max: 0.25, isUs: true, color: "#5be9ff" },
  { id: "ax", label: "Axiom", min: 0.5, max: 1.0, isUs: false, color: "#a89fc4" },
  { id: "tr", label: "Trojan", min: 0.75, max: 1.0, isUs: false, color: "#a89fc4" },
  { id: "ph", label: "Photon", min: 0.85, max: 1.0, isUs: false, color: "#a89fc4" },
];

const MAX_FEE = 1.0;

export function FeeSavingsBar() {
  const reduced = useReducedMotion();
  const [saved, setSaved] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setSaved(Math.round(32.6 * eased * 100) / 100);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative h-full w-full p-6 sm:p-10">
      {/* heading */}
      <div className="mb-6">
        <div className="numerals-tabular font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-ix-fg-dim)]">
          % per swap
        </div>
        <div className="mt-1 flex items-baseline gap-3">
          <span className="numerals-tabular font-display text-[clamp(2rem,7vw,3.5rem)] font-medium leading-none text-white">
            {saved.toFixed(2)}
          </span>
          <span className="font-mono text-xs text-[color:var(--color-ix-fg-dim)]">
            SOL saved · last 10k SOL volume
          </span>
        </div>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-ix-cyan)]/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ix-cyan)]">
          <span className="size-1 rounded-full bg-[color:var(--color-ix-cyan)]" />
          Up to 5× cheaper
        </div>
      </div>

      {/* lanes */}
      <ul className="flex flex-col gap-4">
        {LANES.map((lane, i) => {
          const minPct = (lane.min / MAX_FEE) * 100;
          const maxPct = (lane.max / MAX_FEE) * 100;
          return (
            <li key={lane.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={
                    lane.isUs
                      ? "font-medium text-white"
                      : "text-[color:var(--color-ix-fg-muted)]"
                  }
                >
                  {lane.label}
                </span>
                <span
                  className="numerals-tabular font-mono"
                  style={{ color: lane.isUs ? lane.color : "rgba(168,159,196,0.8)" }}
                >
                  {lane.min.toFixed(2)}–{lane.max.toFixed(2)}%
                </span>
              </div>

              <div className="relative h-3 overflow-hidden rounded-full bg-[color:var(--color-ix-surface)]/70">
                {/* range band (min → max) */}
                <motion.div
                  className="absolute inset-y-0 origin-left rounded-full"
                  style={{
                    width: `${maxPct}%`,
                    background: lane.isUs
                      ? `linear-gradient(90deg, ${lane.color}, #7b5bff)`
                      : `linear-gradient(90deg, ${lane.color}80, ${lane.color}40)`,
                    boxShadow: lane.isUs
                      ? "0 0 20px rgba(91,233,255,0.45)"
                      : undefined,
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* min tick */}
                <motion.div
                  className="absolute inset-y-0 w-px"
                  style={{
                    left: `${minPct}%`,
                    background: lane.isUs ? "#fff" : "rgba(255,255,255,0.4)",
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: 0.6 + i * 0.12, duration: 0.4 }}
                />
                {/* live pulse for Insider-X — never feels static */}
                {lane.isUs && !reduced && (
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${maxPct}%`,
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
                    }}
                    animate={{ x: ["-100%", "180%"] }}
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.4,
                    }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* footnote */}
      <p className="mt-6 max-w-[40ch] text-[11px] leading-relaxed text-[color:var(--color-ix-fg-dim)]">
        Per-swap routing fee charged by each platform on standard market orders. Insider-X
        cashback rebates can take effective cost lower still.
      </p>
    </div>
  );
}
