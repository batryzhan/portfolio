import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { ExternalLink } from "@/components/ExternalLink";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { links, person } from "@/content";

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
    <section id="contact" aria-labelledby="contact-title" className="mt-6 bg-muted px-4 pb-10 pt-14 sm:px-8 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-14">
          <div>
            <h2 id="contact-title" className="max-w-3xl text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1.02]">
              Building something with robots or LLMs? Let&rsquo;s talk.
            </h2>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 px-5 text-base">
                <a href={`mailto:${person.email}`}>{person.email}</a>
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-12 bg-background"
                    onClick={copy}
                    aria-label="Copy email address"
                  >
                    {copied ? <Check className="text-primary" /> : <Copy />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{copied ? "Copied" : "Copy email"}</TooltipContent>
              </Tooltip>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied" : ""}
              </span>
            </div>
          </div>

          <ul className="border-t border-foreground/80">
            {links.map((link) => (
              <li key={link.href} className="border-b border-foreground/15">
                <ExternalLink
                  href={link.href}
                  underline={false}
                  className="group flex items-center gap-4 py-5 transition-colors hover:text-primary"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-2xl font-semibold leading-tight tracking-tight">{link.label}</span>
                    <span className="mt-1 block font-mono text-sm text-muted-foreground">{link.handle}</span>
                  </span>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-foreground/15 bg-background transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-14 flex flex-wrap justify-between gap-4 border-t pt-6 text-sm text-muted-foreground">
          <p>
             {person.name}
          </p>
        </footer>
      </div>
    </section>
  );
}
