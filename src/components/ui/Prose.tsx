import { cn } from "@/lib/cn";

/**
 * Long-form typography wrapper for MDX blog content. Hand-styled against the
 * design tokens (no typography plugin) via descendant selectors.
 */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-none text-body leading-relaxed text-fg-muted",
        // headings
        "[&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-h2 [&_h2]:font-semibold [&_h2]:text-fg [&_h2]:scroll-mt-28",
        "[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-fg",
        // body
        "[&_p]:my-5 [&_p]:text-pretty",
        "[&_a]:text-signal-dim [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-signal",
        "[&_strong]:text-fg [&_strong]:font-semibold",
        // lists
        "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-2 [&_li]:marker:text-signal-dim",
        // code
        "[&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-signal-dim",
        "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-card [&_pre]:border [&_pre]:border-border [&_pre]:bg-bg-2 [&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-relaxed",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-fg-muted",
        // blockquote
        "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-signal/50 [&_blockquote]:pl-5 [&_blockquote]:text-fg [&_blockquote]:italic",
        // media + rules
        "[&_img]:my-8 [&_img]:rounded-card [&_img]:border [&_img]:border-border",
        "[&_hr]:my-12 [&_hr]:border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}
