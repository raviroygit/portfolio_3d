import { cn } from "@/lib/cn";

/** Terminal-style eyebrow label, e.g. `// ai-infrastructure`. */
export function MonoLabel({
  children,
  className,
  prefix = "//",
}: {
  children: React.ReactNode;
  className?: string;
  prefix?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-eyebrow uppercase tracking-[0.18em] text-signal-dim",
        className,
      )}
    >
      {prefix ? <span aria-hidden className="text-fg-subtle">{prefix}</span> : null}
      {children}
    </span>
  );
}
