import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlowCard } from "@/components/ui/GlowCard";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { getFeaturedProjects } from "@/content/work";
import { getMedia } from "@/content/media";
import { glowColor } from "@/lib/color";

function prettyHost(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function FeaturedProducts() {
  const flagship = getFeaturedProjects();

  return (
    <Section id="products">
      <SectionHeading
        eyebrow="featured-projects"
        title="Flagship work."
        description="The platforms and products that define what I build — each a real, live system. Real screenshots, real brand, real scale."
      />

      <div className="mt-16 space-y-20 sm:space-y-28">
        {flagship.map((p, i) => {
          const media = getMedia(p.slug);
          const glow = glowColor(media?.dominant);
          const flip = i % 2 === 1;
          const host = prettyHost(p.url ?? p.links.live);

          return (
            <Reveal key={p.slug}>
              <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                {/* screenshot in a browser frame, with brand-glow bleed behind */}
                <div
                  className={`group/shot relative lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
                >
                  {/* ambient brand glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-6 -z-10 opacity-50 blur-3xl transition-opacity duration-500 group-hover/shot:opacity-80"
                    style={{
                      background: `radial-gradient(60% 60% at 50% 40%, ${glow}, transparent 70%)`,
                    }}
                  />
                  <Link href={`/work/${p.slug}`} aria-label={`${p.name} case study`}>
                    <GlowCard surface={false} glow={glow} className="rounded-xl">
                      <BrowserFrame url={host}>
                        <div className="relative aspect-[16/10] overflow-hidden bg-bg">
                          {media?.image ? (
                            <Image
                              src={media.image}
                              alt={`${p.name} — live product screenshot`}
                              fill
                              sizes="(max-width: 1024px) 100vw, 58vw"
                              className="object-cover object-top transition-transform duration-700 ease-fluid group-hover/shot:scale-[1.03]"
                            />
                          ) : (
                            <div className="grid h-full place-items-center font-display text-2xl text-fg/70">
                              {p.name}
                            </div>
                          )}
                        </div>
                      </BrowserFrame>
                    </GlowCard>
                  </Link>
                </div>

                {/* content */}
                <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-5xl font-bold text-fg/10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-3">
                      {media?.logo ? (
                        <span className="grid size-10 place-items-center overflow-hidden rounded-xl border border-border bg-bg-2">
                          <Image
                            src={media.logo}
                            alt={`${p.name} logo`}
                            width={28}
                            height={28}
                            className="size-7 object-contain"
                          />
                        </span>
                      ) : null}
                      <Badge tone={p.accent === "cyan" ? "cyan" : "signal"}>
                        {p.category}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="mt-5 font-display text-3xl font-semibold text-fg sm:text-4xl">
                    {p.name}
                  </h3>
                  <p className="mt-4 text-pretty text-fg-muted">{p.tagline}</p>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 6).map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <Link
                      href={`/work/${p.slug}`}
                      className="group/cta inline-flex items-center gap-1.5 font-mono text-sm text-signal-dim transition-colors hover:text-signal"
                    >
                      Read case study
                      <span aria-hidden className="transition-transform group-hover/cta:translate-x-1">→</span>
                    </Link>
                    {p.links.live ? (
                      <a
                        href={p.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-sm text-fg-subtle transition-colors hover:text-fg"
                      >
                        Visit live ↗
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
