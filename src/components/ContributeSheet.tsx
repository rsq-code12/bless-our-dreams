"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { isDemo, wedding, type Dream } from "@/wedding.config";
import { rupees } from "@/lib/format";
import { upiLink, type UpiApp } from "@/lib/upi";
import { useDevice } from "@/lib/device";
import type { GuestSide } from "@/lib/types";
import { DreamArt } from "./DreamArt";
import { Divider, Petals } from "./Ornaments";

type Step = "amount" | "details" | "pay" | "done";

export type Draft = {
  dreamId: string;
  step: Step;
  amount: number;
  name: string;
  side: GuestSide;
  message: string;
  isPublic: boolean;
};

const DRAFT_KEY = "shagun-draft";

export function loadDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    const d = raw ? (JSON.parse(raw) as Draft) : null;
    return d && d.step === "pay" ? d : null;
  } catch {
    return null;
  }
}
function saveDraft(d: Draft | null) {
  try {
    if (d) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    else sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* private mode: no draft, no problem */
  }
}

const STEPS: Step[] = ["amount", "details", "pay"];
const couple = `${wedding.bride} & ${wedding.groom}`;

export function ContributeSheet({
  dream,
  initial,
  onClose,
}: {
  dream: Dream;
  initial?: Draft;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>(initial?.step ?? "amount");
  const [amount, setAmount] = useState<number>(initial?.amount ?? 0);
  const [custom, setCustom] = useState<string>(
    initial && !wedding.shagunAmounts.includes(initial.amount) ? String(initial.amount) : "",
  );
  const [name, setName] = useState(initial?.name ?? "");
  const [side, setSide] = useState<GuestSide>(initial?.side ?? "both");
  const [message, setMessage] = useState(initial?.message ?? "");
  const [isPublic, setIsPublic] = useState(initial?.isPublic ?? true);
  const [utr, setUtr] = useState("");

  // Lock page scroll, close on Escape, focus the panel.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Keep a draft while paying, in case the phone reloads the tab after the UPI app.
  useEffect(() => {
    saveDraft(step === "pay" ? { dreamId: dream.id, step, amount, name, side, message, isPublic } : null);
  }, [step, dream.id, amount, name, side, message, isPublic]);

  const go = (s: Step) => {
    setStep(s);
    panelRef.current?.scrollTo({ top: 0 });
  };

  // No server on GitHub Pages: the guest tells the couple on WhatsApp, and the
  // couple adds the gift to src/gifts.ts once it has reached their account.
  const submit = () => {
    if (wedding.whatsapp && !isDemo) {
      const sides = { bride: `${wedding.bride}'s side`, groom: `${wedding.groom}'s side`, both: "Both sides" };
      const lines = [
        `🪔 Shagun for ${couple}`,
        `Dream: ${dream.title}`,
        `Amount: ${rupees(amount)}`,
        `From: ${name.trim()} (${sides[side]})`,
        utr.trim() && `UPI ref: ${utr.trim()}`,
        message.trim() && `Blessing: "${message.trim()}"`,
        `Show on blessings wall: ${isPublic ? "Yes" : "No"}`,
      ].filter(Boolean);
      window.open(`https://wa.me/${wedding.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    }
    saveDraft(null);
    go("done");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        className="sheet-backdrop absolute inset-0 bg-maroon-ink/70 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="sheet-panel relative max-h-[94dvh] w-full overflow-y-auto overscroll-contain rounded-t-[28px] bg-ivory shadow-2xl outline-none sm:max-w-lg sm:rounded-[28px]"
      >
        {/* Header */}
        <div className="bg-velvet relative overflow-hidden px-5 pt-3 pb-5 text-ivory">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/30 sm:hidden" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xl leading-none text-ivory hover:bg-white/20"
            aria-label="Close"
          >
            ×
          </button>
          <div className="flex items-center gap-4">
            <div className="arch relative h-20 w-[4.5rem] shrink-0 overflow-hidden ring-2 ring-gold-soft/70">
              <DreamArt art={dream.art} uid={`sheet-${dream.id}`} className="absolute inset-0 h-full w-full" />
            </div>
            <div className="min-w-0 pr-8">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-gold-soft uppercase">
                {step === "done" ? "Blessing received" : "You're blessing"}
              </p>
              <h2 id={titleId} className="font-display text-2xl leading-tight font-semibold">
                {dream.title}
              </h2>
              {amount > 0 && step !== "amount" && (
                <p className="mt-0.5 font-display text-lg text-foil">{rupees(amount)}</p>
              )}
            </div>
          </div>
          {step !== "done" && (
            <ol className="mt-5 flex items-center gap-2" aria-label="Steps">
              {STEPS.map((s, i) => {
                const active = STEPS.indexOf(step) >= i;
                return (
                  <li key={s} className="flex flex-1 items-center gap-2">
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                        active ? "bg-marigold text-maroon-ink" : "bg-white/15 text-white/60"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className={`text-xs ${active ? "text-ivory" : "text-white/50"}`}>
                      {s === "amount" ? "Shagun" : s === "details" ? "Blessing" : "Pay"}
                    </span>
                    {i < STEPS.length - 1 && <span className="h-px flex-1 bg-white/20" />}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="pb-safe px-5 pt-5">
          {step === "amount" && (
            <AmountStep
              amount={amount}
              custom={custom}
              setAmount={setAmount}
              setCustom={setCustom}
              onNext={() => go("details")}
            />
          )}
          {step === "details" && (
            <DetailsStep
              name={name}
              setName={setName}
              side={side}
              setSide={setSide}
              message={message}
              setMessage={setMessage}
              isPublic={isPublic}
              setIsPublic={setIsPublic}
              onBack={() => go("amount")}
              onNext={() => go("pay")}
            />
          )}
          {step === "pay" && (
            <PayStep
              dream={dream}
              amount={amount}
              name={name}
              utr={utr}
              setUtr={setUtr}
              onBack={() => go("details")}
              onSubmit={submit}
            />
          )}
          {step === "done" && <DoneStep dream={dream} name={name} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}

/* ───────── Step 1: amount ───────── */

function AmountStep({
  amount,
  custom,
  setAmount,
  setCustom,
  onNext,
}: {
  amount: number;
  custom: string;
  setAmount: (n: number) => void;
  setCustom: (s: string) => void;
  onNext: () => void;
}) {
  const endsInZero = amount >= 10 && amount % 10 === 0;
  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-maroon">Choose your shagun</h3>
      <p className="mt-1 text-sm text-muted">Any amount is a blessing. It goes straight to the couple by UPI.</p>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {wedding.shagunAmounts.map((a) => {
          const selected = amount === a && custom === "";
          return (
            <button
              key={a}
              type="button"
              onClick={() => {
                setCustom("");
                setAmount(a);
              }}
              aria-pressed={selected}
              className={`rounded-2xl border px-2 py-3 font-display text-lg font-semibold transition ${
                selected
                  ? "border-maroon bg-maroon text-ivory shadow-md"
                  : "border-gold/40 bg-paper text-maroon hover:border-maroon/60"
              }`}
            >
              {rupees(a)}
            </button>
          );
        })}
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-ink">Or enter your own</span>
        <div className="mt-1.5 flex items-center rounded-2xl border border-gold/40 bg-paper px-4 focus-within:border-maroon focus-within:ring-4 focus-within:ring-marigold/25">
          <span className="font-display text-xl text-muted">₹</span>
          <input
            inputMode="numeric"
            type="number"
            min={1}
            max={1000000}
            placeholder="3,101"
            value={custom}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 7);
              setCustom(v);
              setAmount(v ? Number(v) : 0);
            }}
            className="w-full bg-transparent px-2 py-3 font-display text-xl text-ink outline-none placeholder:text-muted/50"
          />
        </div>
      </label>

      {endsInZero && (
        <button
          type="button"
          onClick={() => {
            setCustom(String(amount + 1));
            setAmount(amount + 1);
          }}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-dashed border-saffron/60 bg-marigold/10 px-4 py-2.5 text-left text-sm text-ink hover:bg-marigold/20"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-marigold font-display text-lg font-bold text-maroon-ink">
            +1
          </span>
          <span>
            <strong>Add ₹1 for shagun?</strong> A rupee on top means the blessing keeps growing.{" "}
            <span className="font-semibold text-maroon">Make it {rupees(amount + 1)}</span>
          </span>
        </button>
      )}

      <PrimaryButton disabled={amount < 1} onClick={onNext} className="mt-6">
        Continue{amount > 0 ? ` with ${rupees(amount)}` : ""}
      </PrimaryButton>
    </div>
  );
}

/* ───────── Step 2: name & blessing ───────── */

function DetailsStep(props: {
  name: string;
  setName: (s: string) => void;
  side: GuestSide;
  setSide: (s: GuestSide) => void;
  message: string;
  setMessage: (s: string) => void;
  isPublic: boolean;
  setIsPublic: (b: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { name, setName, side, setSide, message, setMessage, isPublic, setIsPublic } = props;
  const sides: { v: GuestSide; label: string }[] = [
    { v: "bride", label: `${wedding.bride}'s side` },
    { v: "groom", label: `${wedding.groom}'s side` },
    { v: "both", label: "Both!" },
  ];
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim().length >= 2) props.onNext();
      }}
    >
      <h3 className="font-display text-xl font-semibold text-maroon">Who is this blessing from?</h3>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-ink">Your name (or family name)</span>
        <input
          required
          minLength={2}
          maxLength={60}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sharma Parivaar, Delhi"
          className="mt-1.5 w-full rounded-2xl border border-gold/40 bg-paper px-4 py-3 text-ink outline-none placeholder:text-muted/50 focus:border-maroon focus:ring-4 focus:ring-marigold/25"
        />
      </label>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-ink">You&apos;re from</legend>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {sides.map((s) => (
            <button
              key={s.v}
              type="button"
              aria-pressed={side === s.v}
              onClick={() => setSide(s.v)}
              className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition ${
                side === s.v ? "border-rani bg-rani text-white" : "border-gold/40 bg-paper text-ink hover:border-rani/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-4 block">
        <span className="flex justify-between text-sm font-medium text-ink">
          A few words for the couple <span className="font-normal text-muted">optional</span>
        </span>
        <textarea
          rows={3}
          maxLength={300}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Sada khush raho! May your home always be full of laughter…"
          className="mt-1.5 w-full resize-none rounded-2xl border border-gold/40 bg-paper px-4 py-3 text-ink outline-none placeholder:text-muted/50 focus:border-maroon focus:ring-4 focus:ring-marigold/25"
        />
      </label>

      <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl bg-cream/60 px-4 py-3 text-sm">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-maroon"
        />
        <span>
          Show my name &amp; message on the blessings wall
          <span className="block text-xs text-muted">
            {wedding.showAmountsPublicly ? "Your amount will be shown too." : "Your amount is never shown publicly."}
          </span>
        </span>
      </label>

      <div className="mt-6 flex gap-3">
        <SecondaryButton onClick={props.onBack}>Back</SecondaryButton>
        <PrimaryButton type="submit" disabled={name.trim().length < 2} className="flex-1">
          Continue to pay
        </PrimaryButton>
      </div>
    </form>
  );
}

/* ───────── Step 3: pay by UPI ───────── */

const APPS: { app: UpiApp; label: string; color: string; initial: string }[] = [
  { app: "gpay", label: "Google Pay", color: "#1a73e8", initial: "G" },
  { app: "phonepe", label: "PhonePe", color: "#5f259f", initial: "पे" },
  { app: "paytm", label: "Paytm", color: "#00baf2", initial: "P" },
  { app: "any", label: "Other UPI app", color: "#6e1423", initial: "₹" },
];

function PayStep(props: {
  dream: Dream;
  amount: number;
  name: string;
  utr: string;
  setUtr: (s: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const { dream, amount, name } = props;
  const device = useDevice();
  const [qr, setQr] = useState<string>("");
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  const payment = useMemo(
    () => ({
      vpa: wedding.upi.vpa,
      payeeName: wedding.upi.payeeName,
      amount,
      note: `Shagun ${dream.title} - ${name}`.replace(/[^\w\s-]/g, ""),
    }),
    [amount, dream.title, name],
  );

  useEffect(() => {
    if (isDemo) return;
    let alive = true;
    QRCode.toString(upiLink(payment), {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#2e0710", light: "#ffffff" },
    }).then((svg) => alive && setQr(svg));
    return () => {
      alive = false;
    };
  }, [payment]);

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard blocked; the text is visible to copy manually */
    }
  };

  const qrBlock = (
    <div className="flex flex-col items-center rounded-3xl border border-gold/30 bg-white p-4">
      <div
        className="aspect-square w-52 [&>svg]:h-full [&>svg]:w-full"
        aria-label={`UPI QR code to pay ${rupees(amount)} to ${wedding.upi.payeeName}`}
        role="img"
        dangerouslySetInnerHTML={{ __html: qr }}
      />
      <p className="mt-2 text-center text-xs text-muted">Scan with any UPI app · amount is filled in for you</p>
    </div>
  );

  return (
    <div>
      <div className="rounded-3xl bg-cream/70 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Paying</span>
          <span className="font-display text-2xl font-semibold text-maroon">{rupees(amount)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 border-t border-gold/20 pt-2">
          <span className="text-muted">To</span>
          <span className="text-right">
            <span className="block font-semibold text-ink">{wedding.upi.payeeName}</span>
            {isDemo ? (
              <span className="font-mono text-xs text-muted">UPI ID not added yet</span>
            ) : (
              <button
                type="button"
                onClick={() => copy("vpa", wedding.upi.vpa)}
                className="font-mono text-xs text-maroon underline decoration-dotted underline-offset-2"
              >
                {wedding.upi.vpa} {copied === "vpa" ? "· copied ✓" : "· copy"}
              </button>
            )}
          </span>
        </div>
      </div>

      {isDemo ? (
        <div className="mt-5 rounded-3xl border-2 border-dashed border-saffron/60 bg-marigold/10 p-4 text-sm leading-relaxed text-ink">
          <p className="font-display text-lg font-semibold text-maroon">Preview only, no money will move</p>
          <p className="mt-1">
            The couple hasn&apos;t added their UPI ID yet, so the Google Pay / PhonePe / Paytm buttons and the QR code
            are switched off. Tap the button below to see the rest of the experience.
          </p>
        </div>
      ) : device.mobile ? (
        <>
          <h3 className="mt-5 font-display text-xl font-semibold text-maroon">Pay with your UPI app</h3>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {APPS.map((a) => (
              <a
                key={a.app}
                href={upiLink(payment, a.app, device.ios)}
                onClick={() => setOpened(true)}
                className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-paper px-3 py-3 text-sm font-semibold text-ink shadow-sm transition active:scale-[0.98]"
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl font-deva text-base text-white"
                  style={{ background: a.color }}
                >
                  {a.initial}
                </span>
                {a.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowQr((v) => !v)}
            className="mt-3 text-sm font-medium text-maroon underline decoration-dotted underline-offset-4"
          >
            {showQr ? "Hide QR code" : "Paying from another phone? Show QR code"}
          </button>
          {showQr && <div className="mt-3">{qrBlock}</div>}
        </>
      ) : (
        <>
          <h3 className="mt-5 font-display text-xl font-semibold text-maroon">Scan to pay</h3>
          <p className="mb-3 text-sm text-muted">Open Google Pay, PhonePe, Paytm or your bank&apos;s UPI app and scan.</p>
          {qrBlock}
        </>
      )}

      {!isDemo && (
        <details className="mt-4 rounded-2xl border border-gold/20 bg-paper px-4 py-3 text-sm text-muted">
          <summary className="cursor-pointer font-medium text-ink">App showing an error?</summary>
          <p className="mt-2 leading-relaxed">
            Some apps limit payment links to personal UPI IDs. Open your UPI app, choose{" "}
            <em>Pay to UPI ID</em>, paste <strong className="font-mono text-ink">{wedding.upi.vpa}</strong> and enter{" "}
            <button type="button" className="font-semibold text-maroon underline" onClick={() => copy("amt", String(amount))}>
              {rupees(amount)}
            </button>
            {copied === "amt" ? " (copied ✓)" : ""}.
          </p>
        </details>
      )}

      <Divider className="mx-auto my-5 h-5 w-48" />

      <div className={`rounded-3xl p-4 transition ${opened ? "bg-marigold/15 ring-2 ring-marigold/50" : "bg-cream/50"}`}>
        <p className="font-display text-lg font-semibold text-maroon">Done paying?</p>
        <p className="text-sm text-muted">
          {wedding.whatsapp && !isDemo
            ? `Send ${couple} a quick WhatsApp so they know this blessing is from you.`
            : `Let ${couple} know this blessing is from you.`}
        </p>
        <label className="mt-3 block">
          <span className="text-xs font-medium text-ink">
            UPI reference / UTR number <span className="font-normal text-muted">(optional, helps the couple match it)</span>
          </span>
          <input
            inputMode="numeric"
            value={props.utr}
            onChange={(e) => props.setUtr(e.target.value.slice(0, 35))}
            placeholder="e.g. 431298765012"
            className="mt-1 w-full rounded-xl border border-gold/40 bg-paper px-3 py-2.5 font-mono text-sm text-ink outline-none placeholder:text-muted/50 focus:border-maroon focus:ring-4 focus:ring-marigold/25"
          />
        </label>
        <div className="mt-4 flex gap-3">
          <SecondaryButton onClick={props.onBack}>Back</SecondaryButton>
          <PrimaryButton onClick={props.onSubmit} className="flex-1">
            {isDemo
              ? "Try it: add my blessing"
              : wedding.whatsapp
                ? "I've paid · tell them on WhatsApp"
                : `I've paid ${rupees(amount)}`}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ───────── Step 4: thank you ───────── */

function DoneStep({ dream, name, onClose }: { dream: Dream; name: string; onClose: () => void }) {
  const share = () => {
    const url = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/#bless-${dream.id}`;
    const text = `I just blessed ${couple}'s dream "${dream.title}" 💛 Skip the boxed gift and bless one of their dreams too: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };
  return (
    <div className="relative -mx-5 -mt-5 overflow-hidden px-5 pt-8 pb-2 text-center">
      <Petals count={18} />
      <p className="font-deva text-4xl text-maroon">धन्यवाद</p>
      <p className="mt-1 font-script text-3xl text-rani">Thank you, {name.split(" ")[0]}!</p>
      <p className="mx-auto mt-4 max-w-sm leading-relaxed text-ink">
        Your blessing for <strong>{dream.title}</strong> is on its way to {couple}. It will appear on their board
        once it has reached them.
      </p>
      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={share}
          className="flex items-center justify-center gap-2 rounded-full bg-[#1f9d55] px-5 py-3.5 font-semibold text-white shadow-md active:scale-[0.98]"
        >
          <WhatsAppIcon /> Invite others on WhatsApp
        </button>
        <SecondaryButton onClick={onClose}>See all dreams</SecondaryButton>
      </div>
    </div>
  );
}

/* ───────── Buttons ───────── */

function PrimaryButton({
  className = "",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...props}
      className={`block w-full rounded-full bg-maroon px-5 py-3.5 text-center text-[15px] font-semibold text-ivory shadow-[0_8px_20px_-10px_rgb(110_20_35/.8)] transition hover:bg-maroon-deep focus-visible:ring-4 focus-visible:ring-marigold/50 focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    />
  );
}

function SecondaryButton({ className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-full border border-maroon/30 bg-paper px-5 py-3.5 text-[15px] font-semibold text-maroon transition hover:border-maroon disabled:opacity-40 ${className}`}
    />
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" />
    </svg>
  );
}
