"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const KEY = "ix:loader-seen";
const CHARS = "INSIDER·X".split("");

/**
 * First-visit loader. Letters of "INSIDER·X" assemble from offset noise into
 * place, then the whole thing fades out and we mark this session as "seen".
 *
 * Skipped automatically for reduced-motion users.
 */
export function Loader() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reduced) return;
    const seen = window.sessionStorage.getItem(KEY);
    if (seen) return;
    setVisible(true);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      window.sessionStorage.setItem(KEY, "1");
      setVisible(false);
      document.body.style.overflow = "";
    }, 1700);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[9000] grid place-items-center bg-[color:var(--color-ix-bg)]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        >
          <motion.div
            className="flex items-center gap-1 text-[14vw] font-medium tracking-[0.04em] sm:text-[10vw] md:text-[8vw]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {CHARS.map((c, i) => (
              <motion.span
                key={i}
                initial={{
                  y: (Math.random() - 0.5) * 120,
                  x: (Math.random() - 0.5) * 120,
                  opacity: 0,
                  filter: "blur(20px)",
                  rotate: (Math.random() - 0.5) * 60,
                }}
                animate={{
                  y: 0,
                  x: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  rotate: 0,
                  transition: {
                    delay: 0.04 * i,
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
                className={c === "·" ? "gradient-text-fleet" : ""}
              >
                {c}
              </motion.span>
            ))}
          </motion.div>

          {/* sweeping gradient line under the wordmark */}
          <motion.div
            className="absolute bottom-[34%] left-1/2 h-px w-1/3 -translate-x-1/2 origin-left"
            style={{
              background:
                "linear-gradient(90deg, transparent, #5be9ff 30%, #ff49c8 70%, transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1, transition: { delay: 0.4, duration: 0.9 } }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
