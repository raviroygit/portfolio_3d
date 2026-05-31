import Link from "next/link";
import Image from "next/image";
import { GlowCard } from "@/components/ui/GlowCard";
import { Badge } from "@/components/ui/Badge";
import { getMedia } from "@/content/media";
import { glowColor } from "@/lib/color";
import type { Project } from "@/content/types";

/** Product card with a real screenshot, logo, and a brand-tinted hover glow. */
export function ProjectCard({ project }: { project: Project }) {
  const media = getMedia(project.slug);
  const glow = glowColor(media?.dominant);

  return (
    <Link href={`/work/${project.slug}`} className="block h-full">
      <GlowCard glow={glow} className="h-full">
        {/* screenshot */}
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-bg">
          {media?.image ? (
            <Image
              src={media.image}
              alt={`${project.name} — product screenshot`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top transition-transform duration-700 ease-fluid group-hover/glow:scale-[1.05]"
            />
          ) : (
            <div
              className="absolute inset-0 grid place-items-center"
              style={{
                backgroundImage: `radial-gradient(120% 100% at 50% 0%, ${glow}40, transparent 70%)`,
              }}
            >
              <span className="font-display text-xl font-semibold text-fg/80">
                {project.name}
              </span>
            </div>
          )}

          {/* logo chip */}
          {media?.logo ? (
            <span className="absolute bottom-3 left-3 z-10 grid size-9 place-items-center overflow-hidden rounded-lg border border-border bg-bg/80 backdrop-blur">
              <Image
                src={media.logo}
                alt={`${project.name} logo`}
                width={24}
                height={24}
                className="size-6 object-contain"
              />
            </span>
          ) : null}
        </div>

        {/* meta */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <Badge tone={project.accent === "cyan" ? "cyan" : "signal"}>
              {project.category}
            </Badge>
            <span className="font-mono text-xs text-fg-subtle">
              {project.timeframe}
            </span>
          </div>

          <h3 className="mt-4 font-display text-lg font-semibold text-fg transition-colors group-hover/glow:text-signal">
            {project.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-pretty text-sm leading-relaxed text-fg-muted">
            {project.tagline}
          </p>

          <div className="mt-5 flex items-center gap-1.5 font-mono text-xs text-signal-dim">
            View case study
            <span aria-hidden className="transition-transform group-hover/glow:translate-x-1">
              →
            </span>
          </div>
        </div>
      </GlowCard>
    </Link>
  );
}
