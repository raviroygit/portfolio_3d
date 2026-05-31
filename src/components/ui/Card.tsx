import { cn } from "@/lib/cn";

/** Surface card with hairline border + signal hover glow. */
export function Card({
  children,
  className,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border border-border bg-bg-2/60 shadow-card backdrop-blur-sm",
        interactive &&
          "group transition-colors duration-300 ease-fluid hover:border-signal/40",
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
