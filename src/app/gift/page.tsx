import type { Metadata } from "next";
import Link from "next/link";
import { isDemo, wedding } from "@/wedding.config";
import { getPublicState } from "@/lib/state";
import { formatDate, rupees } from "@/lib/format";
import { DreamBoard } from "@/components/DreamBoard";
import { Divider, Diya, Mandala, Petals, Toran } from "@/components/Ornaments";

const couple = `${wedding.bride} & ${wedding.groom}`;

export const metadata: Metadata = {
  title: `Bless our dreams · ${couple}`,
  description: `Send ${couple} your shagun by UPI and bless one of the dreams they're building together.`,
};

/** The gift portal. Linked from the end of the invitation and from the printable QR card. */
export default function GiftPage() {
  return (
    <main className="overflow-x-clip">
      {isDemo && (
        <div className="bg-marigold px-4 py-1.5 text-center text-xs font-semibold text-maroon-ink">
          Preview with sample names &amp; dreams · payments are switched off
        </div>
      )}
      <Hero />
      <section id="dreams" className="bg-blockprint scroll-mt-4 px-4 pt-12 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            local="सपनों की सूची"
            title="Our Dreams"
            subtitle="Tap a dream, pick an amount, pay with your UPI app. That's it."
          />
          <LiveDreams />
        </div>
      </section>
      <HowItWorks />
      <section id="blessings" className="bg-ivory px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            local="आशीर्वाद"
            title="Blessings Wall"
            subtitle="Words of love from the families and friends who've blessed a dream."
          />
          <BlessingsWall />
        </div>
      </section>
      <Footer />
      <MobileCta />
    </main>
  );
}

/* ───────── Hero ───────── */

function Hero() {
  return (
    <header className="bg-velvet relative isolate overflow-hidden text-ivory">
      <Toran className="relative z-10 h-[60px] w-full sm:h-[84px]" />
      <Petals count={10} />
      <Mandala className="animate-spin-slow absolute top-1/2 left-1/2 -z-10 w-[560px] max-w-none -translate-x-1/2 -translate-y-[40%] opacity-25 sm:w-[760px]" />
      <Link
        href="/"
        className="absolute top-[72px] left-4 z-10 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-gold-soft backdrop-blur hover:bg-white/15 sm:top-24"
      >
        ← Invitation
      </Link>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-10 pb-16 text-center sm:pt-14 sm:pb-20">
        <p className="font-deva text-lg tracking-wide text-gold-soft">{wedding.invocation}</p>
        <h1 className="mt-3 font-script text-[3.4rem] leading-none text-foil sm:text-7xl">{couple}</h1>
        <p className="mt-2 text-sm text-gold-soft/90">
          {formatDate(wedding.weddingDate, { day: "numeric", month: "long", year: "numeric" })} · {wedding.city}
        </p>
        <Divider className="mt-5 h-5 w-52" color="#e2c27a" />
        <p className="mt-5 max-w-sm font-display text-[1.65rem] leading-snug">
          Bless one of our dreams with your <span className="text-foil font-semibold">shagun</span>
        </p>
        <p className="mt-2 text-xs text-gold-soft/80">Straight to us by UPI · GPay · PhonePe · Paytm · any bank app</p>
      </div>

      {/* scalloped bottom edge */}
      <svg className="absolute inset-x-0 -bottom-px h-6 w-full text-ivory" preserveAspectRatio="none" viewBox="0 0 1200 24" aria-hidden>
        <path
          fill="currentColor"
          d={`M0 24 ${Array.from({ length: 24 }, (_, i) => `C ${i * 50 + 4} 2 ${i * 50 + 46} 2 ${(i + 1) * 50} 24`).join(" ")} Z`}
        />
      </svg>
    </header>
  );
}

/* ───────── Dreams (live) ───────── */

function LiveDreams() {
  const state = getPublicState();
  const goal = wedding.dreams.reduce((s, d) => s + d.goal, 0);
  return (
    <>
      <div className="mx-auto mb-12 grid max-w-3xl grid-cols-3 divide-x divide-gold/30 rounded-3xl border border-gold/30 bg-paper/90 py-5 text-center shadow-card backdrop-blur">
        <Stat value={rupees(state.totalRaised)} label="blessed so far" />
        <Stat value={String(state.totalGuests)} label={state.totalGuests === 1 ? "family" : "families"} />
        <Stat value={`${Math.min(100, Math.round((state.totalRaised / goal) * 100))}%`} label="of all dreams" />
      </div>
      <DreamBoard progress={state.progress} />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-2">
      <div className="font-display text-2xl font-semibold text-maroon sm:text-3xl">{value}</div>
      <div className="mt-0.5 text-[11px] tracking-wider text-muted uppercase sm:text-xs">{label}</div>
    </div>
  );
}

/* ───────── How it works ───────── */

function HowItWorks() {
  const steps = [
    { n: "१", title: "Choose a dream", body: "A honeymoon, a home, a café… pick the one that makes you smile." },
    { n: "२", title: "Pay by UPI", body: "Tap your app or scan the QR. Money goes straight to the couple, no middlemen, no fees." },
    { n: "३", title: "Leave a blessing", body: "Add a few words. They'll read every one, now and on every anniversary." },
  ];
  return (
    <section className="bg-velvet relative overflow-hidden px-4 py-20 text-ivory sm:px-6">
      <Mandala className="absolute -top-40 -right-40 w-[420px] opacity-15" />
      <Mandala className="absolute -bottom-40 -left-40 w-[420px] opacity-15" />
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading local="कैसे करें" title="How it works" dark />
        <ol className="grid gap-5 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-3xl border border-gold-soft/25 bg-white/5 p-6 text-center backdrop-blur-sm">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-marigold to-saffron font-deva text-2xl text-maroon-ink shadow-lg">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-gold-soft">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ivory/80">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────── Blessings wall (live) ───────── */

const sideLabel = { bride: `${wedding.bride}'s side`, groom: `${wedding.groom}'s side`, both: "Family & friends" };
const tints = ["bg-[#fff1e0]", "bg-[#fde8ef]", "bg-[#fff7d6]", "bg-[#eef6ea]"];

function BlessingsWall() {
  const { blessings } = getPublicState();
  if (blessings.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-dashed border-gold/50 bg-paper px-6 py-10 text-center">
        <Diya className="mx-auto h-14 w-14" />
        <p className="mt-3 font-display text-2xl text-maroon">Light the first diya</p>
        <p className="mt-1 text-muted">Be the first to bless one of {couple}&apos;s dreams.</p>
        <a href="#dreams" className="mt-5 inline-block rounded-full bg-maroon px-6 py-3 font-semibold text-ivory">
          Bless a dream
        </a>
      </div>
    );
  }
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {blessings.map((b, i) => {
        const dream = wedding.dreams.find((d) => d.id === b.dreamId);
        return (
          <figure
            key={b.id}
            className={`mb-4 break-inside-avoid rounded-3xl ${tints[i % tints.length]} p-5 ring-1 ring-gold/20`}
          >
            {b.message ? (
              <blockquote className="font-display text-xl leading-snug text-ink">“{b.message}”</blockquote>
            ) : (
              <p className="font-display text-xl text-ink italic">Sent their blessings 🙏</p>
            )}
            <figcaption className="mt-4 flex items-end justify-between gap-3 text-sm">
              <span>
                <span className="block font-semibold text-maroon">{b.name}</span>
                <span className="text-xs text-muted">
                  {sideLabel[b.side]} · {formatDate(`${b.date}T12:00:00+05:30`, { day: "numeric", month: "short" })}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-maroon">
                {dream?.title ?? "A dream"}
                {b.amount !== null ? ` · ${rupees(b.amount)}` : ""}
              </span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

/* ───────── Footer & mobile CTA ───────── */

function Footer() {
  return (
    <footer className="bg-velvet px-6 pt-14 pb-28 text-center text-ivory sm:pb-14">
      <p className="font-script text-4xl text-foil">{couple}</p>
      <p className="mt-2 text-sm tracking-[0.3em] text-gold-soft uppercase">{wedding.hashtag}</p>
      <Divider className="mx-auto mt-6 h-5 w-48" color="#e2c27a" />
      <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ivory/70">
        Payments go directly to {wedding.upi.payeeName} through UPI. This site never sees your bank or card details.
      </p>
    </footer>
  );
}

function MobileCta() {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-gold/30 bg-ivory/90 px-4 pt-3 backdrop-blur-md sm:hidden">
      <a
        href="#dreams"
        className="flex items-center justify-center gap-2 rounded-full bg-maroon py-3.5 font-semibold text-ivory shadow-lg active:scale-[0.98]"
      >
        <span aria-hidden>🪔</span> Bless a dream
      </a>
    </div>
  );
}

/* ───────── Shared ───────── */

function SectionHeading({
  local,
  title,
  subtitle,
  dark,
}: {
  local: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-10 text-center">
      <p className={`font-deva text-lg ${dark ? "text-marigold" : "text-rani"}`}>{local}</p>
      <h2 className={`mt-1 font-display text-4xl font-semibold sm:text-5xl ${dark ? "text-gold-soft" : "text-maroon"}`}>
        {title}
      </h2>
      <Divider className="mx-auto mt-3 h-5 w-48" color={dark ? "#e2c27a" : "#b88a2a"} />
      {subtitle && (
        <p className={`mx-auto mt-4 max-w-xl text-[16px] leading-relaxed ${dark ? "text-ivory/80" : "text-muted"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
