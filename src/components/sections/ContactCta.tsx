import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { StatusDot } from "@/components/ui/StatusDot";
import { Reveal } from "@/components/motion/Reveal";
import { EarthGlobe } from "@/components/three/EarthGlobe";
import { siteConfig } from "@/lib/seo";

export function ContactCta() {
  return (
    <Section id="contact" className="overflow-hidden border-t border-border">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        {/* text column */}
        <Reveal>
          <MonoLabel>contact</MonoLabel>
          <h2 className="mt-5 text-balance font-display text-display font-bold text-fg">
            Building something that needs real infrastructure?
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-lg text-fg-muted">
            If you&apos;re building an AI platform, a multi-tenant SaaS, or the
            systems underneath one — let&apos;s talk. I take on a small number of
            serious projects.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={siteConfig.calendar || "/contact"}>Book a call →</Button>
            <Button href={`mailto:${siteConfig.email}`} variant="outline" external>
              {siteConfig.email}
            </Button>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
            <StatusDot />
            available for select projects
          </div>
        </Reveal>

        {/* globe column — contained + centered, never bleeds off-edge */}
        <div className="relative hidden lg:block">
          <div
            aria-hidden
            className="spotlight pointer-events-none absolute inset-0 -z-10 opacity-70"
          />
          <EarthGlobe className="pointer-events-none mx-auto h-[26rem] w-full max-w-[26rem]" />
        </div>
      </div>
    </Section>
  );
}
