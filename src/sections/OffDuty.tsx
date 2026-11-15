import { useState } from "react";
import { ExternalLink } from "../components/ExternalLink";
import { Section } from "../components/Section";
import { COLS, drop, emptyBoard, type PieceKind } from "../lib/tetris";

const SEQUENCE: { kind: PieceKind; col: number }[] = [
  { kind: "I", col: 0 },
  { kind: "O", col: 4 },
  { kind: "T", col: 1 },
  { kind: "L", col: 0 },
  { kind: "S", col: 3 },
  { kind: "O", col: 4 },
  { kind: "I", col: 2 },
  { kind: "T", col: 0 },
];

const TONE: Record<PieceKind, string> = {
  I: "bg-gold",
  O: "bg-silk",
  T: "bg-gold-dim",
  L: "bg-silk-dim",
  S: "bg-trace",
};

function TetrisWell() {
  const [state, setState] = useState({ board: emptyBoard(), step: 0, lines: 0 });

  const dropNext = () =>
    setState((s) => {
      const { kind, col } = SEQUENCE[s.step % SEQUENCE.length];
      const res = drop(s.board, kind, col, s.step + 1);
      if (!res) return { board: emptyBoard(), step: s.step + 1, lines: s.lines };
      return { board: res.board, step: s.step + 1, lines: s.lines + res.cleared };
    });

  return (
    <div className="flex items-end gap-6">
      <div
        className="grid gap-[3px] rounded-sm border border-trace bg-mask-deep p-[3px]"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1.5rem)` }}
        role="img"
        aria-label={`A small Tetris well with ${state.lines} lines cleared`}
      >
        {state.board.flat().map((cell, i) => (
          <span
            key={cell ? `${cell.id}-${i}` : i}
            className={`size-6 rounded-[2px] ${cell ? TONE[cell.kind] : "bg-mask/60"}`}
            style={cell ? { animation: "drop 0.28s cubic-bezier(0.5,0,1,1) both" } : undefined}
          />
        ))}
      </div>
      <div className="space-y-3">
        <p className="font-mono text-sm text-silk-dim" aria-live="polite">
          Lines: <span className="text-gold tabular-nums">{state.lines}</span>
        </p>
        <button
          type="button"
          onClick={dropNext}
          className="min-h-11 rounded-sm border border-gold px-4 text-gold transition-colors hover:bg-gold hover:text-mask-deep active:translate-y-px"
        >
          Drop a piece
        </button>
      </div>
    </div>
  );
}

export function OffDuty() {
  return (
    <Section id="off-duty" designator="TP1" title="Off duty">
      <div className="grid gap-14 md:grid-cols-2 md:gap-20">
        <div className="space-y-6 text-lg">
          <p className="max-w-[48ch] text-silk">
            Away from the soldering iron and the textbooks, I play competitive Tetris. It&rsquo;s the same skill as debugging: read the stack fast, plan two pieces ahead, don&rsquo;t panic when it gets high.
          </p>
          <p className="max-w-[48ch] text-silk-dim">There&rsquo;s almost always something playing on Spotify while I work.</p>
          <ExternalLink href="https://ch.tetr.io/u/batryzhan" className="inline-block py-1 font-medium text-gold">
            My TETR.IO profile
          </ExternalLink>
        </div>
        <TetrisWell />
      </div>
    </Section>
  );
}
