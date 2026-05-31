import { cn } from "@/lib/cn";
import { Container } from "./Container";

/** Standard section vertical rhythm + optional id anchor + container. */
export function Section({
  id,
  children,
  className,
  containerClassName,
  bleed = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  /** When true, skips the inner Container (caller controls width). */
  bleed?: boolean;
}) {
  return (
    <section id={id} className={cn("relative py-20 sm:py-28", className)}>
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
