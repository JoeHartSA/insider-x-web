"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "motion/react";
import { FAQ } from "@/content/faq";
import { KineticHeading } from "@/components/ui/KineticHeading";

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span className="relative inline-block size-5 shrink-0">
      <motion.span
        aria-hidden
        animate={{ rotate: open ? 90 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <span className="absolute left-1/2 top-1/2 h-[1.5px] w-3.5 -translate-x-1/2 -translate-y-1/2 rounded bg-current" />
        <span className="absolute left-1/2 top-1/2 h-3.5 w-[1.5px] -translate-x-1/2 -translate-y-1/2 rounded bg-current" />
      </motion.span>
    </span>
  );
}

export function Faq() {
  return (
    <section className="relative w-full bg-[color:var(--color-ix-bg)] py-32" aria-label="FAQ">
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.4fr]">
        <header className="flex flex-col gap-4">
          <span className="eyebrow">10 · Questions</span>
          <KineticHeading
            as="h2"
            text="Answers, plainly."
            highlight="plainly."
            highlightClassName="gradient-text-fleet"
            className="display-2 max-w-[16ch]"
          />
          <p className="max-w-[42ch] text-pretty text-[color:var(--color-ix-fg-muted)]">
            More in the docs — drop into Telegram or Discord if you want the long answer.
          </p>
        </header>

        <Accordion.Root type="single" collapsible className="flex flex-col gap-2">
          {FAQ.map((item, i) => (
            <Accordion.Item
              key={i}
              value={`item-${i}`}
              className="overflow-hidden rounded-2xl border border-[color:var(--color-ix-border)] bg-[color:var(--color-ix-surface)]/30 transition-colors hover:border-white/20 data-[state=open]:border-[color:var(--color-ix-cyan)]/30"
            >
              <Accordion.Header>
                <Accordion.Trigger
                  data-cursor="cta"
                  className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-white"
                >
                  <span className="font-mono text-[11px] text-[color:var(--color-ix-fg-dim)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-base">{item.q}</span>
                  <span className="text-[color:var(--color-ix-fg-muted)] group-data-[state=open]:text-[color:var(--color-ix-cyan)]">
                    <PlusMinusWrapper />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content
                className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
                style={{
                  // Radix sets --radix-accordion-content-height for height transitions
                  // We rely on CSS keyframes below to animate
                }}
              >
                <div className="px-5 pb-5 pr-12 text-sm leading-relaxed text-[color:var(--color-ix-fg-muted)]">
                  {item.a}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>

      <style jsx global>{`
        @keyframes accordion-down {
          from { height: 0; }
          to { height: var(--radix-accordion-content-height); }
        }
        @keyframes accordion-up {
          from { height: var(--radix-accordion-content-height); }
          to { height: 0; }
        }
        .data-\\[state=open\\]\\:animate-accordion-down[data-state="open"] {
          animation: accordion-down 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .data-\\[state=closed\\]\\:animate-accordion-up[data-state="closed"] {
          animation: accordion-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </section>
  );
}

/** Trigger uses [data-state] from Radix to drive the rotation. */
function PlusMinusWrapper() {
  return (
    <span className="relative inline-block size-5 shrink-0 [&_.bar-v]:transition-transform [&_.bar-v]:duration-300 group-data-[state=open]:[&_.bar-v]:rotate-90">
      <span className="bar-h absolute left-1/2 top-1/2 h-[1.5px] w-3.5 -translate-x-1/2 -translate-y-1/2 rounded bg-current" />
      <span className="bar-v absolute left-1/2 top-1/2 h-3.5 w-[1.5px] -translate-x-1/2 -translate-y-1/2 rounded bg-current" />
    </span>
  );
}

// re-export the unused component to silence lint if anyone imports
export { PlusMinus };
