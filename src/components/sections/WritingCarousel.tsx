"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export type WritingCard = {
  slug: string;
  title: string;
  description: string;
  category: string;
  dateLabel: string;
  readingTime: string;
  coverImageUrl: string | null;
};

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

/** Horizontally-scrollable "Writing" rail with prev/next controls. */
export function WritingCarousel({ posts }: { posts: WritingCard[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const nudge = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.9, 360);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const btn =
    "grid size-10 place-items-center rounded-full border border-border text-fg-muted transition-colors hover:border-signal/50 hover:text-signal disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-fg-muted";

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="writing"
          title="From the notebook."
          description="Deep-dives on AI infrastructure, orchestration, and the systems behind the products — newest first."
        />
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous posts"
              className={btn}
              onClick={() => nudge(-1)}
              disabled={!canLeft}
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              aria-label="Next posts"
              className={btn}
              onClick={() => nudge(1)}
              disabled={!canRight}
            >
              <Chevron dir="right" />
            </button>
          </div>
          <Button href="/blog" variant="outline" size="sm">
            All writing →
          </Button>
        </div>
      </div>

      <div
        ref={scroller}
        className={cn(
          "mt-10 flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-4",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // bleed a touch to the viewport edge on small screens
          "-mx-5 px-5 sm:mx-0 sm:px-0",
        )}
      >
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="w-[280px] shrink-0 snap-start sm:w-[320px]"
          >
            <Card interactive className="h-full">
              {post.coverImageUrl ? (
                <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-bg">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    sizes="320px"
                    className="object-cover transition-transform duration-700 ease-fluid group-hover/glow:scale-[1.05]"
                  />
                </div>
              ) : null}
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge tone="signal">{post.category}</Badge>
                  <span className="font-mono text-[11px] text-fg-subtle">
                    {post.dateLabel}
                    {post.readingTime ? ` · ${post.readingTime}` : ""}
                  </span>
                </div>
                <h3 className="mt-3 line-clamp-2 font-display text-lg font-semibold text-fg transition-colors group-hover/glow:text-signal">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-pretty text-sm leading-relaxed text-fg-muted">
                  {post.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
