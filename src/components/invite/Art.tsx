/**
 * Hand-drawn, animated SVG illustrations for the invitation scenes.
 * Animations live in globals.css (classes prefixed `a-`) and only run
 * while their scene is on screen (`.scene.is-active`).
 */
import type { EventIcon } from "@/wedding.config";
import { Marigold } from "../Ornaments";

type P = { className?: string };

/* ───────── Scene 1: kalash, bells, diyas, rangoli ───────── */

function Leaf({ angle }: { angle: number }) {
  return (
    <g transform={`translate(150 146) rotate(${angle})`}>
      <path d="M0 0 C 10 -12 10 -34 0 -50 C -10 -34 -10 -12 0 0 Z" fill="#2f6b3b" stroke="#1d4a26" strokeWidth="1" />
      <path d="M0 -2 V -46" stroke="#5c9a5f" strokeWidth="1" />
    </g>
  );
}

function Bell({ x, delay }: { x: number; delay: number }) {
  return (
    <g className="a-swing" style={{ transformOrigin: `${x}px 0px`, animationDelay: `${delay}s` }}>
      <line x1={x} y1={0} x2={x} y2={52} stroke="#b88a2a" strokeWidth="1.5" />
      <Marigold cx={x} cy={18} r={5} />
      <Marigold cx={x} cy={32} r={4.5} />
      <path d={`M${x - 11} 72 C ${x - 11} 58 ${x - 7} 52 ${x} 52 C ${x + 7} 52 ${x + 11} 58 ${x + 11} 72 Z`} fill="url(#k-gold)" stroke="#8a6414" />
      <rect x={x - 13} y={71} width={26} height={3} rx={1.5} fill="#8a6414" />
      <circle cx={x} cy={77} r={2.6} fill="#8a6414" />
    </g>
  );
}

export function KalashArt({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 300 300" aria-hidden>
      <defs>
        <linearGradient id="k-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset=".5" stopColor="#d9a441" />
          <stop offset="1" stopColor="#9c6b1c" />
        </linearGradient>
        <linearGradient id="k-copper" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a3d14" />
          <stop offset=".35" stopColor="#e2a04d" />
          <stop offset=".6" stopColor="#c76f26" />
          <stop offset="1" stopColor="#7a3410" />
        </linearGradient>
        <radialGradient id="k-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd36b" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffd36b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="150" cy="185" r="120" fill="url(#k-glow)" className="a-pulse" />

      {/* rangoli drawing itself in */}
      <g transform="translate(150 262)" fill="none" strokeLinecap="round">
        <ellipse rx="128" ry="26" stroke="#c2185b" strokeWidth="2" pathLength={1} className="a-draw" />
        <ellipse rx="110" ry="20" stroke="#f4a417" strokeWidth="2" pathLength={1} className="a-draw" style={{ animationDelay: ".25s" }} />
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={Math.round(Math.cos(a) * 11900) / 100}
              cy={Math.round(Math.sin(a) * 2300) / 100}
              r="3"
              fill={i % 2 ? "#e46b0e" : "#2f6b3b"}
              className="a-pop"
              style={{ animationDelay: `${0.6 + i * 0.04}s` }}
            />
          );
        })}
      </g>

      {/* bells */}
      <Bell x={46} delay={0} />
      <Bell x={254} delay={-1.3} />

      {/* leaves + coconut */}
      <g className="a-rise" style={{ animationDelay: ".2s" }}>
        {[-62, -32, 0, 32, 62].map((a) => (
          <Leaf key={a} angle={a} />
        ))}
        <ellipse cx="150" cy="122" rx="20" ry="25" fill="#7a4a24" />
        <path d="M134 114 q 16 -26 32 0" fill="#9b6a3a" />
        <path d="M131 130 q 19 10 38 0 l -4 14 q -15 6 -30 0 z" fill="#c2185b" />
        <path d="M135 134 q 15 7 30 0" stroke="#ffd36b" strokeWidth="1.5" fill="none" />
      </g>

      {/* kalash */}
      <g className="a-rise">
        <path d="M126 150 L124 166 C 78 176 82 244 128 250 L172 250 C 218 244 222 176 176 166 L174 150 Z" fill="url(#k-copper)" />
        <ellipse cx="150" cy="150" rx="34" ry="7" fill="url(#k-gold)" />
        <path d="M96 198 Q 150 212 204 198" stroke="#ffd36b" strokeWidth="3" fill="none" />
        <path d="M100 210 Q 150 224 200 210" stroke="#c2185b" strokeWidth="2" fill="none" />
        {[-36, -18, 0, 18, 36].map((dx) => (
          <circle key={dx} cx={150 + dx} cy={186} r="3" fill="#ffd36b" />
        ))}
        <path d="M150 176 l 6 8 l -6 8 l -6 -8 z" fill="#c2185b" />
        <rect x="120" y="248" width="60" height="7" rx="3" fill="#7a3410" />
      </g>

      {/* diyas */}
      {[62, 238].map((x, i) => (
        <g key={x} transform={`translate(${x - 22} 216)`}>
          <circle cx="22" cy="10" r="16" fill="url(#k-glow)" />
          <g className="flame" style={{ animationDelay: `${i * 0.4}s` }}>
            <path d="M22 0 C 28 9 28 16 22 20 C 16 16 16 9 22 0 Z" fill="#f4a417" />
            <path d="M22 6 C 25 11 25 15 22 18 C 19 15 19 11 22 6 Z" fill="#fff1c4" />
          </g>
          <path d="M2 22 Q 22 18 42 22 Q 38 36 22 36 Q 6 36 2 22 Z" fill="#b5541b" />
          <path d="M2 22 Q 22 18 42 22 Q 22 26 2 22 Z" fill="#e46b0e" />
        </g>
      ))}
    </svg>
  );
}

/* ───────── Scene 2: a pair of peacocks ───────── */

function Feather({ angle, i }: { angle: number; i: number }) {
  return (
    <g transform={`rotate(${angle} 70 150)`}>
      <path d="M70 150 Q 72 100 70 62" stroke="#2f6b3b" strokeWidth="1.2" fill="none" />
      <g className="a-shimmer" style={{ animationDelay: `${i * 0.12}s` }}>
        <ellipse cx="70" cy="56" rx="10" ry="15" fill="#2a9d8f" />
        <ellipse cx="70" cy="57" rx="7" ry="10" fill="#e9c46a" />
        <ellipse cx="70" cy="58" rx="5" ry="7.5" fill="#1d4ed8" />
        <ellipse cx="70" cy="59" rx="2.4" ry="3.8" fill="#0b1a4a" />
      </g>
    </g>
  );
}

/** One peacock facing right. Mirror it with `flip` for a facing pair. */
export function Peacock({ className, flip }: P & { flip?: boolean }) {
  const angles = [-78, -62, -46, -30, -15, 0, 15, 30];
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <defs>
        <linearGradient id="pc-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#0b3d91" />
        </linearGradient>
      </defs>
      <g className="a-fan" style={{ transformOrigin: "70px 150px" }}>
        {angles.map((a, i) => (
          <Feather key={a} angle={a} i={i} />
        ))}
      </g>
      {/* body & neck */}
      <path d="M58 168 C 52 140 70 124 92 122 C 104 121 110 112 110 98 L 112 74 C 113 66 122 64 124 72 L 120 104 C 118 130 104 160 78 172 Z" fill="url(#pc-body)" />
      <path d="M60 166 C 62 150 74 140 90 138" stroke="#22c55e" strokeWidth="3" fill="none" opacity=".6" />
      {/* head */}
      <circle cx="119" cy="70" r="8" fill="#1d4ed8" />
      <path d="M126 69 l 9 3 l -9 3 z" fill="#d4a017" />
      <circle cx="121" cy="68" r="2" fill="#fff" />
      <circle cx="121.5" cy="68" r="1" fill="#000" />
      {/* crest */}
      {[-18, 0, 18].map((a) => (
        <g key={a} transform={`rotate(${a} 118 62)`}>
          <line x1="118" y1="62" x2="118" y2="48" stroke="#1d4ed8" strokeWidth="1" />
          <circle cx="118" cy="47" r="2.2" fill="#2a9d8f" />
        </g>
      ))}
      {/* wing detail */}
      <path d="M72 150 C 80 138 96 134 104 140 C 96 150 84 156 72 158 Z" fill="#c2a14a" opacity=".85" />
      {/* legs */}
      <path d="M78 170 l -2 18 m 12 -20 l 2 20" stroke="#8a6414" strokeWidth="2" />
    </svg>
  );
}

/* ───────── Scene 3: calendar ───────── */

export function CalendarArt({ month, day, weekday, time }: { month: string; day: string; weekday: string; time: string }) {
  return (
    <div className="a-flip relative mx-auto w-44 rounded-2xl bg-paper text-center shadow-[0_20px_40px_-18px_rgb(0_0_0/.6)]">
      <div className="absolute -top-2 left-0 flex w-full justify-around px-8">
        <span className="h-4 w-1.5 rounded-full bg-gold" />
        <span className="h-4 w-1.5 rounded-full bg-gold" />
      </div>
      <div className="rounded-t-2xl bg-rani py-2 text-xs font-semibold tracking-[0.35em] text-white uppercase">{month}</div>
      <div className="relative py-2">
        <svg viewBox="0 0 120 100" className="absolute inset-0 m-auto h-full w-full" aria-hidden>
          <path
            d="M60 92 C 20 66 8 44 20 26 C 32 10 52 14 60 30 C 68 14 88 10 100 26 C 112 44 100 66 60 92 Z"
            fill="none"
            stroke="#c2185b"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={1}
            className="a-draw"
            style={{ animationDelay: ".9s", animationDuration: "1.6s" }}
          />
        </svg>
        <div className="relative font-display text-6xl leading-none font-semibold text-maroon">{day}</div>
        <div className="relative mt-1 text-sm font-medium text-ink">{weekday}</div>
      </div>
      <div className="rounded-b-2xl border-t border-gold/30 py-2 text-sm font-semibold text-maroon">{time}</div>
    </div>
  );
}

/* ───────── Scene 4: event icons ───────── */

export function EventIconArt({ icon, className }: { icon: EventIcon; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden>
      <defs>
        <linearGradient id={`ev-gold-${icon}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1c4" />
          <stop offset=".5" stopColor="#e2b24a" />
          <stop offset="1" stopColor="#a8741c" />
        </linearGradient>
      </defs>
      {icon === "ring" && (
        <g>
          <circle cx="26" cy="38" r="13" fill="none" stroke={`url(#ev-gold-${icon})`} strokeWidth="4" />
          <circle cx="38" cy="38" r="13" fill="none" stroke={`url(#ev-gold-${icon})`} strokeWidth="4" />
          <path d="M33 20 l 5 -7 h 8 l 5 7 l -9 8 z" fill="#bfe9ff" stroke="#6bb6d6" transform="translate(-10 4)" />
          <g className="a-twinkle">
            <path d="M48 10 l 1.5 4 l 4 1.5 l -4 1.5 l -1.5 4 l -1.5 -4 l -4 -1.5 l 4 -1.5 z" fill="#ffd36b" />
          </g>
          <g className="a-twinkle" style={{ animationDelay: ".7s" }}>
            <path d="M14 14 l 1 3 l 3 1 l -3 1 l -1 3 l -1 -3 l -3 -1 l 3 -1 z" fill="#ffd36b" />
          </g>
        </g>
      )}
      {icon === "haldi" && (
        <g>
          {[18, 30, 44].map((x, i) => (
            <circle key={x} cx={x} cy="20" r="3" fill="#f6c21c" className="a-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
          <path d="M8 32 h48 c 0 14 -10 22 -24 22 s -24 -8 -24 -22 z" fill={`url(#ev-gold-${icon})`} />
          <ellipse cx="32" cy="32" rx="24" ry="5" fill="#f6c21c" />
          <path d="M14 40 q 18 8 36 0" stroke="#a8741c" strokeWidth="1.5" fill="none" />
        </g>
      )}
      {icon === "mehendi" && (
        <g>
          <path
            d="M22 60 L20 34 C 19 30 23 28 25 32 L26 38 L25 14 C 25 10 30 10 30 14 L31 30 L31 10 C 31 6 36 6 36 10 L37 30 L38 13 C 38 9 43 9 43 13 L43 34 L46 27 C 48 23 53 25 51 30 L45 46 C 43 54 38 60 30 60 Z"
            fill="#f3c9a4"
            stroke="#b5541b"
            strokeWidth="1.2"
          />
          <g fill="none" stroke="#8a2a0a" strokeWidth="1.1" strokeLinecap="round">
            <circle cx="34" cy="46" r="5" pathLength={1} className="a-draw" />
            <circle cx="34" cy="46" r="2" pathLength={1} className="a-draw" style={{ animationDelay: ".3s" }} />
            <path d="M27 38 q 7 -5 14 0" pathLength={1} className="a-draw" style={{ animationDelay: ".5s" }} />
            <path d="M28 18 v 8 M33.5 15 v 10 M40.5 17 v 9" pathLength={1} className="a-draw" style={{ animationDelay: ".8s" }} />
          </g>
          <circle cx="28" cy="16" r="1.4" fill="#8a2a0a" />
          <circle cx="33.5" cy="13" r="1.4" fill="#8a2a0a" />
          <circle cx="40.5" cy="15" r="1.4" fill="#8a2a0a" />
        </g>
      )}
      {icon === "sangeet" && (
        <g>
          <g className="a-floatnote">
            <path d="M44 14 v 12 a 3 3 0 1 1 -2 -3 V 10 l 8 -2 v 4 z" fill="#c2185b" />
          </g>
          <g className="a-floatnote" style={{ animationDelay: ".8s" }}>
            <path d="M14 18 v 10 a 3 3 0 1 1 -2 -3 V 15 l 6 -2 v 3 z" fill="#e46b0e" />
          </g>
          <g className="a-beat">
            <rect x="12" y="32" width="40" height="22" rx="4" fill="#c2185b" />
            <ellipse cx="12" cy="43" rx="4" ry="11" fill="#f4e3c3" stroke="#8a6414" />
            <ellipse cx="52" cy="43" rx="4" ry="11" fill="#f4e3c3" stroke="#8a6414" />
            <path d="M14 33 L 50 53 M 14 53 L 50 33" stroke="#ffd36b" strokeWidth="1.4" />
          </g>
        </g>
      )}
      {(icon === "pheras" || icon === "reception") && (
        <g>
          <g className="flame">
            <path d="M32 8 C 44 22 44 34 32 40 C 20 34 20 22 32 8 Z" fill="#f4a417" />
            <path d="M24 18 C 30 26 30 34 24 38 C 18 34 18 26 24 18 Z" fill="#e46b0e" />
            <path d="M40 18 C 46 26 46 34 40 38 C 34 34 34 26 40 18 Z" fill="#e46b0e" />
            <path d="M32 20 C 36 27 36 33 32 37 C 28 33 28 27 32 20 Z" fill="#fff1c4" />
          </g>
          <path d="M10 40 h44 l -6 16 h -32 z" fill={`url(#ev-gold-${icon})`} />
          <path d="M14 46 h36" stroke="#8a6414" strokeWidth="1.4" />
          {[18, 28, 38, 46].map((x, i) => (
            <circle key={x} cx={x} cy="34" r="1.3" fill="#ffd36b" className="a-spark" style={{ animationDelay: `${i * 0.35}s` }} />
          ))}
        </g>
      )}
    </svg>
  );
}

/* ───────── Scene 5: lake palace at dusk ───────── */

function Palace() {
  const windows = [
    [58, 168], [76, 168], [94, 168], [206, 168], [224, 168], [242, 168],
    [120, 150], [138, 150], [162, 150], [180, 150], [130, 176], [170, 176],
  ];
  return (
    <g>
      <g fill="#3b1530">
        <rect x="40" y="160" width="220" height="40" />
        <rect x="104" y="130" width="92" height="70" />
        <path d="M150 74 C 126 80 116 100 118 130 h64 C 184 100 174 80 150 74 Z" />
        <rect x="148" y="62" width="4" height="14" />
        {[52, 86, 214, 248].map((x) => (
          <g key={x}>
            <rect x={x - 12} y="146" width="24" height="16" />
            <path d={`M${x - 14} 146 C ${x - 12} 132 ${x + 12} 132 ${x + 14} 146 Z`} />
            <rect x={x - 1} y="128" width="2" height="8" />
          </g>
        ))}
        {[118, 182].map((x) => (
          <g key={x}>
            <path d={`M${x - 12} 130 C ${x - 10} 116 ${x + 10} 116 ${x + 12} 130 Z`} />
            <rect x={x - 1} y="110" width="2" height="8" />
          </g>
        ))}
      </g>
      {/* arches */}
      <g fill="#24091d">
        {[60, 80, 100, 200, 220, 240].map((x) => (
          <path key={x} d={`M${x - 6} 200 v -14 a 6 6 0 0 1 12 0 v 14 z`} />
        ))}
        {[128, 150, 172].map((x) => (
          <path key={x} d={`M${x - 8} 200 v -16 a 8 8 0 0 1 16 0 v 16 z`} />
        ))}
      </g>
      {windows.map(([x, y], i) => (
        <rect
          key={i}
          x={x - 3}
          y={y - 5}
          width="6"
          height="9"
          rx="3"
          fill="#ffcf6b"
          className="a-window"
          style={{ animationDelay: `${0.8 + i * 0.12}s` }}
        />
      ))}
    </g>
  );
}

export function PalaceArt({ className }: P) {
  const stars = [
    [30, 30], [70, 18], [110, 44], [190, 22], [240, 40], [280, 16], [150, 30], [262, 70], [20, 80],
  ];
  return (
    <svg className={className} viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="pl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a0b2e" />
          <stop offset=".45" stopColor="#6b1d4f" />
          <stop offset=".75" stopColor="#e46b4e" />
          <stop offset="1" stopColor="#ffb36b" />
        </linearGradient>
        <linearGradient id="pl-lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a2c55" />
          <stop offset="1" stopColor="#1a0b2e" />
        </linearGradient>
        <linearGradient id="pl-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="pl-mask">
          <rect x="0" y="200" width="300" height="100" fill="url(#pl-fade)" />
        </mask>
      </defs>
      <rect width="300" height="200" fill="url(#pl-sky)" />
      <circle cx="150" cy="150" r="30" fill="#ffd36b" className="a-sunset" />
      {stars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 ? 1 : 1.6} fill="#fff" className="a-star" style={{ animationDelay: `${0.5 + i * 0.2}s` }} />
      ))}
      <path d="M232 52 a 14 14 0 1 0 12 22 a 11 11 0 1 1 -12 -22 z" fill="#fff1c4" className="a-fadein" style={{ animationDelay: "1.4s" }} />

      {/* sky lanterns */}
      {[
        [60, 0], [120, 1.6], [214, 0.8], [260, 2.4], [30, 3.2],
      ].map(([x, d], i) => (
        <g key={i} className="a-lantern" style={{ animationDelay: `${d}s` }}>
          <circle cx={x} cy={210} r="9" fill="#ffb347" opacity=".25" />
          <path d={`M${x - 4} 204 h8 l 2 10 h -12 z`} fill="#ff9f43" />
          <rect x={x - 2} y={213} width="4" height="2" fill="#ffe08a" />
        </g>
      ))}

      <rect y="200" width="300" height="100" fill="url(#pl-lake)" />
      <Palace />
      <g transform="translate(0 400) scale(1 -1)" mask="url(#pl-mask)" opacity=".7">
        <Palace />
      </g>
      <g stroke="#ffcf6b" strokeOpacity=".5" strokeWidth="1.2" strokeLinecap="round">
        {[[40, 214, 30], [140, 222, 40], [220, 232, 26], [80, 246, 22], [190, 258, 34]].map(([x, y, w], i) => (
          <line key={i} x1={x} y1={y} x2={x + w} y2={y} className="a-ripple" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}
      </g>
      {/* shikara */}
      <g className="a-boat">
        <path d="M-40 270 q 30 10 60 0 l -6 6 h -48 z" fill="#24091d" />
        <path d="M-26 270 v -12 h 30 v 12" fill="#c2185b" />
        <path d="M-30 258 q 19 -8 38 0" fill="#7a1e2c" />
      </g>
    </svg>
  );
}

/* ───────── Scene 7: shagun envelope ───────── */

export function EnvelopeArt({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 240 200" aria-hidden>
      <defs>
        <linearGradient id="en-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c2185b" />
          <stop offset="1" stopColor="#7a0f2c" />
        </linearGradient>
        <radialGradient id="en-coin" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff1c4" />
          <stop offset=".6" stopColor="#e2b24a" />
          <stop offset="1" stopColor="#9c6b1c" />
        </radialGradient>
      </defs>
      {/* envelope body */}
      <rect x="30" y="90" width="180" height="100" rx="8" fill="url(#en-red)" />
      {/* flap opens */}
      <g className="a-flap" style={{ transformOrigin: "120px 90px" }}>
        <path d="M30 98 a 8 8 0 0 1 8 -8 H202 a 8 8 0 0 1 8 8 L120 150 Z" fill="#d81b60" />
        <circle cx="120" cy="128" r="10" fill="#ffd36b" />
        <circle cx="120" cy="128" r="6" fill="#c2185b" />
      </g>
      {/* coin rising out */}
      <g className="a-coin">
        <circle cx="120" cy="92" r="26" fill="url(#en-coin)" stroke="#8a6414" strokeWidth="2" />
        <circle cx="120" cy="92" r="20" fill="none" stroke="#8a6414" strokeDasharray="2 3" />
        <text x="120" y="102" textAnchor="middle" fontSize="28" fontWeight="700" fill="#7a4a10" fontFamily="serif">
          ₹1
        </text>
      </g>
      {/* front pocket */}
      <path d="M30 98 L120 150 L210 98 V182 a 8 8 0 0 1 -8 8 H38 a 8 8 0 0 1 -8 -8 Z" fill="#a3123f" />
      <rect x="40" y="100" width="160" height="80" rx="4" fill="none" stroke="#ffd36b" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="120" y="176" textAnchor="middle" fontSize="15" fill="#ffd36b" fontFamily="serif" fontStyle="italic">
        शुभ आशीर्वाद
      </text>
      {/* sparkles */}
      {[
        [64, 60, 0], [180, 52, 0.5], [150, 30, 1], [86, 34, 1.4],
      ].map(([x, y, d], i) => (
        <path
          key={i}
          d={`M${x} ${y - 7} l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 l 5 -2 z`}
          fill="#ffd36b"
          className="a-twinkle"
          style={{ animationDelay: `${1.2 + d}s` }}
        />
      ))}
    </svg>
  );
}
