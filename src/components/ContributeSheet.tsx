"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { isDemo, wedding, type Dream } from "@/wedding.config";
import { rupees } from "@/lib/format";
import { upiLink, type UpiApp } from "@/lib/upi";
import { useDevice } from "@/lib/device";
import { DreamArt } from "./DreamArt";
import { Petals } from "./Ornaments";

/**
 * One screen, as few taps as possible:
 *   tap an amount → tap your UPI app → come back → tap "Send my blessing".
 * The guest's name is optional: the WhatsApp message already shows who it's from.
 */

export type Draft = { dreamId: string; amount: number; name: string; message: string; paid: boolean };

const DRAFT_KEY = "shagun-draft-v2";

export function loadDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    const d = raw ? (JSON.parse(raw) as Draft) : null;
    return d && d.paid ? d : null;
  } catch {
    return null;
  }
}
function saveDraft(d: Draft | null) {
  try {
    if (d) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    else sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* private mode: fine */
  }
}

const couple = `${wedding.bride} & ${wedding.groom}`;

const APPS: { app: UpiApp; label: string; color: string; initial: string }[] = [
  { app: "gpay", label: "Google Pay", color: "#1a73e8", initial: "G" },
  { app: "phonepe", label: "PhonePe", color: "#5f259f", initial: "पे" },
  { app: "paytm", label: "Paytm", color: "#00baf2", initial: "P" },
  { app: "any", label: "Other UPI", color: "#6e1423", initial: "₹" },
];

export function ContributeSheet({ dream, initial, onClose }: { dream: Dream; initial?: Draft; onClose: () => void }) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const payRef = useRef<HTMLDivElement>(null);
  const device = useDevice();

  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [custom, setCustom] = useState(() =>
    initial && !wedding.shagunAmounts.includes(initial.amount) ? String(initial.amount) : "",
  );
  const [showCustom, setShowCustom] = useState(custom !== "");
  const [name, setName] = useState(initial?.name ?? "");
  const [message, setMessage] = useState(initial?.message ?? "");
  const [showNote, setShowNote] = useState(false);
  const [paid, setPaid] = useState(initial?.paid ?? false);
  const [done, setDone] = useState(false);
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  // Lock the page behind, close on Escape.
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

  // Remember where the guest was in case the phone reloads the tab after the UPI app.
  useEffect(() => {
    saveDraft(paid && !done ? { dreamId: dream.id, amount, name, message, paid } : null);
  }, [paid, done, dream.id, amount, name, message]);

  const payment = useMemo(
    () => ({
      vpa: wedding.upi.vpa,
      payeeName: wedding.upi.payeeName,
      amount,
      note: `Shagun ${dream.title}${name ? ` - ${name}` : ""}`.replace(/[^\w\s-]/g, ""),
    }),
    [amount, dream.title, name],
  );

  // Desktop: QR code for the chosen amount.
  useEffect(() => {
    if (isDemo || device.mobile || amount < 1) return;
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
  }, [payment, device.mobile, amount]);

  const pick = (a: number) => {
    setAmount(a);
    setPaid(false);
    // Bring the pay buttons into view right away: one less scroll.
    requestAnimationFrame(() => payRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  const finish = () => {
    if (wedding.whatsapp && !isDemo) {
      const lines = [
        `🪔 Shagun for ${couple}`,
        `Dream: ${dream.title}`,
        `Amount: ${rupees(amount)} (paid by UPI)`,
        name.trim() && `From: ${name.trim()}`,
        message.trim() ? `Blessing: "${message.trim()}"` : "Blessing: ",
      ].filter(Boolean);
      window.open(`https://wa.me/${wedding.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    }
    setDone(true);
    saveDraft(null);
    panelRef.current?.scrollTo({ top: 0 });
  };

  const endsInZero = amount >= 10 && amount % 10 === 0;
  const ready = amount >= 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label="Close" className="sheet-backdrop absolute inset-0 bg-maroon-ink/70 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="sheet-panel relative max-h-[94dvh] w-full overflow-y-auto overscroll-contain rounded-t-[28px] bg-ivory shadow-2xl outline-none sm:max-w-lg sm:rounded-[28px]"
      >
        {/* header */}
        <div className="bg-velvet relative px-5 pt-3 pb-4 text-ivory">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/30 sm:hidden" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xl leading-none hover:bg-white/20"
            aria-label="Close"
          >
            ×
          </button>
          <div className="flex items-center gap-4 pr-10">
            <div className="arch relative h-16 w-14 shrink-0 overflow-hidden ring-2 ring-gold-soft/70">
              <DreamArt art={dream.art} uid={`sheet-${dream.id}`} className="absolute inset-0 h-full w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-gold-soft uppercase">
                {done ? "Thank you" : "Bless this dream"}
              </p>
              <h2 id={titleId} className="font-display text-2xl leading-tight font-semibold">
                {dream.title}
              </h2>
            </div>
            {ready && <p className="shrink-0 font-display text-2xl text-foil">{rupees(amount)}</p>}
          </div>
        </div>

        {done ? (
          <Thanks dream={dream} onClose={onClose} />
        ) : (
          <div className="px-5 pt-4">
            {/* 1 · amount */}
            <p className="text-sm font-semibold text-maroon">Your shagun</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {wedding.shagunAmounts.map((a) => {
                const on = amount === a && !showCustom;
                return (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setShowCustom(false);
                      setCustom("");
                      pick(a);
                    }}
                    className={`rounded-2xl border py-3 font-display text-lg font-semibold transition active:scale-95 ${
                      on ? "border-maroon bg-maroon text-ivory shadow-md" : "border-gold/40 bg-paper text-maroon"
                    }`}
                  >
                    {rupees(a)}
                  </button>
                );
              })}
            </div>
            {showCustom ? (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex flex-1 items-center rounded-2xl border border-maroon bg-paper px-4 ring-4 ring-marigold/25">
                  <span className="font-display text-xl text-muted">₹</span>
                  <input
                    autoFocus
                    inputMode="numeric"
                    type="number"
                    placeholder="Any amount"
                    value={custom}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 7);
                      setCustom(v);
                      setAmount(v ? Number(v) : 0);
                      setPaid(false);
                    }}
                    className="w-full bg-transparent px-2 py-3 font-display text-xl text-ink outline-none placeholder:text-muted/50"
                  />
                </div>
                {endsInZero && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustom(String(amount + 1));
                      setAmount(amount + 1);
                    }}
                    className="shrink-0 rounded-2xl bg-marigold px-3 py-3 text-sm font-bold text-maroon-ink"
                    title="Shagun traditionally ends in 1"
                  >
                    +₹1 ✨
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowCustom(true);
                  setAmount(0);
                }}
                className="mt-2 w-full rounded-2xl border border-dashed border-gold/50 py-2.5 text-sm font-medium text-maroon"
              >
                Another amount
              </button>
            )}

            {/* 2 · pay */}
            <div ref={payRef} className="scroll-mt-4 pt-5">
              {isDemo ? (
                <div className="rounded-2xl border-2 border-dashed border-saffron/60 bg-marigold/10 p-4 text-sm leading-relaxed text-ink">
                  <p className="font-display text-lg font-semibold text-maroon">Preview only, no money will move</p>
                  The couple&apos;s UPI ID isn&apos;t added yet, so the payment buttons are switched off.
                </div>
              ) : device.mobile ? (
                <>
                  <p className="text-sm font-semibold text-maroon">
                    {ready ? `Pay ${rupees(amount)} with` : "Choose an amount, then pay with"}
                  </p>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {APPS.map((a) => (
                      <a
                        key={a.app}
                        href={ready ? upiLink(payment, a.app, device.ios) : undefined}
                        aria-disabled={!ready}
                        onClick={(e) => {
                          if (!ready) e.preventDefault();
                          else setPaid(true);
                        }}
                        className={`flex flex-col items-center gap-1.5 rounded-2xl border border-gold/30 bg-paper px-1 py-3 text-[11px] font-semibold text-ink transition active:scale-95 ${
                          ready ? "shadow-sm" : "opacity-40"
                        }`}
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-xl font-deva text-base text-white" style={{ background: a.color }}>
                          {a.initial}
                        </span>
                        {a.label}
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl border border-gold/30 bg-white p-3">
                  <div
                    className={`aspect-square w-36 shrink-0 rounded-lg bg-cream [&>svg]:h-full [&>svg]:w-full ${ready ? "" : "opacity-30"}`}
                    role="img"
                    aria-label={ready ? `UPI QR code for ${rupees(amount)}` : "Choose an amount to see the QR code"}
                    dangerouslySetInnerHTML={{ __html: ready ? qr : "" }}
                  />
                  <p className="text-sm text-muted">
                    {ready ? (
                      <>
                        Scan with any UPI app on your phone. <strong className="text-ink">{rupees(amount)}</strong> is
                        filled in for you.
                      </>
                    ) : (
                      "Choose an amount and a QR code appears here."
                    )}
                  </p>
                </div>
              )}
              {!isDemo && (
                <p className="mt-2 text-center text-xs text-muted">
                  Goes straight to {wedding.upi.payeeName} ·{" "}
                  <button
                    type="button"
                    className="font-mono text-maroon underline decoration-dotted"
                    onClick={() => {
                      navigator.clipboard?.writeText(wedding.upi.vpa).then(
                        () => setCopied(true),
                        () => {},
                      );
                    }}
                  >
                    {copied ? "UPI ID copied ✓" : wedding.upi.vpa}
                  </button>
                </p>
              )}
            </div>

            {/* optional note */}
            {showNote ? (
              <div className="mt-4 grid gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 60))}
                  placeholder="Your name (for the blessings wall)"
                  autoComplete="name"
                  className="w-full rounded-2xl border border-gold/40 bg-paper px-4 py-3 text-ink outline-none placeholder:text-muted/60 focus:border-maroon"
                />
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 300))}
                  placeholder="A few words for the couple…"
                  className="w-full resize-none rounded-2xl border border-gold/40 bg-paper px-4 py-3 text-ink outline-none placeholder:text-muted/60 focus:border-maroon"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowNote(true)}
                className="mt-4 text-sm font-medium text-maroon underline decoration-dotted underline-offset-4"
              >
                + Add your name &amp; a blessing (optional)
              </button>
            )}

            {/* 3 · done */}
            <div className="pb-safe sticky bottom-0 -mx-5 mt-5 border-t border-gold/20 bg-ivory/95 px-5 pt-3 backdrop-blur">
              <button
                type="button"
                disabled={!ready}
                onClick={finish}
                className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-[15px] font-semibold shadow-md transition active:scale-[0.98] disabled:opacity-40 ${
                  paid || isDemo || !device.mobile ? "bg-[#1f9d55] text-white" : "bg-maroon text-ivory"
                }`}
              >
                {wedding.whatsapp && !isDemo && <WhatsAppIcon />}
                {isDemo
                  ? "Try it: finish"
                  : wedding.whatsapp
                    ? paid
                      ? "Paid! Send my blessing"
                      : "I've paid · send my blessing"
                    : `I've paid${ready ? ` ${rupees(amount)}` : ""}`}
              </button>
              {wedding.whatsapp && !isDemo && (
                <p className="mt-1.5 text-center text-[11px] text-muted">Opens WhatsApp with your shagun details filled in</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Thanks({ dream, onClose }: { dream: Dream; onClose: () => void }) {
  const share = () => {
    const url = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`;
    const text = `${couple} are getting married! 💛 Here's their invitation: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };
  return (
    <div className="relative overflow-hidden px-5 pt-8 pb-8 text-center">
      <Petals count={18} />
      <p className="font-deva text-4xl text-maroon">धन्यवाद</p>
      <p className="mt-1 font-script text-3xl text-rani">Thank you for your blessing!</p>
      <p className="mx-auto mt-4 max-w-sm leading-relaxed text-ink">
        Your shagun for <strong>{dream.title}</strong> is on its way to {couple}. It will appear on their board once it
        has reached them.
      </p>
      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={share}
          className="flex items-center justify-center gap-2 rounded-full bg-[#1f9d55] px-5 py-3.5 font-semibold text-white shadow-md active:scale-[0.98]"
        >
          <WhatsAppIcon /> Share the invitation
        </button>
        <button type="button" onClick={onClose} className="rounded-full border border-maroon/30 bg-paper px-5 py-3.5 font-semibold text-maroon">
          Back to the dreams
        </button>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" />
    </svg>
  );
}
