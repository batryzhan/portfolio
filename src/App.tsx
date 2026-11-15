import { Nav } from "./components/Nav";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Roles } from "./sections/Roles";
import { Projects } from "./sections/Projects";
import { Achievements } from "./sections/Achievements";
import { Journey } from "./sections/Journey";
import { OffDuty } from "./sections/OffDuty";
import { Contact } from "./sections/Contact";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-mask-deep"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Roles />
        <Projects />
        <Achievements />
        <Journey />
        <OffDuty />
        <Contact />
      </main>
    </>
  );
}
