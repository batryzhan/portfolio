export const COLS = 6;
export const ROWS = 8;

/** Cell offsets [row, col] for each piece in its spawn rotation. */
export const PIECES = {
  I: [[0, 0], [0, 1], [0, 2], [0, 3]],
  O: [[0, 0], [0, 1], [1, 0], [1, 1]],
  T: [[0, 0], [0, 1], [0, 2], [1, 1]],
  L: [[0, 0], [1, 0], [2, 0], [2, 1]],
  S: [[0, 1], [0, 2], [1, 0], [1, 1]],
} as const satisfies Record<string, readonly (readonly [number, number])[]>;

export type PieceKind = keyof typeof PIECES;
export type Cell = { kind: PieceKind; id: number } | null;
export type Board = Cell[][];

export const emptyBoard = (): Board => Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null));

const fits = (board: Board, kind: PieceKind, row: number, col: number) =>
  PIECES[kind].every(([r, c]) => {
    const y = row + r;
    const x = col + c;
    return x >= 0 && x < COLS && y < ROWS && (y < 0 || board[y][x] === null);
  });

/**
 * Hard-drop `kind` at column `col`, then clear full rows.
 * Returns the new board and how many lines cleared, or null if the piece
 * can't enter the well (the caller resets).
 */
export function drop(board: Board, kind: PieceKind, col: number, id: number): { board: Board; cleared: number } | null {
  const width = Math.max(...PIECES[kind].map(([, c]) => c)) + 1;
  const x = Math.min(Math.max(col, 0), COLS - width);
  if (!fits(board, kind, 0, x)) return null;
  let y = 0;
  while (fits(board, kind, y + 1, x)) y++;
  const next = board.map((row) => [...row]);
  for (const [r, c] of PIECES[kind]) next[y + r][x + c] = { kind, id };
  const kept = next.filter((row) => row.some((cell) => cell === null));
  const cleared = ROWS - kept.length;
  const padding = Array.from({ length: cleared }, () => Array<Cell>(COLS).fill(null));
  return { board: [...padding, ...kept], cleared };
}
