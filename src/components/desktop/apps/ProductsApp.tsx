"use client";

import { Badge } from "@/components/ui/Badge";
import { getFeaturedProjects } from "@/content/work";
import { getMedia } from "@/content/media";

export function ProductsApp() {
  const flagship = getFeaturedProjects();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {flagship.map((p) => {
        const media = getMedia(p.slug);
        return (
          <article key={p.slug} className="overflow-hidden rounded-lg border border-border bg-bg-2/40">
            <div className="aspect-[16/10] w-full overflow-hidden border-b border-border bg-bg">
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
            <div className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-fg">{p.name}</span>
                <Badge tone={p.accent === "cyan" ? "cyan" : "signal"}>{p.category}</Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-fg-muted">{p.tagline}</p>
              {p.links.live ? (
                <a
                  href={p.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-mono text-[0.7rem] text-signal-dim hover:text-signal"
                >
                  Visit live ↗
                </a>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
