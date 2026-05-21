"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { seededRandom } from "@/lib/utils";
import { KineticHeading } from "@/components/ui/KineticHeading";
import { playSubBassHit } from "@/lib/audio/synth";
import { soundBus } from "@/lib/audio/sound-bus";

const COLS = 15;
const ROWS = 8;
const COUNT = COLS * ROWS;

const TILE_COLORS = ["#5be9ff", "#7b5bff", "#ff49c8", "#2bff9a", "#ffd166", "#c987ff"];

/**
 * Mobile-only Fleet section. No WebGL, no pinning. A 15×8 DOM grid of mini
 * wallet tiles ripples + fires once when the user scrolls past it. Same
 * narrative beats (form → fire → final tagline) but cheap and snappy on
 * mobile.
 */
export function FleetMobile() {
  const reduced = useReducedMotion();
  const [fired, setFired] = useState(false);
  const [pnl, setPnl] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Deterministic tile palette + delays so the screenshot is stable
  const tiles = useMemo(() => {
    const rng = seededRandom(1337);
    return Array.from({ length: COUNT }).map((_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const cx = (COLS - 1) / 2;
      const cy = (ROWS - 1) / 2;
      const dist = Math.hypot(col - cx, row - cy);
      return {
        i,
        col,
        row,
        color: TILE_COLORS[Math.floor(rng() * TILE_COLORS.length)],
        pnl: 0.15 + rng() * 0.65,
        ripple: dist / 9, // delay relative to centre
      };
    });
  }, []);

  // Continuous post-fire row pulse — kicks off ~1.6s after fire so the
  // grid never reads as a static, finished state when scrolled past.
  const [pulseActive, setPulseActive] = useState(false);
  useEffect(() => {
    if (!fired) return;
    const id = setTimeout(() => setPulseActive(true), 1600);
    return () => clearTimeout(id);
  }, [fired]);

  // Auto-fire when section is well in view
  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !fired) {
            // small delay so user sees the formation first
            setTimeout(() => {
              setFired(true);
              if (soundBus.isEnabled()) playSubBassHit();
            }, 900);
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [fired, reduced]);

  // PnL count-up after fire
  useEffect(() => {
    if (!fired) return;
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setPnl(Math.round(17820 * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [fired]);

  return (
    <section
      id="fleet"
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden bg-[color:var(--color-ix-bg-2)] py-20 md:hidden"
      aria-label="500 wallets in parallel"
    >
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 55%, rgba(123,91,255,0.22), transparent 70%), radial-gradient(40% 40% at 80% 20%, rgba(91,233,255,0.16), transparent 70%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5">
        <div className="flex items-start justify-between gap-4">
          <span className="eyebrow">03 · The Fleet</span>
          <div className="text-right">
            <div className="eyebrow opacity-70">PnL · last fire</div>
            <div
              className="font-mono text-2xl tabular-nums text-[color:var(--color-ix-green)]"
              style={{ textShadow: "0 0 14px rgba(43,255,154,0.4)" }}
            >
              +{pnl.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid place-items-center text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-ix-fg-dim)]">
            Wallets active
          </div>
          <div className="numerals-tabular gradient-text-fleet font-medium leading-none text-[clamp(4rem,22vw,7rem)]">
            500
          </div>
        </div>

        {/* The fleet grid */}
        <div
          className="grid w-full gap-1.5 rounded-2xl p-3 glass-strong"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {tiles.map((t) => (
            <motion.div
              key={t.i}
              initial={{ opacity: 0, scale: 0.6, y: 8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: t.ripple * 0.25 + 0.05,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative aspect-[3/4] overflow-hidden rounded-[3px] border border-[color:var(--color-ix-border)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(11,7,23,0.9) 0%, rgba(17,10,37,0.9) 100%)",
              }}
            >
              {/* token color stripe */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{ background: t.color, opacity: fired ? 1 : 0.7 }}
              />
              {/* pnl bar */}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
                style={{
                  background: "#2bff9a",
                  transform: `scaleX(${fired ? t.pnl : 0.04})`,
                  transition:
                    "transform 700ms cubic-bezier(0.16,1,0.3,1) " +
                    (t.ripple * 0.25 + 0.6) +
                    "s",
                }}
              />
              {/* FIRE flash */}
              {fired && !reduced && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.18] }}
                  transition={{
                    duration: 0.9,
                    delay: 0.45 + t.ripple * 0.3,
                    times: [0, 0.25, 1],
                    ease: "easeOut",
                  }}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(91,233,255,0.85), rgba(255,73,200,0.85))",
                    mixBlendMode: "screen",
                  }}
                />
              )}
              {/* Looping cyan row pulse — propagates row-by-row so the grid
                  keeps moving even when the user has stopped scrolling. */}
              {pulseActive && !reduced && (
                <span
                  aria-hidden
                  className="fleet-row-pulse absolute inset-0"
                  style={{
                    animationDelay: `${t.row * 0.16}s`,
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Final tagline locks in after fire */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={fired ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 0 }}
          transition={{ duration: 0.7, delay: fired ? 1.1 : 0, ease: [0.16, 1, 0.3, 1] }}
          className="grid place-items-center text-center"
        >
          {fired ? (
            <KineticHeading
              text="One click. Five hundred wallets. Zero delay."
              highlight="Zero delay."
              highlightClassName="gradient-text-fleet"
              className="font-display font-medium tracking-[-0.025em] leading-[1.05] text-balance text-white text-[clamp(1.5rem,6vw,2.25rem)] max-w-[22ch]"
            />
          ) : (
            <p className="max-w-[40ch] text-pretty text-sm text-[color:var(--color-ix-fg-muted)]">
              Each tile is a wallet. Each wallet is signed locally. All 500 fire on the same beat.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
