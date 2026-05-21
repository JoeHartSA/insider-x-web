"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type Tab = "limit" | "dca" | "trailing";
const TABS: { id: Tab; label: string }[] = [
  { id: "limit", label: "Limit" },
  { id: "dca", label: "DCA" },
  { id: "trailing", label: "Trailing" },
];

const W = 720;
const H = 360;

function priceCurve(seed: number, samples: number): [number, number][] {
  const pts: [number, number][] = [];
  let v = 0.55;
  for (let i = 0; i < samples; i++) {
    v += (Math.sin(i * 0.4 + seed) + Math.cos(i * 0.15 + seed * 2)) * 0.022;
    const x = (i / (samples - 1)) * W;
    const y = H * (0.85 - v * 0.55);
    pts.push([x, y]);
  }
  return pts;
}

function path(pts: [number, number][]) {
  return pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(" ");
}

/**
 * Order Holo — animated SVG holographic order book / diagram tabs.
 *
 * Each tab draws its own animated chart annotation: a limit line, a DCA
 * pulse series, a trailing stop band.
 */
export function OrderHolo() {
  const [tab, setTab] = useState<Tab>("limit");
  const reduced = useReducedMotion();
  const samples = 100;
  const curve = priceCurve(2, samples);
  const curvePath = path(curve);

  // Auto-cycle tabs every 4s
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setTab((t) => {
        const i = TABS.findIndex((x) => x.id === t);
        return TABS[(i + 1) % TABS.length].id;
      });
    }, 4200);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="relative h-[400px] w-full sm:h-[520px]">
      <div className="glass-strong absolute inset-0 overflow-hidden rounded-[var(--radius-lg)] p-5">
        {/* tabs */}
        <div className="flex items-center gap-2">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                data-cursor="cta"
                className={[
                  "relative rounded-full px-3 py-1.5 text-xs font-mono uppercase tracking-[0.18em] transition-colors",
                  active
                    ? "text-black"
                    : "text-[color:var(--color-ix-fg-muted)] hover:text-white",
                ].join(" ")}
              >
                {active && (
                  <motion.span
                    layoutId="holo-tab"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, #5be9ff 0%, #7b5bff 50%, #ff49c8 100%)",
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 36 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2 text-[10px] text-[color:var(--color-ix-fg-dim)]">
            <span className="size-1.5 rounded-full bg-[color:var(--color-ix-cyan)]" />
            live · on-chain keeper
          </div>
        </div>

        {/* chart */}
        <div className="relative mt-4 h-[calc(100%-3.5rem)] w-full">
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="price-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(91,233,255,0.45)" />
                <stop offset="1" stopColor="rgba(91,233,255,0)" />
              </linearGradient>
              <pattern id="holo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(123,91,255,0.05)" />
              </pattern>
              <linearGradient id="holo-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#5be9ff" />
                <stop offset="1" stopColor="#ff49c8" />
              </linearGradient>
            </defs>

            <rect width={W} height={H} fill="url(#holo-grid)" />

            {/* price area */}
            <path d={`${curvePath} L ${W} ${H} L 0 ${H} Z`} fill="url(#price-grad)" />
            {/* price line */}
            <motion.path
              d={curvePath}
              fill="none"
              stroke="#dfd6ff"
              strokeWidth="1.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* per-tab annotation */}
            {tab === "limit" && (
              <g key="limit">
                <motion.line
                  x1="0"
                  x2={W}
                  y1={H * 0.32}
                  y2={H * 0.32}
                  stroke="url(#holo-stroke)"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                <motion.circle
                  cx={W * 0.66}
                  cy={H * 0.32}
                  r="5"
                  fill="#5be9ff"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ duration: 0.6, delay: 1 }}
                />
                <text
                  x="14"
                  y={H * 0.32 - 8}
                  fontFamily="ui-monospace, monospace"
                  fontSize="10"
                  letterSpacing="2"
                  fill="#5be9ff"
                >
                  LIMIT @ $0.0241
                </text>
              </g>
            )}

            {tab === "dca" && (
              <g key="dca">
                {[0, 1, 2, 3, 4].map((i) => {
                  const cx = (i / 4) * W * 0.9 + W * 0.05;
                  const cy = H * 0.7 - i * 6;
                  return (
                    <motion.g
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                      transition={{ delay: 0.15 + i * 0.18, duration: 0.55 }}
                    >
                      <circle cx={cx} cy={cy} r="10" fill="rgba(91,233,255,0.15)" />
                      <circle cx={cx} cy={cy} r="4" fill="#5be9ff" />
                    </motion.g>
                  );
                })}
                <motion.path
                  d="M 36 252 Q 200 200 360 240 T 684 188"
                  stroke="rgba(91,233,255,0.5)"
                  strokeDasharray="4 6"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 0.6 }}
                />
                <text
                  x="14"
                  y="26"
                  fontFamily="ui-monospace, monospace"
                  fontSize="10"
                  letterSpacing="2"
                  fill="#5be9ff"
                >
                  DCA · 5 buys · 4h spacing
                </text>
              </g>
            )}

            {tab === "trailing" && (
              <g key="trailing">
                <motion.path
                  d={`M 0 ${H * 0.55} ${curve
                    .map(([x, y]) => `L ${x} ${y - 30}`)
                    .join(" ")}`}
                  fill="none"
                  stroke="url(#holo-stroke)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4 }}
                />
                <motion.circle
                  cx={curve[curve.length - 1][0]}
                  cy={curve[curve.length - 1][1] - 30}
                  r="6"
                  fill="#ff49c8"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                />
                <text
                  x="14"
                  y="26"
                  fontFamily="ui-monospace, monospace"
                  fontSize="10"
                  letterSpacing="2"
                  fill="#5be9ff"
                >
                  TRAILING STOP · 8%
                </text>
              </g>
            )}
          </svg>

          {/* corner brackets */}
          {[
            { top: 6, left: 6, rot: 0 },
            { top: 6, right: 6, rot: 90 },
            { bottom: 6, right: 6, rot: 180 },
            { bottom: 6, left: 6, rot: 270 },
          ].map((b, i) => (
            <span
              key={i}
              className="absolute size-3 border-[color:var(--color-ix-cyan)]/60"
              style={{
                ...b,
                borderLeftWidth: 1,
                borderTopWidth: 1,
                transform: `rotate(${b.rot}deg)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
