import { Section } from "@/components/Section";
import { journey } from "@/content";

export function Journey() {
  return (
    <Section id="journey" title="My Journey" lede="Competitions, and the people I built things with.">
      <ol className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        {journey.map((item, i) => (
          <li key={item.src} className={i % 2 === 1 ? "md:mt-20" : undefined}>
            <figure>
              <div className="overflow-hidden rounded-xl border bg-muted">
                <img
                  src={item.src}
                  alt={`${item.event}: ${item.caption}`}
                  width={item.w}
                  height={item.h}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <span className="block text-lg font-semibold tracking-tight">{item.event}</span>
                <span className="mt-1 block max-w-[48ch] text-muted-foreground">{item.caption}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </Section>
  );
}
