import { Section } from "../components/Section";
import { journey } from "../content";

export function Journey() {
  return (
    <Section id="journey" designator="J4" title="Robotics journey">
      <ol className="grid gap-x-8 gap-y-16 md:grid-cols-2">
        {journey.map((item, i) => (
          <li key={item.src} className={i % 2 === 1 ? "md:mt-24" : ""}>
            <figure>
              <div className="overflow-hidden rounded-md border border-trace/60 bg-mask-deep">
                <img
                  src={item.src}
                  alt={`${item.event}: ${item.caption}`}
                  width={item.w}
                  height={item.h}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-4">
                <span className="block font-display text-3xl font-bold text-silk">{item.event}</span>
                <span className="mt-1 block max-w-[48ch] text-silk-dim">{item.caption}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </Section>
  );
}
