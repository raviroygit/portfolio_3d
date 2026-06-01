"use client";

import { siteConfig } from "@/lib/seo";

const links = [
  { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { label: "GitHub", value: "github.com/raviroygit", href: siteConfig.social.github },
  { label: "LinkedIn", value: "linkedin.com/in/erraviroy", href: siteConfig.social.linkedin },
  { label: "Contact page", value: "raviroy.in/contact", href: "/contact" },
];

export function ContactApp() {
  return (
    <div className="space-y-3 text-sm">
      <p className="text-fg-muted">
        Building an AI platform, multi-tenant SaaS, or the infrastructure behind it? Let&apos;s talk.
      </p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center justify-between rounded-lg border border-border bg-bg-2/40 px-3 py-2.5 transition-colors hover:border-signal/40"
            >
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-signal-dim">
                {l.label}
              </span>
              <span className="truncate text-xs text-fg">{l.value}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
