"use client";

import Link from "next/link";
import { wedding } from "@/wedding.config";
import { formatDate } from "@/lib/format";
import { sound } from "@/lib/sound";
import { Countdown } from "../Countdown";
import { Diya, Divider, Mandala, Paisley, Petals, Toran } from "../Ornaments";
import { EventIconArt, KalashArt, PalaceArt, Peacock } from "../invite/Art";

/**
 * The pages of a traditional shaadi card, shown one at a time.
 * Calm, respectful and easy to read: written for the whole family, elders included.
 */

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/** Gold double border with paisley corners, like a printed card. */
function Frame({ dark }: { dark?: boolean }) {
  const line = dark ? "border-gold-soft/60" : "border-gold/55";
  const thin = dark ? "border-gold-soft/30" : "border-gold/30";
  const ink = dark ? "text-gold-soft/70" : "text-gold/70";
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
      <div className={`absolute inset-3 rounded-[20px] border-2 ${line}`} />
      <div className={`absolute inset-[19px] rounded-[15px] border ${thin}`} />
      <Paisley className={`absolute top-6 left-6 h-9 w-9 ${ink}`} />
      <Paisley className={`absolute top-6 right-6 h-9 w-9 -scale-x-100 ${ink}`} />
      <Paisley className={`absolute bottom-6 left-6 h-9 w-9 -scale-y-100 ${ink}`} />
      <Paisley className={`absolute right-6 bottom-6 h-9 w-9 -scale-100 ${ink}`} />
    </div>
  );
}

function Page({ dark, children, className = "" }: { dark?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={`scene is-on absolute inset-0 overflow-hidden ${dark ? "bg-velvet text-ivory" : "bg-blockprint text-ink"}`}>
      <Frame dark={dark} />
      <div className={`relative z-10 flex h-full flex-col items-center justify-center px-10 pt-14 pb-12 text-center ${className}`}>
        {children}
      </div>
    </div>
  );
}

const hosts = wedding.invitation.hosts;

/* ───────── 1 · the invitation ───────── */

export function InvitePage({ guest }: { guest: string }) {
  return (
    <Page>
      <KalashArt className="-mt-4 w-36" />
      <p className="k-in font-deva text-xl text-rani" style={d(0.3)}>
        {wedding.invocation}
      </p>
      <p className="k-in mt-4 font-script text-4xl text-maroon" style={d(0.7)}>
        {guest ? `${guest},` : "Respected family,"}
      </p>
      <p className="k-in mt-3 font-display text-lg text-muted italic" style={d(1.1)}>
        With the blessings of our elders
      </p>
      <p className="k-in mt-3 font-display text-2xl leading-snug font-semibold text-maroon" style={d(1.5)}>
        {hosts}
      </p>
      <p className="k-in mt-3 max-w-xs text-[17px] leading-relaxed text-ink/85" style={d(1.9)}>
        cordially invite you and your family to grace the auspicious occasion of the wedding of their{" "}
        {wedding.invitation.relation}
      </p>
      {wedding.invitation.hindiLine && (
        <p className="k-in mt-4 font-deva text-[17px] leading-relaxed text-rani" style={d(2.4)}>
          {wedding.invitation.hindiLine}
        </p>
      )}
    </Page>
  );
}

/* ───────── 2 · the couple ───────── */

export function CouplePage() {
  return (
    <Page dark>
      <Mandala className="animate-spin-slow absolute top-[44%] left-1/2 w-[560px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.12]" />
      <p className="k-in font-deva text-lg text-gold-soft" style={d(0.2)}>
        शुभ विवाह
      </p>
      <p className="k-up mt-3 font-script text-[4.4rem] leading-none text-foil" style={d(0.5)}>
        {wedding.bride}
      </p>
      {wedding.brideFamily && (
        <p className="k-in mt-2 text-[15px] text-ivory/80" style={d(1)}>
          {wedding.brideFamily}
        </p>
      )}
      <div className="k-in my-5 flex items-center gap-3" style={d(1.3)}>
        <Divider className="h-5 w-16" color="#e2c27a" />
        <span className="font-display text-2xl text-gold-soft italic">with</span>
        <Divider className="h-5 w-16" color="#e2c27a" />
      </div>
      <p className="k-up font-script text-[4.4rem] leading-none text-foil" style={d(1.6)}>
        {wedding.groom}
      </p>
      {wedding.groomFamily && (
        <p className="k-in mt-2 text-[15px] text-ivory/80" style={d(2.1)}>
          {wedding.groomFamily}
        </p>
      )}
      <div className="mt-6 flex items-end justify-center">
        <Peacock className="-mr-3 w-28" />
        <Diya className="k-pop mb-2 h-10 w-10" />
        <Peacock flip className="-ml-3 w-28" />
      </div>
    </Page>
  );
}

/* ───────── 3 · the auspicious day ───────── */

export function MuhuratPage() {
  const weekday = formatDate(wedding.weddingDate, { weekday: "long" });
  const date = formatDate(wedding.weddingDate, { day: "numeric", month: "long", year: "numeric" });
  const time = new Date(wedding.weddingDate).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
  });
  return (
    <Page>
      <p className="k-in font-deva text-2xl text-rani" style={d(0.2)}>
        शुभ मुहूर्त
      </p>
      <p className="k-in mt-1 font-display text-xl text-muted italic" style={d(0.4)}>
        on the auspicious day of
      </p>
      <span className="k-in mt-4 block" style={d(0.6)}>
        <Divider className="h-5 w-48" />
      </span>
      <p className="k-in mt-4 font-display text-2xl text-maroon" style={d(0.8)}>
        {weekday}
      </p>
      <p className="k-pop font-display text-[2.6rem] leading-tight font-semibold text-maroon" style={d(1)}>
        {date}
      </p>
      <p className="k-in mt-1 font-display text-xl text-ink" style={d(1.3)}>
        {time.toUpperCase()} onwards
      </p>
      <p className="k-in mt-1 text-[15px] text-muted" style={d(1.5)}>
        {wedding.city}
      </p>
      <span className="k-in mt-5 block" style={d(1.7)}>
        <Divider className="h-5 w-48" />
      </span>
      <div className="k-in mt-6" style={d(2)}>
        <Countdown to={wedding.weddingDate} tone="light" />
      </div>
    </Page>
  );
}

/* ───────── 4 · programme ───────── */

export function ProgrammePage() {
  return (
    <Page dark className="px-8">
      <p className="k-in font-deva text-2xl text-marigold" style={d(0.1)}>
        कार्यक्रम
      </p>
      <p className="k-in font-display text-2xl text-gold-soft" style={d(0.25)}>
        Programme of Ceremonies
      </p>
      <ol className="mt-5 w-full max-w-sm space-y-2.5 text-left">
        {wedding.events.map((e, i) => (
          <li
            key={e.name}
            className="k-in flex items-center gap-3 rounded-2xl border border-gold-soft/25 bg-white/5 px-3 py-2.5"
            style={d(0.6 + i * 0.4)}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cream to-sand ring-2 ring-gold-soft/60">
              <EventIconArt icon={e.icon} className="h-9 w-9" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-xl leading-tight font-semibold text-gold-soft">
                {e.name} <span className="font-deva text-base font-normal text-marigold">{e.local}</span>
              </span>
              <span className="block text-[15px] text-ivory/90">
                {formatDate(`${e.date}T12:00:00+05:30`, { weekday: "short", day: "numeric", month: "long" })} · {e.time}
              </span>
              <span className="block text-sm text-ivory/65">{e.place}</span>
            </span>
          </li>
        ))}
      </ol>
    </Page>
  );
}

/* ───────── 5 · venue ───────── */

export function VenuePage() {
  const v = wedding.venue;
  const maps = v.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name}, ${v.address}`)}`;
  return (
    <div className="scene is-on absolute inset-0 flex flex-col overflow-hidden bg-[#1a0b2e] text-ivory">
      <Frame dark />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-10 pt-14 text-center">
        <p className="k-in font-deva text-2xl text-marigold" style={d(0.1)}>
          विवाह स्थल
        </p>
        <p className="k-in font-display text-xl text-gold-soft/80 italic" style={d(0.25)}>
          The Venue
        </p>
        <p className="k-in mt-3 font-display text-4xl leading-tight font-semibold text-foil" style={d(0.5)}>
          {v.name}
        </p>
        <p className="k-in mt-1 text-[16px] text-ivory/85" style={d(0.8)}>
          {v.address}
        </p>
        <a
          href={maps}
          target="_blank"
          rel="noopener noreferrer"
          className="k-in mt-5 inline-flex items-center gap-2 rounded-full border border-gold-soft/50 bg-white/10 px-6 py-3 text-[15px] font-semibold text-gold-soft"
          style={d(1.1)}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
          Get directions
        </a>
      </div>
      <PalaceArt className="relative z-0 mx-auto aspect-square w-full max-w-[520px] shrink-0" />
    </div>
  );
}

/* ───────── 6 · RSVP ───────── */

export function RsvpPage({ guest }: { guest: string }) {
  const send = (yes: boolean) => {
    sound.cue("ghungroo");
    const who = guest ? `${guest} ` : "We ";
    const text = yes
      ? `🙏 Namaste! ${who}will be happy to attend the wedding of ${wedding.bride} & ${wedding.groom}. Many congratulations!`
      : `🙏 Namaste! ${who}will not be able to attend, but send heartfelt blessings to ${wedding.bride} & ${wedding.groom}.`;
    window.open(`https://wa.me/${wedding.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };
  return (
    <Page>
      <Toran className="absolute inset-x-3 top-3 z-0 h-[56px] w-[calc(100%-24px)] rounded-t-[20px]" />
      <p className="k-in font-deva text-2xl text-rani" style={d(0.2)}>
        कृपया पधारें
      </p>
      <p className="k-in mt-1 font-display text-3xl font-semibold text-maroon" style={d(0.4)}>
        Kindly confirm your presence
      </p>
      <p className="k-in mt-3 max-w-xs text-[17px] text-ink/80" style={d(0.7)}>
        A single tap sends your reply to the family on WhatsApp.
      </p>
      <div className="k-in mt-7 grid w-full max-w-xs gap-3" style={d(1)} data-nonav>
        <button
          type="button"
          onClick={() => send(true)}
          className="rounded-full bg-maroon px-6 py-4 text-lg font-semibold text-ivory shadow-md active:scale-[0.98]"
        >
          We will attend 🙏
        </button>
        <button
          type="button"
          onClick={() => send(false)}
          className="rounded-full border border-maroon/30 bg-paper px-6 py-3.5 text-[16px] font-semibold text-maroon active:scale-[0.98]"
        >
          Unable to attend, sending blessings
        </button>
      </div>
    </Page>
  );
}

/* ───────── 7 · blessings ───────── */

export function BlessingsPage() {
  return (
    <Page dark>
      <Petals count={10} />
      <span className="k-pop block" style={d(0.2)}>
        <Diya className="h-20 w-20" />
      </span>
      <p className="k-in mt-4 font-deva text-2xl leading-relaxed text-gold-soft" style={d(0.6)}>
        आपका आशीर्वाद ही
        <br />
        हमारा सबसे बड़ा उपहार है
      </p>
      <p className="k-in mt-3 font-display text-xl text-ivory/85 italic" style={d(1)}>
        Your blessings are the greatest gift for us.
      </p>
      <span className="k-in mt-6 block" style={d(1.3)}>
        <Divider className="h-5 w-44" color="#e2c27a" />
      </span>
      <Link
        href="/gift/"
        data-nonav
        className="k-in mt-6 text-[15px] font-medium text-gold-soft/90 underline decoration-gold-soft/40 underline-offset-4"
        style={d(1.6)}
      >
        For those who wish to send shagun ›
      </Link>
    </Page>
  );
}

/* ───────── 8 · with warm regards ───────── */

export function AwaitingPage({ onReplay }: { onReplay: () => void }) {
  const share = async () => {
    sound.cue("chime");
    const url = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`;
    const text = `🙏 You are cordially invited to the wedding of ${wedding.bride} & ${wedding.groom}. Please open the invitation:`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${wedding.bride} & ${wedding.groom} · Wedding Invitation`, text, url });
        return;
      }
    } catch {
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener");
  };
  return (
    <Page>
      <p className="k-in font-deva text-3xl text-rani" style={d(0.2)}>
        स्वागतोत्सुक
      </p>
      <p className="k-in font-display text-xl text-muted italic" style={d(0.4)}>
        Eagerly awaiting your presence
      </p>
      <span className="k-in mt-4 block" style={d(0.6)}>
        <Divider className="h-5 w-44" />
      </span>
      <ul className="mt-4 space-y-1.5">
        {[hosts, ...wedding.invitation.awaiting].map((n, i) => (
          <li key={n} className="k-in font-display text-[1.35rem] leading-snug text-maroon" style={d(0.8 + i * 0.25)}>
            {n}
          </li>
        ))}
      </ul>
      <div className="k-in mt-8 grid w-full max-w-xs gap-3" style={d(2.2)} data-nonav>
        <button
          type="button"
          onClick={share}
          className="rounded-full bg-[#1f9d55] px-6 py-3.5 text-[16px] font-semibold text-white shadow-md active:scale-[0.98]"
        >
          Share with family
        </button>
        <button
          type="button"
          onClick={onReplay}
          className="rounded-full border border-maroon/30 bg-paper px-6 py-3 text-[15px] font-semibold text-maroon active:scale-[0.98]"
        >
          ↺ View the card again
        </button>
      </div>
    </Page>
  );
}
