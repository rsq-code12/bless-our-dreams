"use client";

import { useSyncExternalStore } from "react";

let now = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => now || Date.now();
const getServerSnapshot = () => 0;

export function Countdown({ to, tone = "dark" }: { to: string; tone?: "dark" | "light" }) {
  const light = tone === "light";
  const t = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const target = new Date(to).getTime();
  const diff = t ? Math.max(0, target - t) : null;

  if (diff === 0) {
    return (
      <p className={`font-display text-2xl italic ${light ? "text-maroon" : "text-gold-soft"}`}>
        Just married! Thank you for blessing us.
      </p>
    );
  }

  const parts: [string, number | null][] = [
    ["Days", diff === null ? null : Math.floor(diff / 86_400_000)],
    ["Hours", diff === null ? null : Math.floor(diff / 3_600_000) % 24],
    ["Mins", diff === null ? null : Math.floor(diff / 60_000) % 60],
    ["Secs", diff === null ? null : Math.floor(diff / 1000) % 60],
  ];

  return (
    <div className="flex items-stretch justify-center gap-2 sm:gap-3" role="timer" aria-label="Time until the wedding">
      {parts.map(([label, v]) => (
        <div
          key={label}
          className={`w-16 rounded-2xl border px-2 py-2 sm:w-20 ${light ? "border-gold/40 bg-paper" : "border-gold-soft/40 bg-white/5 backdrop-blur-sm"}`}
        >
          <div className={`font-display text-3xl font-semibold tabular-nums sm:text-4xl ${light ? "text-maroon" : "text-foil"}`}>
            {v === null ? "--" : String(v).padStart(2, "0")}
          </div>
          <div className={`text-[10px] font-medium tracking-[0.2em] uppercase ${light ? "text-muted" : "text-gold-soft/80"}`}>{label}</div>
        </div>
      ))}
    </div>
  );
}
