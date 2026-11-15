const items = [
  { href: "#about", label: "About", mobileHidden: true },
  { href: "#projects", label: "Projects", mobileHidden: false },
  { href: "#achievements", label: "Achievements", mobileHidden: true },
  { href: "#contact", label: "Contact", mobileHidden: false },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-trace/40 bg-mask-deep/75 backdrop-blur-md">
      <nav aria-label="Primary" className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-8">
        <a href="#top" className="font-display text-2xl font-black tracking-wide text-gold" aria-label="Batyrzhan Amanbek, back to top">
          BA
        </a>
        <ul className="flex items-center gap-4 text-sm sm:gap-7 sm:text-[0.9375rem]">
          {items.map((item) => (
            <li key={item.href} className={item.mobileHidden ? "hidden sm:block" : undefined}>
              <a href={item.href} className="trace-link py-2 text-silk-dim">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
