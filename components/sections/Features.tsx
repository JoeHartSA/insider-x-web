"use client";

import { FEATURES } from "@/content/features";
import { KineticHeading } from "@/components/ui/KineticHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CommandPlinth } from "./features/CommandPlinth";
import { MEVShield } from "./features/MEVShield";
import { OrderHolo } from "./features/OrderHolo";

const DIORAMAS = [CommandPlinth, MEVShield, OrderHolo];

export function Features() {
  return (
    <section id="features" className="relative w-full overflow-hidden py-32" aria-label="Feature deep-dives">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-32 px-5 sm:px-8">
        {FEATURES.map((f, i) => {
          const Diorama = DIORAMAS[i];
          const flipped = i % 2 === 1;
          return (
            <div
              key={f.id}
              className={[
                "grid items-center gap-12 lg:grid-cols-2",
                flipped ? "lg:[direction:rtl]" : "",
              ].join(" ")}
            >
              {/* Diorama */}
              <div className="lg:[direction:ltr]">
                <Diorama />
              </div>

              {/* Copy */}
              <div className="space-y-5 lg:[direction:ltr]">
                <Reveal>
                  <span className="eyebrow">{f.eyebrow}</span>
                </Reveal>
                <KineticHeading
                  as="h2"
                  text={f.title}
                  className="display-2 max-w-[20ch] text-balance text-white"
                />
                <Reveal delay={0.1}>
                  <p className="max-w-[52ch] text-pretty text-[color:var(--color-ix-fg-muted)]">
                    {f.copy}
                  </p>
                </Reveal>
                <Reveal delay={0.15}>
                  <ul className="grid gap-2 pt-2 text-sm">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="mt-2 inline-block size-1.5 shrink-0 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, #5be9ff, #ff49c8)",
                          }}
                        />
                        <span className="text-[color:var(--color-ix-fg-muted)]">{b}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
