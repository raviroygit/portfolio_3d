import { cn } from "@/lib/cn";

type Tone = "default" | "signal" | "cyan";

const tones: Record<Tone, string> = {
  default: "border-border text-fg-muted",
  signal: "border-signal/40 text-signal-dim bg-signal/5",
  cyan: "border-cyan/30 text-cyan bg-cyan/5",
};

/** Small mono pill for tech chips and category tags. */
export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
