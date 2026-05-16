"use client";

import { useState } from "react";
import { COMPARISON_ROWS } from "@/content/comparison";
import { KineticHeading } from "@/components/ui/KineticHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const COLS = [
  { id: "feature", label: "" },
  { id: "insiderx", label: "Insider-X", us: true },
  { id: "axiom", label: "Axiom" },
  { id: "trojan", label: "Trojan" },
  { id: "photon", label: "Photon" },
] as const;

function Check({ pass }: { pass: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="inline-block size-5"
      initial={{ scale: 0.6, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden
    >
      {pass ? (
        <motion.path
          d="M5 12l4 4 10-10"
          fill="none"
          stroke="#5be9ff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : (
        <g>
          <motion.path
            d="M7 7l10 10"
            stroke="rgba(168,159,196,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4 }}
          />
          <motion.path
            d="M17 7L7 17"
            stroke="rgba(168,159,196,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
        </g>
      )}
    </motion.svg>
  );
}

function renderCell(value: string | boolean) {
  if (typeof value === "boolean") return <Check pass={value} />;
  return <span className="font-mono text-sm">{value}</span>;
}

type ColKey = "insiderx" | "axiom" | "trojan" | "photon";
const COL_KEYS: ColKey[] = ["insiderx", "axiom", "trojan", "photon"];
const COL_LABEL: Record<ColKey, string> = {
  insiderx: "Insider-X",
  axiom: "Axiom",
  trojan: "Trojan",
  photon: "Photon",
};

export function Comparison() {
  const [hoverCol, setHoverCol] = useState<ColKey | null>(null);
  const [openRow, setOpenRow] = useState<number | null>(null);

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-[color:var(--color-ix-bg-2)] py-32"
      aria-label="vs Axiom, Trojan, Photon"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <header className="flex flex-col gap-4">
          <span className="eyebrow">07 · The field</span>
          <KineticHeading
            as="h2"
            text="Stack us up. We'll wait."
            highlight="We'll wait."
            highlightClassName="gradient-text-fleet"
            className="display-2 max-w-[20ch]"
          />
          <Reveal>
            <p className="max-w-[55ch] text-pretty text-[color:var(--color-ix-fg-muted)]">
              Every claim below is reproducible. Tap a feature row to see the data behind the
              number. Hovering a column dims the others — we&apos;re proud of the spotlight.
            </p>
          </Reveal>
        </header>

        {/* Desktop / tablet table */}
        <div className="mt-12 hidden overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--color-ix-border)] bg-[color:var(--color-ix-surface)]/30 backdrop-blur md:block">
          {/* sticky header */}
          <div className="sticky top-0 z-10 grid grid-cols-[1.6fr_repeat(4,1fr)] items-center gap-2 border-b border-[color:var(--color-ix-border)] bg-[color:var(--color-ix-surface)]/85 px-4 py-3 backdrop-blur sm:px-6">
            {COLS.map((c) => (
              <button
                key={c.id}
                type="button"
                onMouseEnter={() => c.id !== "feature" && setHoverCol(c.id)}
                onMouseLeave={() => setHoverCol(null)}
                data-cursor={c.id === "feature" ? undefined : "cta"}
                className={cn(
                  "text-left transition-opacity",
                  c.id !== "feature" && "text-center font-mono uppercase tracking-[0.18em]",
                  "us" in c && c.us
                    ? "text-white"
                    : c.id === "feature"
                    ? "text-[color:var(--color-ix-fg-dim)] font-mono text-[10px] uppercase tracking-[0.32em]"
                    : "text-[color:var(--color-ix-fg-dim)]",
                  hoverCol && hoverCol !== c.id && c.id !== "feature" ? "opacity-30" : "opacity-100",
                )}
              >
                {c.id === "feature" ? "Feature" : c.label}
                {"us" in c && c.us && (
                  <span className="ml-1 inline-block size-1.5 -translate-y-[1px] rounded-full bg-[color:var(--color-ix-cyan)] align-middle" />
                )}
              </button>
            ))}
          </div>

          {/* rows */}
          <div>
            {COMPARISON_ROWS.map((row, i) => {
              const expanded = openRow === i;
              return (
                <div
                  key={i}
                  className={cn(
                    "border-b border-[color:var(--color-ix-border)]/40 transition-colors last:border-b-0",
                    i % 2 === 0 ? "bg-white/[0.012]" : "bg-transparent",
                    row.highlight ? "ring-1 ring-[color:var(--color-ix-cyan)]/15 ring-inset" : "",
                  )}
                >
                  <button
                    type="button"
                    data-cursor="cta"
                    onClick={() => setOpenRow((v) => (v === i ? null : i))}
                    aria-expanded={expanded}
                    className="grid w-full grid-cols-[1.6fr_repeat(4,1fr)] items-center gap-2 px-4 py-3 text-left transition-colors sm:px-6 hover:bg-white/[0.018]"
                  >
                    <span
                      className={cn(
                        "flex items-center gap-2 text-sm text-[color:var(--color-ix-fg-muted)]",
                        row.highlight && "text-white",
                      )}
                    >
                      <motion.svg
                        viewBox="0 0 12 12"
                        className="size-3 shrink-0 text-[color:var(--color-ix-fg-dim)]"
                        animate={{ rotate: expanded ? 90 : 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        aria-hidden
                      >
                        <path
                          d="M4 2l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </motion.svg>
                      {row.feature}
                    </span>
                    {COL_KEYS.map((col) => (
                      <span
                        key={col}
                        onMouseEnter={() => setHoverCol(col)}
                        onMouseLeave={() => setHoverCol(null)}
                        className={cn(
                          "flex items-center justify-center text-center transition-opacity",
                          hoverCol && hoverCol !== col ? "opacity-30" : "opacity-100",
                          col === "insiderx" && "text-white",
                        )}
                      >
                        {renderCell(row[col])}
                      </span>
                    ))}
                  </button>

                  {/* Expandable methodology row */}
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        key="note"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-[1.6fr_repeat(4,1fr)] gap-2 px-4 pb-4 sm:px-6">
                          <div className="col-span-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ix-cyan)]">
                            Data behind the number
                          </div>
                          <p className="col-span-4 text-pretty text-sm leading-relaxed text-[color:var(--color-ix-fg-muted)]">
                            {row.note}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: one card per feature, tap to expand methodology */}
        <div className="mt-12 grid gap-3 md:hidden">
          {COMPARISON_ROWS.map((row, i) => {
            const expanded = openRow === i;
            return (
              <div
                key={i}
                className={cn(
                  "overflow-hidden rounded-2xl border border-[color:var(--color-ix-border)] bg-[color:var(--color-ix-surface)]/40 backdrop-blur",
                  row.highlight ? "border-[color:var(--color-ix-cyan)]/30" : "",
                )}
              >
                <button
                  type="button"
                  data-cursor="cta"
                  onClick={() => setOpenRow((v) => (v === i ? null : i))}
                  aria-expanded={expanded}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white">{row.feature}</span>
                    <motion.svg
                      viewBox="0 0 12 12"
                      className="size-3 shrink-0 text-[color:var(--color-ix-fg-dim)]"
                      animate={{ rotate: expanded ? 90 : 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      aria-hidden
                    >
                      <path
                        d="M4 2l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </motion.svg>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {COL_KEYS.map((col) => (
                      <div
                        key={col}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-xl border border-[color:var(--color-ix-border)] px-3 py-2 text-xs",
                          col === "insiderx"
                            ? "bg-[color:var(--color-ix-cyan)]/8"
                            : "bg-transparent",
                        )}
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ix-fg-dim)]">
                          {COL_LABEL[col]}
                        </span>
                        <span
                          className={cn(
                            col === "insiderx"
                              ? "text-white"
                              : "text-[color:var(--color-ix-fg-muted)]",
                          )}
                        >
                          {renderCell(row[col])}
                        </span>
                      </div>
                    ))}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      key="note"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border-t border-[color:var(--color-ix-border)]/60"
                    >
                      <div className="px-4 py-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ix-cyan)]">
                          Data behind the number
                        </div>
                        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-[color:var(--color-ix-fg-muted)]">
                          {row.note}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
