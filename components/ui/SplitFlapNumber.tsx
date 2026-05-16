"use client";

import { motion, useReducedMotion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Split-flap counter that animates from 0 → `value` on scroll into view.
 * Each digit / glyph is its own column; on update it scrolls through 0..9 to
 * land on the target glyph, with a slight stagger across columns.
 */
export function SplitFlapNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1.2,
  className,
}: {
  value: string; // e.g. "1,284,392"
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (inView) setAnimated(true);
  }, [inView]);

  const chars = useMemo(() => value.split(""), [value]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {prefix && <span className="inline-block align-baseline">{prefix}</span>}
      {chars.map((ch, i) => {
        const isDigit = /\d/.test(ch);
        if (!isDigit) {
          return (
            <span key={i} className="inline-block align-baseline px-[0.05em]">
              {ch}
            </span>
          );
        }
        const target = parseInt(ch, 10);
        return (
          <FlapDigit
            key={i}
            target={target}
            delay={i * 0.06}
            duration={duration}
            play={animated && !reduced}
          />
        );
      })}
      {suffix && <span className="inline-block align-baseline">{suffix}</span>}
    </span>
  );
}

function FlapDigit({
  target,
  delay,
  duration,
  play,
}: {
  target: number;
  delay: number;
  duration: number;
  play: boolean;
}) {
  // For visual richness we cycle through 14 frames before settling on target
  const cycles = 14;
  const offset = play ? -(cycles + target) : 0;

  return (
    <span
      className="relative inline-block overflow-hidden align-baseline numerals-tabular"
      style={{ width: "0.65em", height: "1em" }}
    >
      <motion.span
        initial={{ y: 0 }}
        animate={{ y: `${offset}em` }}
        transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-0 flex flex-col leading-[1]"
      >
        {/* 0..9 wheel repeated `cycles/10` times + final target */}
        {Array.from({ length: cycles + 10 }).map((_, i) => (
          <span key={i} className="block h-[1em]">
            {i % 10}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
