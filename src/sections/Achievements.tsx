import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { achievements } from "@/content";
import { prefersReducedMotion } from "@/lib/motion";

const TOTAL_PRIZE = achievements.reduce((sum, a) => sum + (a.prize ?? 0), 0);
const fmt = new Intl.NumberFormat("en-US");

/** Counts up once when scrolled into view; shows the final value for reduced motion. */
function useCountUp(target: number, duration = 1200) {
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
      <p className="mb-12 max-w-3xl text-[clamp(1.75rem,4.2vw,3rem)] font-semibold leading-[1.1] tracking-tight">
        <span ref={ref} className="text-primary">
          {fmt.format(value)} KZT
        </span>{" "}
        <span className="text-muted-foreground">won at two national hackathons, plus a national robotics final.</span>
      </p>

      <ol className="grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-3">
        {achievements.map((a) => {
          const first = a.place === "1st place";
          return (
            <li key={a.title} className="flex flex-col gap-4 bg-background p-6 md:p-7">
              <img
                src={a.image.src}
                width={a.image.w}
                height={a.image.h}
                alt={a.image.alt}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: a.image.position }}
                className="aspect-[4/3] w-full rounded-lg object-cover"
              />
              <Badge variant={first ? "default" : "outline"} className="w-fit">
                {a.place}
              </Badge>
              <div className="flex-1">
                <h3 className="text-xl font-semibold leading-snug tracking-tight">{a.title}</h3>
                <p className="mt-1 text-muted-foreground">{a.detail}</p>
              </div>
              <p className="mt-2 flex items-baseline justify-between border-t pt-4 font-mono text-sm">
                <span className="text-muted-foreground">{a.prize ? "Prize" : "Result"}</span>
                <span className={first ? "tabular-nums" : "text-muted-foreground"}>
                  {a.prize ? `${fmt.format(a.prize)} KZT` : "Top 20"}
                </span>
              </p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
