"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/use-in-view";

/**
 * Gates a 3D scene: only renders (and thus code-splits / loads) its children
 * when near the viewport, and falls back to a static poster under
 * prefers-reduced-motion. Keeps three.js out of the initial bundle and
 * respects accessibility + low-power devices.
 */
export function Lazy3D({
  children,
  poster,
  className,
  rootMargin = "300px",
}: {
  children: React.ReactNode;
  poster: React.ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin, once: true });
  const reduced = useReducedMotion();
  const show = inView && !reduced;

  return (
    <div ref={ref} className={cn("relative", className)}>
      {show ? children : poster}
    </div>
  );
}
