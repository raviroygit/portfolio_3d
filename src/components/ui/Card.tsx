import { cn } from "@/lib/cn";
import { GlowCard } from "./GlowCard";

/** Surface card with a hairline border. When `interactive`, it reuses GlowCard's
 *  cursor-following spotlight + glowing border ring + hover lift (the same effect
 *  as the "More products" grid). */
export function Card({
  children,
  className,
  interactive = false,
  glow,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  /** brand glow color forwarded to GlowCard when interactive */
  glow?: string;
}) {
  if (interactive) {
    return (
      <GlowCard glow={glow} className={className}>
        {children}
      </GlowCard>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border border-border glass shadow-card",
        className,
      )}
    >
      {/* top hairline highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent"
      />
      {children}
    </div>
  );
}
