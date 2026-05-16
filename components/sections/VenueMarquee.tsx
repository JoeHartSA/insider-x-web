"use client";

import { Marquee } from "@/components/ui/Marquee";
import { VENUES } from "@/content/venues";

/**
 * Dual-row counter-rotating marquees of venue badges under the hero.
 */
export function VenueMarquee() {
  const row1 = VENUES.slice(0, 6);
  const row2 = VENUES.slice(4);

  return (
    <div className="relative isolate w-full space-y-3 py-6">
      <Marquee speed={42}>
        {row1.map((v) => (
          <Pill key={v.id} short={v.short} name={v.name} />
        ))}
      </Marquee>
      <Marquee speed={56} reverse>
        {row2.map((v) => (
          <Pill key={v.id} short={v.short} name={v.name} muted />
        ))}
      </Marquee>
    </div>
  );
}

function Pill({ short, name, muted }: { short: string; name: string; muted?: boolean }) {
  return (
    <span
      className={[
        "group inline-flex shrink-0 items-center gap-3 rounded-full border border-[color:var(--color-ix-border)] px-5 py-2 text-sm transition-colors",
        muted ? "text-[color:var(--color-ix-fg-dim)]" : "text-[color:var(--color-ix-fg-muted)]",
        "hover:text-white hover:border-[color:var(--color-ix-cyan)]/40",
      ].join(" ")}
    >
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase">{short}</span>
      <span className="size-1 rounded-full bg-current opacity-40" />
      <span>{name}</span>
    </span>
  );
}
