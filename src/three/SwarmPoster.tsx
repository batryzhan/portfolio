import { formationTargets } from "../lib/swarm";

// Same formation as the live scene, projected once, so the swap is seamless.
const DOTS = formationTargets(Array(60).fill(true), 2.2).map((t) => {
  const [x, y, z] = t!;
  const s = 1 / (1 + z * 0.12);
  return { x: x * s * 70, y: -y * s * 70, r: 3.2 * s, o: 0.45 + (z + 2.2) / 6 };
});

export function SwarmPoster({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-260 -230 520 460" preserveAspectRatio="xMidYMid meet" className={className} aria-hidden="true">
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="var(--color-gold)" opacity={Math.min(d.o, 1)} />
      ))}
    </svg>
  );
}
