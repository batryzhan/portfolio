export type Vec3 = [number, number, number];

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Fibonacci-sphere formation for the robots that are still alive.
 * Failed robots get `null`; survivors are spread evenly, so losing one
 * makes the rest re-form — the TALOS idea in miniature.
 */
export function formationTargets(alive: readonly boolean[], radius: number): (Vec3 | null)[] {
  const n = alive.reduce((sum, a) => sum + (a ? 1 : 0), 0);
  let slot = 0;
  return alive.map((isAlive) => {
    if (!isAlive) return null;
    const y = n === 1 ? 0 : 1 - (slot / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * slot;
    slot++;
    return [Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius];
  });
}

/** Fail robot `i`. If it was the last one standing, the swarm reboots. */
export function failRobot(alive: readonly boolean[], i: number): boolean[] {
  if (!alive[i]) return [...alive];
  const next = alive.map((a, j) => (j === i ? false : a));
  return next.some(Boolean) ? next : next.map(() => true);
}
