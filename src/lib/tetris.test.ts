import { describe, expect, it } from "vitest";
import { COLS, ROWS, drop, emptyBoard } from "./tetris";

describe("drop", () => {
  it("lands a piece on the floor", () => {
    const res = drop(emptyBoard(), "O", 0, 1)!;
    expect(res.board[ROWS - 1][0]).toEqual({ kind: "O", id: 1 });
    expect(res.board[ROWS - 2][1]).toEqual({ kind: "O", id: 1 });
    expect(res.cleared).toBe(0);
  });

  it("stacks pieces on top of each other", () => {
    const a = drop(emptyBoard(), "O", 0, 1)!;
    const b = drop(a.board, "O", 0, 2)!;
    expect(b.board[ROWS - 3][0]?.id).toBe(2);
  });

  it("clamps a piece that would hang off the right wall", () => {
    const res = drop(emptyBoard(), "I", COLS - 1, 1)!;
    expect(res.board[ROWS - 1].slice(COLS - 4).every((c) => c?.id === 1)).toBe(true);
  });

  it("clears a full row", () => {
    let board = drop(emptyBoard(), "O", 0, 1)!.board;
    board = drop(board, "O", 2, 2)!.board;
    const res = drop(board, "O", 4, 3)!;
    expect(res.cleared).toBe(2);
    expect(res.board.flat().every((c) => c === null)).toBe(true);
  });

  it("returns null when the well is full at the spawn point", () => {
    let board = emptyBoard();
    for (let i = 0; i < ROWS / 2; i++) board = drop(board, "O", 0, i)!.board;
    expect(drop(board, "O", 0, 99)).toBeNull();
  });
});
