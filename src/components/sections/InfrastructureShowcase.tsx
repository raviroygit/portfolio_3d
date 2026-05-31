import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { infraSystems } from "@/content/infrastructure";

export function InfrastructureShowcase() {
  return (
    <Section id="infrastructure">
      <SectionHeading
        eyebrow="infrastructure-and-automation"
        title="The platforms underneath the products."
        description="Internal infrastructure I've built and run in production — the hard layer other products delegate to. Solved once, correctly, and reused everywhere."
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-2">
        {infraSystems.map((sys, i) => (
          <Reveal key={sys.slug} delay={(i % 2) * 0.06}>
            <Card interactive className="flex h-full flex-col p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-signal-dim">{sys.index}</span>
                <Badge tone={sys.accent}>{sys.tagline}</Badge>
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold text-fg sm:text-2xl">
                {sys.name}
              </h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-fg-muted">
                {sys.description}
              </p>

              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {sys.capabilities.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2 font-mono text-xs text-fg-subtle"
                  >
                    <span
                      aria-hidden
                      className={`mt-1.5 size-1 shrink-0 rounded-full ${sys.accent === "cyan" ? "bg-cyan" : "bg-signal"}`}
                    />
                    {c}
                  </li>
                ))}
              </ul>

              {sys.supports ? (
                <div className="mt-6 border-t border-border pt-5">
                  <div className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-fg-subtle">
                    {sys.supports.label}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {sys.supports.items.map((it) => (
                      <Badge key={it}>{it}</Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-auto pt-6">
                <div className="flex flex-wrap gap-1.5">
                  {sys.stack.map((s) => (
                    <span key={s} className="font-mono text-[0.7rem] text-fg-subtle">
                      {s}
                    </span>
                  )).reduce<React.ReactNode[]>((acc, el, idx) => {
                    if (idx > 0) acc.push(<span key={`d${idx}`} className="text-fg-subtle/40">·</span>);
                    acc.push(el);
                    return acc;
                  }, [])}
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
