"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { wedding } from "@/wedding.config";
import { sound, type Cue } from "@/lib/sound";
import { GaneshaCover } from "./Ganesha";
import {
  AwaitingPage,
  BlessingsPage,
  CouplePage,
  InvitePage,
  MuhuratPage,
  ProgrammePage,
  RsvpPage,
  VenuePage,
} from "./pages";

/**
 * The invitation, one card page at a time: Shri Ganesh opens it, then the
 * pages turn by themselves (tap right / left to move, hold to pause).
 */

type SlideDef = { id: string; ms: number; backdrop: string; cue?: [Cue, number] };

const AUTO_BEGIN_MS = 6500;
const HOLD_MS = 220;

function useGuestName() {
  return useSyncExternalStore(
    () => () => {},
    () => (new URLSearchParams(window.location.search).get("to") ?? "").trim().slice(0, 40),
    () => "",
  );
}

export function Story() {
  const guest = useGuestName();
  const slides: SlideDef[] = useMemo(
    () => [
      { id: "invite", ms: 11000, backdrop: "#6e1423", cue: ["chime", 600] },
      { id: "couple", ms: 9000, backdrop: "#4a0a14", cue: ["ghungroo", 700] },
      { id: "muhurat", ms: 9000, backdrop: "#6e1423", cue: ["bells", 500] },
      { id: "programme", ms: 11000, backdrop: "#4a0a14", cue: ["dhol", 300] },
      { id: "venue", ms: 9000, backdrop: "#1a0b2e", cue: ["windchime", 700] },
      ...(wedding.whatsapp ? [{ id: "rsvp", ms: 9000, backdrop: "#6e1423" } as SlideDef] : []),
      { id: "blessings", ms: 9000, backdrop: "#4a0a14", cue: ["chime", 500] },
      { id: "awaiting", ms: 0, backdrop: "#6e1423", cue: ["bells", 600] },
    ],
    [],
  );
  const last = slides.length - 1;

  const [cover, setCover] = useState<"on" | "leaving" | "off">("on");
  const [i, setI] = useState(0);
  const [run, setRun] = useState(0);
  const [held, setHeld] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const paused = held || manualPause;
  const playing = cover === "off";

  /* ── cover ── */
  const coverRef = useRef(cover);
  const begin = useCallback((byTap: boolean) => {
    if (coverRef.current !== "on") return;
    coverRef.current = "leaving";
    if (byTap && !sound.prefersOff()) sound.start("doors");
    setCover("leaving");
    setTimeout(() => {
      coverRef.current = "off";
      setCover("off");
      setRun((r) => r + 1);
    }, 1150);
  }, []);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => begin(false), reduce ? 2500 : AUTO_BEGIN_MS);
    return () => clearTimeout(t);
  }, [begin]);

  /* ── navigation ── */
  const go = useCallback(
    (n: number) => {
      const next = Math.max(0, Math.min(last, n));
      setI(next);
      setRun((r) => r + 1);
    },
    [last],
  );

  /* ── autoplay, with pause that keeps the remaining time ── */
  const remaining = useRef(0);
  useEffect(() => {
    remaining.current = slides[i].ms;
  }, [i, run, slides]);
  useEffect(() => {
    if (!playing || paused || !slides[i].ms) return;
    const started = performance.now();
    const t = setTimeout(() => go(i + 1), remaining.current);
    return () => {
      clearTimeout(t);
      remaining.current -= performance.now() - started;
    };
  }, [playing, paused, i, run, slides, go]);

  /* ── a sound for each slide ── */
  useEffect(() => {
    if (!playing) return;
    const cue = slides[i].cue;
    if (!cue) return;
    const t = setTimeout(() => sound.cue(cue[0]), cue[1]);
    return () => clearTimeout(t);
  }, [playing, i, run, slides]);

  /* ── tap left/right, hold to pause ── */
  const frame = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wasHeld = useRef(false);
  const isUi = (t: EventTarget | null) => Boolean((t as Element | null)?.closest?.("button, a, input, [data-nonav]"));

  const onDown = (e: React.PointerEvent) => {
    if (isUi(e.target)) return;
    wasHeld.current = false;
    clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => {
      wasHeld.current = true;
      setHeld(true);
    }, HOLD_MS);
  };
  const onUp = (e: React.PointerEvent) => {
    clearTimeout(holdTimer.current);
    if (isUi(e.target)) return;
    if (wasHeld.current) {
      wasHeld.current = false;
      setHeld(false);
      return;
    }
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;
    const x = e.clientX - box.left;
    go(x < box.width * 0.3 ? i - 1 : i + 1);
  };
  const onCancel = () => {
    clearTimeout(holdTimer.current);
    if (wasHeld.current) setHeld(false);
    wasHeld.current = false;
  };

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(i + 1);
      else if (e.key === "ArrowLeft") go(i - 1);
      else if (e.key === " ") {
        e.preventDefault();
        setManualPause((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, i, go]);

  const replay = () => {
    setManualPause(false);
    go(0);
  };

  const slide = slides[i];
  const render = () => {
    switch (slide.id) {
      case "invite":
        return <InvitePage guest={guest} />;
      case "couple":
        return <CouplePage />;
      case "muhurat":
        return <MuhuratPage />;
      case "programme":
        return <ProgrammePage />;
      case "venue":
        return <VenuePage />;
      case "rsvp":
        return <RsvpPage guest={guest} />;
      case "blessings":
        return <BlessingsPage />;
      default:
        return <AwaitingPage onReplay={replay} />;
    }
  };

  return (
    <div
      className="fixed inset-0 grid place-items-center overflow-hidden transition-colors duration-700"
      style={{ background: `radial-gradient(circle at 50% 40%, ${slide.backdrop}, #12040a 75%)` }}
    >
      <div className="relative">
        {/* desktop arrows */}
        {playing && (
          <>
            <button
              type="button"
              onClick={() => go(i - 1)}
              disabled={i === 0}
              aria-label="Previous"
              className="absolute top-1/2 -left-16 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-2xl text-white backdrop-blur hover:bg-white/25 disabled:opacity-30 sm:grid"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              disabled={i === last}
              aria-label="Next"
              className="absolute top-1/2 -right-16 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-2xl text-white backdrop-blur hover:bg-white/25 disabled:opacity-30 sm:grid"
            >
              ›
            </button>
          </>
        )}

        <div
          ref={frame}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={onCancel}
          onPointerLeave={onCancel}
          onContextMenu={(e) => e.preventDefault()}
          className="relative h-dvh w-screen touch-manipulation overflow-hidden select-none sm:h-[min(92dvh,860px)] sm:w-[min(430px,92vw)] sm:rounded-[34px] sm:shadow-[0_40px_80px_-30px_rgb(0_0_0/.8)] sm:ring-1 sm:ring-white/10"
        >
          {playing && (
            <div key={`${slide.id}-${run}`} className="slide-enter absolute inset-0">
              {render()}
            </div>
          )}

          {/* progress + header */}
          {playing && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-5 pt-[max(10px,env(safe-area-inset-top))] pb-4">
              <div className="flex gap-1">
                {slides.map((s, k) => (
                  <div key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-gold/35">
                    {k < i && <div className="h-full w-full bg-gold" />}
                    {k === i && (
                      <div
                        key={`${run}`}
                        className={`h-full w-full bg-gold ${s.ms ? "story-fill" : ""} ${paused ? "paused" : ""}`}
                        style={{ "--dur": `${s.ms}ms` } as React.CSSProperties}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center pr-14">
                <button
                  type="button"
                  onClick={() => setManualPause((p) => !p)}
                  aria-label={paused ? "Play" : "Pause"}
                  className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-black/25 text-white"
                >
                  {paused ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {playing && i === 0 && (
            <p className="k-in pointer-events-none absolute right-0 bottom-8 left-0 z-30 text-center text-[13px] font-semibold tracking-wide text-maroon/70" style={{ "--d": "2.5s" } as React.CSSProperties}>
              Tap for the next page ›
            </p>
          )}
        </div>
      </div>

      {cover !== "off" && <GaneshaCover guest={guest} leaving={cover === "leaving"} onBegin={() => begin(true)} />}
    </div>
  );
}
