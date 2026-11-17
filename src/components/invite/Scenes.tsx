import Link from "next/link";
import { wedding } from "@/wedding.config";
import { sound } from "@/lib/sound";
import { formatDate } from "@/lib/format";
import { Countdown } from "../Countdown";
import { Divider, Mandala, Marigold, Petals, Toran } from "../Ornaments";
import { CalendarArt, EnvelopeArt, EventIconArt, KalashArt, PalaceArt, Peacock } from "./Art";

/**
 * The scenes of the invitation, top to bottom. Each fills the screen.
 * `.reveal` / `.write` children animate in (with an optional --d delay)
 * the first time the scene comes into view.
 */

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export function SceneAarambh() {
  return (
    <div className="bg-velvet relative flex h-full flex-col items-center justify-center overflow-hidden px-6 text-center text-ivory">
      <Toran className="absolute inset-x-0 top-0 h-[64px] w-full" />
      <Mandala className="animate-spin-slow absolute top-1/2 left-1/2 w-[620px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-20" />
      {wedding.openingLine && (
        <p className="reveal font-deva text-2xl text-gold-soft" style={d(0.2)}>
          {wedding.openingLine}
        </p>
      )}
      <KalashArt className="relative mt-2 w-64 sm:w-80" />
      <p className="reveal font-deva text-4xl text-foil sm:text-5xl" style={d(1.1)}>
        {wedding.invocation.replace(/॥/g, "").trim()}
      </p>
      <p className="reveal mt-3 text-xs font-semibold tracking-[0.35em] text-gold-soft/80 uppercase" style={d(1.5)}>
        With the blessings of our elders
      </p>
    </div>
  );
}

export function SceneCouple() {
  return (
    <div className="bg-blockprint relative flex h-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Mandala
        stroke="#b88a2a"
        className="animate-spin-slow absolute top-[42%] left-1/2 w-[560px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.12]"
      />
      <p className="reveal text-[11px] font-semibold tracking-[0.4em] text-muted uppercase" style={d(0.1)}>
        Together with their families
      </p>
      <h2 className="relative mt-4 flex flex-col items-center leading-none">
        <span className="write bg-gradient-to-r from-rani to-maroon bg-clip-text px-4 font-script text-[4.6rem] text-transparent sm:text-8xl" style={d(0.3)}>
          {wedding.bride}
        </span>
        {wedding.brideFamily && (
          <span className="reveal mt-1 text-xs text-muted" style={d(1.2)}>
            {wedding.brideFamily}
          </span>
        )}
        <span className="reveal my-4 flex items-center gap-3 font-display text-2xl text-gold italic" style={d(1.5)}>
          <span className="h-px w-10 bg-gold/60" /> weds <span className="h-px w-10 bg-gold/60" />
        </span>
        <span className="write bg-gradient-to-r from-maroon to-rani bg-clip-text px-4 font-script text-[4.6rem] text-transparent sm:text-8xl" style={d(1.8)}>
          {wedding.groom}
        </span>
        {wedding.groomFamily && (
          <span className="reveal mt-1 text-xs text-muted" style={d(2.6)}>
            {wedding.groomFamily}
          </span>
        )}
      </h2>
      <div className="relative mt-6 flex items-end justify-center">
        <Peacock className="-mr-4 w-36 sm:w-44" />
        <svg viewBox="0 0 40 40" className="a-pop mb-6 w-10" style={{ animationDelay: "2s" }} aria-hidden>
          <path d="M20 34 C 6 24 2 14 8 8 C 13 3 18 6 20 11 C 22 6 27 3 32 8 C 38 14 34 24 20 34 Z" fill="#c2185b" />
        </svg>
        <Peacock flip className="-ml-4 w-36 sm:w-44" />
      </div>
    </div>
  );
}

export function SceneInvite({ guest }: { guest: string }) {
  const month = formatDate(wedding.weddingDate, { month: "long" });
  const day = formatDate(wedding.weddingDate, { day: "numeric" });
  const weekday = formatDate(wedding.weddingDate, { weekday: "long" });
  const time = new Date(wedding.weddingDate).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
  });
  return (
    <div className="bg-velvet relative flex h-full flex-col items-center justify-center overflow-hidden px-6 text-center text-ivory">
      <Petals count={10} />
      <p className="reveal font-script text-4xl text-gold-soft" style={d(0.1)}>
        {guest ? `Dear ${guest},` : "Dear family & friends,"}
      </p>
      <p className="reveal mx-auto mt-4 max-w-xs font-display text-2xl leading-snug sm:max-w-md sm:text-3xl" style={d(0.5)}>
        we joyfully invite you to bless us as we begin our forever
      </p>
      <div className="mt-8">
        <CalendarArt month={month} day={day} weekday={weekday} time={time.toUpperCase()} />
      </div>
      <p className="reveal mt-6 text-sm tracking-wide text-gold-soft" style={d(1.4)}>
        {wedding.city}
      </p>
      <div className="reveal mt-6" style={d(1.8)}>
        <Countdown to={wedding.weddingDate} />
      </div>
    </div>
  );
}

export function SceneEvents() {
  return (
    <div className="bg-blockprint relative flex h-full flex-col items-center justify-center overflow-hidden px-5 text-center">
      <p className="reveal font-deva text-lg text-rani" style={d(0)}>
        उत्सव
      </p>
      <h2 className="reveal font-display text-4xl font-semibold text-maroon" style={d(0.1)}>
        The Celebrations
      </h2>
      <Divider className="reveal mt-2 h-5 w-44" />
      <ol className="relative mt-6 w-full max-w-sm space-y-3 text-left">
        <svg className="absolute top-8 bottom-8 left-[31px] h-[calc(100%-4rem)] w-1" preserveAspectRatio="none" viewBox="0 0 2 100" aria-hidden>
          <path d="M1 0 V100" stroke="#b88a2a" strokeWidth="2" strokeDasharray="1" pathLength={1} className="a-draw" vectorEffect="non-scaling-stroke" />
        </svg>
        {wedding.events.map((e, i) => (
          <li
            key={e.name}
            className="reveal relative flex items-center gap-4 rounded-2xl bg-paper/80 py-2.5 pr-3 pl-1 shadow-sm ring-1 ring-gold/20 backdrop-blur"
            style={d(0.4 + i * 0.45)}
          >
            <span className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-cream to-sand ring-2 ring-gold/50">
              <EventIconArt icon={e.icon} className="h-10 w-10" />
            </span>
            <span className="min-w-0">
              <span className="flex items-baseline gap-2">
                <span className="font-display text-xl leading-tight font-semibold text-maroon">{e.name}</span>
                <span className="font-deva text-sm text-rani">{e.local}</span>
              </span>
              <span className="block text-[13px] text-ink">
                {formatDate(`${e.date}T12:00:00+05:30`, { weekday: "short", day: "numeric", month: "short" })} · {e.time}
              </span>
              <span className="block truncate text-xs text-muted">{e.place}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SceneVenue() {
  const v = wedding.venue;
  const maps = v.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name}, ${v.address}`)}`;
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#1a0b2e] text-center text-ivory">
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-10">
        <p className="reveal text-[11px] font-semibold tracking-[0.4em] text-gold-soft/80 uppercase" style={d(0.1)}>
          The Venue
        </p>
        <h2 className="reveal mt-2 font-display text-4xl font-semibold text-foil sm:text-5xl" style={d(0.3)}>
          {v.name}
        </h2>
        <p className="reveal mt-1 text-sm text-ivory/80" style={d(0.5)}>
          {v.address}
        </p>
        <a
          href={maps}
          target="_blank"
          rel="noopener noreferrer"
          className="reveal mt-5 inline-flex items-center gap-2 rounded-full border border-gold-soft/50 bg-white/10 px-5 py-2.5 text-sm font-semibold text-gold-soft backdrop-blur hover:bg-white/15"
          style={d(0.8)}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
          Get directions
        </a>
      </div>
      <PalaceArt className="relative mx-auto aspect-square w-full max-w-[560px] shrink-0 sm:[mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]" />
    </div>
  );
}

export function SceneRsvp({ guest }: { guest: string }) {
  const send = (yes: boolean) => {
    sound.cue("ghungroo");
    const who = guest || "";
    const text = yes
      ? `🎉 Yes! ${who ? `${who} ` : ""}will be there to celebrate ${wedding.bride} & ${wedding.groom}'s wedding. Can't wait!`
      : `🙏 ${who ? `${who} ` : ""}can't make it, but sending all our love and blessings to ${wedding.bride} & ${wedding.groom}!`;
    window.open(`https://wa.me/${wedding.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };
  return (
    <div className="bg-velvet relative flex h-full flex-col items-center justify-center overflow-hidden px-6 text-center text-ivory">
      <Toran className="absolute inset-x-0 top-0 h-[64px] w-full" />
      <Lanterns />
      <p className="reveal font-deva text-lg text-marigold" style={d(0)}>
        सादर आमंत्रण
      </p>
      <h2 className="reveal mt-1 font-display text-4xl font-semibold text-gold-soft sm:text-5xl" style={d(0.2)}>
        Will you join us?
      </h2>
      <p className="reveal mx-auto mt-3 max-w-xs text-ivory/80" style={d(0.5)}>
        Your presence will make our celebration complete. Tap once to let us know.
      </p>
      <div className="reveal mt-8 grid w-full max-w-xs gap-3" style={d(0.9)}>
        <button
          type="button"
          onClick={() => send(true)}
          className="rounded-full bg-gradient-to-r from-marigold to-saffron px-6 py-4 text-base font-semibold text-maroon-ink shadow-[0_12px_30px_-12px_rgb(244_164_23/.9)] active:scale-[0.98]"
        >
          Joyfully accept 🎉
        </button>
        <button
          type="button"
          onClick={() => send(false)}
          className="rounded-full border border-gold-soft/40 px-6 py-3.5 text-sm font-semibold text-gold-soft active:scale-[0.98]"
        >
          Sending blessings from afar
        </button>
      </div>
    </div>
  );
}

function Lanterns() {
  return (
    <>
      {[
        { x: "8%", len: 90, delay: 0 },
        { x: "22%", len: 140, delay: -1 },
        { x: "78%", len: 120, delay: -2 },
        { x: "92%", len: 80, delay: -0.5 },
      ].map((l, i) => (
        <svg
          key={i}
          className="a-swing pointer-events-none absolute top-0 w-8"
          style={{ left: l.x, transformOrigin: "50% 0", animationDelay: `${l.delay}s` }}
          viewBox={`0 0 32 ${l.len + 40}`}
          height={l.len + 40}
          aria-hidden
        >
          <line x1="16" y1="0" x2="16" y2={l.len} stroke="#b88a2a" />
          <circle cx="16" cy={l.len + 18} r="16" fill="#ffb347" opacity=".2" />
          <path d={`M6 ${l.len} h20 l 4 10 l -4 18 h -20 l -4 -18 z`} fill={i % 2 ? "#c2185b" : "#e46b0e"} />
          <path d={`M10 ${l.len + 4} v 22 M16 ${l.len + 2} v 26 M22 ${l.len + 4} v 22`} stroke="#ffd36b" strokeWidth="1" opacity=".7" />
          <path d={`M12 ${l.len + 28} l 4 8 l 4 -8`} fill="#ffd36b" />
        </svg>
      ))}
    </>
  );
}

export function SceneBlessing({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="bg-blockprint relative flex h-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      <EnvelopeArt className="relative w-56 sm:w-64" />
      <p className="reveal mt-2 font-script text-5xl text-rani" style={d(0.4)}>
        Your presence is our present
      </p>
      <p className="reveal mx-auto mt-4 max-w-xs text-[16px] leading-relaxed text-ink/85 sm:max-w-sm" style={d(0.9)}>
        No boxed gifts, please. But if you&apos;d love to bless us, we&apos;ve shared a few dreams we&apos;re building
        together.
      </p>
      <Link
        href="/gift/"
        className="reveal mt-7 inline-flex items-center gap-2 rounded-full bg-maroon px-8 py-4 text-base font-semibold text-ivory shadow-[0_12px_30px_-14px_rgb(110_20_35/.9)] active:scale-[0.98]"
        style={d(1.3)}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <Marigold cx={12} cy={12} r={10} />
        </svg>
        See our dreams
      </Link>
      <button
        type="button"
        onClick={onReplay}
        className="reveal mt-4 text-sm font-medium text-muted underline decoration-dotted underline-offset-4"
        style={d(1.6)}
      >
        ↺ Watch the invitation again
      </button>
      <p className="reveal absolute bottom-6 text-xs tracking-[0.3em] text-muted uppercase" style={d(2)}>
        {wedding.hashtag}
      </p>
    </div>
  );
}
