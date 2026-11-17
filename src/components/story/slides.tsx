"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { wedding } from "@/wedding.config";
import { formatDate } from "@/lib/format";
import { sound } from "@/lib/sound";
import { Countdown } from "../Countdown";
import { Mandala, Marigold } from "../Ornaments";
import { EnvelopeArt, EventIconArt, PalaceArt, Peacock } from "../invite/Art";

/**
 * "Shaadi Wrapped": one full-screen slide per moment, in the spirit of a
 * year-in-review story. Each slide mounts fresh, so its animations replay.
 */

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;
const couple = `${wedding.bride} & ${wedding.groom}`;

/** A line of big type that slides up out of a mask. */
function K({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className="k-mask">
      <span className={`k-up ${className}`} style={d(delay)}>
        {children}
      </span>
    </span>
  );
}

function Pill({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <span
      className={`k-in inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase ${className}`}
      style={d(delay)}
    >
      {children}
    </span>
  );
}

function useCountUp(getTarget: () => number, ms = 1700, delay = 400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const target = getTarget();
    let raf = 0;
    let start = 0;
    const t = setTimeout(() => {
      const step = (now: number) => {
        if (!start) start = now;
        const p = Math.min(1, (now - start) / ms);
        setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms, delay]);
  return v;
}

const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(n);

function Confetti({ count = 40 }: { count?: number }) {
  const colors = ["#f4a417", "#c2185b", "#ffd36b", "#2a9d8f", "#fff8ee", "#e46b0e"];
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const left = (i * 37 + 7) % 100;
        const x = `${((i * 53) % 120) - 60}px`;
        const r = `${(i * 97) % 720}deg`;
        const w = 6 + (i % 4) * 2;
        return (
          <span
            key={i}
            className="confetti"
            style={
              {
                left: `${left}%`,
                width: w,
                height: w * (i % 3 ? 0.5 : 1),
                background: colors[i % colors.length],
                borderRadius: i % 3 === 0 ? 999 : 2,
                "--x": x,
                "--r": r,
                "--delay": `${(i % 10) * 0.05}s`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

/* ───────────────────────── 1 · intro ───────────────────────── */

export function IntroSlide({ guest }: { guest: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#c2185b] text-ivory">
      <div className="k-shape float-a absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-marigold" style={d(0.1)} />
      <div className="k-shape float-b absolute -top-16 -left-20 h-56 w-56 rounded-full bg-maroon" style={d(0.25)} />
      <div className="k-shape absolute top-[22%] right-8 h-16 w-16 rotate-45 rounded-xl bg-[#ffd36b]" style={d(0.4)} />
      <Mandala stroke="#fff1c4" className="animate-spin-slow absolute -right-40 -bottom-40 w-[520px] opacity-25" />
      <div className="relative flex h-full flex-col justify-end px-7 pb-24">
        <Pill className="mb-6 self-start bg-black/20 text-ivory" delay={0.2}>
          Shaadi Wrapped · {formatDate(wedding.weddingDate, { year: "numeric" })}
        </Pill>
        <h1 className="font-wrap text-[2.9rem] leading-[0.98] font-extrabold tracking-tight sm:text-6xl">
          <K delay={0.35}>{guest ? `${guest},` : "Hey you,"}</K>
          <K delay={0.5}>you&apos;re invited</K>
          <K delay={0.65}>to the</K>
          <K delay={0.8} className="text-[#ffd36b]">
            biggest day
          </K>
          <K delay={0.95}>of our lives.</K>
        </h1>
        <p className="k-in mt-5 font-deva text-lg text-ivory/85" style={d(1.4)}>
          {wedding.invocation}
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────── 2 · the couple ───────────────────────── */

export function CoupleSlide() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#fff1e0] text-maroon">
      <div className="k-shape float-a absolute -top-20 -right-16 h-64 w-64 rounded-full bg-[#ffd36b]/70" style={d(0.1)} />
      <div className="k-shape float-b absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#f8bbd0]" style={d(0.2)} />
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <Pill className="bg-maroon text-ivory" delay={0.2}>
          Starring
        </Pill>
        <p className="k-pop mt-4 font-script text-[5.2rem] leading-none text-rani sm:text-8xl" style={d(0.45)}>
          {wedding.bride}
        </p>
        {wedding.brideFamily && (
          <p className="k-in mt-1 text-xs text-muted" style={d(0.9)}>
            {wedding.brideFamily}
          </p>
        )}
        <p className="k-pop my-3 font-wrap text-4xl font-extrabold text-gold" style={d(1.1)}>
          &amp;
        </p>
        <p className="k-pop font-script text-[5.2rem] leading-none text-maroon sm:text-8xl" style={d(1.35)}>
          {wedding.groom}
        </p>
        {wedding.groomFamily && (
          <p className="k-in mt-1 text-xs text-muted" style={d(1.8)}>
            {wedding.groomFamily}
          </p>
        )}
        <div className="scene is-on mt-6 flex items-end justify-center">
          <Peacock className="-mr-4 w-32 sm:w-40" />
          <svg viewBox="0 0 40 40" className="k-pop mb-6 w-9" style={d(2)} aria-hidden>
            <path d="M20 34 C 6 24 2 14 8 8 C 13 3 18 6 20 11 C 22 6 27 3 32 8 C 38 14 34 24 20 34 Z" fill="#c2185b" />
          </svg>
          <Peacock flip className="-ml-4 w-32 sm:w-40" />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 3 · days together ───────────────────────── */

export function TogetherSlide() {
  const days = useCountUp(() => Math.max(0, Math.floor((Date.now() - new Date(wedding.story.metOn).getTime()) / 86_400_000)), 1800, 500);
  const chips = ["bg-[#ffd36b] text-maroon-ink", "bg-[#f8bbd0] text-maroon-ink", "bg-ivory text-maroon-ink"];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0f5e50] text-ivory">
      <div className="k-shape float-a absolute -top-24 -left-24 h-72 w-72 rounded-full border-[28px] border-[#ffd36b]/25" style={d(0.1)} />
      <div className="relative flex h-full flex-col justify-center px-7">
        <h2 className="font-wrap text-3xl leading-tight font-bold">
          <K delay={0.2}>Since the day</K>
          <K delay={0.35}>we met, it&apos;s been</K>
        </h2>
        <p className="k-pop mt-3 font-wrap text-[5.5rem] leading-none font-extrabold tracking-tight text-[#ffd36b] tabular-nums sm:text-8xl" style={d(0.5)}>
          {fmt(days)}
        </p>
        <p className="k-in font-wrap text-2xl font-bold" style={d(0.8)}>
          days <span className="font-display font-medium text-ivory/70 italic">and counting</span>
        </p>
        <div className="mt-8 grid gap-2.5">
          {wedding.story.stats.map((s, i) => (
            <Stat key={s.label} value={s.value} label={s.label} className={chips[i % chips.length]} delay={2 + i * 0.45} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, className, delay }: { value: number; label: string; className: string; delay: number }) {
  const v = useCountUp(() => value, 900, delay * 1000);
  return (
    <div className={`k-right flex items-baseline gap-3 rounded-2xl px-4 py-3 ${className}`} style={d(delay)}>
      <span className="font-wrap text-3xl font-extrabold tabular-nums">{fmt(v)}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}

/* ───────────────────────── 4 · quiz ───────────────────────── */

export function QuizSlide() {
  const q = wedding.story.quiz;
  const [picked, setPicked] = useState<number | null>(null);
  const [auto, setAuto] = useState(false);
  const revealed = picked !== null || auto;

  useEffect(() => {
    const t = setTimeout(() => setAuto(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const choose = (i: number) => {
    if (revealed) return;
    setPicked(i);
    sound.cue(i === q.answer ? "ghungroo" : "tick");
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#2b1a6b] text-ivory">
      <div className="k-shape float-a absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-[#c2185b]" style={d(0.1)} />
      <div className="k-shape float-b absolute top-16 -left-10 h-24 w-24 rotate-12 rounded-2xl bg-[#f4a417]" style={d(0.3)} />
      {picked === q.answer && <Confetti />}
      <div className="relative flex h-full flex-col justify-center px-7">
        <Pill className="self-start bg-white/15 text-ivory" delay={0.1}>
          Quick quiz 👀
        </Pill>
        <h2 className="mt-4 font-wrap text-[2.4rem] leading-[1.02] font-extrabold">
          <K delay={0.25}>{q.question}</K>
        </h2>
        <div className="mt-7 grid gap-3" data-nonav>
          {q.options.map((o, i) => {
            const right = i === q.answer;
            const state = !revealed ? "idle" : right ? "right" : picked === i ? "wrong" : "dim";
            return (
              <button
                key={o}
                type="button"
                onClick={() => choose(i)}
                className={`k-right flex items-center justify-between rounded-2xl px-5 py-4 text-left text-lg font-semibold transition ${
                  state === "right"
                    ? "bg-[#ffd36b] text-maroon-ink"
                    : state === "wrong"
                      ? "k-shake bg-white/10 text-ivory/60 line-through"
                      : state === "dim"
                        ? "bg-white/5 text-ivory/40"
                        : "bg-white/12 text-ivory ring-1 ring-white/20 active:scale-[0.98]"
                }`}
                style={d(0.6 + i * 0.15)}
              >
                <span>{o}</span>
                {state === "right" && <span aria-hidden>✓</span>}
              </button>
            );
          })}
        </div>
        <p className={`mt-6 min-h-[3.5rem] font-display text-xl text-ivory/90 italic transition-opacity duration-500 ${revealed ? "opacity-100" : "opacity-0"}`}>
          {revealed && (picked === null || picked === q.answer ? q.reveal : `Nope! ${q.reveal}`)}
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────── 5 · top moments ───────────────────────── */

export function MomentsSlide() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f4a417] text-maroon-ink">
      <div className="k-shape float-a absolute -top-28 -right-20 h-72 w-72 rounded-full bg-[#ffd36b]" style={d(0)} />
      <div className="relative flex h-full flex-col justify-center px-7">
        <h2 className="font-wrap text-[2.5rem] leading-[1] font-extrabold">
          <K delay={0.15}>Our top 5</K>
          <K delay={0.3}>moments</K>
        </h2>
        <ol className="mt-7 space-y-2.5">
          {wedding.story.moments.slice(0, 5).map((m, i) => (
            <li
              key={m}
              className={`k-right flex items-center gap-4 rounded-2xl px-4 py-3 ${i === 0 ? "bg-maroon text-ivory" : "bg-white/35"}`}
              style={d(0.7 + i * 0.55)}
            >
              <span className={`w-9 font-wrap text-4xl leading-none font-extrabold ${i === 0 ? "text-[#ffd36b]" : "text-transparent [-webkit-text-stroke:1.5px_#6e1423]"}`}>
                {i + 1}
              </span>
              <span className="font-semibold leading-snug">{m}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ───────────────────────── 6 · save the date ───────────────────────── */

export function DateSlide() {
  const day = formatDate(wedding.weddingDate, { day: "numeric" });
  const month = formatDate(wedding.weddingDate, { month: "long" });
  const weekday = formatDate(wedding.weddingDate, { weekday: "long" });
  const time = new Date(wedding.weddingDate).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" });
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#e91e63] via-[#c2185b] to-[#6e1423] text-ivory">
      <Mandala stroke="#ffd36b" className="animate-spin-slow absolute top-1/2 left-1/2 w-[640px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-20" />
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <Pill className="bg-black/25 text-ivory" delay={0.1}>
          Save the date
        </Pill>
        <p className="k-pop mt-2 font-wrap text-[10rem] leading-[0.85] font-extrabold tracking-tighter text-[#ffd36b]" style={d(0.35)}>
          {day}
        </p>
        <p className="k-in font-wrap text-4xl font-extrabold tracking-wide uppercase" style={d(0.7)}>
          {month}
        </p>
        <p className="k-in mt-2 text-lg text-ivory/85" style={d(0.95)}>
          {weekday} · {time.toUpperCase()} · {wedding.city}
        </p>
        <div className="k-in mt-8" style={d(1.3)}>
          <Countdown to={wedding.weddingDate} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 7 · the shaadi playlist ───────────────────────── */

export function PlaylistSlide() {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setNow((n) => (n + 1) % wedding.events.length), 1800);
    return () => clearInterval(t);
  }, []);
  const days = new Set(wedding.events.map((e) => e.date)).size;
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#5a0c18] via-[#1c0910] to-[#120609] text-ivory">
      <div className="relative flex h-full flex-col justify-center px-6">
        <div className="flex items-end gap-4">
          <div className="k-pop relative grid aspect-square w-28 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-marigold to-rani shadow-2xl" style={d(0.1)}>
            <Mandala stroke="#fff1c4" className="animate-spin-slow absolute inset-[-20%] opacity-40" />
            <span className="relative font-script text-4xl text-white drop-shadow">
              {wedding.bride[0]}&amp;{wedding.groom[0]}
            </span>
          </div>
          <div className="min-w-0">
            <p className="k-in text-[11px] font-bold tracking-[0.2em] text-ivory/60 uppercase" style={d(0.3)}>
              Playlist
            </p>
            <h2 className="k-in font-wrap text-3xl leading-tight font-extrabold" style={d(0.4)}>
              The Shaadi Playlist
            </h2>
            <p className="k-in mt-1 text-sm text-ivory/70" style={d(0.5)}>
              {couple} · {wedding.events.length} events · {days} days
            </p>
          </div>
        </div>

        <div className="k-in mt-5 flex items-center gap-4" style={d(0.7)}>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-marigold text-maroon-ink shadow-lg">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-sm text-ivory/70">Now playing: {wedding.events[now].name}</span>
        </div>

        <ol className="mt-5 space-y-1">
          {wedding.events.map((e, i) => {
            const on = i === now;
            return (
              <li
                key={e.name}
                className={`k-right flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors duration-500 ${on ? "bg-white/10" : ""}`}
                style={d(0.9 + i * 0.2)}
              >
                <span className="w-5 text-center text-sm text-ivory/50 tabular-nums">
                  {on ? (
                    <span className="flex h-4 items-end justify-center gap-[2px]">
                      {[0, 0.3, 0.15].map((dl, k) => (
                        <span key={k} className="eq-bar w-[3px] rounded-full bg-marigold" style={{ animationDelay: `${dl}s` }} />
                      ))}
                    </span>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-gradient-to-br from-cream to-sand">
                  <EventIconArt icon={e.icon} className="h-8 w-8" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate font-semibold ${on ? "text-marigold" : ""}`}>
                    {e.name} <span className="font-deva text-sm font-normal text-ivory/50">{e.local}</span>
                  </span>
                  <span className="block truncate text-xs text-ivory/55">{e.place}</span>
                </span>
                <span className="shrink-0 text-right text-xs text-ivory/70">
                  {formatDate(`${e.date}T12:00:00+05:30`, { day: "numeric", month: "short" })}
                  <span className="block text-ivory/45">{e.time}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/* ───────────────────────── 8 · venue ───────────────────────── */

export function VenueSlide() {
  const v = wedding.venue;
  const maps = v.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name}, ${v.address}`)}`;
  return (
    <div className="scene is-on absolute inset-0 flex flex-col overflow-hidden bg-[#1a0b2e] text-ivory">
      <div className="relative z-10 flex flex-1 flex-col justify-center px-7 pt-10">
        <Pill className="self-start bg-white/10 text-gold-soft" delay={0.1}>
          Destination unlocked 🔓
        </Pill>
        <h2 className="mt-4 font-wrap text-[2.6rem] leading-[1] font-extrabold">
          <K delay={0.3} className="text-[#ffd36b]">
            {v.name}
          </K>
        </h2>
        <p className="k-in mt-2 text-ivory/75" style={d(0.6)}>
          {v.address}
        </p>
        <a
          href={maps}
          target="_blank"
          rel="noopener noreferrer"
          className="k-in mt-5 inline-flex items-center gap-2 self-start rounded-full bg-ivory px-5 py-3 text-sm font-bold text-maroon-ink"
          style={d(0.9)}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
          Get directions
        </a>
      </div>
      <PalaceArt className="relative mx-auto aspect-square w-full max-w-[520px] shrink-0" />
    </div>
  );
}

/* ───────────────────────── 9 · rsvp ───────────────────────── */

export function RsvpSlide({ guest }: { guest: string }) {
  const [sent, setSent] = useState(false);
  const send = (yes: boolean) => {
    sound.cue("ghungroo");
    setSent(true);
    const who = guest ? `${guest} ` : "";
    const text = yes
      ? `🎉 Yes! ${who}will be there to celebrate ${couple}'s wedding. Can't wait!`
      : `🙏 ${who}can't make it, but sending all our love and blessings to ${couple}!`;
    window.open(`https://wa.me/${wedding.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#e46b0e] to-[#c2185b] text-ivory">
      <div className="k-shape float-a absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[#ffd36b]/40" style={d(0.1)} />
      {sent && <Confetti />}
      <div className="relative flex h-full flex-col justify-center px-7">
        <h2 className="font-wrap text-[3.2rem] leading-[0.95] font-extrabold">
          <K delay={0.2}>So…</K>
          <K delay={0.4}>are you in?</K>
        </h2>
        <p className="k-in mt-4 max-w-xs text-lg text-ivory/90" style={d(0.7)}>
          One tap tells us on WhatsApp.
        </p>
        <div className="mt-8 grid gap-3" data-nonav>
          <button
            type="button"
            onClick={() => send(true)}
            className="k-right rounded-2xl bg-ivory px-6 py-5 text-left font-wrap text-2xl font-extrabold text-maroon-ink shadow-xl active:scale-[0.98]"
            style={d(1)}
          >
            Count me in! 🎉
          </button>
          <button
            type="button"
            onClick={() => send(false)}
            className="k-right rounded-2xl bg-black/20 px-6 py-4 text-left text-lg font-semibold text-ivory active:scale-[0.98]"
            style={d(1.2)}
          >
            Sending love from afar 💌
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 10 · gift ───────────────────────── */

export function GiftSlide() {
  return (
    <div className="scene is-on absolute inset-0 overflow-hidden bg-[#fff1e0] text-maroon">
      <div className="k-shape float-b absolute -top-24 -left-16 h-64 w-64 rounded-full bg-[#ffd36b]/60" style={d(0.1)} />
      <div className="relative flex h-full flex-col items-center justify-center px-7 text-center">
        <EnvelopeArt className="w-52" />
        <h2 className="mt-2 font-wrap text-[2.2rem] leading-[1] font-extrabold">
          <K delay={0.3}>Your presence</K>
          <K delay={0.45}>is our present.</K>
        </h2>
        <p className="k-in mt-4 max-w-xs text-[17px] leading-relaxed text-ink/85" style={d(1)}>
          But if you insist 😄 we&apos;ve shared a few dreams we&apos;re building together.
        </p>
        <Link
          href="/gift/"
          data-nonav
          className="k-pop mt-7 inline-flex items-center gap-2 rounded-full bg-maroon px-8 py-4 text-base font-bold text-ivory shadow-[0_12px_30px_-14px_rgb(110_20_35/.9)] active:scale-[0.98]"
          style={d(1.4)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <Marigold cx={12} cy={12} r={10} />
          </svg>
          See our dreams
        </Link>
      </div>
    </div>
  );
}

/* ───────────────────────── 11 · wrapped summary ───────────────────────── */

export function WrappedSlide({ guest, onReplay }: { guest: string; onReplay: () => void }) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setDaysLeft(Math.max(0, Math.ceil((new Date(wedding.weddingDate).getTime() - Date.now()) / 86_400_000))), 0);
    return () => clearTimeout(t);
  }, []);
  const share = async () => {
    sound.cue("chime");
    const url = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`;
    const text = `${couple} are getting married! 💛 Open the invitation:`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${couple} · Shaadi Wrapped`, text, url });
        return;
      }
    } catch {
      return; // guest closed the share sheet
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener");
  };
  const cells: [string, string][] = [
    ["Invited", guest || "You 💛"],
    ["Date", formatDate(wedding.weddingDate, { day: "numeric", month: "short", year: "numeric" })],
    ["Venue", wedding.venue.name],
    ["Countdown", daysLeft === null ? "…" : `${daysLeft} days`],
  ];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#2e0710] text-ivory">
      <Mandala stroke="#e2c27a" className="animate-spin-slow absolute -top-48 -right-48 w-[560px] opacity-15" />
      <Confetti count={30} />
      <div className="relative flex h-full flex-col justify-center px-6">
        <h2 className="text-center font-wrap text-3xl font-extrabold">
          <K delay={0.1}>Your invite, wrapped</K>
        </h2>
        <div className="k-pop mt-5 rounded-[26px] bg-gradient-to-br from-marigold via-rani to-[#6e1423] p-[3px] shadow-2xl" style={d(0.4)}>
          <div className="rounded-[23px] bg-[#fff1e0] p-5 text-maroon-ink">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-marigold to-rani font-script text-xl text-white">
                {wedding.bride[0]}&amp;{wedding.groom[0]}
              </span>
              <div>
                <p className="font-script text-3xl leading-none text-rani">{couple}</p>
                <p className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">Shaadi Wrapped</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              {cells.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase">{k}</dt>
                  <dd className="font-wrap text-lg leading-tight font-extrabold">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 border-t border-maroon/10 pt-3">
              <p className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase">Top events</p>
              <p className="font-semibold">{wedding.events.map((e) => e.name).join(" · ")}</p>
            </div>
            <p className="mt-3 text-right font-wrap text-sm font-bold text-rani">{wedding.hashtag}</p>
          </div>
        </div>
        <div className="k-in mt-6 grid grid-cols-2 gap-3" style={d(1)} data-nonav>
          <button type="button" onClick={share} className="rounded-full bg-ivory px-4 py-3.5 font-bold text-maroon-ink active:scale-[0.98]">
            Share invite
          </button>
          <button type="button" onClick={onReplay} className="rounded-full border border-ivory/40 px-4 py-3.5 font-bold text-ivory active:scale-[0.98]">
            ↺ Replay
          </button>
        </div>
        <Link href="/gift/" data-nonav className="k-in mt-4 text-center text-sm font-semibold text-gold-soft underline underline-offset-4" style={d(1.2)}>
          Bless one of our dreams →
        </Link>
      </div>
    </div>
  );
}
