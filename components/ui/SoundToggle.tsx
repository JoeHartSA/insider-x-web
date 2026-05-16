"use client";

import { useEffect, useRef } from "react";
import { useSoundPref } from "@/lib/audio/sound-prefs";
import { cn } from "@/lib/utils";

/**
 * Tiny waveform toggle in the nav. Bars animate at full height when sound is on,
 * collapse to a flat line when off.
 */
export function SoundToggle({ className }: { className?: string }) {
  const [enabled, setEnabled] = useSoundPref();
  const barsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.querySelectorAll<HTMLSpanElement>("span");
    bars.forEach((b, i) => {
      b.style.animationDelay = `${i * 90}ms`;
    });
  }, []);

  return (
    <button
      type="button"
      data-cursor="cta"
      aria-pressed={enabled}
      aria-label={enabled ? "Mute sound" : "Enable sound"}
      onClick={() => setEnabled(!enabled)}
      className={cn(
        "group relative inline-flex h-9 items-center gap-2 rounded-full pl-2 pr-3 text-xs glass numerals-tabular text-[color:var(--color-ix-fg-muted)] hover:text-white transition-colors",
        className,
      )}
    >
      <div ref={barsRef} className="flex h-4 w-5 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "w-[2px] rounded-full",
              enabled
                ? "bg-[color:var(--color-ix-cyan)] animate-[sound-bar_900ms_var(--ease-in-out-expo)_infinite_alternate]"
                : "bg-[color:var(--color-ix-fg-dim)] h-[2px]",
            )}
            style={enabled ? { height: `${30 + i * 18}%` } : undefined}
          />
        ))}
      </div>
      <span className="tracking-[0.18em] uppercase">{enabled ? "Sound on" : "Sound off"}</span>

      <style jsx>{`
        @keyframes sound-bar {
          0% {
            transform: scaleY(0.35);
          }
          100% {
            transform: scaleY(1);
          }
        }
        span span {
          transform-origin: bottom;
        }
      `}</style>
    </button>
  );
}
