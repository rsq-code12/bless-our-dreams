import type { DreamArt as Art } from "@/wedding.config";
import { Marigold } from "./Ornaments";

/**
 * Little illustrated scenes, one per kind of dream, drawn to sit inside a
 * jharokha (palace-window) arch. `uid` keeps gradient ids unique per card.
 */
export function DreamArt({ art, uid, className }: { art: Art; uid: string; className?: string }) {
  const id = (s: string) => `${uid}-${s}`;
  return (
    <svg className={className} viewBox="0 0 200 220" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {art === "travel" && <Travel id={id} />}
      {art === "home" && <Home id={id} />}
      {art === "aurora" && <Aurora id={id} />}
      {art === "cafe" && <Cafe id={id} />}
      {art === "car" && <Travel id={id} />}
      {art === "blessing" && <Blessing id={id} />}
    </svg>
  );
}

type P = { id: (s: string) => string };

function Travel({ id }: P) {
  return (
    <>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb6a3" />
          <stop offset=".55" stopColor="#ffd59a" />
          <stop offset="1" stopColor="#fff0cf" />
        </linearGradient>
        <linearGradient id={id("sea")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3aa7b8" />
          <stop offset="1" stopColor="#1d6c84" />
        </linearGradient>
      </defs>
      <rect width="200" height="220" fill={`url(#${id("sky")})`} />
      <circle cx="100" cy="128" r="34" fill="#ff8a5c" opacity=".9" />
      {/* Balinese split gate silhouette */}
      <g fill="#7a2f3a" opacity=".85">
        <path d="M58 150 V112 l6 -4 V100 l5 -4 V88 l5 -6 l5 6 v8 l5 4 v8 l4 4 V150 Z" />
        <path d="M142 150 V112 l-6 -4 V100 l-5 -4 V88 l-5 -6 l-5 6 v8 l-5 4 v8 l-4 4 V150 Z" />
      </g>
      <rect y="150" width="200" height="70" fill={`url(#${id("sea")})`} />
      <g stroke="#bfe9ee" strokeWidth="1.4" strokeLinecap="round" opacity=".8">
        <path d="M30 166 h18 M80 172 h26 M140 164 h20 M54 186 h22 M120 192 h30" />
      </g>
      {/* palm */}
      <g fill="none" stroke="#2f4f2a" strokeWidth="3" strokeLinecap="round">
        <path d="M172 220 C 168 190 170 160 160 132" />
      </g>
      <g fill="#2f6b3b">
        <path d="M160 132 c -18 -6 -32 2 -40 10 c 14 -4 28 -6 40 -10 z" />
        <path d="M160 132 c -10 -16 -26 -18 -36 -16 c 14 4 26 10 36 16 z" />
        <path d="M160 132 c 4 -18 18 -24 30 -22 c -12 6 -22 14 -30 22 z" />
        <path d="M160 132 c 16 -4 28 4 34 14 c -12 -6 -22 -10 -34 -14 z" />
      </g>
      {/* plane + dotted heart trail */}
      <path
        d="M24 86 C 40 70 56 80 52 92 C 48 104 30 96 44 80 C 56 66 80 62 100 62"
        fill="none"
        stroke="#6e1423"
        strokeWidth="1.4"
        strokeDasharray="2 4"
        strokeLinecap="round"
      />
      <g transform="translate(108 60) rotate(-8)" fill="#6e1423">
        <path d="M-8 0 L10 -1.5 C 13 -1.5 13 1.5 10 1.5 L-8 0 Z" />
        <path d="M0 0 L-5 -9 L-2 -9 L5 0 Z" />
        <path d="M0 0 L-5 9 L-2 9 L5 0 Z" />
        <path d="M-7 0 L-10 -4 L-8.5 -4 L-5 0 Z" />
      </g>
    </>
  );
}

function Home({ id }: P) {
  return (
    <>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde2e4" />
          <stop offset="1" stopColor="#fff3dc" />
        </linearGradient>
      </defs>
      <rect width="200" height="220" fill={`url(#${id("sky")})`} />
      <circle cx="152" cy="60" r="16" fill="#ffd27a" opacity=".8" />
      <path d="M0 176 Q 50 160 100 170 T 200 166 V220 H0 Z" fill="#9cc59a" />
      <path d="M0 190 Q 60 178 120 188 T 200 184 V220 H0 Z" fill="#7fb07c" />
      {/* house */}
      <rect x="54" y="108" width="92" height="74" fill="#fff8ee" stroke="#6e1423" strokeWidth="2" />
      <path d="M44 112 L100 68 L156 112 Z" fill="#c2185b" stroke="#6e1423" strokeWidth="2" strokeLinejoin="round" />
      <path d="M86 92 a14 14 0 0 1 28 0 v6 h-28 z" fill="#ffd27a" stroke="#6e1423" strokeWidth="1.5" />
      {/* door with toran */}
      <path d="M88 182 V150 a12 12 0 0 1 24 0 V182 Z" fill="#6e1423" />
      <path d="M84 146 Q 100 154 116 146" fill="none" stroke="#2f6b3b" strokeWidth="2" />
      <Marigold cx={88} cy={148} r={3.2} />
      <Marigold cx={100} cy={151} r={3.2} />
      <Marigold cx={112} cy={148} r={3.2} />
      {/* windows, warm light */}
      <rect x="64" y="124" width="16" height="18" rx="2" fill="#ffd27a" stroke="#6e1423" strokeWidth="1.5" />
      <rect x="120" y="124" width="16" height="18" rx="2" fill="#ffd27a" stroke="#6e1423" strokeWidth="1.5" />
      {/* plants */}
      <g fill="#2f6b3b">
        <ellipse cx="44" cy="174" rx="10" ry="14" />
        <ellipse cx="160" cy="172" rx="8" ry="12" />
      </g>
      <rect x="40" y="178" width="8" height="8" fill="#b5541b" />
      <rect x="156" y="178" width="8" height="8" fill="#b5541b" />
      {/* heart */}
      <path
        d="M100 48 c -6 -8 -18 -2 -12 7 l12 11 l12 -11 c 6 -9 -6 -15 -12 -7 z"
        fill="#c2185b"
        opacity=".85"
      />
    </>
  );
}

function Aurora({ id }: P) {
  return (
    <>
      <defs>
        <linearGradient id={id("night")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1638" />
          <stop offset="1" stopColor="#23305e" />
        </linearGradient>
        <linearGradient id={id("aur")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4ff0b0" stopOpacity="0" />
          <stop offset=".3" stopColor="#4ff0b0" stopOpacity=".8" />
          <stop offset=".7" stopColor="#7bd8ff" stopOpacity=".6" />
          <stop offset="1" stopColor="#c08bff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="200" height="220" fill={`url(#${id("night")})`} />
      <g fill="#fff">
        {[
          [24, 30], [60, 18], [96, 40], [140, 22], [176, 44], [40, 70], [120, 64], [168, 90], [16, 104],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.4 : 0.9} opacity=".85" />
        ))}
      </g>
      <path d="M-10 110 C 40 60 80 120 120 70 S 190 60 210 40" fill="none" stroke={`url(#${id("aur")})`} strokeWidth="26" opacity=".55" />
      <path d="M-10 128 C 50 90 90 140 130 100 S 190 90 210 70" fill="none" stroke={`url(#${id("aur")})`} strokeWidth="14" opacity=".5" />
      <path d="M0 170 L40 120 L66 148 L96 104 L136 156 L160 130 L200 168 V220 H0 Z" fill="#1a2547" />
      <path d="M40 120 L50 133 L44 132 L36 128 Z M96 104 L108 120 L100 118 L90 112 Z" fill="#e8eef9" opacity=".8" />
      <path d="M0 192 Q 100 176 200 194 V220 H0 Z" fill="#e9eef7" />
      {/* the two of them */}
      <g fill="#0d1638">
        <circle cx="94" cy="170" r="3.2" />
        <path d="M90 186 L91 175 Q 94 172 97 175 L98 186 Z" />
        <circle cx="104" cy="169" r="3.4" />
        <path d="M100 186 L101 174 Q 104 171 107 174 L108 186 Z" />
      </g>
    </>
  );
}

function Cafe({ id }: P) {
  return (
    <>
      <defs>
        <linearGradient id={id("wall")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe8c2" />
          <stop offset="1" stopColor="#f7d29a" />
        </linearGradient>
      </defs>
      <rect width="200" height="220" fill={`url(#${id("wall")})`} />
      {/* awning */}
      <g>
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={i}
            d={`M${i * 25} 40 h25 v22 a12.5 12.5 0 0 1 -25 0 z`}
            fill={i % 2 ? "#fff8ee" : "#c2185b"}
          />
        ))}
      </g>
      {/* bookshelf */}
      <rect x="18" y="86" width="60" height="4" fill="#7a3b1b" />
      <rect x="18" y="122" width="60" height="4" fill="#7a3b1b" />
      {["#6e1423", "#2f6b3b", "#e46b0e", "#3a5a9b", "#b88a2a", "#c2185b"].map((c, i) => (
        <rect key={i} x={22 + i * 9} y={i % 2 ? 64 : 60} width="7" height={i % 2 ? 22 : 26} fill={c} />
      ))}
      {["#3a5a9b", "#b88a2a", "#6e1423", "#2f6b3b", "#e46b0e"].map((c, i) => (
        <rect key={i} x={24 + i * 10} y={i % 2 ? 100 : 98} width="8" height={i % 2 ? 22 : 24} fill={c} />
      ))}
      {/* counter */}
      <rect x="0" y="168" width="200" height="52" fill="#8a4a24" />
      <rect x="0" y="164" width="200" height="8" fill="#6e3a1c" />
      {/* kulhad */}
      <path d="M112 128 h44 l-6 38 h-32 z" fill="#b5541b" />
      <path d="M112 128 h44 l-1 6 h-42 z" fill="#8a3a14" />
      <ellipse cx="134" cy="129" rx="22" ry="4" fill="#d9a56a" />
      {/* steam */}
      <g fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".85">
        <path d="M126 118 c -6 -8 6 -12 0 -22" />
        <path d="M140 116 c -6 -8 6 -12 0 -22" />
      </g>
      {/* hanging bulb */}
      <line x1="170" y1="62" x2="170" y2="88" stroke="#4a0a14" strokeWidth="1.2" />
      <circle cx="170" cy="94" r="7" fill="#ffd96b" />
      <circle cx="170" cy="94" r="14" fill="#ffd96b" opacity=".25" />
    </>
  );
}

function Blessing({ id }: P) {
  return (
    <>
      <defs>
        <radialGradient id={id("glow")} cx="50%" cy="55%" r="60%">
          <stop offset="0" stopColor="#ffcf6b" />
          <stop offset=".45" stopColor="#c2185b" />
          <stop offset="1" stopColor="#4a0a14" />
        </radialGradient>
      </defs>
      <rect width="200" height="220" fill={`url(#${id("glow")})`} />
      {/* rangoli */}
      <g transform="translate(100 150)" fill="none" stroke="#fff1c4" strokeWidth="1.3" opacity=".9">
        <circle r="56" strokeDasharray="2 5" />
        <circle r="44" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M0 -44 Q 9 -54 0 -66 Q -9 -54 0 -44 Z" transform={`rotate(${i * 30})`} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M0 -14 Q 10 -26 0 -40 Q -10 -26 0 -14 Z" transform={`rotate(${i * 45})`} fill="#f4a417" fillOpacity=".4" />
        ))}
        <circle r="12" fill="#f4a417" fillOpacity=".6" />
      </g>
      {/* diya */}
      <g transform="translate(68 104)">
        <g className="flame">
          <path d="M32 0 C 40 14 40 24 32 30 C 24 24 24 14 32 0 Z" fill="#ffd96b" />
          <path d="M32 9 C 36 17 36 23 32 27 C 28 23 28 17 32 9 Z" fill="#fff" />
        </g>
        <path d="M4 32 Q 32 26 60 32 Q 56 54 32 54 Q 8 54 4 32 Z" fill="#b5541b" />
        <path d="M4 32 Q 32 26 60 32 Q 32 38 4 32 Z" fill="#e46b0e" />
      </g>
      <Marigold cx={30} cy={40} r={8} />
      <Marigold cx={172} cy={52} r={7} />
      <Marigold cx={160} cy={24} r={5} />
    </>
  );
}
