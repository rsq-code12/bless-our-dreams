"use client";

import { useEffect } from "react";
import { wedding } from "@/wedding.config";
import { Diya, Mandala, Petals, Toran } from "../Ornaments";

/**
 * The opening of every Hindu wedding card: Shri Ganesh, remover of obstacles,
 * is invited first. Gold line art that draws itself in, with the Vakratunda shloka.
 */

const line = { fill: "none", stroke: "#f2d48a", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const draw = (delay: number, dur = 1.6) =>
  ({ animationDelay: `${delay}s`, animationDuration: `${dur}s` }) as React.CSSProperties;

export function GaneshaArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 300" aria-hidden>
      <defs>
        <radialGradient id="gn-halo" cx="50%" cy="46%" r="50%">
          <stop offset="0" stopColor="#ffd36b" stopOpacity=".55" />
          <stop offset=".6" stopColor="#f4a417" stopOpacity=".12" />
          <stop offset="1" stopColor="#f4a417" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gn-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1c4" />
          <stop offset=".5" stopColor="#e2b24a" />
          <stop offset="1" stopColor="#a8741c" />
        </linearGradient>
      </defs>

      <circle cx="120" cy="140" r="118" fill="url(#gn-halo)" className="a-pulse" />
      <circle cx="120" cy="140" r="104" {...line} strokeOpacity=".35" strokeDasharray="2 6" pathLength={1} className="a-draw" style={draw(0, 2.4)} />

      {/* crown (mukut) */}
      <g className="a-fadein" style={{ animationDelay: "1.4s" }}>
        <circle cx="120" cy="17" r="4" fill="url(#gn-gold)" />
        <path d="M120 21 L114 36 H126 Z" fill="url(#gn-gold)" />
      </g>
      <path d="M90 92 C 90 66 102 46 120 36 C 138 46 150 66 150 92" {...line} pathLength={1} className="a-draw" style={draw(0.1)} />
      <path d="M100 88 C 100 71 108 57 120 50 C 132 57 140 71 140 88" {...line} strokeWidth={1.4} pathLength={1} className="a-draw" style={draw(0.3)} />
      <path d="M84 92 H156 M86 102 H154" {...line} pathLength={1} className="a-draw" style={draw(0.4)} />
      <path d="M84 92 C 77 88 75 80 80 73 M156 92 C 163 88 165 80 160 73" {...line} pathLength={1} className="a-draw" style={draw(0.5)} />
      <g className="a-fadein" style={{ animationDelay: "1.6s" }}>
        {[96, 108, 132, 144].map((x) => (
          <circle key={x} cx={x} cy="97" r="2.4" fill="#f2d48a" />
        ))}
        <circle cx="120" cy="97" r="4" fill="#e11d48" stroke="#f2d48a" strokeWidth="1.2" />
        {[106, 113, 120, 127, 134].map((x, i) => (
          <circle key={x} cx={x} cy={78 - Math.abs(i - 2) * 6} r="1.6" fill="#f2d48a" />
        ))}
      </g>

      {/* ears */}
      <path d="M88 108 C 56 92 18 112 22 156 C 26 196 62 210 90 188" {...line} pathLength={1} className="a-draw" style={draw(0.6, 1.8)} />
      <path d="M152 108 C 184 92 222 112 218 156 C 214 196 178 210 150 188" {...line} pathLength={1} className="a-draw" style={draw(0.6, 1.8)} />
      <path d="M84 121 C 62 113 41 128 43 156 C 45 179 64 189 84 178" {...line} strokeWidth={2} strokeDasharray=".01 8" className="a-fadein" style={{ animationDelay: "1.8s" }} />
      <path d="M156 121 C 178 113 199 128 197 156 C 195 179 176 189 156 178" {...line} strokeWidth={2} strokeDasharray=".01 8" className="a-fadein" style={{ animationDelay: "1.8s" }} />
      <g className="a-fadein" style={{ animationDelay: "2s" }} fill="#f2d48a">
        <circle cx="52" cy="156" r="3" />
        <circle cx="188" cy="156" r="3" />
      </g>

      {/* head */}
      <path d="M88 102 C 84 118 84 138 92 154 C 96 150 104 146 110 146" {...line} pathLength={1} className="a-draw" style={draw(0.9)} />
      <path d="M152 102 C 156 118 156 138 148 154 C 144 150 136 146 130 146" {...line} pathLength={1} className="a-draw" style={draw(0.9)} />

      {/* brows, eyes, tilak */}
      <path d="M96 124 Q 106 117 114 123 M126 123 Q 134 117 144 124" {...line} strokeWidth={1.6} pathLength={1} className="a-draw" style={draw(1.2, 0.8)} />
      <g className="a-fadein" style={{ animationDelay: "1.7s" }}>
        <path d="M98 132 Q 106 124 114 132 Q 106 137 98 132 Z" fill="#fff8ee" stroke="#f2d48a" strokeWidth="1.2" />
        <path d="M126 132 Q 134 124 142 132 Q 134 137 126 132 Z" fill="#fff8ee" stroke="#f2d48a" strokeWidth="1.2" />
        <circle cx="107" cy="131" r="2.3" fill="#2e0710" />
        <circle cx="133" cy="131" r="2.3" fill="#2e0710" />
        <path d="M120 105 C 116 111 116 117 120 122 C 124 117 124 111 120 105 Z" fill="#e11d48" />
        <circle cx="120" cy="127" r="2.4" fill="#ffd36b" />
      </g>

      {/* trunk */}
      <path
        d="M110 146 C 106 176 106 206 122 228 C 136 246 164 248 172 232 C 178 220 172 206 160 206 C 152 206 150 216 156 220"
        {...line}
        strokeWidth={2.6}
        pathLength={1}
        className="a-draw"
        style={draw(1.1, 1.8)}
      />
      <path d="M130 146 C 132 172 134 196 144 210 C 149 216 155 216 158 212" {...line} strokeWidth={2.6} pathLength={1} className="a-draw" style={draw(1.2, 1.6)} />
      <path d="M110 162 Q 120 167 131 162 M109 178 Q 120 183 132 178 M110 194 Q 121 199 135 193" {...line} strokeWidth={1.2} strokeOpacity=".8" pathLength={1} className="a-draw" style={draw(1.8, 0.9)} />

      {/* tusks */}
      <g className="a-fadein" style={{ animationDelay: "2.1s" }}>
        <path d="M136 158 C 146 166 150 176 146 185 C 142 178 138 171 132 165 Z" fill="#fff8ee" stroke="#f2d48a" strokeWidth="1.2" />
        <path d="M104 160 C 98 164 96 168 98 172 C 102 168 104 166 108 164 Z" fill="#fff8ee" stroke="#f2d48a" strokeWidth="1.2" />
      </g>

      {/* modak & lotus */}
      <g className="a-fadein" style={{ animationDelay: "2.3s" }}>
        <path d="M150 214 C 150 206 156 202 160 200 C 164 202 170 206 170 214 Z" fill="url(#gn-gold)" />
        <path d="M154 210 L160 202 L166 210" fill="none" stroke="#a8741c" strokeWidth="1" />
      </g>
      <g transform="translate(120 286)">
        <g className="a-rise" style={{ animationDelay: "1.9s" }}>
        {[-60, -30, 0, 30, 60].map((a) => (
          <path
            key={a}
            d="M0 0 C -10 -12 -8 -26 0 -34 C 8 -26 10 -12 0 0 Z"
            transform={`rotate(${a})`}
            fill={a === 0 ? "#e11d48" : "#c2185b"}
            fillOpacity={a === 0 ? 0.95 : 0.8}
            stroke="#f2d48a"
            strokeWidth="1"
          />
        ))}
        </g>
      </g>
    </svg>
  );
}

/** Full-screen opening. Tap to begin (which also lets the browser play the shankh and music). */
export function GaneshaCover({ guest, leaving, onBegin }: { guest: string; leaving: boolean; onBegin: () => void }) {
  // Keep the opening uncluttered: the music button hides until the story begins.
  useEffect(() => {
    document.body.dataset.cover = "on";
    return () => {
      delete document.body.dataset.cover;
    };
  }, []);
  return (
    <div
      role="button"
      tabIndex={0}
      data-doors
      aria-label="Begin the invitation"
      onClick={onBegin}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onBegin()}
      className={`scene is-on bg-velvet fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden px-6 text-center select-none ${
        leaving ? "cover-leave" : ""
      }`}
    >
      <Toran className="absolute inset-x-0 top-0 h-[64px] w-full" />
      <Petals count={12} />
      <Mandala className="animate-spin-slow absolute top-[44%] left-1/2 w-[640px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.14]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_35%,rgb(20_2_8/.6))]" />

      <p className="reveal relative font-deva text-2xl text-gold-soft" style={{ "--d": "0.2s" } as React.CSSProperties}>
        ॥ श्री गणेशाय नमः ॥
      </p>

      <div className="cover-ganesha relative mt-2 flex items-end justify-center">
        <Diya className="mb-6 h-12 w-12" />
        <GaneshaArt className="w-[min(62vw,260px)]" />
        <Diya className="mb-6 h-12 w-12" />
      </div>

      <div className="reveal relative mt-2 font-deva text-[15px] leading-relaxed text-gold-soft/85" style={{ "--d": "2.2s" } as React.CSSProperties}>
        <p>वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।</p>
        <p>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥</p>
      </div>

      <div className="reveal relative mt-7" style={{ "--d": "2.8s" } as React.CSSProperties}>
        {guest && (
          <p className="mb-3 text-sm text-ivory/80">
            An invitation for <span className="font-script text-2xl text-foil">{guest}</span>
          </p>
        )}
        <p className="cover-tap inline-flex items-center gap-2 rounded-full border border-gold-soft/50 bg-white/10 px-7 py-3 text-sm font-semibold tracking-[0.2em] text-gold-soft uppercase backdrop-blur">
          Tap to begin 🙏
        </p>
        <p className="mt-3 text-xs text-gold-soft/70">
          {wedding.bride} &amp; {wedding.groom} · 🎶 with shehnai &amp; shankh
        </p>
      </div>
    </div>
  );
}
