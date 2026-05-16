"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  staggerChar?: number;
  as?: "h1" | "h2" | "h3" | "div";
  highlight?: string;
  highlightClassName?: string;
  children?: ReactNode;
};

type Word = { text: string; highlight: boolean };

/**
 * Letter-by-letter mask reveal with variable-font axis breathing.
 *
 * Words wrap on natural word boundaries (so "command" never breaks across two
 * lines), but inside each word, characters animate individually. The space
 * between words is a normal breakable text node.
 *
 * `highlight` lets you specify a single substring to be styled differently
 * (e.g. gradient text for the focal phrase).
 */
export function KineticHeading({
  text,
  className,
  delay = 0,
  staggerChar = 0.018,
  as: Tag = "h2",
  highlight,
  highlightClassName,
}: Props) {
  const reduced = useReducedMotion();

  /**
   * Build a flat list of word tokens with their highlight flag, while keeping
   * each word atomic (no internal line break possible).
   */
  const words: Word[] = useMemo(() => {
    const segs = !highlight
      ? [{ text, highlight: false }]
      : (() => {
          const idx = text.indexOf(highlight);
          if (idx === -1) return [{ text, highlight: false }];
          return [
            { text: text.slice(0, idx), highlight: false },
            { text: highlight, highlight: true },
            { text: text.slice(idx + highlight.length), highlight: false },
          ].filter((s) => s.text.length > 0);
        })();

    const out: Word[] = [];
    segs.forEach((seg) => {
      // Split on whitespace but preserve the separators so consecutive
      // segments still get their spacing right.
      seg.text.split(/(\s+)/).forEach((piece) => {
        if (piece.length === 0) return;
        out.push({ text: piece, highlight: seg.highlight });
      });
    });
    return out;
  }, [text, highlight]);

  const container: Variants = {
    hidden: {},
    show: {
      transition: { delayChildren: delay, staggerChildren: reduced ? 0 : staggerChar },
    },
  };

  const child: Variants = {
    hidden: {
      y: "115%",
      opacity: 0,
      fontVariationSettings: "'wght' 720, 'slnt' -2",
    },
    show: {
      y: "0%",
      opacity: 1,
      fontVariationSettings: "'wght' 600, 'slnt' 0",
      transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Walk all chars across all words to keep stagger order globally consistent
  let charIndex = 0;

  return (
    <Tag className={cn(className)}>
      <motion.span
        className="inline"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        {words.map((word, wi) => {
          // Pure whitespace word — render as a normal text node so the browser
          // is free to wrap here on its own.
          if (/^\s+$/.test(word.text)) {
            return <span key={`w-${wi}`}>{" "}</span>;
          }

          const chars = Array.from(word.text);
          return (
            <span
              key={`w-${wi}`}
              className="inline-block whitespace-nowrap align-baseline"
              style={{ paddingBottom: "0.18em", marginBottom: "-0.18em" }}
            >
              {chars.map((ch, ci) => {
                const idx = charIndex++;
                return (
                  <span
                    key={`c-${wi}-${ci}`}
                    aria-hidden={ci > 0}
                    className="inline-block overflow-hidden align-baseline"
                    style={{ paddingBottom: "0.18em", marginBottom: "-0.18em" }}
                  >
                    <motion.span
                      custom={idx}
                      className={cn(
                        "kinetic-char",
                        // Apply the gradient/effect class to the glyph-bearing
                        // span itself so background-clip:text actually has a
                        // text element to clip to.
                        word.highlight && highlightClassName,
                      )}
                      variants={child}
                      style={{ display: "inline-block" }}
                    >
                      {ch}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          );
        })}
        {/* SR-only readable text so screen readers don't get per-letter spam */}
        <span className="sr-only">{text}</span>
      </motion.span>
    </Tag>
  );
}
