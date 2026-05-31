import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { getAllProjects } from "@/content/work";

export function SelectedWork() {
  // product-tier (non-flagship) projects
  const products = getAllProjects().filter((p) => p.tier === "product");

  return (
    <Section id="work">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="more-products"
          title="More products."
          description="Consumer apps, AI tools, and platforms — built on the same orchestration and identity foundation, shipped end to end."
        />
        <Button href="/work" variant="outline" size="sm" className="shrink-0">
          All work →
        </Button>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.05}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
