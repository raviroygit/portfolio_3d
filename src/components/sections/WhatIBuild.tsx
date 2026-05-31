import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { capabilities } from "@/content/work";

export function WhatIBuild() {
  return (
    <Section id="what-i-build">
      <SectionHeading
        eyebrow="what-i-build"
        title="Not websites. Platforms, agents, and infrastructure."
        description="Most of what I build is the hard layer underneath AI products — the orchestration, identity, and multi-tenancy that make them work at scale."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap, i) => (
          <Reveal key={cap.title} delay={i * 0.05}>
            <Card className="h-full p-6">
              <h3 className="font-display text-lg font-semibold text-fg">
                {cap.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {cap.description}
              </p>
              <ul className="mt-5 space-y-2">
                {cap.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 font-mono text-xs text-fg-subtle"
                  >
                    <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-signal" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
