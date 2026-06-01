import { cn } from "@/lib/cn";
import { MonoLabel } from "./MonoLabel";

/** Section header: mono eyebrow + display title + optional lede. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** heading level — pass "h1" when this is the page's primary heading */
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <MonoLabel>{eyebrow}</MonoLabel> : null}
      <Heading className="text-balance font-display text-h2 font-semibold text-fg">
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-pretty text-fg-muted",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
