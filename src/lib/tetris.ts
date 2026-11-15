/**
 * Pure Tetris rules: 22-row board (rows 0-1 hidden), SRS spawn boxes and
 * official quarter-turn kicks. 180-degree rotation uses a small generic kick
 * list, rather than TETR.IO's SRS+ table. Timing is driven entirely by step.
 * The caller supplies the RNG; like Math.random, it may itself be stateful.
 */
export const COLS = 10;
export const VISIBLE_ROWS = 20;
export const BUFFER_ROWS = 2;
const ROWS = VISIBLE_ROWS + BUFFER_ROWS;
export type PieceKind = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
type Rotation = 0 | 1 | 2 | 3;
type Point = [number, number];
type Piece = { kind: PieceKind; rotation: Rotation; x: number; y: number };
export type GameState = {
  board: (PieceKind | null)[][];
  active: Piece;
  hold: PieceKind | null;
  canHold: boolean;
  queue: PieceKind[];
  gameOver: boolean;
  lines: number;
  piecesPlaced: number;
  attack: number;
  elapsedMs: number;
  gravityIntervalMs: number;
  gravityMs: number;
  lockMs: number;
  lockResets: number;
  /** Last successful player action was a rotation (for T-spin detection). */
  lastRotation: boolean;
  /** Remaining bag and random source are part of the state. */
  bag: PieceKind[];
  rng: () => number;
};
const KINDS: PieceKind[] = ["I", "O", "T", "S", "Z", "J", "L"];
function shuffled(rng: () => number): PieceKind[] {
  const bag = [...KINDS];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.max(0, Math.min(i, Math.floor(rng() * (i + 1))));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}
export function* createBag(rng: () => number = Math.random): Generator<PieceKind, never, unknown> {
  while (true) yield* shuffled(rng);
}
const SPAWN: Record<PieceKind, Point[]> = {
  I: [[0, 1], [1, 1], [2, 1], [3, 1]],
  O: [[1, 0], [2, 0], [1, 1], [2, 1]],
  T: [[1, 0], [0, 1], [1, 1], [2, 1]],
  S: [[1, 0], [2, 0], [0, 1], [1, 1]],
  Z: [[0, 0], [1, 0], [1, 1], [2, 1]],
  J: [[0, 0], [0, 1], [1, 1], [2, 1]],
  L: [[2, 0], [0, 1], [1, 1], [2, 1]],
};
export function cellsOf(kind: PieceKind, rotation: number): Point[] {
  let cells = SPAWN[kind].map(([x, y]): Point => [x, y]);
  if (kind === "O") return cells;
  const turns = ((rotation % 4) + 4) % 4;
  for (let i = 0; i < turns; i++) {
    cells = cells.map(([x, y]): Point => kind === "I" ? [3 - y, x] : [2 - y, x]);
  }
  return cells;
}
// SRS kick offsets use screen coordinates: positive y is down.
const JL: Record<string, Point[]> = {
  "0>1": [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  "1>0": [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  "1>2": [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  "2>1": [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  "2>3": [[0,0],[1,0],[1,-1],[0,2],[1,2]],
  "3>2": [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  "3>0": [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  "0>3": [[0,0],[1,0],[1,-1],[0,2],[1,2]],
};
const IK: Record<string, Point[]> = {
  "0>1": [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
  "1>0": [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
  "1>2": [[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
  "2>1": [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
  "2>3": [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
  "3>2": [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
  "3>0": [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
  "0>3": [[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
};
const HALF: Point[] = [[0,0],[0,-1],[1,0],[-1,0],[0,1]];
// Spawn straddling the skyline (rows 1-2) so the piece is visible at once, as in TETR.IO.
const spawn = (kind: PieceKind): Piece => ({ kind, rotation: 0, x: 3, y: BUFFER_ROWS - 1 });
const fits = (board: GameState["board"], piece: Piece): boolean =>
  cellsOf(piece.kind, piece.rotation).every(([x, y]) => {
    const col = piece.x + x, row = piece.y + y;
    return col >= 0 && col < COLS && row < ROWS && (row < 0 || board[row][col] === null);
  });
function refill(state: GameState): GameState {
  const queue = [...state.queue], bag = [...state.bag];
  while (queue.length < 5) {
    if (!bag.length) bag.push(...shuffled(state.rng));
    queue.push(bag.shift()!);
  }
  return { ...state, queue, bag };
}
function nextPiece(state: GameState): GameState {
  const [kind, ...queue] = state.queue;
  const active = spawn(kind);
  return refill({ ...state, queue, active, gameOver: !fits(state.board, active),
    gravityMs: 0, lockMs: 0, lockResets: 0, lastRotation: false });
}
export function newGame(rng: () => number = Math.random): GameState {
  const initial: GameState = { board: Array.from({ length: ROWS }, () => Array<PieceKind | null>(COLS).fill(null)),
    active: spawn("I"), hold: null, canHold: true, queue: [], bag: [], rng,
    gameOver: false, lines: 0, piecesPlaced: 0, attack: 0, elapsedMs: 0,
    gravityIntervalMs: 800, gravityMs: 0, lockMs: 0, lockResets: 0, lastRotation: false };
  return nextPiece(refill(initial));
}
function reposition(state: GameState, active: Piece, rotated: boolean): GameState {
  if (!fits(state.board, active)) return state;
  const grounded = !fits(state.board, { ...state.active, y: state.active.y + 1 });
  const reset = grounded && state.lockResets < 15;
  return { ...state, active, lastRotation: rotated,
    lockMs: reset ? 0 : state.lockMs, lockResets: state.lockResets + (reset ? 1 : 0) };
}
export function move(state: GameState, dx: number): GameState {
  if (state.gameOver || (dx !== -1 && dx !== 1)) return state;
  return reposition(state, { ...state.active, x: state.active.x + dx }, false);
}
export function rotate(state: GameState, dir: 1 | -1 | 2): GameState {
  if (state.gameOver) return state;
  const from = state.active.rotation, to = ((from + dir + 4) % 4) as Rotation;
  const kicks = state.active.kind === "O" ? [[0, 0] as Point] : dir === 2 ? HALF :
    (state.active.kind === "I" ? IK : JL)[`${from}>${to}`];
  for (const [x, y] of kicks) {
    const piece = { ...state.active, rotation: to, x: state.active.x + x, y: state.active.y + y };
    if (fits(state.board, piece)) return reposition(state, piece, true);
  }
  return state;
}
export function softDrop(state: GameState): GameState {
  const active = { ...state.active, y: state.active.y + 1 };
  return state.gameOver || !fits(state.board, active) ? state : { ...state, active, lastRotation: false };
}
export function ghostY(state: GameState): number {
  let y = state.active.y;
  while (fits(state.board, { ...state.active, y: y + 1 })) y++;
  return y;
}
function lock(state: GameState): GameState {
  const { active } = state;
  const board = state.board.map(row => [...row]);
  const corners = [[0,0],[2,0],[0,2],[2,2]];
  const spin = active.kind === "T" && state.lastRotation && corners.filter(([x,y]) => {
    const col = active.x + x, row = active.y + y;
    return col < 0 || col >= COLS || row >= ROWS || (row >= 0 && board[row][col] !== null);
  }).length >= 3;
  const shape = cellsOf(active.kind, active.rotation);
  // Lock out: the whole piece came to rest in the hidden buffer rows.
  let above = shape.every(([, y]) => active.y + y < BUFFER_ROWS);
  for (const [x, y] of shape) {
    if (active.y + y < 0) above = true;
    else board[active.y + y][active.x + x] = active.kind;
  }
  const kept = board.filter(row => row.some(cell => cell === null));
  const cleared = ROWS - kept.length;
  const nextBoard = [...Array.from({ length: cleared }, () => Array<PieceKind | null>(COLS).fill(null)), ...kept];
  const sent = spin && cleared === 2 ? 4 : ([0, 0, 1, 2, 4][cleared] ?? 0);
  const next = { ...state, board: nextBoard, lines: state.lines + cleared,
    piecesPlaced: state.piecesPlaced + 1, attack: state.attack + sent, canHold: true };
  return above ? { ...next, gameOver: true } : nextPiece(next);
}
export function hardDrop(state: GameState): GameState {
  if (state.gameOver) return state;
  const y = ghostY(state);
  return lock({ ...state, active: { ...state.active, y } });
}
export function hold(state: GameState): GameState {
  if (state.gameOver || !state.canHold) return state;
  const held = state.active.kind;
  if (state.hold === null) return nextPiece({ ...state, hold: held, canHold: false });
  const active = spawn(state.hold);
  return { ...state, active, hold: held, canHold: false, gameOver: !fits(state.board, active),
    gravityMs: 0, lockMs: 0, lockResets: 0, lastRotation: false };
}
/** Advance gravity and grounded lock delay in chronological order. */
export function step(state: GameState, dtMs: number): GameState {
  if (state.gameOver || !Number.isFinite(dtMs) || dtMs <= 0) return state;
  let s = { ...state, elapsedMs: state.elapsedMs + dtMs };
  let remaining = dtMs;
  while (remaining > 0 && !s.gameOver) {
    const grounded = !fits(s.board, { ...s.active, y: s.active.y + 1 });
    const interval = Math.max(1, s.gravityIntervalMs);
    const untilGravity = Math.max(0, interval - s.gravityMs);
    const untilLock = grounded ? Math.max(0, 500 - s.lockMs) : Infinity;
    const amount = Math.min(remaining, untilGravity, untilLock);
    s = { ...s, gravityMs: s.gravityMs + amount, lockMs: grounded ? s.lockMs + amount : 0 };
    remaining -= amount;
    if (grounded && s.lockMs >= 500) { s = lock(s); continue; }
    if (s.gravityMs >= interval) {
      const active = { ...s.active, y: s.active.y + 1 };
      s = { ...s, gravityMs: 0, ...(fits(s.board, active) ? { active, lastRotation: false } : {}) };
    }
  }
  return s;
}
export const pps = (state: GameState): number => state.elapsedMs > 0 ? state.piecesPlaced * 1000 / state.elapsedMs : 0;
export const apm = (state: GameState): number => state.elapsedMs > 0 ? state.attack * 60000 / state.elapsedMs : 0;
