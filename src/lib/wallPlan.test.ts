import { describe, expect, it } from "vitest";
import { BOARD_COLS, LETTER_H, planWord, wordMask } from "./wallPlan";

describe("wallPlan", () => {
  const rows = LETTER_H + 3;

  it("every letter has a cell count divisible by four", () => {
    expect(wordMask(rows).length % 4).toBe(0);
  });

  it("tiles the word exactly with droppable tetrominoes", () => {
    for (let i = 0; i < 30; i++) {
      const plan = planWord(rows);
      expect(plan).not.toBeNull();
      const placed = new Set<string>();
      for (const p of plan!) {
        expect(p.cells).toHaveLength(4);
        for (const [x, y] of p.cells) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThan(BOARD_COLS);
          placed.add(`${x},${y}`);
        }
      }
      const mask = new Set(wordMask(rows).map(([x, y]) => `${x},${y}`));
      expect(placed).toEqual(mask);
    }
  });
});
