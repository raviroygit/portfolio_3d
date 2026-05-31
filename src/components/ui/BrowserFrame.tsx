import { cn } from "@/lib/cn";

/** Lightweight browser chrome around a product screenshot — adds "real product" depth. */
export function BrowserFrame({
  url,
  children,
  className,
}: {
  url?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-bg-2 shadow-card",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-bg/60 px-3 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="size-2.5 rounded-full bg-[#28c840]/80" />
        </span>
        {url ? (
          <span className="ml-2 truncate rounded-md bg-bg px-3 py-1 font-mono text-[0.7rem] text-fg-subtle">
            {url}
          </span>
        ) : null}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
