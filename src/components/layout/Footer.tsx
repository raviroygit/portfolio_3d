import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { siteConfig, navItems } from "@/lib/seo";

const social = [
  { label: "GitHub", href: siteConfig.social.github },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-2/40">
      <Container className="py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="inline-flex items-center gap-3 font-mono text-sm">
              <Image
                src="/assets/logo.png"
                alt="Ravi Roy"
                width={32}
                height={32}
                className="size-8 rounded-full border border-signal/50 object-cover"
              />
              <span className="text-fg">Ravi Roy</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              AI Platform Engineer &amp; Infrastructure Architect. Building
              production AI platforms, multi-tenant SaaS, and the orchestration
              layer behind them.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">
                Navigate
              </h3>
              <ul className="mt-4 space-y-2.5">
                {navItems.map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      className="text-sm text-fg-muted transition-colors hover:text-signal"
                    >
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">
                Elsewhere
              </h3>
              <ul className="mt-4 space-y-2.5">
                {social.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-fg-muted transition-colors hover:text-signal"
                    >
                      {s.label} ↗
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-sm text-fg-muted transition-colors hover:text-signal"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 font-mono text-xs text-fg-subtle sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Ravi Roy. All rights reserved.</span>
          <span>Built with Next.js · Three.js · designed end to end.</span>
        </div>
      </Container>
    </footer>
  );
}
