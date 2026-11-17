"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { wedding } from "@/wedding.config";
import { sound, type Cue } from "@/lib/sound";
import { GaneshaCover } from "./Ganesha";
import {
  CoupleSlide,
  DateSlide,
  GiftSlide,
  IntroSlide,
  MomentsSlide,
  PlaylistSlide,
  QuizSlide,
  RsvpSlide,
  TogetherSlide,
  VenueSlide,
  WrappedSlide,
} from "./slides";

/**
 * The invitation as stories: Shri Ganesh opens it, then tap right / left
 * (or let it play), hold to pause. Like a year-in-review, but for a shaadi.
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
      { id: "intro", ms: 6000, backdrop: "#c2185b", cue: ["chime", 500] },
      { id: "couple", ms: 7000, backdrop: "#f3c9a4", cue: ["ghungroo", 600] },
      { id: "together", ms: 8000, backdrop: "#0f5e50", cue: ["tick", 2000] },
      { id: "quiz", ms: 11000, backdrop: "#2b1a6b" },
      { id: "moments", ms: 9000, backdrop: "#f4a417", cue: ["ghungroo", 700] },
      { id: "date", ms: 7000, backdrop: "#c2185b", cue: ["dhol", 250] },
      { id: "playlist", ms: 9000, backdrop: "#5a0c18", cue: ["chime", 400] },
      { id: "venue", ms: 7500, backdrop: "#1a0b2e", cue: ["windchime", 700] },
      ...(wedding.whatsapp ? [{ id: "rsvp", ms: 8000, backdrop: "#e46b0e" } as SlideDef] : []),
      { id: "gift", ms: 8000, backdrop: "#f3c9a4", cue: ["coin", 1300] },
      { id: "wrapped", ms: 0, backdrop: "#2e0710", cue: ["bells", 400] },
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
      case "intro":
        return <IntroSlide guest={guest} />;
      case "couple":
        return <CoupleSlide />;
      case "together":
        return <TogetherSlide />;
      case "quiz":
        return <QuizSlide />;
      case "moments":
        return <MomentsSlide />;
      case "date":
        return <DateSlide />;
      case "playlist":
        return <PlaylistSlide />;
      case "venue":
        return <VenueSlide />;
      case "rsvp":
        return <RsvpSlide guest={guest} />;
      case "gift":
        return <GiftSlide />;
      default:
        return <WrappedSlide guest={guest} onReplay={replay} />;
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
            <div className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/35 to-transparent px-3 pt-[max(10px,env(safe-area-inset-top))] pb-6">
              <div className="flex gap-1">
                {slides.map((s, k) => (
                  <div key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35">
                    {k < i && <div className="h-full w-full bg-white" />}
                    {k === i && (
                      <div
                        key={`${run}`}
                        className={`h-full w-full bg-white ${s.ms ? "story-fill" : ""} ${paused ? "paused" : ""}`}
                        style={{ "--dur": `${s.ms}ms` } as React.CSSProperties}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2.5 flex items-center gap-2.5 pr-14">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-marigold to-rani font-script text-sm text-white ring-2 ring-white/70">
                  {wedding.bride[0]}&amp;{wedding.groom[0]}
                </span>
                <span className="text-[13px] leading-tight font-semibold text-white drop-shadow">
                  {wedding.bride} &amp; {wedding.groom}
                  <span className="block text-[11px] font-normal text-white/75">Shaadi Wrapped</span>
                </span>
                <button
                  type="button"
                  onClick={() => setManualPause((p) => !p)}
                  aria-label={paused ? "Play" : "Pause"}
                  className="pointer-events-auto ml-auto grid h-8 w-8 place-items-center rounded-full text-white"
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
            <p className="k-in pointer-events-none absolute right-0 bottom-6 left-0 z-30 text-center text-[11px] font-semibold tracking-[0.25em] text-white/80 uppercase" style={{ "--d": "2.5s" } as React.CSSProperties}>
              Tap to continue →
            </p>
          )}
        </div>
      </div>

      {cover !== "off" && <GaneshaCover guest={guest} leaving={cover === "leaving"} onBegin={() => begin(true)} />}
    </div>
  );
}
