import { Section } from "../components/Section";
import { person } from "../content";

const PINS = Array.from({ length: 9 });

function Pins({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute top-8 bottom-8 flex flex-col justify-between ${side === "left" ? "-left-3" : "-right-3"}`}
    >
      {PINS.map((_, i) => (
        <span key={i} className="block h-1.5 w-3 rounded-[1px] bg-gold-dim" />
      ))}
    </div>
  );
}

const rows: { k: string; v: string }[] = [
  { k: "Age", v: `${person.age}` },
  { k: "Based in", v: "Kyzylorda, Kazakhstan" },
  { k: "Works on", v: "Robotics, soldering, LLMs, NLP" },
  { k: "Day job", v: "Hardware Engineer, HubTech KZ" },
  { k: "Team", v: "Captain of Pulsar (FIRST Tech Challenge)" },
  { k: "Preparing for", v: person.studying.join(", ") },
];

export function About() {
  return (
    <Section id="about" title="About">
      <div className="grid gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
        <figure className="relative mx-3 max-w-sm md:mx-0">
          <Pins side="left" />
          <Pins side="right" />
          <div className="relative overflow-hidden rounded-md border border-gold-dim/70 bg-mask-deep p-2">
            <img
              src="/img/portrait.webp"
              alt="Portrait of Batyrzhan Amanbek in his lyceum jacket"
              width={800}
              height={1198}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full rounded-sm object-cover object-top"
            />
            <span aria-hidden="true" className="absolute left-4 top-4 size-2.5 rounded-full border border-gold bg-mask-deep" />
          </div>
          <figcaption className="designator mt-4 text-center">Part no. BA-16, rev. 11th grade</figcaption>
        </figure>

        <div>
          <p className="max-w-[58ch] text-xl leading-relaxed text-silk md:text-2xl">
            I&rsquo;m an 11th-grade student who likes the moment a board powers on for the first time and actually works. Most of my time goes into robots: the electronics, the code that coordinates them, and lately the language models that sit on top.
          </p>

          <dl className="mt-10 divide-y divide-trace/50 border-y border-trace/50">
            {rows.map((row) => (
              <div key={row.k} className="grid grid-cols-[9rem_1fr] gap-4 py-3 sm:grid-cols-[11rem_1fr]">
                <dt className="text-silk-dim">{row.k}</dt>
                <dd className="text-silk">{row.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex items-center gap-5 rounded-md bg-silk p-4 pr-6 text-mask-deep">
            <img
              src="/img/lyceum.webp"
              alt="Kyzylorda Bilim-Innovation Lyceum logo"
              width={120}
              height={120}
              loading="lazy"
              className="size-16 shrink-0 sm:size-20"
            />
            <div>
              <p className="text-sm text-mask/80">Education, {person.grade}</p>
              <p className="font-medium leading-snug">{person.school}</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
