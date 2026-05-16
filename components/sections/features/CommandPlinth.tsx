"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { seededRandom } from "@/lib/utils";

const COLS = ["Wallet", "Token", "Size", "Entry", "Mark", "PnL", ""];

type Row = {
  id: string;
  wallet: string;
  token: string;
  size: string;
  entry: string;
  mark: string;
  pnl: number;
  color: string;
};

const TOKENS = [
  { sym: "WIF", color: "#5be9ff" },
  { sym: "BONK", color: "#ffd166" },
  { sym: "JLP", color: "#7b5bff" },
  { sym: "POPCAT", color: "#ff49c8" },
  { sym: "PNUT", color: "#2bff9a" },
  { sym: "MOTHER", color: "#ffd166" },
];

function buildRows(count = 7): Row[] {
  const rng = seededRandom(7);
  return Array.from({ length: count }).map((_, i) => {
    const t = TOKENS[i % TOKENS.length];
    const pnl = (rng() - 0.4) * 8.4;
    const wallet = `0x${Math.floor(rng() * 0xfffff)
      .toString(16)
      .padStart(5, "0")}…${Math.floor(rng() * 0xfff)
      .toString(16)
      .padStart(3, "0")}`;
    return {
      id: `r-${i}`,
      wallet,
      token: t.sym,
      size: `${(rng() * 9 + 0.4).toFixed(2)} SOL`,
      entry: `$${(rng() * 5 + 0.01).toFixed(4)}`,
      mark: `$${(rng() * 5 + 0.01).toFixed(4)}`,
      pnl,
      color: t.color,
    };
  });
}

/** The mock multi-wallet "command center" UI shown on a tilted glass plinth. */
export function CommandPlinth() {
  const [rows, setRows] = useState<Row[]>(() => {
    if (typeof window === "undefined") return buildRows();
    return buildRows(window.matchMedia("(max-width: 767px)").matches ? 4 : 7);
  });
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  // Live PnL jitter so the panel feels alive
  useEffect(() => {
    const id = setInterval(() => {
      setRows((rs) =>
        rs.map((r) => ({
          ...r,
          pnl: r.pnl + (Math.random() - 0.5) * 0.4,
          mark: `$${(parseFloat(r.mark.slice(1)) + (Math.random() - 0.5) * 0.002).toFixed(4)}`,
        })),
      );
    }, 1100);
    return () => clearInterval(id);
  }, []);

  // Mouse-driven plinth tilt
  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    let raf = 0;
    const state = { rx: -14, ry: 8, tx: -14, ty: 8 };
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      state.tx = -14 + ((cy - e.clientY) / r.height) * 8;
      state.ty = 8 + ((e.clientX - cx) / r.width) * 12;
    };
    const tick = () => {
      state.rx += (state.tx - state.rx) * 0.08;
      state.ry += (state.ty - state.ry) * 0.08;
      inner.style.transform = `perspective(1400px) rotateX(${state.rx}deg) rotateY(${state.ry}deg) rotateZ(-1deg)`;
      raf = requestAnimationFrame(tick);
    };
    wrap.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative h-[380px] w-full sm:h-[520px]"
      style={{ perspective: "1400px" }}
    >
      {/* Plinth glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 bottom-2 h-40 rounded-[40%]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(91,233,255,0.35), rgba(123,91,255,0.1) 60%, transparent 80%)",
          filter: "blur(28px)",
        }}
      />

      <Reveal className="absolute inset-0" amount={0.2} y={40}>
        <div
          ref={innerRef}
          className="relative h-full w-full origin-center"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {/* Window chrome */}
          <div className="glass-strong overflow-hidden rounded-[var(--radius-lg)] h-full">
            <div className="flex items-center justify-between border-b border-[color:var(--color-ix-border)] px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ix-fg-muted)]">
                  Insider-X · Command
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[color:var(--color-ix-fg-dim)]">
                <span className="size-1.5 rounded-full bg-[color:var(--color-ix-green)]" />
                184ms · jito-mainnet
              </div>
            </div>

            {/* Sub-toolbar */}
            <div className="flex items-center gap-2 border-b border-[color:var(--color-ix-border)] px-4 py-2 text-[11px]">
              <span className="rounded bg-white/5 px-2 py-1 text-white">All 287</span>
              <span className="rounded px-2 py-1 text-[color:var(--color-ix-fg-muted)]">Snipers 38</span>
              <span className="rounded px-2 py-1 text-[color:var(--color-ix-fg-muted)]">Hedging 12</span>
              <span className="rounded px-2 py-1 text-[color:var(--color-ix-fg-muted)]">Drift 73</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="font-mono text-[color:var(--color-ix-fg-dim)]">Σ PnL</span>
                <span className="font-mono text-[color:var(--color-ix-green)]">+412.7 SOL</span>
              </div>
            </div>

            {/* Table */}
            <div className="text-[11px]">
              <div className="grid grid-cols-[1.5fr_0.8fr_0.7fr_0.8fr_0.8fr_0.8fr_0.4fr] gap-3 border-b border-[color:var(--color-ix-border)] px-4 py-2 font-mono uppercase tracking-[0.12em] text-[color:var(--color-ix-fg-dim)]">
                {COLS.map((c, i) => (
                  <span key={i}>{c}</span>
                ))}
              </div>
              {rows.map((r, i) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[1.5fr_0.8fr_0.7fr_0.8fr_0.8fr_0.8fr_0.4fr] items-center gap-3 border-b border-[color:var(--color-ix-border)]/50 px-4 py-2 font-mono transition-colors hover:bg-white/[0.02]"
                  style={{
                    background: i % 2 === 0 ? "rgba(255,255,255,0.014)" : "transparent",
                  }}
                >
                  <span className="flex items-center gap-2 text-[color:var(--color-ix-fg-muted)]">
                    <span className="size-1.5 rounded-full" style={{ background: r.color }} />
                    {r.wallet}
                  </span>
                  <span className="text-white">{r.token}</span>
                  <span className="text-[color:var(--color-ix-fg-muted)]">{r.size}</span>
                  <span className="text-[color:var(--color-ix-fg-muted)]">{r.entry}</span>
                  <span className="text-white">{r.mark}</span>
                  <span
                    className={
                      r.pnl >= 0
                        ? "text-[color:var(--color-ix-green)]"
                        : "text-[color:var(--color-ix-red)]"
                    }
                  >
                    {r.pnl >= 0 ? "+" : ""}
                    {r.pnl.toFixed(2)}
                  </span>
                  <span className="text-[color:var(--color-ix-fg-dim)]">···</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[color:var(--color-ix-border)] px-4 py-3 text-[10px]">
              <span className="font-mono text-[color:var(--color-ix-fg-dim)]">
                ⌘+F to fire across selection
              </span>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[color:var(--color-ix-cyan)]/15 px-2 py-1 text-[color:var(--color-ix-cyan)]">
                  Fire 287 wallets
                </span>
              </div>
            </div>
          </div>

          {/* Hovering selection chip in front of the panel (desktop only) */}
          <div
            className="absolute -right-4 top-12 hidden rounded-2xl border border-[color:var(--color-ix-border)] bg-black/80 p-3 backdrop-blur lg:block"
            style={{ transform: "translateZ(80px)" }}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ix-fg-dim)]">
              Selection
            </div>
            <div className="mt-1 text-2xl font-mono text-white">287 wallets</div>
            <div className="mt-1 text-[10px] text-[color:var(--color-ix-fg-muted)]">
              Snipers + Drift · grouped
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
