import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const PLAYLIST_ID = "0uDHPurWQzXWIsy8nNckTs";
const PLAYLIST_URI = `spotify:playlist:${PLAYLIST_ID}`;
const PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;
const API_SRC = "https://open.spotify.com/embed/iframe-api/v1";

type PlaybackState = { isPaused: boolean; isBuffering: boolean; duration: number; position: number };
type Controller = {
  togglePlay: () => void;
  seek: (seconds: number) => void;
  destroy: () => void;
  addListener: (event: string, cb: (e: { data: PlaybackState }) => void) => void;
};
type IFrameAPI = {
  createController: (el: HTMLElement, opts: Record<string, unknown>, cb: (c: Controller) => void) => void;
};
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
  }
}

const fmt = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * A light, purple-accented player for a Spotify playlist. Spotify's own embed can't be restyled,
 * so the real embed stays mounted (visually hidden) and this UI drives it through Spotify's iFrame API.
 * The Spotify script is only fetched once the player scrolls near the viewport.
 */
export function SpotifyPlayer({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<PlaybackState>({ isPaused: true, isBuffering: false, duration: 0, position: 0 });
  const [scrub, setScrub] = useState<number | null>(null);
  const gotUpdate = useRef(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near || !mountRef.current) return;
    const mount = mountRef.current;
    let cancelled = false;

    const init = (api: IFrameAPI) => {
      if (cancelled) return;
      api.createController(mount, { uri: PLAYLIST_URI, width: "100%", height: 152 }, (controller) => {
        if (cancelled) {
          controller.destroy();
          return;
        }
        controllerRef.current = controller;
        controller.addListener("ready", () => setReady(true));
        controller.addListener("playback_update", (e) => {
          gotUpdate.current = true;
          setState(e.data);
        });
      });
    };

    window.onSpotifyIframeApiReady = init;
    if (!document.querySelector(`script[src="${API_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = API_SRC;
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, [near]);

  /** Toggles playback; if the embed never reports back (blocked, signed out, no audio), point to Spotify. */
  const toggle = () => {
    gotUpdate.current = false;
    setStuck(false);
    controllerRef.current?.togglePlay();
    if (state.isPaused) {
      window.setTimeout(() => {
        if (!gotUpdate.current) setStuck(true);
      }, 3000);
    }
  };

  const position = scrub ?? state.position;
  const playing = !state.isPaused;

  return (
    <div ref={rootRef} className={cn("rounded-2xl border bg-background p-4 sm:p-5", className)}>
      <div className="flex items-center gap-4 sm:gap-5">
        <img
          src="/img/playlist-cover.webp"
          alt="A white cat in glasses soldering a circuit board"
          width={400}
          height={400}
          loading="lazy"
          className="size-24 shrink-0 rounded-xl border object-cover sm:size-28"
        />

        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">My playlist</p>
          <p className="mt-1 truncate text-xl font-semibold leading-tight tracking-tight">lkdn</p>
          <p className="truncate text-sm text-muted-foreground">Batyrzhan &middot; on Spotify</p>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={!ready}
              onClick={toggle}
              aria-label={playing ? "Pause playlist" : "Play playlist"}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-40"
            >
              {playing ? <Pause className="size-5 fill-current" aria-hidden="true" /> : <Play className="size-5 translate-x-px fill-current" aria-hidden="true" />}
            </button>

            <input
              type="range"
              min={0}
              max={Math.max(state.duration, 1)}
              step={500}
              value={Math.min(position, Math.max(state.duration, 1))}
              disabled={!ready || state.duration === 0}
              aria-label="Seek"
              onChange={(e) => setScrub(Number(e.target.value))}
              onPointerUp={() => {
                if (scrub !== null) controllerRef.current?.seek(scrub / 1000);
                setScrub(null);
              }}
              onKeyUp={() => {
                if (scrub !== null) controllerRef.current?.seek(scrub / 1000);
                setScrub(null);
              }}
              className="h-1.5 min-w-0 flex-1 cursor-pointer accent-primary disabled:cursor-default disabled:opacity-40"
            />
            <span className="w-[4.5ch] shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground">
              {fmt(position)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t pt-3 text-sm">
        <span className="text-muted-foreground">
          {stuck
            ? "Playback didn't start here. Open it in Spotify instead."
            : near && !ready
              ? "Connecting to Spotify…"
              : "Almost always something playing while I work, and while I play."}
        </span>
        <a
          href={PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "shrink-0 whitespace-nowrap underline underline-offset-4 hover:text-primary",
            stuck ? "font-medium text-primary" : "text-foreground",
          )}
        >
          Open in Spotify
        </a>
      </div>

      {/* The real Spotify embed. Kept in the page but out of sight; the UI above controls it. */}
      <div aria-hidden="true" className="pointer-events-none fixed -left-[9999px] top-0 h-[152px] w-[400px] opacity-0">
        <div ref={mountRef} />
      </div>
    </div>
  );
}
