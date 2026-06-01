"use client";

import { Badge } from "@/components/ui/Badge";
import { getAllProjects, projectGroups } from "@/content/work";
import { getMedia } from "@/content/media";

export function ProjectsApp() {
  const all = getAllProjects();
  return (
    <div className="space-y-6">
      {projectGroups.map((group) => {
        const items = all.filter((p) => p.group === group);
        if (!items.length) return null;
        return (
          <section key={group}>
            <h3 className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal-dim">
              {group}
            </h3>
            <ul className="space-y-2">
              {items.map((p) => {
                const media = getMedia(p.slug);
                return (
                  <li
                    key={p.slug}
                    className="flex gap-3 rounded-lg border border-border bg-bg-2/40 p-2.5"
                  >
                    <div className="h-12 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-bg">
                      {media?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={media.image}
                          alt={`${p.name} screenshot`}
                          loading="lazy"
                          className="h-full w-full object-cover object-top"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-fg">{p.name}</span>
                        <Badge tone={p.accent === "cyan" ? "cyan" : "signal"}>{p.category}</Badge>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-fg-muted">{p.tagline}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {p.stack.slice(0, 5).map((s) => (
                          <Badge key={s}>{s}</Badge>
                        ))}
                      </div>
                      {p.links.live ? (
                        <a
                          href={p.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-block font-mono text-[0.7rem] text-signal-dim hover:text-signal"
                        >
                          Visit live ↗
                        </a>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
