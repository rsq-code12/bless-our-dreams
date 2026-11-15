"use client";

import { useEffect, useState } from "react";
import { wedding, type Dream } from "@/wedding.config";
import { rupees, rupeesShort } from "@/lib/format";
import type { DreamProgress } from "@/lib/types";
import { DreamArt } from "./DreamArt";
import { ContributeSheet, loadDraft, type Draft } from "./ContributeSheet";

export function DreamBoard({ progress }: { progress: Record<string, DreamProgress> }) {
  const [open, setOpen] = useState<{ dream: Dream; draft?: Draft } | null>(null);

  // If the guest's browser reloaded the page while they were in their UPI app,
  // bring them straight back to where they were.
  useEffect(() => {
    const draft = loadDraft();
    const dream = draft && wedding.dreams.find((d) => d.id === draft.dreamId);
    if (draft && dream) queueMicrotask(() => setOpen({ dream, draft }));
  }, []);

  // Deep link: /#bless-<dream-id> opens that dream directly (handy for WhatsApp).
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#bless-(.+)$/);
      const dream = m && wedding.dreams.find((d) => d.id === m[1]);
      if (dream) setOpen({ dream });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {wedding.dreams.map((dream, i) => (
          <DreamCard
            key={dream.id}
            dream={dream}
            progress={progress[dream.id]}
            featured={i === 0}
            onBless={() => setOpen({ dream })}
          />
        ))}
      </div>
      {open && (
        <ContributeSheet
          key={open.dream.id}
          dream={open.dream}
          initial={open.draft}
          onClose={() => {
            setOpen(null);
            if (window.location.hash.startsWith("#bless-")) {
              history.replaceState(null, "", window.location.pathname + "#dreams");
            }
          }}
        />
      )}
    </>
  );
}

function DreamCard({
  dream,
  progress,
  featured,
  onBless,
}: {
  dream: Dream;
  progress?: DreamProgress;
  featured?: boolean;
  onBless: () => void;
}) {
  const raised = progress?.raised ?? 0;
  const count = progress?.count ?? 0;
  const pct = Math.min(100, Math.round((raised / dream.goal) * 100));
  const funded = raised >= dream.goal;

  return (
    <article
      id={`dream-${dream.id}`}
      className="group relative flex flex-col rounded-[30px] bg-paper p-3 shadow-card ring-1 ring-gold/25 transition duration-300 hover:-translate-y-1 hover:ring-gold/50"
    >
      <div className="relative">
        <div className="arch relative aspect-[10/8.5] overflow-hidden sm:aspect-[10/10.5] ring-2 ring-gold-soft/70">
          <DreamArt
            art={dream.art}
            uid={dream.id}
            className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-maroon-ink/55 to-transparent" />
          {dream.localTitle && (
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-maroon-deep/70 px-3 py-1 font-deva text-sm whitespace-nowrap text-gold-soft backdrop-blur-sm">
              {dream.localTitle}
            </span>
          )}
        </div>
        {funded ? (
          <span className="absolute -top-1 -left-1 z-10 rounded-full bg-leaf px-3 py-1 text-xs font-semibold tracking-wide text-white shadow">
            Dream fulfilled ✓
          </span>
        ) : featured ? (
          <span className="absolute -top-1 -left-1 z-10 rounded-full bg-rani px-3 py-1 text-[11px] font-semibold tracking-wider text-white uppercase shadow">
            Most loved
          </span>
        ) : null}
        {/* thin gold echo of the arch */}
        <div className="arch pointer-events-none absolute -inset-1.5 border border-gold/30" />
      </div>

      <div className="flex flex-1 flex-col px-2 pt-5 pb-1">
        <h3 className="font-display text-[1.7rem] leading-tight font-semibold text-maroon">{dream.title}</h3>
        <p className="mt-1 text-sm font-medium text-saffron">{dream.tagline}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{dream.story}</p>

        <div className="mt-auto pt-5">
          <div
            className="relative h-3 overflow-hidden rounded-full bg-cream ring-1 ring-gold/20"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label={`${dream.title}: ${pct}% funded`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-saffron via-marigold to-[#ffd36b] transition-[width] duration-1000"
              style={{ width: `${Math.max(pct, raised > 0 ? 3 : 0)}%` }}
            >
              <div className="progress-shimmer absolute inset-0" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2 text-sm">
            <span>
              <strong className="font-semibold text-ink">{rupees(raised)}</strong>
              <span className="text-muted"> of {rupeesShort(dream.goal)}</span>
            </span>
            <span className="font-semibold text-maroon">{pct}%</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {count === 0 ? "Be the first to bless this dream" : `${count} blessing${count > 1 ? "s" : ""} so far`}
          </p>

          <button
            type="button"
            onClick={onBless}
            className="mt-4 w-full rounded-full bg-maroon px-5 py-3.5 text-[15px] font-semibold text-ivory shadow-[0_8px_20px_-10px_rgb(110_20_35/.8)] transition hover:bg-maroon-deep focus-visible:ring-4 focus-visible:ring-marigold/50 focus-visible:outline-none active:scale-[0.98]"
          >
            {funded ? "Add your blessing anyway" : "Bless this dream"}
          </button>
        </div>
      </div>
    </article>
  );
}
