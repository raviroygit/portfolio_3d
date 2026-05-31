import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { StatusDot } from "@/components/ui/StatusDot";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Building an AI platform, multi-tenant SaaS, or the infrastructure underneath one? Let's talk.",
  path: "/contact",
});

const channels = [
  { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { label: "GitHub", value: "github.com/raviroygit", href: siteConfig.social.github },
  { label: "LinkedIn", value: "in/erraviroy", href: siteConfig.social.linkedin },
];

export default function ContactPage() {
  return (
    <main id="main" className="pt-28 pb-24 sm:pt-36">
      <Container className="max-w-4xl">
        <MonoLabel>contact</MonoLabel>
        <h1 className="mt-5 text-balance font-display text-display font-bold text-fg">
          Let&apos;s build something serious.
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-lg text-fg-muted">
          If you&apos;re working on an AI platform, a multi-tenant SaaS, or the
          systems underneath one, tell me about it. I take on a small number of
          projects at a time.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
          <StatusDot />
          available for select projects
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <ContactForm />

          <div className="space-y-8">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-signal-dim">
                Direct channels
              </h2>
              <ul className="mt-4 space-y-3">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-center justify-between gap-4 border-b border-border pb-3 transition-colors hover:border-signal/50"
                    >
                      <span className="text-sm text-fg-muted group-hover:text-fg">
                        {c.value}
                      </span>
                      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-fg-subtle">
                        {c.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p className="font-mono text-xs leading-relaxed text-fg-subtle">
              {/* TODO(ravi): add a Cal.com / Calendly link to enable one-click booking. */}
              Prefer a call? A scheduling link is coming — for now, email works best.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
