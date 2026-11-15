import { useEffect, useState } from "react";
import { ExternalLink } from "../components/ExternalLink";
import { links, person } from "../content";

export function Contact() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative border-t border-trace/60 bg-mask-deep/70 px-4 pb-10 pt-24 sm:px-8 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <span className="designator" aria-hidden="true">
          J5
        </span>
        <h2 id="contact-title" className="mt-3 max-w-4xl font-display text-[clamp(3rem,9vw,7.5rem)] font-black leading-[0.9] text-silk">
          Building something with robots or LLMs? Let&rsquo;s talk.
        </h2>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a href={`mailto:${person.email}`} className="trace-link text-2xl font-medium text-gold sm:text-3xl">
            {person.email}
          </a>
          <button
            type="button"
            onClick={copy}
            className="min-h-11 rounded-sm border border-trace px-4 text-sm text-silk-dim transition-colors hover:border-gold hover:text-gold"
          >
            {copied ? "Copied" : "Copy email"}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? "Email address copied" : ""}
          </span>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-md bg-trace/50 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <li key={link.href} className="bg-mask-deep">
              <ExternalLink href={link.href} className="flex min-h-16 items-baseline justify-between gap-4 px-5 py-5 hover:bg-mask">
                <span className="text-silk">{link.label}</span>
                <span className="font-mono text-sm text-silk-dim">{link.handle}</span>
              </ExternalLink>
            </li>
          ))}
        </ul>

        <footer className="mt-20 flex flex-wrap justify-between gap-4 text-sm text-silk-dim">
          <p>© {new Date().getFullYear()} {person.name}</p>
          <p>Built with React, Three.js and a soldering iron nearby.</p>
        </footer>
      </div>
    </section>
  );
}
