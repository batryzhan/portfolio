import { ExternalLink } from "@/components/ExternalLink";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { Section } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/content";

export function Projects() {
  return (
    <Section id="projects" title="Projects" lede="Two things I've built recently, with screenshots from the real software.">
      <div className="space-y-20 md:space-y-28">
        {projects.map((project) => (
          <article
            key={project.id}
            aria-labelledby={`${project.id}-name`}
            className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14"
          >
            <div className="md:pt-2">
              <h3 id={`${project.id}-name`} className="text-3xl font-semibold sm:text-4xl">
                {project.name}
              </h3>
              <p className="mt-1.5 text-muted-foreground">{project.expansion}</p>
              <p className="mt-6 max-w-[52ch]">{project.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Topics">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <Badge variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  </li>
                ))}
              </ul>
              <ExternalLink href={project.repo} className="mt-8 inline-block py-1 font-medium">
                View the code on GitHub
              </ExternalLink>
            </div>
            <ProjectCarousel label={`${project.name} screenshots`} slides={project.slides} />
          </article>
        ))}
      </div>
    </Section>
  );
}
