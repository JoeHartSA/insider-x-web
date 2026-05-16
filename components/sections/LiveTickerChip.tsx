"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Tiny live data chip shown under the hero CTA. Numbers tick with a soft jitter
 * to feel like live data — replace with real feed when wired.
 */
export function LiveTickerChip({ className }: { className?: string }) {
  const [sol, setSol] = useState(187.42);
  const [vol, setVol] = useState(4.18);
  const [lat, setLat] = useState(184);

  useEffect(() => {
    const id = setInterval(() => {
      setSol((s) => Math.max(140, s + (Math.random() - 0.5) * 0.35));
      setVol((v) => Math.max(2, v + (Math.random() - 0.5) * 0.05));
      setLat((l) => Math.max(140, Math.min(240, l + (Math.random() - 0.5) * 8)));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-x-5 gap-y-2 rounded-full px-4 py-2 text-[12px] glass numerals-tabular",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <span className="relative inline-flex size-1.5 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--color-ix-green)] opacity-70" />
          <span className="size-1.5 rounded-full bg-[color:var(--color-ix-green)]" />
        </span>
        <span className="text-[color:var(--color-ix-fg-muted)]">LIVE</span>
      </span>
      <Stat label="SOL" value={`$${sol.toFixed(2)}`} />
      <Stat label="24h vol routed" value={`$${vol.toFixed(2)}B`} />
      <Stat label="median fill" value={`${Math.round(lat)}ms`} accent />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-[color:var(--color-ix-fg-dim)]">{label}</span>
      <span className={cn("font-mono", accent && "text-[color:var(--color-ix-cyan)]")}>{value}</span>
    </span>
  );
}
