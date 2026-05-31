import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { skillGroups } from "@/content/work";

export function TechnicalExpertise() {
  return (
    <Section id="expertise" className="border-y border-border bg-bg-2/40">
      <SectionHeading
        eyebrow="technical-expertise"
        title="A modern, full-stack toolkit."
        description="From the AI layer down to the database and out to mobile — the stack I use to ship platforms end to end."
      />

      <div className="mt-14 space-y-px overflow-hidden rounded-card border border-border bg-border">
        {skillGroups.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.04}>
            <div className="grid gap-4 bg-bg-2 p-6 sm:grid-cols-[200px_1fr] sm:items-center">
              <div className="font-mono text-xs uppercase tracking-[0.15em] text-signal-dim">
                {g.group}
              </div>
              <div className="flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
