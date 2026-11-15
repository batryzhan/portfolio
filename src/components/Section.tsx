import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  title: string;
  /** One sentence under the heading that says what the section holds. */
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Page section: heading + optional lede on the left rail, content to the right on wide screens. */
export function Section({ id, title, lede, children, className }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("px-4 py-20 sm:px-8 md:py-28", className)}>
      <div className="mx-auto max-w-6xl border-t pt-8 md:pt-10">
        <div className="mb-10 max-w-2xl md:mb-14">
          <h2 id={headingId} className="text-4xl font-semibold leading-[1.05] sm:text-5xl">
            {title}
          </h2>
          {lede ? <p className="mt-4 text-lg text-muted-foreground">{lede}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
