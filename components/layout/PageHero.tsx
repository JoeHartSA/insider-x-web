import { KineticHeading } from "@/components/ui/KineticHeading";

type Props = {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
};

export function PageHero({ eyebrow, title, highlight, subtitle }: Props) {
  return (
    <section className="relative isolate w-full overflow-hidden border-b border-[color:var(--color-ix-border)] pb-16 pt-40">
      <div
        aria-hidden
        className="aurora-fallback pointer-events-none absolute inset-0 -z-10 opacity-60"
      />
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <span className="eyebrow">{eyebrow}</span>
        <KineticHeading
          as="h1"
          text={title}
          highlight={highlight}
          highlightClassName="gradient-text-fleet"
          className="mt-4 font-display font-medium tracking-[-0.04em] leading-[0.95] text-balance text-white text-[clamp(2.25rem,8vw,6rem)] max-w-[24ch]"
        />
        {subtitle && (
          <p className="mt-6 max-w-[60ch] text-pretty text-lg text-[color:var(--color-ix-fg-muted)]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
