"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Two easter eggs:
 *
 *  - Konami code → "Hyperdrive" mode: a fullscreen warp-speed star tunnel for 6s
 *  - Long-press anywhere → "Blueprints" mode: high-contrast cyan-on-black wireframe
 *    overlay applied until released
 */
export function EasterEggs() {
  const [hyperdrive, setHyperdrive] = useState(false);
  const [blueprints, setBlueprints] = useState(false);
  const [, setKonamiSeq] = useState<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      setKonamiSeq((prev) => {
        const next = [...prev, e.key].slice(-KONAMI.length);
        if (next.length === KONAMI.length && next.every((k, i) => k === KONAMI[i])) {
          setHyperdrive(true);
          setTimeout(() => setHyperdrive(false), 6200);
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Long-press on the page logo (the nav link)
  useEffect(() => {
    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    const onDown = (e: MouseEvent) => {
      const tgt = e.target as HTMLElement;
      if (!tgt.closest("a[aria-label='Insider-X']")) return;
      pressTimer = setTimeout(() => setBlueprints(true), 600);
    };
    const onUp = () => {
      if (pressTimer) clearTimeout(pressTimer);
      setBlueprints(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseleave", onUp);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseleave", onUp);
      if (pressTimer) clearTimeout(pressTimer);
    };
  }, []);

  return (
    <>
      {/* Blueprints overlay */}
      <AnimatePresence>
        {blueprints && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none fixed inset-0 z-[9100]"
            style={{
              mixBlendMode: "difference",
              backgroundImage:
                "linear-gradient(0deg, transparent 0%, transparent 96%, rgba(91,233,255,0.5) 100%), linear-gradient(90deg, transparent 0%, transparent 96%, rgba(91,233,255,0.5) 100%)",
              backgroundSize: "60px 60px",
            }}
          />
        )}
      </AnimatePresence>

      {/* Hyperdrive */}
      <AnimatePresence>
        {hyperdrive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-0 z-[9200] grid place-items-center overflow-hidden bg-black/90 backdrop-blur"
          >
            {/* warp stars */}
            <div className="absolute inset-0">
              {Array.from({ length: 220 }).map((_, i) => {
                const left = `${Math.random() * 100}%`;
                const top = `${Math.random() * 100}%`;
                const len = 80 + Math.random() * 220;
                const dur = 0.4 + Math.random() * 0.8;
                const delay = Math.random() * 0.6;
                return (
                  <motion.span
                    key={i}
                    initial={{ x: 0, opacity: 0, scaleX: 0.1 }}
                    animate={{ x: [0, len], opacity: [0, 1, 0], scaleX: [0.1, 1, 0.6] }}
                    transition={{
                      duration: dur,
                      delay,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute h-px"
                    style={{
                      left,
                      top,
                      width: 40,
                      background:
                        "linear-gradient(90deg, transparent, #5be9ff, #ffffff, transparent)",
                      transformOrigin: "left center",
                    }}
                  />
                );
              })}
            </div>

            <div className="relative z-10 text-center">
              <div
                className="font-display text-5xl tracking-[0.2em] text-white sm:text-7xl"
                style={{ textShadow: "0 0 30px #5be9ff" }}
              >
                HYPERDRIVE
              </div>
              <div className="mt-3 font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--color-ix-cyan)]">
                engaged
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
