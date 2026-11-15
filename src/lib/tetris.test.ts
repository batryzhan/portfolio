import { describe, expect, it } from "vitest";
import { apm, BUFFER_ROWS, cellsOf, COLS, createBag, ghostY, hardDrop, hold, move, newGame, pps, rotate, step, VISIBLE_ROWS, type GameState, type PieceKind } from "./tetris";

const rows = BUFFER_ROWS + VISIBLE_ROWS;
const withPiece = (state: GameState, kind: PieceKind, x = 3, y = 0): GameState =>
  ({ ...state, active: { kind, rotation: 0, x, y } });

describe("Tetris engine", () => {
  it("deals every piece once in each bag and keeps five previews", () => {
    const bag = createBag(() => 0.4);
    for (let n = 0; n < 3; n++) {
      expect(new Set(Array.from({ length: 7 }, () => bag.next().value))).toEqual(new Set(["I", "O", "T", "S", "Z", "J", "L"]));
    }
    let state = newGame(() => 0.5);
    for (let i = 0; i < 10 && !state.gameOver; i++) {
      expect(state.queue.length).toBeGreaterThanOrEqual(5);
      state = hardDrop(state);
    }
  });
  it("hard drops onto the floor without modifying the original board", () => {
    const state = withPiece(newGame(() => 0), "O");
    const result = hardDrop(state);
    expect(result.board[rows - 1].slice(4, 6)).toEqual(["O", "O"]);
    expect(result.board[rows - 2].slice(4, 6)).toEqual(["O", "O"]);
    expect(state.board.flat().every(cell => cell === null)).toBe(true);
    expect(result.piecesPlaced).toBe(1);
  });
  it("clears a completed row", () => {
    const state = withPiece(newGame(() => 0), "I");
    state.board[rows - 1] = Array.from({ length: COLS }, (_, x) => x >= 3 && x <= 6 ? null : "J");
    const result = hardDrop(state);
    expect(result.lines).toBe(1);
    expect(result.board[rows - 1].every(cell => cell === null)).toBe(true);
  });
  it("holds once per piece and respawns swapped pieces", () => {
    const state = newGame(() => 0);
    const first = state.active.kind;
    const held = hold(state);
    expect(held.hold).toBe(first);
    expect(held.canHold).toBe(false);
    expect(hold(held)).toEqual(held);
    const locked = hardDrop(held);
    const swapped = hold(locked);
    expect(swapped.active).toEqual({ kind: first, rotation: 0, x: 3, y: BUFFER_ROWS - 1 });
    expect(swapped.hold).toBe(locked.active.kind);
  });
  it("ghost matches the hard-drop landing position", () => {
    const state = withPiece(newGame(() => 0), "T");
    state.board[rows - 1][4] = "Z";
    const y = ghostY(state);
    const result = hardDrop(state);
    for (const [x, dy] of cellsOf("T", 0)) expect(result.board[y + dy][state.active.x + x]).toBe("T");
  });
  it("uses the I wall kick when rotating beside a wall", () => {
    let state = withPiece(newGame(() => 0), "I");
    state = rotate(state, 1);
    for (let i = 0; i < 5; i++) state = move(state, -1);
    expect(state.active.x).toBe(-2);
    const result = rotate(state, -1);
    expect(result.active.rotation).toBe(0);
    expect(result.active.x).toBe(0);
  });
  it("ends the game when the next spawn is obstructed", () => {
    const state = withPiece(newGame(() => 0), "O", 0);
    for (let x = 3; x <= 6; x++) state.board[1][x] = "Z";
    expect(hardDrop(state).gameOver).toBe(true);
  });
  it("reports finite rates and advances elapsed time", () => {
    const state = newGame(() => 0);
    expect(pps(state)).toBe(0);
    expect(apm(state)).toBe(0);
    const timed = step({ ...state, piecesPlaced: 2, attack: 3 }, 1000);
    expect(pps(timed)).toBe(2);
    expect(apm(timed)).toBe(180);
  });
  it("locks after 500 ms grounded and resets delay on a grounded move", () => {
    const state = withPiece(newGame(() => 0), "O", 3, rows - 2);
    const waiting = step(state, 400);
    expect(waiting.piecesPlaced).toBe(0);
    const moved = move(waiting, 1);
    expect(moved.lockResets).toBe(1);
    expect(step(moved, 499).piecesPlaced).toBe(0);
    expect(step(moved, 500).piecesPlaced).toBe(1);
  });
});


it("uses the existing upward 180 kick when the direct rotation is obstructed", () => {
  const state = withPiece(newGame(() => 0), "T", 3, 5);
  state.board[7][4] = "J";
  const result = rotate(state, 2);
  expect(result.active.rotation).toBe(2);
  expect(result.active.y).toBe(4);
});

describe("spawn, lock out and no-op identity", () => {
  it("spawns with part of the piece already in the visible field", () => {
    const state = newGame(() => 0);
    const lowest = Math.max(...cellsOf(state.active.kind, 0).map(([, y]) => state.active.y + y));
    expect(lowest).toBeGreaterThanOrEqual(BUFFER_ROWS);
  });
  it("tops out when a piece locks entirely in the hidden buffer (lock out)", () => {
    const state = withPiece(newGame(() => 0), "O", 3, 0);
    // Fill the top visible row under the O so it rests in buffer rows 0-1.
    for (let x = 0; x < COLS; x++) if (x !== 0) state.board[BUFFER_ROWS][x] = "Z";
    expect(hardDrop(state).gameOver).toBe(true);
  });
  it("returns the same state object for a blocked move", () => {
    const state = withPiece(newGame(() => 0), "O", -1, BUFFER_ROWS); // O cells sit at x+1..x+2, so this is flush left
    expect(move(state, -1)).toBe(state);
  });
});
