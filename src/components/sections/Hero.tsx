import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { StatusDot } from "@/components/ui/StatusDot";
import { Reveal } from "@/components/motion/Reveal";
import { HeroComputer } from "@/components/three/HeroComputer";
import { siteConfig } from "@/lib/seo";

const proof = [
  { value: "60+", label: "AI providers routed" },
  { value: "10+", label: "Products shipped" },
  { value: "7+ yrs", label: "Full-stack" },
  { value: "Multi-tenant", label: "By default" },
];

const focus = [
  "AI Platforms",
  "AI Infrastructure",
  "Workflow Automation",
  "Multi-Tenant SaaS",
  "Voice AI",
  "Mobile & Web",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-24">
      <Container className="relative">
        {/* Row 1 — intro text */}
        <div className="max-w-4xl">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <MonoLabel>ai-platform-engineer</MonoLabel>
              <span className="inline-flex items-center gap-2 font-mono text-eyebrow uppercase tracking-[0.18em] text-fg-muted">
                <StatusDot />
                available for select projects
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 text-balance font-display text-display-lg font-bold text-fg">
              I build the <span className="text-signal-gradient">platform</span>{" "}
              under the product.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-fg-muted">
              I&apos;m Ravi Roy — an AI Platform Engineer &amp; Infrastructure
              Architect. I design and ship production AI platforms, multi-tenant
              SaaS, agents, and the orchestration layer behind them — end to end,
              from Postgres to LLM routing to mobile.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-7 flex flex-wrap gap-2">
              {focus.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-border bg-bg-2/50 px-3 py-1 font-mono text-xs text-fg-muted"
                >
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={siteConfig.calendar || "/contact"}>
                Book a call →
              </Button>
              <Button href="/work" variant="outline">
                View work
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Row 2 — the desktop workstation, its own full-width row */}
        <Reveal delay={0.1} className="relative mt-2 sm:mt-3">
          <div
            aria-hidden
            className="spotlight pointer-events-none absolute inset-0 -z-10 opacity-80"
          />
          <HeroComputer className="pointer-events-none mx-auto h-[320px] w-full max-w-6xl [mask-image:radial-gradient(92%_88%_at_50%_50%,#000_68%,transparent_100%)] [-webkit-mask-image:radial-gradient(92%_88%_at_50%_50%,#000_68%,transparent_100%)] sm:h-[440px] lg:h-[540px] lg:pointer-events-auto" />
        </Reveal>

        {/* Row 3 — stats */}
        <Reveal delay={0.16}>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-8 sm:grid-cols-4">
            {proof.map((p) => (
              <div key={p.label}>
                <dt className="font-mono text-2xl font-semibold text-fg">
                  {p.value}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-fg-subtle">
                  {p.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
