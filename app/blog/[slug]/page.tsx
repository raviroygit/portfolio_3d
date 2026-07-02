import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Prose } from "@/components/ui/Prose";
import { getPost, getPostSlugs } from "@/content/blog";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, jsonLdScript } from "@/lib/jsonld";

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

// Remote CMS posts can be published after build — allow rendering unknown slugs.
export const dynamicParams = true;
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.frontmatter.date,
    tags: post.frontmatter.tags,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Local posts render via compiled MDX; remote CMS posts render their HTML body.
  let body: React.ReactNode;
  if (post.source === "local") {
    // compiled MDX (rendered via @next/mdx + plugins from next.config.ts)
    const { default: Content } = await import(
      `../../../content/blog/${slug}.mdx`
    );
    body = <Content />;
  } else {
    body = <div dangerouslySetInnerHTML={{ __html: post.contentHtml ?? "" }} />;
  }

  const { frontmatter } = post;

  return (
    <main id="main" className="pt-28 pb-24 sm:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          articleSchema({
            title: frontmatter.title,
            description: frontmatter.description,
            slug,
            date: frontmatter.date,
            tags: frontmatter.tags,
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Writing", path: "/blog" },
            { name: frontmatter.title, path: `/blog/${slug}` },
          ]),
        )}
      />
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="font-mono text-xs text-fg-subtle transition-colors hover:text-signal"
        >
          ← Writing
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="signal">{frontmatter.category}</Badge>
            <span className="font-mono text-xs text-fg-subtle">
              {formatDate(frontmatter.date)} · {post.readingTime}
            </span>
          </div>
          <h1 className="mt-5 text-balance font-display text-display font-bold text-fg">
            {frontmatter.title}
          </h1>
          <p className="mt-4 text-pretty text-lg text-fg-muted">
            {frontmatter.description}
          </p>
        </header>

        {post.coverImageUrl ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-card border border-border bg-bg">
            <Image
              src={post.coverImageUrl}
              alt={frontmatter.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        <Prose className="mt-10 border-t border-border pt-10">{body}</Prose>

        <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
          {frontmatter.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </Container>
    </main>
  );
}
