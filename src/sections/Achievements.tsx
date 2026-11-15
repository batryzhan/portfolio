import { useEffect, useRef, useState } from "react";
import { Section } from "../components/Section";
import { achievements } from "../content";
import { prefersReducedMotion } from "../lib/motion";

const TOTAL_PRIZE = achievements.reduce((sum, a) => sum + (a.prize ?? 0), 0);
const fmt = new Intl.NumberFormat("en-US");

/** Counts up once when scrolled into view; jumps straight to the value for reduced motion. */
function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          setValue(Math.round(target * (1 - Math.pow(1 - p, 4))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);
  return [ref, value] as const;
}

export function Achievements() {
  const [ref, value] = useCountUp(TOTAL_PRIZE);
  return (
    <Section id="achievements" title="Achievements">
      <p className="mb-14 max-w-3xl font-display text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.95] text-silk">
        <span ref={ref} className="text-gold tabular-nums">
          {fmt.format(value)}
        </span>{" "}
        KZT won at two national hackathons.
      </p>

      <ol className="border-t border-trace/60">
        {achievements.map((a) => (
          <li
            key={a.title}
            className="grid gap-x-8 gap-y-1 border-b border-trace/60 py-6 md:grid-cols-[9rem_minmax(0,1fr)_auto] md:items-baseline"
          >
            <span className={`font-medium ${a.place === "1st place" ? "text-gold" : "text-silk-dim"}`}>{a.place}</span>
            <div>
              <h3 className="text-xl font-semibold text-silk md:text-2xl">{a.title}</h3>
              <p className="text-silk-dim">{a.detail}</p>
            </div>
            {a.prize ? <span className="font-mono text-silk tabular-nums">{fmt.format(a.prize)} KZT</span> : <span />}
          </li>
        ))}
      </ol>
    </Section>
  );
}
