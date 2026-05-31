import { cn } from "@/lib/cn";

/** Pulsing status LED — used for the "available" indicator. */
export function StatusDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-2", className)} aria-hidden>
      <span className="absolute inline-flex size-full animate-led rounded-full bg-signal" />
      <span className="relative inline-flex size-2 rounded-full bg-signal" />
    </span>
  );
}
