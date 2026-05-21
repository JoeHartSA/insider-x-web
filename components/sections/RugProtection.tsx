"use client";

import { KineticHeading } from "@/components/ui/KineticHeading";
import { Reveal } from "@/components/ui/Reveal";
import { RugRadar } from "./features/RugRadar";

/**
 * RugProtection — sits between Fleet and Command Center. Highlights
 * the on-chain anomaly detection layer (bubble-map / bundle / dev-wallet
 * monitoring) and the two response modes: auto-exit and live alert.
 */
export function RugProtection() {
  return (
    <section
      id="rug-protection"
      className="relative w-full overflow-hidden py-28 sm:py-32"
      aria-label="Rug protection and on-chain anomaly detection"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 40% at 30% 40%, rgba(255,77,109,0.10), transparent 70%), radial-gradient(60% 50% at 80% 60%, rgba(91,233,255,0.10), transparent 70%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        {/* Diorama */}
        <div className="order-2 lg:order-1">
          <RugRadar />
        </div>

        {/* Copy */}
        <div className="order-1 space-y-5 lg:order-2">
          <Reveal>
            <span className="eyebrow">04 · Rug protection</span>
          </Reveal>
          <KineticHeading
            as="h2"
            text="We see the rug before it lands."
            highlight="before it lands."
            highlightClassName="gradient-text-fleet"
            className="display-2 max-w-[20ch] text-balance text-white"
          />
          <Reveal delay={0.1}>
            <p className="max-w-[52ch] text-pretty text-[color:var(--color-ix-fg-muted)]">
              Insider-X watches the on-chain layer every block. Bundle consolidation,
              bubble-map expansion, dev-wallet transfers, suspicious top-holder rebalances —
              the second any of these light up, we react.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid gap-3 pt-2 sm:grid-cols-1">
              <div className="rounded-2xl border border-[color:var(--color-ix-border)] bg-[color:var(--color-ix-surface)]/60 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[color:var(--color-ix-cyan)]">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-[color:var(--color-ix-cyan)]"
                    style={{ boxShadow: "0 0 10px rgba(91,233,255,0.7)" }}
                  />
                  Auto-exit armed
                </div>
                <p className="mt-1.5 text-sm text-[color:var(--color-ix-fg-muted)]">
                  Your position is sold before the rug clears the mempool.
                </p>
              </div>
              <div className="rounded-2xl border border-[color:var(--color-ix-border)] bg-[color:var(--color-ix-surface)]/60 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#ffb1bf]">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-[color:var(--color-ix-red)]"
                    style={{ boxShadow: "0 0 10px rgba(255,77,109,0.7)" }}
                  />
                  Alert mode
                </div>
                <p className="mt-1.5 text-sm text-[color:var(--color-ix-fg-muted)]">
                  You get a live warning the second the pattern matches — no scrolling X.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
