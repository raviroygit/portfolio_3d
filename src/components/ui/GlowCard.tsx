"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { SIGNAL_GLOW } from "@/lib/color";

/**
 * Premium interactive card: a cursor-following spotlight fill + a glowing border
 * ring (masked gradient) that lights up on hover, tinted to the project's brand
 * color (`glow`). Lifts subtly. Falls back to a static frame under reduced motion.
 */
export function GlowCard({
  children,
  className,
  glow = SIGNAL_GLOW,
  interactive = true,
  surface = true,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
  interactive?: boolean;
  /** When false, render only the glow overlays + lift (no glass base / hairline),
   *  so the card can wrap an already-framed element without a double border. */
  surface?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const live = interactive && !reduced;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={live ? onMove : undefined}
      style={{ "--glow": glow } as React.CSSProperties}
      className={cn(
        "group/glow relative overflow-hidden rounded-card",
        surface && "border border-border glass shadow-card",
        live &&
          "transition-[transform,border-color,box-shadow] duration-300 ease-fluid hover:-translate-y-1 hover:shadow-glow",
        live && surface && "hover:border-transparent",
        className,
      )}
    >
      {/* top hairline highlight */}
      {surface ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent"
        />
      ) : null}

      {live ? (
        <>
          {/* spotlight fill following the cursor */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover/glow:opacity-100"
            style={{
              background:
                "radial-gradient(300px circle at var(--mx, 50%) var(--my, 0%), color-mix(in oklch, var(--glow) 16%, transparent), transparent 65%)",
            }}
          />
          {/* glowing border ring, masked to the 1.5px frame, tinted by --glow */}
          <span
            aria-hidden
            className="glow-ring pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/glow:opacity-100"
            style={{
              background:
                "radial-gradient(240px circle at var(--mx, 50%) var(--my, 0%), var(--glow), transparent 60%)",
            }}
          />
        </>
      ) : null}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
