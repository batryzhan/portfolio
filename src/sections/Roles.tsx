import { ExternalLink } from "@/components/ExternalLink";
import { Section } from "@/components/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { roles } from "@/content";

/** 3D concept renders (generated with Codex + gpt-image, see scripts/optimize-images.mjs). */
const renders: Record<string, { name: string; alt: string }> = {
  hardware: {
    name: "pcb",
    alt: "3D render of a purple microcontroller board with gold pads, a USB-C port and four mounting holes.",
  },
  team: {
    name: "ftc-robot",
    alt: "3D concept render of an FTC robot for team 38924: mecanum drivetrain, linear-slide lift, claw and violet side panels.",
  },
};

export function Roles() {
  return (
    <Section id="roles" title="What I do">
      <ul className="grid gap-5 md:grid-cols-2">
        {roles.map((role) => {
          const art = renders[role.id];
          return (
            <li key={role.id}>
              <Card className="h-full gap-0 overflow-hidden py-0 shadow-none">
                <div className="border-b bg-white">
                  <img
                    src={`/images/renders/${art.name}-640.webp`}
                    srcSet={`/images/renders/${art.name}-640.webp 640w, /images/renders/${art.name}-1200.webp 1200w`}
                    sizes="(min-width: 768px) 560px, 100vw"
                    alt={art.alt}
                    width={640}
                    height={427}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3/2] w-full object-contain"
                  />
                </div>
                <CardHeader className="pt-6">
                  <CardTitle className="text-2xl font-semibold tracking-tight">{role.title}</CardTitle>
                  <CardDescription>
                    <ExternalLink href={role.href} className="text-base text-primary">
                      {role.org}
                    </ExternalLink>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-7 pt-3">
                  <p className="max-w-[46ch] text-muted-foreground">{role.body}</p>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
