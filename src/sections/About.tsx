import { Section } from "@/components/Section";

const facts: { k: string; v: string }[] = [
  { k: "Living in", v: "Kyzylorda, Kazakhstan" },
  { k: "Studying at ", v: "Bilim-Innovation Lyceum for gifted boys" },
  { k: "Focused on  ", v: "Embedded systems, LLMs & swarm robotics" },
  { k: "Outside work", v: "playing tetris and listening musics"}
];

export function About() {
  return (
    <Section id="about" title="About">
      <div className="grid gap-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16">
        <div className="space-y-6 text-xl leading-relaxed md:text-[1.375rem]">
          <p className="max-w-[52ch]">
            I&rsquo;m an 11th-grade student who likes the moment a board powers on for the first time and actually works.
          </p>
          <p className="max-w-[52ch] text-muted-foreground">
            Most of my time goes into robots: the electronics, the code that coordinates them, and lately the language models
            that sit on top. I like problems where hardware and software have to meet halfway.
          </p>
        </div>

        <div>
          <dl className="divide-y border-y">
            {facts.map((row) => (
              <div key={row.k} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3.5">
                <dt className="text-muted-foreground">{row.k}</dt>
                <dd>{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
