import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { getAllPosts } from "@/content/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Writing",
  description:
    "Technical deep-dives on AI infrastructure, orchestration, agents, multi-tenant SaaS, and system design by Ravi Roy.",
  path: "/blog",
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main id="main" className="pt-28 pb-24 sm:pt-36">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="writing"
          title="Notes on building AI infrastructure."
          description="Deep-dives on the systems I build — orchestration, agents, multi-tenancy, and the architecture decisions behind them."
        />

        <div className="mt-12 space-y-4">
          {posts.length === 0 ? (
            <p className="font-mono text-sm text-fg-subtle">
              No posts yet — coming soon.
            </p>
          ) : (
            posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.05}>
                <Link href={`/blog/${post.slug}`} className="block">
                  <Card interactive className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge tone="signal">{post.frontmatter.category}</Badge>
                      <span className="font-mono text-xs text-fg-subtle">
                        {formatDate(post.frontmatter.date)} · {post.readingTime}
                      </span>
                    </div>
                    <h2 className="mt-4 font-display text-xl font-semibold text-fg transition-colors group-hover:text-signal">
                      {post.frontmatter.title}
                    </h2>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-fg-muted">
                      {post.frontmatter.description}
                    </p>
                  </Card>
                </Link>
              </Reveal>
            ))
          )}
        </div>
      </Container>
    </main>
  );
}
