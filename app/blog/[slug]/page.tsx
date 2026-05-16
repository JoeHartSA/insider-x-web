import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { POSTS } from "@/content/posts";
import { PageHero } from "@/components/layout/PageHero";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <PageHero eyebrow={`Blog · ${post.tag}`} title={post.title} subtitle={post.excerpt} />
      <article className="mx-auto w-full max-w-[760px] px-5 py-16 sm:px-8">
        <p className="text-[color:var(--color-ix-fg-muted)]">
          Full write-up coming soon. We&apos;ll publish methodology, traces, and the full reasoning
          here. In the meantime, drop into our Discord with questions or grab early access below.
        </p>
        <div className="mt-8">
          <Link
            href="/blog"
            data-cursor="cta"
            className="inline-flex items-center gap-2 text-sm text-[color:var(--color-ix-cyan)]"
          >
            ← Back to blog
          </Link>
        </div>
      </article>
    </>
  );
}
