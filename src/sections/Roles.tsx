import { ExternalLink } from "../components/ExternalLink";
import { Section } from "../components/Section";
import { roles } from "../content";

export function Roles() {
  return (
    <Section id="roles" title="What I do">
      <ul className="grid gap-px overflow-hidden rounded-md bg-trace/50 md:grid-cols-2">
        {roles.map((role) => (
          <li key={role.id} className="flex flex-col gap-6 bg-mask p-7 md:p-10">
            <span className="designator">{role.id}</span>
            <div>
              <h3 className="font-display text-4xl font-bold leading-tight text-silk md:text-5xl">{role.title}</h3>
              <ExternalLink href={role.href} className="mt-1 inline-block text-lg text-gold">
                {role.org}
              </ExternalLink>
            </div>
            <p className="max-w-[46ch] text-silk-dim">{role.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
