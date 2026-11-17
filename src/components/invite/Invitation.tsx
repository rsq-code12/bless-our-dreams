"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { wedding } from "@/wedding.config";
import { Mandala } from "../Ornaments";
import {
  SceneAarambh,
  SceneBlessing,
  SceneCouple,
  SceneEvents,
  SceneInvite,
  SceneRsvp,
  SceneVenue,
} from "./Scenes";

/** How long each scene stays before the invitation moves on by itself (ms). */
type SceneDef = { id: string; ms: number };

const IDLE_RESUME_MS = 9000;
const AUTO_OPEN_MS = 3800;

/** "?to=Sharma%20Family" personalises the card. */
function useGuestName() {
  return useSyncExternalStore(
    () => () => {},
    () => (new URLSearchParams(window.location.search).get("to") ?? "").trim().slice(0, 40),
    () => "",
  );
}

type Phase = "closed" | "opening" | "open";

export function Invitation() {
  const guest = useGuestName();
  const scenes: SceneDef[] = useMemo(
    () =>
      [
        { id: "aarambh", ms: 5200 },
        { id: "couple", ms: 7000 },
        { id: "invite", ms: 7500 },
        { id: "events", ms: 8500 },
        { id: "venue", ms: 7000 },
        ...(wedding.whatsapp ? [{ id: "rsvp", ms: 7000 }] : []),
        { id: "blessing", ms: 0 },
      ] satisfies SceneDef[],
    [],
  );
  const last = scenes.length - 1;

  const scroller = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("closed");
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set());
  const [playing, setPlaying] = useState(true);
  const [run, setRun] = useState(0); // bumps to restart the current scene's timer/progress bar
  const phaseRef = useRef<Phase>("closed");
  const manualPause = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const markSeen = useCallback((i: number) => {
    setSeen((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
  }, []);

  /* ── doors ── */
  const open = useCallback(() => {
    if (phaseRef.current !== "closed") return;
    phaseRef.current = "opening";
    setPhase("opening");
    markSeen(0);
    setTimeout(() => {
      phaseRef.current = "open";
      setPhase("open");
      setRun((r) => r + 1);
    }, 1500);
  }, [markSeen]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(open, reduce ? 0 : AUTO_OPEN_MS);
    return () => clearTimeout(t);
  }, [open]);

  /* ── which scene is on screen ── */
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = Number((e.target as HTMLElement).dataset.i);
          if (e.intersectionRatio >= 0.35 && phaseRef.current !== "closed") markSeen(i);
          if (e.intersectionRatio >= 0.6) setActive(i);
        }
      },
      { root, threshold: [0.35, 0.6] },
    );
    root.querySelectorAll("[data-i]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [markSeen, scenes.length]);

  const goTo = useCallback((i: number, smooth = true) => {
    const root = scroller.current;
    if (!root) return;
    root.scrollTo({ top: i * root.clientHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  /* ── autoplay ── */
  useEffect(() => {
    if (phase !== "open" || !playing || active >= last) return;
    const t = setTimeout(() => goTo(active + 1), scenes[active].ms);
    return () => clearTimeout(t);
  }, [phase, playing, active, last, scenes, goTo, run]);

  // Any touch, wheel or key pauses the autoplay; it picks up again after a quiet spell.
  const onInteract = useCallback(() => {
    if (phaseRef.current !== "open") return;
    setPlaying(false);
    clearTimeout(idleTimer.current);
    if (manualPause.current) return;
    idleTimer.current = setTimeout(() => {
      setPlaying(true);
      setRun((r) => r + 1);
    }, IDLE_RESUME_MS);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onInteract);
    return () => {
      window.removeEventListener("keydown", onInteract);
      clearTimeout(idleTimer.current);
    };
  }, [onInteract]);

  const togglePlay = () => {
    clearTimeout(idleTimer.current);
    if (playing) {
      manualPause.current = true;
      setPlaying(false);
    } else {
      manualPause.current = false;
      setPlaying(true);
      setRun((r) => r + 1);
      if (active >= last) replay();
    }
  };

  const replay = () => {
    setSeen(new Set());
    goTo(0, false);
    manualPause.current = false;
    setPlaying(true);
    setTimeout(() => {
      markSeen(0);
      setActive(0);
      setRun((r) => r + 1);
    }, 50);
  };

  const render = (id: string) => {
    switch (id) {
      case "aarambh":
        return <SceneAarambh />;
      case "couple":
        return <SceneCouple />;
      case "invite":
        return <SceneInvite guest={guest} />;
      case "events":
        return <SceneEvents />;
      case "venue":
        return <SceneVenue />;
      case "rsvp":
        return <SceneRsvp guest={guest} />;
      default:
        return <SceneBlessing onReplay={replay} />;
    }
  };

  return (
    <>
      <div
        ref={scroller}
        className="fixed inset-0 snap-y snap-mandatory overflow-y-auto overscroll-none"
        onPointerDown={onInteract}
        onWheel={onInteract}
        onTouchStart={onInteract}
      >
        {scenes.map((s, i) => (
          <section
            key={s.id}
            data-i={i}
            aria-label={s.id}
            className={`scene relative h-dvh snap-start snap-always overflow-hidden ${seen.has(i) ? "is-on" : ""}`}
          >
            {render(s.id)}
          </section>
        ))}
      </div>

      {/* story progress + controls */}
      {phase === "open" && (
        <>
          <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex gap-1 px-3 pt-[max(8px,env(safe-area-inset-top))]">
            {scenes.map((s, i) => (
              <div key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30 mix-blend-difference">
                {i < active && <div className="h-full w-full bg-white" />}
                {i === active && (
                  <div
                    key={`${run}-${i}`}
                    className={`h-full w-full bg-white ${s.ms ? `story-fill ${playing ? "" : "paused"}` : ""}`}
                    style={{ "--dur": `${s.ms}ms` } as React.CSSProperties}
                  />
                )}
              </div>
            ))}
          </div>
          {active < last && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause invitation" : "Play invitation"}
              className="fixed right-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 grid h-11 w-11 place-items-center rounded-full bg-black/35 text-white backdrop-blur-md"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}
          {active === 0 && (
            <div className="a-nudge pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 text-center text-[11px] tracking-[0.3em] text-gold-soft uppercase">
              <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          )}
        </>
      )}

      {phase !== "open" && <Doors guest={guest} opening={phase === "opening"} onOpen={open} />}
    </>
  );
}

/* ───────── The sealed doors ───────── */

function Doors({ guest, opening, onOpen }: { guest: string; opening: boolean; onOpen: () => void }) {
  const initials = `${wedding.bride[0]}${wedding.groom[0]}`;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open the invitation"
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      className={`fixed inset-0 z-50 cursor-pointer select-none ${opening ? "doors-open doors-gone" : ""}`}
    >
      <Door side="l" />
      <Door side="r" />

      <div className="door-text pointer-events-none absolute inset-x-0 top-[12%] px-6 text-center">
        <p className="font-deva text-xl text-gold-soft">{wedding.invocation}</p>
        <p className="mt-6 text-[11px] font-semibold tracking-[0.45em] text-gold-soft/80 uppercase">
          {guest ? "Specially for" : "You are invited"}
        </p>
        {guest && <p className="mt-2 font-display text-3xl text-foil">{guest}</p>}
      </div>

      <div className="seal pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid h-36 w-36 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff1c4,#e2b24a_45%,#9c6b1c)] shadow-[0_0_0_6px_rgb(74_10_20),0_0_0_8px_rgb(226_194_122/.6),0_20px_50px_-10px_rgb(0_0_0/.7)]">
          <Mandala stroke="#7a4a10" className="animate-spin-slow absolute inset-1 opacity-50" />
          <span className="relative font-display text-4xl font-bold tracking-tight text-maroon-deep">
            {initials[0]}
            <span className="mx-0.5 font-script text-3xl font-normal text-rani">&amp;</span>
            {initials[1]}
          </span>
        </div>
      </div>

      <div className="door-text pointer-events-none absolute inset-x-0 bottom-[12%] text-center">
        <p className="font-script text-4xl text-foil">
          {wedding.bride} &amp; {wedding.groom}
        </p>
        <p className="a-nudge mt-4 text-xs font-semibold tracking-[0.35em] text-gold-soft uppercase">Tap to open</p>
      </div>
    </div>
  );
}

function Door({ side }: { side: "l" | "r" }) {
  const isL = side === "l";
  return (
    <div className={`door door-${side} bg-velvet absolute inset-y-0 w-1/2 overflow-hidden ${isL ? "left-0" : "right-0"}`}>
      {/* carved frame */}
      <div className="absolute inset-3 rounded-t-[999px] border-2 border-gold-soft/60" />
      <div className="absolute inset-6 rounded-t-[999px] border border-gold-soft/30" />
      {/* brass studs */}
      <div
        className="absolute inset-10 rounded-t-[999px] opacity-60"
        style={{
          backgroundImage: "radial-gradient(circle, #e2c27a 0 2px, transparent 2.5px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* the inner edge where the doors meet */}
      <div className={`absolute inset-y-0 w-[3px] bg-gradient-to-b from-gold-soft/20 via-gold-soft to-gold-soft/20 ${isL ? "right-0" : "left-0"}`} />
      {/* door ring */}
      <div
        className={`absolute top-[58%] h-10 w-10 rounded-full border-[3px] border-gold-soft shadow-lg ${isL ? "right-4" : "left-4"}`}
      />
    </div>
  );
}
