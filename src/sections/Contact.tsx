import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
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
    <section id="contact" aria-labelledby="contact-title" className="mt-12 bg-muted px-4 pb-10 pt-20 sm:px-8 md:pt-28">
      <div className="mx-auto max-w-6xl">
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

        <ul className="mt-14 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {links.map((link) => (
            <li key={link.href} className="bg-background">
              <ExternalLink
                href={link.href}
                underline={false}
                className="flex min-h-20 flex-col justify-center gap-0.5 px-5 py-4 transition-colors hover:bg-accent"
              >
                <span className="font-medium">{link.label}</span>
                <span className="font-mono text-sm text-muted-foreground">{link.handle}</span>
              </ExternalLink>
            </li>
          ))}
        </ul>

        <footer className="mt-16 flex flex-wrap justify-between gap-4 border-t pt-6 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {person.name}
          </p>
          <p>Built with React, shadcn/ui and a soldering iron nearby.</p>
        </footer>
      </div>
    </section>
  );
}
