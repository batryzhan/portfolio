import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { hardDrop, hold, move, newGame, pps, rotate, softDrop, step, type GameState } from "@/lib/tetris";

/** TETR.IO-like handling defaults. */
const DAS_MS = 133;
const ARR_MS = 10;
const SOFT_DROP_MS = 30;

export type Status = "idle" | "playing" | "paused" | "over";
type Direction = -1 | 1;
type Held = { left: boolean; right: boolean; down: boolean; dir: Direction | null; nextShift: number; nextDrop: number };

const GAME_KEYS = new Set(["arrowleft", "arrowright", "arrowdown", "arrowup", " ", "x", "z", "a", "c", "shift", "escape"]);
const releasedKeys = (): Held => ({ left: false, right: false, down: false, dir: null, nextShift: 0, nextDrop: 0 });

/**
 * Game loop + input for the TETR.IO widget. The engine (`@/lib/tetris`) is pure;
 * this hook owns timing (requestAnimationFrame), DAS/ARR auto-repeat and the
 * idle / playing / paused / over lifecycle. Keys are only read while the widget
 * root has focus, so the page itself never loses its keyboard.
 */
export function useTetrio() {
  const [game, setGame] = useState<GameState>(() => newGame());
  const [status, setStatusState] = useState<Status>("idle");
  const [announcement, setAnnouncement] = useState("");

  const gameRef = useRef(game);
  const statusRef = useRef(status);
  const held = useRef<Held>(releasedKeys());

  const setStatus = useCallback((next: Status) => {
    statusRef.current = next;
    setStatusState(next);
    if (next !== "playing") held.current = releasedKeys();
  }, []);

  const apply = useCallback(
    (action: (s: GameState) => GameState) => {
      const before = gameRef.current;
      const next = action(before);
      if (next === before) return;
      gameRef.current = next;
      setGame(next);
      const cleared = next.lines - before.lines;
      if (cleared > 0) setAnnouncement(`${cleared} line${cleared === 1 ? "" : "s"} cleared, ${next.lines} total.`);
      if (next.gameOver && !before.gameOver) {
        setAnnouncement(`Game over: ${next.lines} lines at ${pps(next).toFixed(2)} pieces per second.`);
        setStatus("over");
      }
    },
    [setStatus],
  );

  const start = useCallback(() => {
    if (statusRef.current === "over") {
      const fresh = newGame();
      gameRef.current = fresh;
      setGame(fresh);
      setAnnouncement("");
    }
    setStatus("playing");
  }, [setStatus]);

  const pause = useCallback(() => {
    if (statusRef.current === "playing") setStatus("paused");
  }, [setStatus]);

  // Frame loop: gravity/lock timing from the engine plus DAS/ARR repeats.
  useEffect(() => {
    if (status !== "playing") return;
    let frame = 0;
    let last: number | null = null;
    const tick = (now: number) => {
      if (statusRef.current !== "playing") return;
      if (last !== null) {
        const dt = Math.min(now - last, 100); // a long frame (tab switch) shouldn't teleport pieces
        apply((s) => {
          let next = step(s, dt);
          const h = held.current;
          if (h.dir !== null && now >= h.nextShift) {
            const shifts = Math.min(COLS_MAX, Math.floor((now - h.nextShift) / ARR_MS) + 1);
            for (let i = 0; i < shifts; i++) next = move(next, h.dir);
            h.nextShift += shifts * ARR_MS;
          }
          if (h.down && now >= h.nextDrop) {
            const drops = Math.min(ROWS_MAX, Math.floor((now - h.nextDrop) / SOFT_DROP_MS) + 1);
            for (let i = 0; i < drops; i++) next = softDrop(next);
            h.nextDrop += drops * SOFT_DROP_MS;
          }
          return next;
        });
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [status, apply]);

  // Leaving the tab pauses the game.
  useEffect(() => {
    const onVisibility = () => document.hidden && pause();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [pause]);

  const onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (!GAME_KEYS.has(key)) return;
    event.preventDefault();
    if (event.repeat) return; // auto-repeat is handled by DAS/ARR, not the OS

    if (key === "escape") {
      if (statusRef.current === "playing") pause();
      else if (statusRef.current === "paused") start();
      return;
    }
    if (statusRef.current !== "playing") {
      if (key === " " && statusRef.current !== "over") start();
      return;
    }

    const h = held.current;
    switch (key) {
      case "arrowleft":
      case "arrowright": {
        const dir: Direction = key === "arrowleft" ? -1 : 1;
        if (dir === -1) h.left = true;
        else h.right = true;
        h.dir = dir; // last pressed direction wins
        h.nextShift = performance.now() + DAS_MS;
        apply((s) => move(s, dir));
        break;
      }
      case "arrowdown":
        h.down = true;
        h.nextDrop = performance.now() + SOFT_DROP_MS;
        apply(softDrop);
        break;
      case " ":
        apply(hardDrop);
        break;
      case "arrowup":
      case "x":
        apply((s) => rotate(s, 1));
        break;
      case "z":
        apply((s) => rotate(s, -1));
        break;
      case "a":
        apply((s) => rotate(s, 2));
        break;
      case "c":
      case "shift":
        apply(hold);
        break;
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    const h = held.current;
    if (event.key === "ArrowDown") h.down = false;
    if (event.key === "ArrowLeft") h.left = false;
    if (event.key === "ArrowRight") h.right = false;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const fallback: Direction | null = h.left ? -1 : h.right ? 1 : null;
      if (fallback !== h.dir) {
        h.dir = fallback;
        h.nextShift = performance.now() + DAS_MS;
      }
    }
  };

  /** One-shot action for touch buttons; ignored unless a game is running. */
  const act = (action: (s: GameState) => GameState) => {
    if (statusRef.current === "playing") apply(action);
  };

  return { game, status, announcement, start, pause, act, onKeyDown, onKeyUp };
}

/** Upper bounds per frame so a stalled frame can't loop forever. */
const COLS_MAX = 10;
const ROWS_MAX = 20;
