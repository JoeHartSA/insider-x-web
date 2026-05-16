import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { POSTS } from "@/content/posts";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Engineering notes, performance benchmarks, and research from the Insider-X team.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Notes from the deck."
        highlight="the deck."
        subtitle="Engineering write-ups, benchmark methodology, and research from the team."
      />
      <section className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8">
        <div className="grid gap-4">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              data-cursor="cta"
              className="group block"
            >
              <GlassCard className="flex items-center justify-between gap-6 p-6 transition-all group-hover:border-[color:var(--color-ix-cyan)]/40">
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="rounded-full bg-[color:var(--color-ix-cyan)]/15 px-2 py-0.5 font-mono uppercase tracking-[0.2em] text-[color:var(--color-ix-cyan)]">
                      {p.tag}
                    </span>
                    <span className="font-mono uppercase tracking-[0.2em] text-[color:var(--color-ix-fg-dim)]">
                      {p.date}
                    </span>
                  </div>
                  <h3 className="display-3 mt-2 text-white">{p.title}</h3>
                  <p className="mt-2 max-w-[60ch] text-sm text-[color:var(--color-ix-fg-muted)]">
                    {p.excerpt}
                  </p>
                </div>
                <span className="text-2xl text-[color:var(--color-ix-fg-dim)] transition-transform group-hover:translate-x-1 group-hover:text-[color:var(--color-ix-cyan)]">
                  →
                </span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
