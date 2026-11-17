"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { wedding } from "@/wedding.config";
import { formatDate } from "@/lib/format";
import { Divider, Mandala, Toran } from "@/components/Ornaments";

const couple = `${wedding.bride} & ${wedding.groom}`;

export function QrCard() {
  const [svg, setSvg] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const target = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/gift/`;
    QRCode.toString(target, {
      type: "svg",
      margin: 0,
      errorCorrectionLevel: "Q",
      color: { dark: "#4a0a14", light: "#00000000" },
    }).then((s) => {
      setSvg(s);
      setUrl(target.replace(/^https?:\/\//, ""));
    });
  }, []);

  return (
    <main className="min-h-dvh bg-cream px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto flex max-w-sm flex-col items-center print:max-w-none">
        <article className="bg-velvet relative w-full overflow-hidden rounded-[28px] text-center text-ivory shadow-2xl print:rounded-none print:shadow-none">
          <Toran className="h-[60px] w-full" />
          <Mandala className="absolute top-[58%] left-1/2 w-[520px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-15" />
          <div className="relative px-6 pt-2 pb-8">
            <p className="font-deva text-lg text-gold-soft">{wedding.invocation}</p>
            <p className="mt-1 font-script text-5xl text-foil">{couple}</p>
            <Divider className="mx-auto mt-2 h-5 w-48" color="#e2c27a" />
            <h1 className="mt-3 font-display text-3xl font-semibold">Bless our dreams</h1>
            <p className="mx-auto mt-1 max-w-[16rem] text-sm text-ivory/80">
              Scan with your phone camera to send your shagun by UPI
            </p>
            <div className="mx-auto mt-5 w-56 rounded-3xl bg-paper p-4 shadow-[0_0_0_4px_rgb(226_194_122),0_0_0_8px_rgb(74_10_20),0_0_0_9px_rgb(226_194_122/.6)]">
              <div className="aspect-square w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
            </div>
            <p className="mt-3 font-mono text-[10px] break-all text-gold-soft/70">{url}</p>
            <p className="mt-4 text-xs tracking-[0.3em] text-gold-soft uppercase">
              {formatDate(wedding.weddingDate, { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </article>
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-6 rounded-full bg-maroon px-8 py-3.5 font-semibold text-ivory shadow-md print:hidden"
        >
          Print this card
        </button>
        <p className="mt-3 text-center text-xs text-muted print:hidden">
          Tip: print in colour on card stock and place it at the engagement or wedding entrance.
        </p>
      </div>
    </main>
  );
}
