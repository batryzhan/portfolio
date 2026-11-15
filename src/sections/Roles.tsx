import { ExternalLink } from "@/components/ExternalLink";
import { Section } from "@/components/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { roles } from "@/content";
import hardwareArt from "@/illustrations/hardware.svg";
import teamArt from "@/illustrations/team.svg";

const art: Record<string, string> = { hardware: hardwareArt, team: teamArt };

export function Roles() {
  return (
    <Section id="roles" title="What I do">
      <ul className="grid gap-5 md:grid-cols-2">
        {roles.map((role) => (
          <li key={role.id}>
            <Card className="h-full gap-0 overflow-hidden py-0 shadow-none">
              <div className="border-b bg-muted px-6 py-4">
                <img src={art[role.id]} alt="" width={240} height={160} loading="lazy" className="mx-auto h-36 w-auto" />
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
        ))}
      </ul>
    </Section>
  );
}
