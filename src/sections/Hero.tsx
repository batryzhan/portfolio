import { person } from "../content";

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative flex min-h-[100svh] flex-col justify-end px-4 pb-14 pt-24 sm:px-8 md:pb-20">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="font-display text-[clamp(4.25rem,15vw,13rem)] font-black uppercase leading-[0.82] text-silk">
          {person.first} <span className="text-gold">{person.last}</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-silk md:text-xl">{person.tagline}</p>
      </div>
    </section>
  );
}
