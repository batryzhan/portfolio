/**
 * Plans a "wall" of tetrominoes that spells a word: tiles the letter pixels exactly with the
 * seven pieces, then orders the pieces so each one can fall straight down and rest on something.
 */

export type Cell = readonly [number, number];
export type Rotation = { cells: Cell[]; w: number; h: number };

/** Piece order is I, O, T, S, Z, J, L; the index is the piece id. */
const BASE: Cell[][] = [
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[1, 0], [0, 1], [1, 1], [2, 1]],
  [[1, 0], [2, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [1, 1], [2, 1]],
  [[0, 0], [0, 1], [1, 1], [2, 1]],
  [[2, 0], [0, 1], [1, 1], [2, 1]],
];

function normalize(cells: Cell[]): Rotation {
  const minX = Math.min(...cells.map((c) => c[0]));
  const minY = Math.min(...cells.map((c) => c[1]));
  const moved = cells
    .map((c): Cell => [c[0] - minX, c[1] - minY])
    .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  return {
    cells: moved,
    w: Math.max(...moved.map((c) => c[0])) + 1,
    h: Math.max(...moved.map((c) => c[1])) + 1,
  };
}

/** Every distinct rotation of every piece. Cells are sorted row-major, so cells[0] is the first. */
export const PIECES: Rotation[][] = BASE.map((cells) => {
  const seen = new Set<string>();
  const out: Rotation[] = [];
  let cur = normalize(cells);
  for (let i = 0; i < 4; i++) {
    const key = cur.cells.map((c) => c.join(",")).join(";");
    if (!seen.has(key)) {
      seen.add(key);
      out.push(cur);
    }
    cur = normalize(cur.cells.map((c): Cell => [-c[1], c[0]]));
  }
  return out;
});

const LETTERS: Record<string, string[]> = {
  B: ["XXXXX.", "X...XX", "X...XX", "XXXXXX", "X...XX", "X...XX", "XXXXX."],
  A: [".XXXX.", "XX..XX", "XX..XX", "XXXXXX", "X....X", "X....X", "X....X"],
  T: ["XXXXXX", "X.XX.X", "..XX..", "..XX..", "..XX..", "..XX..", "..XX.."],
  Y: ["XX..XX", "XX..XX", ".XXXX.", "..XX..", "..XX..", "..XX..", "..XX.."],
};

export const WORD = "BATYA";
export const LETTER_H = 7;
const GAP = 1;
const MARGIN = 1;

export function wordWidth(word = WORD) {
  return word.split("").reduce((sum, ch, i) => sum + LETTERS[ch][0].length + (i ? GAP : 0), 0);
}

/** Board width including a one-cell margin either side. */
export const BOARD_COLS = wordWidth() + MARGIN * 2;

/** Cells (x, y) of the word with the baseline on the bottom row of `rows`. */
export function wordMask(rows: number, word = WORD): Cell[] {
  const out: Cell[] = [];
  let x0 = MARGIN;
  const y0 = rows - LETTER_H;
  for (const ch of word) {
    const bmp = LETTERS[ch];
    bmp.forEach((line, y) => {
      [...line].forEach((v, x) => {
        if (v === "X") out.push([x0 + x, y0 + y]);
      });
    });
    x0 += bmp[0].length + GAP;
  }
  return out;
}

export type Placement = { piece: number; cells: Cell[] };

const shuffle = <T>(arr: T[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Builds the wall bottom-up: repeatedly covers the lowest uncovered cell with a piece that can
 * fall straight down onto what is already there. Backtracks, and prunes any move that leaves an
 * enclosed region whose size is not a multiple of four.
 */
export function planWord(rows: number, cols = BOARD_COLS, word = WORD): Placement[] | null {
  const remaining: boolean[][] = Array.from({ length: rows }, () => Array<boolean>(cols).fill(false));
  const filled: boolean[][] = Array.from({ length: rows }, () => Array<boolean>(cols).fill(false));
  let left = 0;
  for (const [x, y] of wordMask(rows, word)) {
    remaining[y][x] = true;
    left++;
  }
  const result: Placement[] = [];
  let budget = 50000;

  const regionsOk = () => {
    const seen = new Set<number>();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!remaining[y][x] || seen.has(y * cols + x)) continue;
        let size = 0;
        const stack: Cell[] = [[x, y]];
        seen.add(y * cols + x);
        while (stack.length) {
          const [cx, cy] = stack.pop() as Cell;
          size++;
          for (const [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]] as Cell[]) {
            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
            const k = ny * cols + nx;
            if (remaining[ny][nx] && !seen.has(k)) {
              seen.add(k);
              stack.push([nx, ny]);
            }
          }
        }
        if (size % 4 !== 0) return false;
      }
    }
    return true;
  };

  const solve = (): boolean => {
    if (left === 0) return true;
    if (budget-- <= 0) return false;

    // Lowest remaining cell, leftmost on ties.
    let cx = -1;
    let cy = -1;
    for (let y = rows - 1; y >= 0 && cy < 0; y--) {
      for (let x = 0; x < cols; x++) {
        if (remaining[y][x]) {
          cx = x;
          cy = y;
          break;
        }
      }
    }

    const options: { piece: number; cells: Cell[] }[] = [];
    PIECES.forEach((rots, piece) => {
      for (const rot of rots) {
        for (const [ax, ay] of rot.cells) {
          const ox = cx - ax;
          const oy = cy - ay;
          const abs = rot.cells.map(([dx, dy]): Cell => [ox + dx, oy + dy]);
          if (!abs.every(([x, y]) => x >= 0 && x < cols && y >= 0 && y < rows && remaining[y][x])) continue;
          const own = new Set(abs.map(([x, y]) => `${x},${y}`));
          let clear = true;
          let supported = false;
          for (const [x, y] of abs) {
            for (let r = 0; r < y; r++) if (filled[r][x] && !own.has(`${x},${r}`)) clear = false;
            if (y === rows - 1 || (!own.has(`${x},${y + 1}`) && filled[y + 1][x])) supported = true;
          }
          if (clear && supported && !options.some((o) => o.piece === piece && o.cells.every(([x, y]) => own.has(`${x},${y}`)))) {
            options.push({ piece, cells: abs });
          }
        }
      }
    });

    for (const opt of shuffle(options)) {
      for (const [x, y] of opt.cells) {
        remaining[y][x] = false;
        filled[y][x] = true;
      }
      left -= 4;
      result.push({ piece: opt.piece, cells: opt.cells });
      if (regionsOk() && solve()) return true;
      result.pop();
      left += 4;
      for (const [x, y] of opt.cells) {
        remaining[y][x] = true;
        filled[y][x] = false;
      }
    }
    return false;
  };

  return solve() ? result : null;
}
