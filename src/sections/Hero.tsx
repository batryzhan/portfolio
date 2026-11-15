import { Button } from "@/components/ui/button";
import { person } from "@/content";

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="px-4 pb-14 pt-24 sm:px-8 md:pb-16 md:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-14">
        <div>
          <p className="fade-in text-muted-foreground" style={{ animationDelay: "0.5s" }}>
            # a young Robotics and NLP enthusiast
          </p>
          <h1 className="mt-5 text-[clamp(3.25rem,8.2vw,7.25rem)] font-bold leading-[0.88] tracking-[-0.045em]">
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span className="rise">{person.first}</span>
            </span>
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span className="rise" style={{ animationDelay: "0.1s" }}>
                {person.last}
              </span>
            </span>
          </h1>
          <div className="fade-in" style={{ animationDelay: "0.6s" }}>
            <p className="mt-6 max-w-[34ch] text-xl leading-snug text-foreground/85 md:mt-7 md:text-[1.375rem]">{person.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#projects">See my projects</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`mailto:${person.email}`}>Email me</a>
              </Button>
            </div>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-sm md:max-w-full">
          <img
            src="/img/portrait.webp"
            alt="Portrait of Batyrzhan Amanbek in his lyceum jacket"
            width={800}
            height={1198}
            fetchPriority="high"
            decoding="async"
            className="aspect-[6/7] w-full rounded-2xl border object-cover object-top md:mx-auto md:w-[min(100%,calc(0.857*clamp(22rem,calc(100svh-13rem),38rem)))]"
          />
          <figcaption className="mt-3 text-sm text-muted-foreground">
            Hardware engineer at HubTech KZ. Captain of robotics team Pulsar.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
