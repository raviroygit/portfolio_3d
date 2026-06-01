import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { OrchestrationField } from "@/components/three/OrchestrationField";

const stats = [
  { value: "60+", label: "model providers routed through one API" },
  { value: "1", label: "provider-agnostic orchestration layer" },
  { value: "∞", label: "fallback paths — never locked to one vendor" },
];

const layers = [
  {
    step: "01",
    title: "Model routing",
    body: "Provider-agnostic router with cost-aware selection and automatic fallback across 60+ providers.",
  },
  {
    step: "02",
    title: "Multi-model architecture",
    body: "A single request can fan out or fail over between models — no app changes required.",
  },
  {
    step: "03",
    title: "Organization-aware memory",
    body: "Agent context isolated per tenant. Memory never leaks across organizations.",
  },
  {
    step: "04",
    title: "Workflow automation",
    body: "An orchestration backend that chains models, tools, and steps into reliable workflows.",
  },
];

export function AiInfrastructure() {
  return (
    <Section
      id="ai-infrastructure"
      className="overflow-hidden border-y border-border bg-bg-2/40"
    >
      {/* the orchestration node-field — a contained ambient backdrop (clipped to
          the section, behind content, never bleeds off-layout) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden opacity-20 [mask-image:radial-gradient(60%_70%_at_70%_45%,#000,transparent_75%)] lg:block"
      >
        <OrchestrationField className="h-full w-full" />
      </div>

      <div className="relative z-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="ai-infrastructure"
            title="The orchestration layer behind the products."
            description="The single most useful thing I build: the infrastructure that makes AI products possible without rebuilding the foundation every time."
          />
          <dl className="mt-10 space-y-6">
            {stats.map((s) => (
              <Reveal key={s.label} className="flex items-baseline gap-5 border-b border-border pb-6">
                <dt className="font-mono text-4xl font-semibold text-signal">
                  {s.value}
                </dt>
                <dd className="text-sm text-fg-muted">{s.label}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {layers.map((l, i) => (
            <Reveal key={l.step} delay={i * 0.06}>
              <Card interactive className="h-full p-6">
                <span className="font-mono text-xs text-signal-dim">{l.step}</span>
                <h3 className="mt-3 font-display text-base font-semibold text-fg">
                  {l.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {l.body}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
