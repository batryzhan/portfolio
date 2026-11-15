import type { ReactElement } from "react";
import { ExternalLink } from "../components/ExternalLink";
import { Section } from "../components/Section";
import { projects } from "../content";

/** Three robots carry goods from depot to dock; R2 fails and R3 picks up its load. */
function TalosDiagram() {
  return (
    <svg viewBox="0 0 320 230" className="h-auto w-full" role="img" aria-labelledby="talos-diagram-title">
      <title id="talos-diagram-title">Diagram: robot R2 fails on the way to the dock, and R3 reroutes to take over its delivery.</title>
      <g className="font-mono text-[14px]">
        <rect x="6" y="30" width="44" height="160" rx="4" fill="none" stroke="var(--color-trace)" />
        <text x="28" y="214" textAnchor="middle" className="fill-silk-dim">depot</text>
        <rect x="270" y="30" width="44" height="160" rx="4" fill="none" stroke="var(--color-trace)" />
        <text x="292" y="214" textAnchor="middle" className="fill-silk-dim">dock</text>

        <path d="M50 60 H270" stroke="var(--color-gold-dim)" strokeDasharray="3 5" />
        <circle cx="170" cy="60" r="9" fill="var(--color-gold-dim)" />
        <text x="170" y="40" textAnchor="middle" className="fill-silk-dim">R1</text>

        <path d="M50 115 H112" stroke="var(--color-fault)" strokeDasharray="3 5" />
        <circle cx="120" cy="115" r="9" fill="none" stroke="var(--color-fault)" strokeWidth="1.5" />
        <path d="M114 109 l12 12 M126 109 l-12 12" stroke="var(--color-fault)" strokeWidth="1.5" />
        <text x="120" y="146" textAnchor="middle" className="fill-fault">R2 down</text>

        <path d="M50 175 C150 175 160 115 270 115" fill="none" stroke="var(--color-gold)" strokeWidth="1.75" />
        <circle cx="222" cy="115.5" r="9" fill="var(--color-gold)" />
        <text x="222" y="95" textAnchor="middle" className="fill-gold">R3 takes over</text>
      </g>
    </svg>
  );
}

const exampleTickets = [
  { p: "P1", text: "Paid for a car, it never arrived in my garage", tone: "text-fault border-fault/60" },
  { p: "P2", text: "Can't log in after the update", tone: "text-gold border-gold/60" },
  { p: "P3", text: "How do I change my nickname?", tone: "text-silk-dim border-trace" },
];

function TriageQueue() {
  return (
    <figure>
      <ol className="space-y-2" aria-label="Example of sorted support requests">
        {exampleTickets.map((t) => (
          <li key={t.p} className="flex items-center gap-3 rounded-sm bg-mask-deep/80 px-3 py-2.5 text-sm">
            <span className={`shrink-0 rounded-sm border px-1.5 font-mono text-xs ${t.tone}`}>{t.p}</span>
            <span className="text-silk">{t.text}</span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-sm text-silk-dim">Illustrative requests. Each gets a priority and a drafted reply that an admin approves.</figcaption>
    </figure>
  );
}

const illustrations: Record<string, ReactElement> = {
  talos: <TalosDiagram />,
  triage: <TriageQueue />,
};

export function Projects() {
  return (
    <Section id="projects" designator="J2" title="Projects">
      <div className="space-y-6">
        {projects.map((project) => (
          <article
            key={project.id}
            className="grid gap-10 rounded-md border border-trace/60 bg-mask-raised/40 p-6 sm:p-10 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:items-center"
          >
            <div>
              <h3 className="font-display text-6xl font-black leading-none text-gold md:text-7xl">{project.name}</h3>
              <p className="mt-2 text-silk-dim">{project.expansion}</p>
              <p className="mt-6 max-w-[56ch] text-lg text-silk">{project.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Topics">
                {project.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-trace px-3 py-1 text-sm text-silk-dim">
                    {tag}
                  </li>
                ))}
              </ul>
              <ExternalLink href={project.repo} className="mt-8 inline-block py-1 font-medium text-silk">
                View the code on GitHub
              </ExternalLink>
            </div>
            <div>{illustrations[project.id]}</div>
          </article>
        ))}
      </div>
    </Section>
  );
}
