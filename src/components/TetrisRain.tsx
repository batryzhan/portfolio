import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { BOARD_COLS, LETTER_H, planWord, type Cell, type Placement } from "@/lib/wallPlan";

/** TETR.IO's colours for I, O, T, S, Z, J, L. */
const COLORS = ["#42afe1", "#f6d03c", "#b94bc6", "#84b83d", "#ef624d", "#1165b5", "#ef9535"];

const ROWS = LETTER_H + 3;
const FALL_SPEED = 22; // rows per second
const LAUNCH_EVERY = 190; // ms between pieces
const HOLD_MS = 2600;
const CLEAR_MS = 1100;
const PAUSE_MS = 500;

type Falling = { cells: Cell[]; x: number; y: number; targetY: number; color: string };

/** Fills the cell like a TETR.IO block: flat square, lit top-left edge, shaded bottom-right edge. */
function drawBlock(ctx: CanvasRenderingContext2D, px: number, py: number, size: number, color: string, alpha: number) {
  const edge = Math.max(1, Math.round(size * 0.09));
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(px, py, size, size);

  const sheen = ctx.createLinearGradient(px, py, px, py + size);
  sheen.addColorStop(0, "rgba(255,255,255,0.32)");
  sheen.addColorStop(0.55, "rgba(255,255,255,0.04)");
  sheen.addColorStop(1, "rgba(0,0,0,0.12)");
  ctx.fillStyle = sheen;
  ctx.fillRect(px, py, size, size);

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(px, py, size, edge);
  ctx.fillRect(px, py, edge, size);
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(px, py + size - edge, size, edge);
  ctx.fillRect(px + size - edge, py, edge, size);
  ctx.globalAlpha = 1;
}

type Frame = { settled: (string | null)[][]; falling: Falling[] };

function draw(ctx: CanvasRenderingContext2D, frame: Frame, cell: number, clearT: number) {
  ctx.clearRect(0, 0, BOARD_COLS * cell, ROWS * cell);

  ctx.strokeStyle = "rgba(113,113,122,0.14)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let c = 1; c < BOARD_COLS; c++) {
    ctx.moveTo(Math.round(c * cell) + 0.5, 0);
    ctx.lineTo(Math.round(c * cell) + 0.5, ROWS * cell);
  }
  for (let r = 1; r < ROWS; r++) {
    ctx.moveTo(0, Math.round(r * cell) + 0.5);
    ctx.lineTo(BOARD_COLS * cell, Math.round(r * cell) + 0.5);
  }
  ctx.stroke();

  for (let r = 0; r < ROWS; r++) {
    // Rows dissolve from the bottom up while clearT runs 0 -> 1.
    const fromBottom = ROWS - 1 - r;
    const alpha = clearT <= 0 ? 1 : 1 - Math.min(1, Math.max(0, clearT * (ROWS + 4) - fromBottom));
    if (alpha <= 0) continue;
    for (let c = 0; c < BOARD_COLS; c++) {
      const color = frame.settled[r][c];
      if (color) drawBlock(ctx, c * cell, r * cell, cell, color, alpha);
    }
  }
  for (const f of frame.falling) {
    for (const [dx, dy] of f.cells) {
      drawBlock(ctx, (f.x + dx) * cell, (f.y + dy) * cell, cell, f.color, 1);
    }
  }
}

const emptyBoard = () => Array.from({ length: ROWS }, () => Array<string | null>(BOARD_COLS).fill(null));

function toFalling(p: Placement): Falling {
  const minX = Math.min(...p.cells.map((c) => c[0]));
  const minY = Math.min(...p.cells.map((c) => c[1]));
  return {
    cells: p.cells.map(([x, y]): Cell => [x - minX, y - minY]),
    x: minX,
    y: -4,
    targetY: minY,
    color: COLORS[p.piece],
  };
}

/** TETR.IO-style pieces fall one by one and stack into the word BATYA, then dissolve and repeat. */
export function TetrisRain({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    let raf = 0;
    let visible = true;
    let stop = () => {};

    const setup = () => {
      stop();
      const width = wrap.clientWidth;
      if (width === 0) return;
      const cell = width / BOARD_COLS;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(BOARD_COLS * cell * dpr);
      canvas.height = Math.round(ROWS * cell * dpr);
      canvas.style.width = `${BOARD_COLS * cell}px`;
      canvas.style.height = `${ROWS * cell}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const settled = emptyBoard();
      const falling: Falling[] = [];
      let queue: Placement[] = [];

      const land = (f: Falling) => {
        for (const [dx, dy] of f.cells) settled[f.targetY + dy][f.x + dx] = f.color;
      };
      const newPlan = () => {
        queue = planWord(ROWS) ?? [];
      };
      newPlan();

      if (prefersReducedMotion()) {
        for (const p of queue) land(toFalling(p));
        draw(ctx, { settled, falling }, cell, 0);
        return;
      }

      type Phase = "fill" | "hold" | "clear" | "pause";
      let phase: Phase = "fill";
      let phaseT = 0;
      let launchT = 0;
      let last = performance.now();

      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(now - last, 50);
        last = now;
        if (!visible) return;

        if (phase === "fill") {
          launchT += dt;
          while (launchT >= LAUNCH_EVERY && queue.length) {
            launchT -= LAUNCH_EVERY;
            falling.push(toFalling(queue.shift() as Placement));
          }
          if (queue.length === 0 && falling.length === 0) {
            phase = "hold";
            phaseT = 0;
          }
        } else {
          phaseT += dt;
          if (phase === "hold" && phaseT >= HOLD_MS) {
            phase = "clear";
            phaseT = 0;
          } else if (phase === "clear" && phaseT >= CLEAR_MS) {
            for (const row of settled) row.fill(null);
            newPlan();
            phase = "pause";
            phaseT = 0;
          } else if (phase === "pause" && phaseT >= PAUSE_MS) {
            phase = "fill";
            launchT = LAUNCH_EVERY;
          }
        }

        for (let i = falling.length - 1; i >= 0; i--) {
          const f = falling[i];
          f.y = Math.min(f.targetY, f.y + FALL_SPEED * (dt / 1000));
          if (f.y >= f.targetY) {
            land(f);
            falling.splice(i, 1);
          }
        }
        draw(ctx, { settled, falling }, cell, phase === "clear" ? phaseT / CLEAR_MS : 0);
      };
      raf = requestAnimationFrame(tick);
      stop = () => cancelAnimationFrame(raf);
    };

    setup();
    const ro = new ResizeObserver(setup);
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrap);
    return () => {
      ro.disconnect();
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Animation of TETR.IO-style Tetris pieces falling one by one and stacking into the word BATYA, over and over"
        className="block"
      />
    </div>
  );
}
