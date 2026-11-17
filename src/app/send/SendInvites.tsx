"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { wedding } from "@/wedding.config";
import { formatDate } from "@/lib/format";
import { Divider, Toran } from "@/components/Ornaments";

const couple = `${wedding.bride} & ${wedding.groom}`;
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const useOrigin = () =>
  useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );

export function SendInvites() {
  const origin = useOrigin();
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const clean = name.trim().slice(0, 40);
  const link = `${origin}${base}/${clean ? `?to=${encodeURIComponent(clean)}` : ""}`;
  const date = formatDate(wedding.weddingDate, { day: "numeric", month: "long", year: "numeric" });
  const message = [
    `Namaste${clean ? ` ${clean}` : ""}! 🙏`,
    "",
    `With great joy, ${couple} invite you to celebrate their wedding.`,
    `📅 ${date} · ${wedding.city}`,
    "",
    `💌 Open your invitation: ${link}`,
  ].join("\n");

  return (
    <main className="bg-blockprint min-h-dvh">
      <div className="bg-velvet text-ivory">
        <Toran className="h-[56px] w-full" />
        <div className="px-6 pt-4 pb-8 text-center">
          <p className="font-script text-4xl text-foil">{couple}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">Send your invitations</h1>
        </div>
      </div>

      <div className="mx-auto max-w-md px-5 py-8">
        <label className="block">
          <span className="text-sm font-semibold text-maroon">Who is this invitation for?</span>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setCopied(false);
            }}
            placeholder="e.g. Sharma Family"
            className="mt-2 w-full rounded-2xl border border-gold/40 bg-paper px-4 py-3.5 text-lg text-ink outline-none focus:border-maroon focus:ring-4 focus:ring-marigold/25"
          />
          <span className="mt-1.5 block text-xs text-muted">
            Their name appears on the doors when they open it. Leave empty for a general invitation.
          </span>
        </label>

        <div className="mt-6 grid gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-[#1f9d55] px-5 py-4 font-semibold text-white shadow-md active:scale-[0.98]"
          >
            Send on WhatsApp
          </a>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                navigator.clipboard?.writeText(link).then(
                  () => setCopied(true),
                  () => {},
                )
              }
              className="rounded-full border border-maroon/30 bg-paper px-4 py-3 text-sm font-semibold text-maroon"
            >
              {copied ? "Link copied ✓" : "Copy link"}
            </button>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-maroon/30 bg-paper px-4 py-3 text-center text-sm font-semibold text-maroon"
            >
              Preview
            </a>
          </div>
        </div>

        <Divider className="mx-auto my-8 h-5 w-44" />

        <p className="text-sm font-semibold text-maroon">Message preview</p>
        <pre className="mt-2 rounded-2xl bg-[#e7f7e9] p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap text-ink">
          {message}
        </pre>

        <p className="mt-8 text-center text-sm text-muted">
          Need a QR code for the engagement table?{" "}
          <Link href="/qr/" className="font-semibold text-maroon underline">
            Print the shagun QR card
          </Link>
        </p>
      </div>
    </main>
  );
}
