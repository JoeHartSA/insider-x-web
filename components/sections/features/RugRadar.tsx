"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { seededRandom } from "@/lib/utils";

/**
 * RugRadar diorama — animated SVG.
 *
 * A bubble-map cluster of holder dots. A "dev wallet" pulses red and a thin
 * transfer line traces to a bundle aggregator. A radar sweep rotates across
 * the cluster, then two chips slide in:
 *   1. Bundle consolidation detected · 4 wallets · 2.7s ago
 *   2. Auto-exit fired · -8.4% slippage · saved 92%
 *
 * Loops every ~6s.
 */
export function RugRadar() {
  const reduced = useReducedMotion();
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setIteration((i) => i + 1), 6200);
    return () => clearInterval(id);
  }, [reduced]);

  // Deterministic holder positions (small spread around center)
  const holders = useMemo(() => {
    const rng = seededRandom(31);
    return Array.from({ length: 22 }, (_, i) => {
      const ang = rng() * Math.PI * 2;
      const rad = 30 + rng() * 110;
      return {
        i,
        cx: 220 + Math.cos(ang) * rad,
        cy: 240 + Math.sin(ang) * rad,
        r: 5 + rng() * 9,
        phase: rng(),
      };
    });
  }, []);

  return (
    <div className="relative h-[360px] w-full sm:h-[520px]">
      <svg
        key={iteration}
        viewBox="0 0 720 520"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="rug-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5be9ff" />
            <stop offset="0.5" stopColor="#7b5bff" />
            <stop offset="1" stopColor="#ff49c8" />
          </linearGradient>
          <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(91,233,255,0.42)" />
            <stop offset="1" stopColor="rgba(91,233,255,0)" />
          </radialGradient>
          <radialGradient id="dev-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(255,77,109,0.85)" />
            <stop offset="1" stopColor="rgba(255,77,109,0)" />
          </radialGradient>
          <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <pattern id="rug-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(123,91,255,0.06)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="720" height="520" fill="url(#rug-grid)" />

        {/* labels */}
        <g
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          letterSpacing="2"
          fill="rgba(168,159,196,0.7)"
        >
          <text x="40" y="40">BUBBLE-MAP · LIVE</text>
          <text x="500" y="40">BUNDLE AGGREGATOR</text>
        </g>

        {/* radar circle backdrop */}
        <circle cx="220" cy="240" r="160" fill="url(#radar-glow)" opacity="0.55" />
        <circle cx="220" cy="240" r="160" fill="none" stroke="rgba(91,233,255,0.18)" strokeWidth="1" />
        <circle cx="220" cy="240" r="100" fill="none" stroke="rgba(91,233,255,0.14)" strokeWidth="1" />
        <circle cx="220" cy="240" r="50" fill="none" stroke="rgba(91,233,255,0.12)" strokeWidth="1" />

        {/* rotating sweep */}
        {!reduced && (
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "220px 240px" }}
          >
            <path
              d="M 220 240 L 380 240 A 160 160 0 0 0 360 175 Z"
              fill="url(#rug-grad)"
              opacity="0.18"
            />
            <line x1="220" y1="240" x2="380" y2="240" stroke="rgba(91,233,255,0.65)" strokeWidth="1.3" />
          </motion.g>
        )}

        {/* holder bubbles */}
        {holders.map((h) => (
          <motion.circle
            key={h.i}
            cx={h.cx}
            cy={h.cy}
            r={h.r}
            fill="rgba(123,91,255,0.18)"
            stroke="rgba(123,91,255,0.55)"
            strokeWidth="1"
            initial={{ opacity: 0.55, scale: 1 }}
            animate={
              reduced
                ? { opacity: 0.7, scale: 1 }
                : { opacity: [0.55, 0.85, 0.55], scale: [1, 1.05, 1] }
            }
            transition={{ duration: 2.4, delay: h.phase * 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${h.cx}px ${h.cy}px` }}
          />
        ))}

        {/* dev wallet — pulsing red, fixed position */}
        <g>
          <circle cx="180" cy="200" r="22" fill="url(#dev-glow)" />
          <motion.circle
            cx="180"
            cy="200"
            r="9"
            fill="#ff4d6d"
            stroke="#ffb1bf"
            strokeWidth="1.2"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={
              reduced
                ? { opacity: 1, scale: 1 }
                : { opacity: [0.7, 1, 0.7], scale: [1, 1.18, 1] }
            }
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "180px 200px" }}
          />
          <text
            x="180"
            y="170"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            fill="#ff7d92"
          >
            dev-wallet
          </text>
        </g>

        {/* aggregator node (right) */}
        <g>
          <circle cx="580" cy="240" r="36" fill="rgba(91,233,255,0.08)" stroke="rgba(91,233,255,0.45)" strokeWidth="1.4" />
          <circle cx="580" cy="240" r="14" fill="rgba(123,91,255,0.35)" stroke="#9d8cff" strokeWidth="1" />
          <text
            x="580"
            y="298"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            fill="rgba(168,159,196,0.85)"
          >
            bundle.agg
          </text>
        </g>

        {/* transfer path: dev → aggregator (animated dashed line) */}
        <path
          id="rug-transfer"
          d="M 180 200 C 260 160 460 180 580 240"
          fill="none"
          stroke="rgba(255,77,109,0.35)"
          strokeWidth="1.4"
          strokeDasharray="5 7"
        />
        {!reduced && (
          <motion.circle
            r="5"
            fill="#ff4d6d"
            filter="url(#dot-glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.4, times: [0, 0.1, 0.95, 1], delay: 0.6, ease: "easeInOut" }}
          >
            <animateMotion dur="2.4s" begin="0.6s" repeatCount="1" fill="freeze">
              <mpath href="#rug-transfer" />
            </animateMotion>
          </motion.circle>
        )}

        {/* aggregator pulse on impact */}
        {!reduced && (
          <motion.circle
            cx="580"
            cy="240"
            r="40"
            fill="none"
            stroke="rgba(255,77,109,0.8)"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.7, 1.7, 2.2] }}
            transition={{ duration: 1.2, delay: 3.0, ease: "easeOut" }}
            style={{ transformOrigin: "580px 240px" }}
          />
        )}

        {/* alert chip 1 — bundle consolidation */}
        {!reduced && (
          <motion.g
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: [0, 1, 1, 1], x: [40, 0, 0, 0] }}
            transition={{ duration: 6.0, times: [0, 0.55, 0.6, 1], delay: 0, ease: "easeOut" }}
          >
            <rect
              x="380"
              y="380"
              width="300"
              height="40"
              rx="20"
              fill="rgba(11,7,23,0.85)"
              stroke="rgba(255,77,109,0.6)"
              strokeWidth="1"
            />
            <circle cx="400" cy="400" r="5" fill="#ff4d6d" />
            <text
              x="418"
              y="397"
              fontFamily="ui-monospace, monospace"
              fontSize="10"
              fill="#ffffff"
              letterSpacing="1"
            >
              Bundle consolidation detected
            </text>
            <text
              x="418"
              y="411"
              fontFamily="ui-monospace, monospace"
              fontSize="9"
              fill="rgba(168,159,196,0.85)"
              letterSpacing="1"
            >
              4 wallets · 2.7s ago
            </text>
          </motion.g>
        )}

        {/* alert chip 2 — auto-exit fired */}
        {!reduced && (
          <motion.g
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: [0, 0, 1, 1], x: [40, 40, 0, 0] }}
            transition={{ duration: 6.0, times: [0, 0.7, 0.78, 1], delay: 0, ease: "easeOut" }}
          >
            <rect
              x="380"
              y="430"
              width="300"
              height="40"
              rx="20"
              fill="rgba(11,7,23,0.9)"
              stroke="rgba(91,233,255,0.55)"
              strokeWidth="1"
            />
            <circle cx="400" cy="450" r="5" fill="#5be9ff" />
            <text
              x="418"
              y="447"
              fontFamily="ui-monospace, monospace"
              fontSize="10"
              fill="#ffffff"
              letterSpacing="1"
            >
              Auto-exit fired
            </text>
            <text
              x="418"
              y="461"
              fontFamily="ui-monospace, monospace"
              fontSize="9"
              fill="rgba(91,233,255,0.85)"
              letterSpacing="1"
            >
              -8.4% slippage · saved 92%
            </text>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
