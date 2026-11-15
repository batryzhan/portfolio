import { Button } from "@/components/ui/button";
import { person } from "@/content";

const items = [
  { href: "#about", label: "About", mobile: false },
  { href: "#projects", label: "Projects", mobile: true },
  { href: "#achievements", label: "Achievements", mobile: false },
  { href: "#off-duty", label: "Off duty", mobile: true },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-8">
        <a href="#top" className="shrink-0 text-[1.0625rem] font-semibold tracking-tight" aria-label={`${person.name}, back to top`}>
          {person.first}
          <span className="hidden text-muted-foreground sm:inline"> {person.last}</span>
        </a>
        <ul className="ml-auto flex items-center gap-4 text-[0.9375rem] text-muted-foreground sm:gap-7">
          {items.map((item) => (
            <li key={item.href} className={item.mobile ? undefined : "hidden md:block"}>
              <a href={item.href} className="py-2 transition-colors hover:text-foreground">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <Button asChild size="sm">
          <a href="#contact">Contact</a>
        </Button>
      </nav>
    </header>
  );
}
