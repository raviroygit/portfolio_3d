"use client";

import { experiences } from "@/content/work";
import { siteConfig } from "@/lib/seo";

export function AboutApp() {
  return (
    <div className="space-y-5 text-sm">
      <div>
        <h3 className="font-display text-lg font-semibold text-fg">{siteConfig.name}</h3>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-signal-dim">
          AI Platform Engineer &amp; Infrastructure Architect
        </p>
        <p className="mt-2 leading-relaxed text-fg-muted">{siteConfig.description}</p>
      </div>

      <div>
        <h4 className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal-dim">
          Experience
        </h4>
        <ul className="space-y-3">
          {experiences.map((e) => (
            <li key={`${e.company}-${e.date}`} className="border-l border-border pl-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="font-semibold text-fg">{e.role}</span>
                <span className="font-mono text-[0.7rem] text-fg-subtle">{e.date}</span>
              </div>
              <div className="text-xs text-fg-muted">{e.company}</div>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-fg-subtle">
                {e.points.slice(0, 2).map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3 font-mono text-xs">
        <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="text-signal-dim hover:text-signal">GitHub ↗</a>
        <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-signal-dim hover:text-signal">LinkedIn ↗</a>
        <a href={`mailto:${siteConfig.email}`} className="text-signal-dim hover:text-signal">{siteConfig.email}</a>
      </div>
    </div>
  );
}
