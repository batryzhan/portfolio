import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { person } from "../content";
import { SwarmPoster } from "../three/SwarmPoster";

const SwarmScene = lazy(() => import("../three/SwarmScene"));

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Load the 3D chunk only after first paint, when the browser is idle. */
function useDeferredWebGL() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!supportsWebGL()) return;
    const go = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(go, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(go, 300);
    return () => clearTimeout(id);
  }, []);
  return ready;
}

/** Pause the render loop when the hero scrolls out of view. */
function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible] as const;
}

export function Hero() {
  const webgl = useDeferredWebGL();
  const [ref, visible] = useOnScreen<HTMLElement>();
  const [status, setStatus] = useState<{ online: number; total: number } | null>(null);
  const [kicks, setKicks] = useState(0);

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden px-4 pb-14 pt-24 sm:px-8 md:pb-20"
    >
      <div className="absolute inset-x-0 top-12 -z-10 h-[52%] md:inset-y-0 md:left-[30%] md:h-auto" aria-hidden={!webgl}>
        <SwarmPoster className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${status ? "opacity-0" : "opacity-100"}`} />
        {webgl && (
          <Suspense fallback={null}>
            <SwarmScene active={visible} kicks={kicks} onStatus={setStatus} />
          </Suspense>
        )}
      </div>
      {/* Keeps the name legible over the swarm on narrow screens. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-mask-deep via-mask-deep/70 to-transparent md:hidden"
        aria-hidden="true"
      />

      <div className="pointer-events-none mx-auto w-full max-w-6xl">
        <p className="fade-in mb-6 max-w-md text-silk-dim" style={{ animationDelay: "0.5s" }}>
          {person.age} years old. Robotics, soldering and language models, from Kyzylorda, Kazakhstan.
        </p>
        <h1 className="font-display font-black uppercase leading-[0.82] tracking-[-0.01em] text-silk">
          <span className="block overflow-hidden text-[clamp(4.25rem,15vw,13rem)]">
            <span className="rise">{person.first}</span>
          </span>
          <span className="block overflow-hidden text-[clamp(4.25rem,15vw,13rem)] text-gold">
            <span className="rise" style={{ animationDelay: "0.12s" }}>
              {person.last}
            </span>
          </span>
        </h1>
        <div className="fade-in mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end" style={{ animationDelay: "0.7s" }}>
          <p className="max-w-xl text-lg text-silk md:text-xl">{person.tagline}</p>
          <p className="pointer-events-auto font-mono text-sm text-silk-dim" aria-live="polite">
            {status ? (
              <>
                <span className={status.online < status.total ? "text-fault" : "text-gold"}>
                  {status.online}/{status.total}
                </span>{" "}
                robots online
                <span className="block text-silk-dim/80">
                  Click one to knock it out, or{" "}
                  <button type="button" onClick={() => setKicks((k) => k + 1)} className="trace-link py-1 text-gold">
                    fail a random robot
                  </button>
                  . The rest re-form.
                </span>
              </>
            ) : (
              <span className="text-silk-dim/80">Hardware Engineer at HubTech KZ. Captain of Pulsar.</span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
