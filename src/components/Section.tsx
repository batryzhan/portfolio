import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  designator: string;
  title: string;
  children: ReactNode;
  className?: string;
};

/** A board region: silkscreen designator, heading, and a gold trace on the left edge. */
export function Section({ id, designator, title, children, className = "" }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={`relative px-4 py-24 sm:px-8 md:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-baseline gap-4 border-b border-trace/60 pb-4 md:mb-16">
          <span className="designator" aria-hidden="true">
            {designator}
          </span>
          <h2
            id={headingId}
            className="font-display text-5xl font-bold leading-none tracking-tight text-silk sm:text-6xl md:text-7xl"
          >
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
