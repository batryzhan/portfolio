import { memo, type CSSProperties, type ReactNode } from "react";
import { ArrowDownToLine, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  apm,
  BUFFER_ROWS,
  cellsOf,
  COLS,
  ghostY,
  hardDrop,
  hold,
  move,
  pps,
  rotate,
  VISIBLE_ROWS,
  type GameState,
  type PieceKind,
} from "@/lib/tetris";
import { useTetrio } from "./useTetrio";

const FILL: Record<PieceKind, string> = {
  I: "bg-piece-i",
  O: "bg-piece-o",
  T: "bg-piece-t",
  S: "bg-piece-s",
  Z: "bg-piece-z",
  J: "bg-piece-j",
  L: "bg-piece-l",
};
const OUTLINE: Record<PieceKind, string> = {
  I: "border-piece-i",
  O: "border-piece-o",
  T: "border-piece-t",
  S: "border-piece-s",
  Z: "border-piece-z",
  J: "border-piece-j",
  L: "border-piece-l",
};

/** TETR.IO's own HUD vernacular: tiny tracked caps labels over big numbers. */
const hudLabel = "text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground";

function formatTime(ms: number) {
  const cs = Math.floor(ms / 10);
  const m = Math.floor(cs / 6000);
  const s = Math.floor(cs / 100) % 60;
  return `${m}:${String(s).padStart(2, "0")}.${String(cs % 100).padStart(2, "0")}`;
}

/** A piece drawn tightly in its own bounding box and centered, the way TETR.IO previews are. */
function PiecePreview({ kind, size = "md", dim = false }: { kind: PieceKind | null; size?: "sm" | "md"; dim?: boolean }) {
  const cells = kind ? cellsOf(kind, 0) : [];
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  const w = cells.length ? Math.max(...cells.map(([x]) => x)) - minX + 1 : 0;
  const h = cells.length ? Math.max(...cells.map(([, y]) => y)) - minY + 1 : 0;
  const unit = size === "md" ? "var(--preview-md)" : "var(--preview-sm)";
  return (
    <div className={cn("flex h-[calc(var(--preview-md)*2.75)] items-center justify-center transition-opacity", dim && "opacity-35")}>
      {kind ? (
        <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${w}, ${unit})`, gridTemplateRows: `repeat(${h}, ${unit})` }}>
          {cells.map(([x, y]) => (
            <span
              key={`${x},${y}`}
              className={cn("rounded-[2px] shadow-[inset_0_-2px_0_rgb(0_0_0/0.14)]", FILL[kind])}
              style={{ gridColumn: x - minX + 1, gridRow: y - minY + 1 }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Panel({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-background px-2 pb-1.5 pt-1.5", className)}>
      <p className={hudLabel}>{title}</p>
      {children}
    </div>
  );
}

function Stat({ name, value }: { name: string; value: string }) {
  return (
    <div className="text-right">
      <p className={hudLabel}>{name}</p>
      <p className="font-mono text-[0.9375rem] font-medium leading-tight tabular-nums sm:text-lg">{value}</p>
    </div>
  );
}

/** Memoized on the pieces only, so the per-frame TIME/PPS updates don't repaint 200 cells. */
const Matrix = memo(function Matrix({ game }: { game: GameState }) {
  const shape = cellsOf(game.active.kind, game.active.rotation);
  const landing = ghostY(game);
  const active = new Set(shape.map(([x, y]) => `${game.active.x + x},${game.active.y + y}`));
  const ghost = new Set(shape.map(([x, y]) => `${game.active.x + x},${landing + y}`));
  const live = !game.gameOver;

  return (
    <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${COLS}, var(--cell))` }} aria-hidden="true">
      {Array.from({ length: VISIBLE_ROWS * COLS }, (_, i) => {
        const x = i % COLS;
        const y = Math.floor(i / COLS) + BUFFER_ROWS;
        const id = `${x},${y}`;
        const kind = live && active.has(id) ? game.active.kind : game.board[y][x];
        const isGhost = live && !kind && ghost.has(id);
        return (
          <span
            key={i}
            className={cn(
              "size-(--cell)",
              kind
                ? cn("rounded-[2px] shadow-[inset_0_-2px_0_rgb(0_0_0/0.14)]", FILL[kind], game.gameOver && "opacity-40 grayscale")
                : "bg-background",
              isGhost && cn("rounded-[2px] border-2 opacity-70", OUTLINE[game.active.kind]),
            )}
          />
        );
      })}
    </div>
  );
}, (a, b) => a.game.board === b.game.board && a.game.active === b.game.active && a.game.gameOver === b.game.gameOver);

const KEYS: [string, string][] = [
  ["← →", "move"],
  ["↓", "soft drop"],
  ["Space", "hard drop"],
  ["↑ X", "rotate"],
  ["Z", "rotate left"],
  ["A", "180°"],
  ["C", "hold"],
  ["Esc", "pause"],
];

/** A playable, TETR.IO-style mini game: 10x20 matrix, 7-bag, SRS, ghost, hold and a five-piece next queue. */
export function TetrioWidget({ className }: { className?: string }) {
  const { rootRef, game, status, announcement, start, pause, act, onKeyDown, onKeyUp } = useTetrio();
  const playing = status === "playing";

  const overlay = {
    idle: { title: "Click to play", hint: "Or focus here and press Space" },
    paused: { title: "Paused", hint: "Click or press Esc to resume" },
    over: { title: "Topped out", hint: `${game.lines} lines, ${pps(game).toFixed(2)} PPS, ${formatTime(game.elapsedMs)}` },
    playing: null,
  }[status];

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="application"
      aria-roledescription="game"
      aria-label="Tetris. Arrow keys move, Up or X rotates, Z rotates left, A rotates 180, Space hard drops, C holds, Escape pauses."
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) pause();
      }}
      className={cn(
        "rounded-2xl border bg-muted p-3 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/60 sm:p-5",
        className,
      )}
      style={
        {
          "--cell": "clamp(13px, 3.9vw, 22px)",
          "--preview-md": "clamp(8px, 2.2vw, 12px)",
          "--preview-sm": "clamp(7px, 1.8vw, 10px)",
        } as CSSProperties
      }
    >
      <div className="flex items-stretch justify-center gap-2 sm:gap-3">
        {/* Left column: HOLD on top, stats bottom-aligned like TETR.IO */}
        <div className="flex w-[4.25rem] shrink-0 flex-col justify-between sm:w-20">
          <Panel title="Hold">
            <PiecePreview kind={game.hold} dim={!game.canHold} />
          </Panel>
          <div className="space-y-2.5 pb-1">
            <Stat name="PPS" value={pps(game).toFixed(2)} />
            <Stat name="APM" value={apm(game).toFixed(1)} />
            <Stat name="Lines" value={String(game.lines)} />
            <Stat name="Time" value={formatTime(game.elapsedMs)} />
          </div>
        </div>

        {/* The matrix */}
        <div
          className="relative shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-border p-px"
          onClick={() => (playing ? act((s) => rotate(s, 1)) : start())}
        >
          <Matrix game={game} />
          {overlay ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/85 p-4 text-center backdrop-blur-[2px]">
              <p className="text-base font-semibold tracking-tight">{overlay.title}</p>
              <p className="text-xs text-muted-foreground">{overlay.hint}</p>
              {status === "over" ? (
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    start();
                  }}
                >
                  Play again
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Right column: five-piece NEXT queue */}
        <Panel title="Next" className="w-[4.25rem] shrink-0 self-start sm:w-20">
          {game.queue.slice(0, 5).map((kind, i) => (
            <PiecePreview key={i} kind={kind} size={i === 0 ? "md" : "sm"} />
          ))}
        </Panel>
      </div>

      {/* Touch controls (phones/tablets). preventDefault on pointerdown keeps focus on the game root. */}
      <div className="mt-4 grid grid-cols-5 gap-1.5 md:hidden">
        {(
          [
            ["Move left", <ChevronLeft key="l" />, (s: GameState) => move(s, -1)],
            ["Move right", <ChevronRight key="r" />, (s: GameState) => move(s, 1)],
            ["Rotate", <RotateCw key="rot" />, (s: GameState) => rotate(s, 1)],
            ["Hard drop", <ArrowDownToLine key="d" />, hardDrop],
            ["Hold", "Hold", hold],
          ] as const
        ).map(([name, icon, action]) => (
          <Button
            key={name}
            type="button"
            variant="outline"
            className="h-11 bg-background"
            aria-label={name}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => act(action)}
          >
            {icon}
          </Button>
        ))}
      </div>

      <ul className="mt-4 hidden flex-wrap justify-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground md:flex">
        {KEYS.map(([keys, what]) => (
          <li key={what} className="whitespace-nowrap">
            <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[11px] text-foreground">{keys}</kbd> {what}
          </li>
        ))}
      </ul>

      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
