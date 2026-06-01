import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { getProject, getProjectSlugs, getAllProjects } from "@/content/work";
import { getMedia } from "@/content/media";
import { buildMetadata, siteConfig } from "@/lib/seo";
import { softwareSchema, breadcrumbSchema, jsonLdScript } from "@/lib/jsonld";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  // OG image comes from the colocated opengraph-image.tsx (branded 1200×630).
  return buildMetadata({
    title: project.name,
    description: project.tagline,
    path: `/work/${slug}`,
    type: "article",
  });
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border py-8 sm:grid sm:grid-cols-[200px_1fr] sm:gap-8">
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-signal-dim">
        {label}
      </h2>
      <div className="mt-4 sm:mt-0">{children}</div>
    </div>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const media = getMedia(slug);
  const accent = media?.dominant ?? undefined;
  const next = getAllProjects().find((p) => p.slug !== slug);

  return (
    <main id="main" className="pt-28 pb-24 sm:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          softwareSchema({
            name: project.name,
            description: project.tagline,
            slug: project.slug,
            category: project.category,
            image: media?.image ?? undefined,
            appUrl: project.links.live ?? project.url,
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: project.name, path: `/work/${project.slug}` },
          ]),
        )}
      />
      <Container className="max-w-4xl">
        <Link
          href="/work"
          className="font-mono text-xs text-fg-subtle transition-colors hover:text-signal"
        >
          ← All Work
        </Link>

        {/* header */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {media?.logo ? (
            <span className="grid size-9 place-items-center overflow-hidden rounded-lg border border-border bg-bg-2">
              <Image
                src={media.logo}
                alt={`${project.name} logo`}
                width={24}
                height={24}
                className="size-6 object-contain"
              />
            </span>
          ) : null}
          <Badge tone={project.accent === "cyan" ? "cyan" : "signal"}>
            {project.category}
          </Badge>
          <span className="font-mono text-xs text-fg-subtle">
            {project.timeframe}
          </span>
        </div>
        <h1 className="mt-5 text-balance font-display text-display font-bold text-fg">
          {project.name}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg text-fg-muted">
          {project.tagline}
        </p>

        {/* links + role */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          {project.links.live ? (
            <Button href={project.links.live} size="sm" external>
              Live ↗
            </Button>
          ) : null}
          {project.links.playStore ? (
            <Button href={project.links.playStore} size="sm" external>
              Google Play ↗
            </Button>
          ) : null}
          {project.links.appStore ? (
            <Button href={project.links.appStore} size="sm" variant="outline" external>
              App Store ↗
            </Button>
          ) : null}
          {project.links.repo ? (
            <Button href={project.links.repo} size="sm" variant="outline" external>
              Repo ↗
            </Button>
          ) : null}
          <span className="font-mono text-xs text-fg-subtle">{project.role}</span>
        </div>

        {/* real product screenshot */}
        {media?.image ? (
          <figure className="mt-10 overflow-hidden rounded-card border border-border bg-bg">
            <span
              aria-hidden
              className="block h-0.5 w-full"
              style={{ background: accent ?? "var(--color-signal)" }}
            />
            <Image
              src={media.image}
              alt={`${project.name} — live product screenshot`}
              width={media.dims?.width ?? 1280}
              height={media.dims?.height ?? 800}
              className="w-full"
              priority
            />
          </figure>
        ) : null}

        {/* metrics */}
        {project.metrics && project.metrics.length > 0 ? (
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="bg-bg-2 p-5">
                <dt className="font-mono text-xl font-semibold text-signal">
                  {m.value}
                </dt>
                <dd className="mt-1 text-xs text-fg-subtle">{m.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {/* body */}
        <div className="mt-12">
          <Block label="Problem">
            <p className="text-pretty leading-relaxed text-fg-muted">
              {project.problem}
            </p>
          </Block>

          <Block label="Approach">
            <ul className="space-y-3">
              {project.approach.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-fg-muted">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-signal" />
                  {a}
                </li>
              ))}
            </ul>
          </Block>

          <Block label="Architecture">
            <ul className="space-y-3">
              {project.architecture.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-fg-muted">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-cyan" />
                  {a}
                </li>
              ))}
            </ul>
          </Block>

          <Block label="Stack">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </Block>
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-card border border-border bg-bg-2/60 p-8 text-center">
          <MonoLabel className="justify-center">lets-build</MonoLabel>
          <h2 className="mt-4 font-display text-h2 font-semibold text-fg">
            Building something like this?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-fg-muted">
            If you need this kind of platform or infrastructure, let&apos;s talk.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href={siteConfig.calendar || "/contact"}>Book a call →</Button>
            {next ? (
              <Button href={`/work/${next.slug}`} variant="outline">
                Next: {next.name}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </main>
  );
}
