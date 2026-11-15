import { describe, expect, it } from "vitest";
import { failRobot, formationTargets } from "./swarm";

describe("formationTargets", () => {
  it("gives each alive robot a distinct target and skips failed ones", () => {
    const alive = [true, false, true, true];
    const targets = formationTargets(alive, 2);
    expect(targets).toHaveLength(4);
    expect(targets[1]).toBeNull();
    const keys = targets.filter(Boolean).map((t) => t!.map((v) => v.toFixed(3)).join(","));
    expect(new Set(keys).size).toBe(3);
  });

  it("places targets on a sphere of the given radius", () => {
    const targets = formationTargets([true, true, true, true, true], 3);
    for (const t of targets) {
      const [x, y, z] = t!;
      expect(Math.hypot(x, y, z)).toBeCloseTo(3, 5);
    }
  });

  it("redistributes when a robot fails (survivors re-form)", () => {
    const before = formationTargets([true, true, true], 1);
    const after = formationTargets([true, false, true], 1);
    expect(after[2]).not.toEqual(before[2]);
  });
});

describe("failRobot", () => {
  it("marks one robot as failed without mutating the input", () => {
    const alive = [true, true, true];
    const next = failRobot(alive, 1);
    expect(next).toEqual([true, false, true]);
    expect(alive).toEqual([true, true, true]);
  });

  it("resets the whole swarm when the last robot would fail", () => {
    expect(failRobot([false, true, false], 1)).toEqual([true, true, true]);
  });

  it("ignores an out-of-range or already-failed index", () => {
    expect(failRobot([true, false], 5)).toEqual([true, false]);
    expect(failRobot([true, false, true], 1)).toEqual([true, false, true]);
  });
});
