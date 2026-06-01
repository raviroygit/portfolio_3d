import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Reveal } from "@/components/motion/Reveal";
import { getAllProjects, getProjectsByGroup, projectGroups } from "@/content/work";
import { buildMetadata } from "@/lib/seo";
import { itemListSchema, jsonLdScript } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description:
    "AI platforms, orchestration infrastructure, multi-tenant SaaS, voice AI, and enterprise systems — case studies by Ravi Roy.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <main id="main" className="pt-28 pb-24 sm:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          itemListSchema({
            name: "Work & Case Studies",
            items: getAllProjects().map((p) => ({
              name: p.name,
              path: `/work/${p.slug}`,
            })),
          }),
        )}
      />
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="work"
          title="AI platforms, products, and systems."
          description="A selection of the AI platforms, SaaS products, and enterprise systems I've built and shipped — with live screenshots from each product."
        />

        <div className="mt-16 space-y-16">
          {projectGroups.map((group) => {
            const items = getProjectsByGroup(group);
            if (items.length === 0) return null;
            return (
              <div key={group}>
                <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-signal-dim">
                  {group}
                  <span className="ml-2 text-fg-subtle">
                    [{String(items.length).padStart(2, "0")}]
                  </span>
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p, i) => (
                    <Reveal key={p.slug} delay={(i % 3) * 0.05}>
                      <ProjectCard project={p} />
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
