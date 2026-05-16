"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  amount?: number;
};

/**
 * Lightweight scroll-reveal wrapper. Slides + fades on first viewport entry.
 * Falls back to instant fade-only when prefers-reduced-motion is set.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.9,
  className,
  amount = 0.4,
}: Props) {
  const reduced = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y, filter: reduced ? "blur(0px)" : "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay,
        duration: reduced ? 0.2 : duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}
