"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { sound } from "@/lib/sound";

/**
 * Music on/off, shown on every guest page. Music keeps playing when the guest
 * moves from the invitation to the gift page. On the invitation, the first tap
 * anywhere starts the music (unless the guest turned it off before).
 */
export function SoundToggle() {
  const pathname = usePathname() ?? "/";
  const { started, muted } = useSyncExternalStore(sound.subscribe, sound.getState, sound.getServerState);
  const isInvite = pathname === "/" || pathname === "";
  const hidden = pathname.startsWith("/send") || pathname.startsWith("/qr");

  useEffect(() => {
    if (!isInvite) return;
    const onTap = (e: PointerEvent) => {
      // The doors start the music themselves, with the shankh.
      if ((e.target as Element | null)?.closest?.("[data-doors]")) return;
      if (!sound.prefersOff()) sound.start();
      window.removeEventListener("pointerup", onTap);
    };
    window.addEventListener("pointerup", onTap);
    return () => window.removeEventListener("pointerup", onTap);
  }, [isInvite]);

  if (hidden) return null;

  const playing = started && !muted;
  return (
    <button
      type="button"
      onClick={() => (started ? sound.setMuted(!muted) : sound.start())}
      aria-label={playing ? "Turn music off" : "Play music"}
      aria-pressed={playing}
      className={`fixed top-[calc(env(safe-area-inset-top)+18px)] right-3 z-40 flex h-10 items-center gap-2 rounded-full bg-black/35 text-white shadow-lg backdrop-blur-md transition active:scale-95 ${
        started ? "w-10 justify-center" : "px-3.5"
      }`}
    >
      {playing ? (
        <span className="flex h-4 items-end gap-[3px]" aria-hidden>
          {[0, 0.25, 0.5, 0.15].map((d, i) => (
            <span key={i} className="eq-bar w-[3px] rounded-full bg-marigold" style={{ animationDelay: `${d}s` }} />
          ))}
        </span>
      ) : started ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" />
          <path d="m22 9-6 6m0-6 6 6" />
        </svg>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="a-beat h-4 w-4 text-marigold" fill="currentColor" aria-hidden>
            <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span className="text-xs font-semibold tracking-wide">Play music</span>
        </>
      )}
    </button>
  );
}
