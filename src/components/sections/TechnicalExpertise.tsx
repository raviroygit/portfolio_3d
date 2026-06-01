import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { skillGroups } from "@/content/work";

export function TechnicalExpertise() {
  return (
    <Section id="expertise" className="border-y border-border bg-bg-2/40">
      <SectionHeading
        eyebrow="technical-expertise"
        title="A modern, full-stack toolkit."
        description="From the AI layer down to the database and out to mobile — the stack I use to ship platforms end to end."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {skillGroups.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.04}>
            <Card interactive className="h-full p-6">
              <div className="font-mono text-xs uppercase tracking-[0.15em] text-signal-dim">
                {g.group}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
