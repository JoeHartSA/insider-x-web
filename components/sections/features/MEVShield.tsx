"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * MEVShield diorama — animated SVG.
 *
 * A red "MEV bot" dart approaches from the left and gets deflected by a
 * hexagonal shield. Simultaneously our own snipe lands sub-block on the right.
 * Loops every 4.5s.
 */
export function MEVShield() {
  const reduced = useReducedMotion();
  const [iteration, setIteration] = useState(0);

  // Force restart of the animation by changing the key
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setIteration((i) => i + 1), 4600);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="relative h-[360px] w-full sm:h-[520px]">
      <svg
        key={iteration}
        viewBox="0 0 720 520"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="shield-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5be9ff" />
            <stop offset="0.5" stopColor="#7b5bff" />
            <stop offset="1" stopColor="#ff49c8" />
          </linearGradient>
          <radialGradient id="shield-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(91,233,255,0.45)" />
            <stop offset="1" stopColor="rgba(91,233,255,0)" />
          </radialGradient>
          <filter id="threat-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <pattern id="grid-pat" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(123,91,255,0.06)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* faint grid */}
        <rect width="720" height="520" fill="url(#grid-pat)" />

        {/* labels */}
        <g fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="2" fill="rgba(168,159,196,0.7)">
          <text x="40" y="40">PUBLIC MEMPOOL</text>
          <text x="440" y="40" textAnchor="start">PRIVATE BUNDLE · JITO</text>
        </g>

        {/* vertical divider */}
        <line x1="360" y1="60" x2="360" y2="480" stroke="rgba(123,91,255,0.2)" strokeDasharray="4 6" />

        {/* shield (left half) */}
        <g transform="translate(280 260)">
          <circle r="120" fill="url(#shield-glow)" />
          <motion.g
            initial={{ scale: 0.9, opacity: 0.85 }}
            animate={
              reduced
                ? { scale: 1, opacity: 1 }
                : { scale: [0.95, 1.04, 1], opacity: [0.85, 1, 0.9] }
            }
            transition={{ duration: 4.6, times: [0, 0.5, 1], repeat: 0 }}
          >
            {/* hex shield */}
            <polygon
              points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45"
              fill="none"
              stroke="url(#shield-grad)"
              strokeWidth="1.5"
            />
            <polygon
              points="0,-72 62,-36 62,36 0,72 -62,36 -62,-36"
              fill="rgba(91,233,255,0.04)"
              stroke="rgba(91,233,255,0.45)"
              strokeWidth="0.6"
            />
            <polygon
              points="0,-54 47,-27 47,27 0,54 -47,27 -47,-27"
              fill="rgba(123,91,255,0.06)"
              stroke="rgba(123,91,255,0.5)"
              strokeWidth="0.6"
            />
            <circle r="6" fill="url(#shield-grad)" />
          </motion.g>
          <text
            y="140"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="11"
            letterSpacing="3"
            fill="#fff"
          >
            INSIDER-X SHIELD
          </text>
        </g>

        {/* incoming threat dart */}
        {!reduced && (
          <motion.g
            initial={{ x: -40, y: 200, opacity: 0 }}
            animate={{
              x: [-40, 180, 200, 100, -80],
              y: [200, 240, 260, 320, 460],
              opacity: [0, 1, 1, 1, 0],
              rotate: [10, 14, -10, 60, 100],
            }}
            transition={{ duration: 3.6, times: [0, 0.35, 0.45, 0.6, 1], ease: "easeOut" }}
            filter="url(#threat-glow)"
          >
            <polygon
              points="0,0 26,4 12,8 26,12 0,16 18,8"
              fill="#ff4d6d"
              transform="translate(0 -8)"
            />
            <text x="34" y="6" fontFamily="ui-monospace, monospace" fontSize="9" fill="#ff7d92">
              mev-bot.eth
            </text>
          </motion.g>
        )}

        {/* shield ripple on impact */}
        {!reduced && (
          <motion.circle
            cx="280"
            cy="260"
            r="90"
            fill="none"
            stroke="url(#shield-grad)"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.7, 1.6, 2] }}
            transition={{ duration: 1.4, delay: 1.3, ease: "easeOut" }}
            style={{ transformOrigin: "280px 260px" }}
          />
        )}

        {/* our snipe lands on the right (private path) */}
        <g>
          <text
            x="540"
            y="180"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            fill="rgba(168,159,196,0.7)"
          >
            ↓ private-route
          </text>

          {/* tube/path */}
          <path
            d="M 540 200 L 540 380"
            stroke="rgba(91,233,255,0.25)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 540 200 L 540 380"
            stroke="rgba(91,233,255,0.6)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            strokeLinecap="round"
          />

          {/* snipe packet */}
          {!reduced && (
            <motion.g
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: [0, 0, 180], opacity: [0, 1, 1] }}
              transition={{ duration: 2.6, times: [0, 0.2, 1], delay: 1.1, ease: "easeIn" }}
            >
              <rect
                x="530"
                y="200"
                width="20"
                height="6"
                rx="2"
                fill="#5be9ff"
                style={{ filter: "drop-shadow(0 0 8px rgba(91,233,255,0.7))" }}
              />
            </motion.g>
          )}

          {/* landing flash */}
          {!reduced && (
            <motion.circle
              cx="540"
              cy="386"
              r="6"
              fill="#5be9ff"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 6, 12] }}
              transition={{ duration: 0.8, delay: 3.4, ease: "easeOut" }}
              style={{ transformOrigin: "540px 386px" }}
            />
          )}

          <text
            x="540"
            y="430"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="10"
            letterSpacing="2"
            fill="#5be9ff"
          >
            LANDED SUB-BLOCK
          </text>
          <text
            x="540"
            y="448"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            fill="rgba(168,159,196,0.6)"
          >
            slot 248,182,401 · 184ms
          </text>
        </g>
      </svg>
    </div>
  );
}
