"use client";

import { useEffect, useRef } from "react";
import { TESTIMONIALS, type Testimonial } from "@/content/testimonials";
import { KineticHeading } from "@/components/ui/KineticHeading";

function ParallaxCard({ t, idx }: { t: Testimonial; idx: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip the entire effect on touch — saves listeners + reflow cost.
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    };
    const onLeave = () => {
      el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="group relative rounded-2xl border border-[color:var(--color-ix-border)] bg-[color:var(--color-ix-surface)]/50 p-5 backdrop-blur transition-transform duration-200 will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <div className="flex items-center gap-3">
        <div
          className="size-9 shrink-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, hsl(${t.avatarHue} 90% 70%), hsl(${
              t.avatarHue + 40
            } 60% 30%))`,
          }}
        />
        <div className="flex-1">
          <div className="text-sm text-white">{t.name}</div>
          <div className="font-mono text-[11px] text-[color:var(--color-ix-fg-dim)]">
            {t.handle}
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-[color:var(--color-ix-fg-dim)]" aria-hidden>
          <path d="M10.6 1H12.8L8.1 6.3 13.5 13H9.3L6 8.8 2.2 13H0L5 7.3 0 1h4.3l3 4 3.3-4z" />
        </svg>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-ix-fg-muted)]">
        {t.text}
      </p>

      {t.metric && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ix-cyan)]/25 bg-[color:var(--color-ix-cyan)]/10 px-3 py-1 font-mono text-[11px] text-[color:var(--color-ix-cyan)]">
          <span className="size-1 rounded-full bg-[color:var(--color-ix-cyan)]" />
          {t.metric}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-[10px] text-[color:var(--color-ix-fg-dim)]">
        <span>{idx + 1} of {TESTIMONIALS.length}</span>
        <span className="font-mono">verified · X</span>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative w-full overflow-hidden bg-[color:var(--color-ix-bg-2)] py-32" aria-label="Testimonials">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <header className="mb-12 flex flex-col gap-3">
          <span className="eyebrow">09 · Voices from the deck</span>
          <KineticHeading
            as="h2"
            text="Real traders. Real fills."
            highlight="Real fills."
            highlightClassName="gradient-text-fleet"
            className="display-2 max-w-[22ch]"
          />
        </header>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {TESTIMONIALS.map((t, i) => (
            <ParallaxCard key={t.handle} t={t} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
