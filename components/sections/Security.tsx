"use client";

import { motion, useReducedMotion } from "motion/react";
import { KineticHeading } from "@/components/ui/KineticHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";

/**
 * Breathing network topology diagram:
 *   YOU → keys (local, non-custodial)
 *      ↓
 *   Insider-X router
 *      ↓
 *   Validator + RPC mesh (3 nodes shown)
 *      ↓
 *   Solana cluster (with Jito bundle path)
 */
function Topology() {
  const reduced = useReducedMotion();

  return (
    <svg viewBox="0 0 600 400" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="topo-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5be9ff" />
          <stop offset="1" stopColor="#ff49c8" />
        </linearGradient>
      </defs>

      {/* nodes */}
      {[
        { id: "you", x: 300, y: 50, label: "You · local keys" },
        { id: "router", x: 300, y: 160, label: "Insider-X router" },
        { id: "rpc1", x: 160, y: 260, label: "RPC · Frankfurt" },
        { id: "rpc2", x: 300, y: 260, label: "RPC · Tokyo" },
        { id: "rpc3", x: 440, y: 260, label: "RPC · Virginia" },
        { id: "jito", x: 300, y: 350, label: "Solana · Jito bundle" },
      ].map((n) => (
        <g key={n.id}>
          {!reduced && (
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="20"
              fill="none"
              stroke="url(#topo-line)"
              strokeWidth="1"
              animate={{ r: [16, 22, 16], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <circle cx={n.x} cy={n.y} r="6" fill="#5be9ff" />
          <text
            x={n.x}
            y={n.y - 14}
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            letterSpacing="2"
            textAnchor="middle"
            fill="rgba(245,241,255,0.7)"
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* edges */}
      {[
        ["300,50", "300,160"],
        ["300,160", "160,260"],
        ["300,160", "300,260"],
        ["300,160", "440,260"],
        ["160,260", "300,350"],
        ["300,260", "300,350"],
        ["440,260", "300,350"],
      ].map(([a, b], i) => {
        const [x1, y1] = a.split(",").map(Number);
        const [x2, y2] = b.split(",").map(Number);
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(123,91,255,0.35)"
              strokeWidth="1"
            />
            {!reduced && (
              <motion.circle
                cx={x1}
                cy={y1}
                r="2.5"
                fill="#5be9ff"
                initial={{ cx: x1, cy: y1, opacity: 0 }}
                animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function Security() {
  return (
    <section className="relative w-full bg-[color:var(--color-ix-bg)] py-32" aria-label="Security and infrastructure">
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-5">
          <span className="eyebrow">08 · Security</span>
          <KineticHeading
            as="h2"
            text="Your keys. Our wires."
            highlight="Our wires."
            highlightClassName="gradient-text-fleet"
            className="display-2 max-w-[18ch]"
          />
          <Reveal>
            <p className="max-w-[55ch] text-pretty text-[color:var(--color-ix-fg-muted)]">
              Wallets are generated and encrypted client-side. We never touch your private keys
              and physically cannot move your funds. Orders ride a private validator mesh
              co-located with the three major Solana clusters and ship through signed Jito
              bundles when latency matters.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label: "Non-custodial", value: "Yes · keys client-side" },
              { label: "Audits", value: "OtterSec · Q1 + Q3" },
              { label: "Open-source SDK", value: "MIT · github.com/insider-x" },
              { label: "Status", value: "99.97% · 90d" },
            ].map((s) => (
              <GlassCard key={s.label} className="px-4 py-3 text-sm">
                <div className="eyebrow opacity-70">{s.label}</div>
                <div className="mt-1 font-mono text-[13px] text-white">{s.value}</div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="relative h-[420px] w-full overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--color-ix-border)] bg-[color:var(--color-ix-surface)]/40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(91,233,255,0.12), transparent 70%)",
            }}
          />
          <Topology />
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between text-[10px] text-[color:var(--color-ix-fg-dim)]">
            <span>Routing topology</span>
            <span className="font-mono">end-to-end signed · TLS 1.3</span>
          </div>
        </div>
      </div>
    </section>
  );
}
