/**
 * Hand-drawn SVG ornaments: marigold toran, mandala, dividers, diya, petals.
 * Pure SVG, no images, so the whole site stays light on mobile data.
 */

type SvgProps = { className?: string };

/* ───────── Marigold (genda) flower ───────── */

/** Round SVG coordinates so server and browser render identical numbers. */
const r2 = (n: number) => Math.round(n * 100) / 100;

export function Marigold({ cx, cy, r = 9 }: { cx: number; cy: number; r?: number }) {
  const petals = 10;
  return (
    <g>
      {Array.from({ length: petals }, (_, i) => {
        const a = (i / petals) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={r2(cx + Math.cos(a) * r * 0.72)}
            cy={r2(cy + Math.sin(a) * r * 0.72)}
            r={r2(r * 0.42)}
            fill="#e46b0e"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r2(r * 0.78)} fill="#f4a417" />
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2 + 0.3;
        return (
          <circle
            key={i}
            cx={r2(cx + Math.cos(a) * r * 0.45)}
            cy={r2(cy + Math.sin(a) * r * 0.45)}
            r={r2(r * 0.22)}
            fill="#ffc23d"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r2(r * 0.22)} fill="#ffd96b" />
    </g>
  );
}

function MangoLeaf({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <path
      d={`M${x} ${y} q ${flip ? -7 : 7} 9 0 22 q ${flip ? 7 : -7} -9 0 -22 z`}
      fill="#2f6b3b"
      stroke="#1f4a28"
      strokeWidth=".6"
    />
  );
}

/** A marigold & mango-leaf toran that hangs across the top of the hero. */
export function Toran({ className }: SvgProps) {
  const unit = 64;
  const count = 28;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${unit * count} 120`}
      preserveAspectRatio="xMidYMin slice"
      aria-hidden
    >
      <path d={`M0 10 H${unit * count}`} stroke="#b88a2a" strokeWidth="2" />
      {Array.from({ length: count }, (_, i) => {
        const x = i * unit + unit / 2;
        const long = i % 2 === 0;
        return (
          <g key={i} className="animate-sway" style={{ animationDelay: `${(i % 5) * -1.1}s` }}>
            <line x1={x} y1={10} x2={x} y2={long ? 92 : 58} stroke="#b88a2a" strokeWidth="1" />
            <Marigold cx={x} cy={22} r={8.5} />
            <Marigold cx={x} cy={40} r={7} />
            {long && <Marigold cx={x} cy={57} r={7} />}
            {long ? (
              <>
                <Marigold cx={x} cy={74} r={6} />
                <circle cx={x} cy={89} r={3.5} fill="#c2185b" />
                <path d={`M${x - 3} 92 l3 9 l3 -9 z`} fill="#b88a2a" />
              </>
            ) : (
              <circle cx={x} cy={57} r={3} fill="#c2185b" />
            )}
            <MangoLeaf x={x + unit / 2 - 6} y={10} />
            <MangoLeaf x={x + unit / 2 + 6} y={10} flip />
          </g>
        );
      })}
    </svg>
  );
}

/* ───────── Mandala ───────── */

function ring(count: number, render: (deg: number, i: number) => React.ReactNode) {
  return Array.from({ length: count }, (_, i) => render((360 / count) * i, i));
}

function petal(inner: number, outer: number, width: number) {
  const mid = (inner + outer) / 2;
  return `M0 ${-inner} Q ${width} ${-mid} 0 ${-outer} Q ${-width} ${-mid} 0 ${-inner} Z`;
}

export function Mandala({ className, stroke = "#e2c27a" }: SvgProps & { stroke?: string }) {
  return (
    <svg className={className} viewBox="-200 -200 400 400" aria-hidden>
      <g fill="none" stroke={stroke} strokeWidth="1.1">
        <circle r="14" />
        <circle r="22" />
        {ring(12, (d) => (
          <path key={d} d={petal(22, 58, 13)} transform={`rotate(${d})`} />
        ))}
        {ring(12, (d) => (
          <path key={d} d={petal(30, 50, 5)} transform={`rotate(${d})`} />
        ))}
        <circle r="64" />
        {ring(36, (d) => (
          <circle key={d} cx="0" cy="-70" r="3.2" transform={`rotate(${d})`} />
        ))}
        <circle r="77" />
        {ring(16, (d) => (
          <path key={d} d={petal(77, 128, 22)} transform={`rotate(${d})`} />
        ))}
        {ring(16, (d) => (
          <path key={d} d={petal(86, 116, 8)} transform={`rotate(${d})`} />
        ))}
        {ring(16, (d) => (
          <path key={d} d={petal(108, 140, 12)} transform={`rotate(${d + 11.25})`} />
        ))}
        <circle r="146" />
        <circle r="152" strokeDasharray="2 5" />
        {ring(48, (d) => (
          <path
            key={d}
            d="M0 -156 q 6 10 0 20 q -6 -10 0 -20"
            transform={`rotate(${d})`}
          />
        ))}
        {ring(48, (d) => (
          <circle key={d} cx="0" cy="-184" r="2" transform={`rotate(${d + 3.75})`} />
        ))}
        <circle r="192" />
      </g>
    </svg>
  );
}

/* ───────── Small ornaments ───────── */

export function Diya({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden>
      <defs>
        <radialGradient id="diya-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0" stopColor="#ffd96b" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffd96b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="24" r="20" fill="url(#diya-glow)" />
      <g className="flame">
        <path d="M32 8 C 38 18 38 26 32 30 C 26 26 26 18 32 8 Z" fill="#f4a417" />
        <path d="M32 15 C 35 21 35 25 32 28 C 29 25 29 21 32 15 Z" fill="#fff1c4" />
      </g>
      <path d="M8 34 Q 32 30 56 34 Q 52 52 32 52 Q 12 52 8 34 Z" fill="#b5541b" />
      <path d="M8 34 Q 32 30 56 34 Q 32 40 8 34 Z" fill="#e46b0e" />
      <path d="M14 42 Q 32 47 50 42" fill="none" stroke="#f4c56a" strokeWidth="1.4" />
      <circle cx="22" cy="45" r="1.3" fill="#f4c56a" />
      <circle cx="32" cy="47" r="1.3" fill="#f4c56a" />
      <circle cx="42" cy="45" r="1.3" fill="#f4c56a" />
    </svg>
  );
}

/** Gold rule with a lotus in the middle, used between headings and text. */
export function Divider({ className, color = "#b88a2a" }: SvgProps & { color?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 24" aria-hidden>
      <g fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
        <path d="M4 12 H88" />
        <path d="M152 12 H236" />
        <path d="M92 12 l4 -4 l4 4 l-4 4 z" fill={color} />
        <path d="M140 12 l4 -4 l4 4 l-4 4 z" fill={color} />
        <path d="M120 3 C 126 9 126 15 120 21 C 114 15 114 9 120 3 Z" fill={color} fillOpacity=".25" />
        <path d="M120 21 C 112 19 106 14 104 8 C 111 9 117 13 120 21 Z" />
        <path d="M120 21 C 128 19 134 14 136 8 C 129 9 123 13 120 21 Z" />
      </g>
    </svg>
  );
}

/** Corner paisley (keri) used to frame cards. */
export function Paisley({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 60 60" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M14 46 C 2 36 6 12 28 8 C 48 5 56 24 44 34 C 36 41 26 36 30 28 C 33 22 41 25 39 30" />
        <path d="M18 42 C 10 34 13 18 28 15 C 42 13 48 25 40 31" strokeDasharray="1.5 3" />
        <circle cx="35" cy="28" r="2" fill="currentColor" />
        <path d="M14 46 Q 10 54 4 56" />
      </g>
    </svg>
  );
}

/** Rose & marigold petals drifting down. Positions are deterministic so SSR matches. */
export function Petals({ count = 14 }: { count?: number }) {
  const colors = ["#e46b0e", "#f4a417", "#c2185b", "#f4a417", "#e8456f"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const left = (i * 37 + 11) % 100;
        const size = 8 + ((i * 7) % 9);
        const dur = 11 + ((i * 5) % 9);
        const delay = -((i * 3.3) % dur);
        const drift = ((i % 2 ? 1 : -1) * (30 + ((i * 13) % 60))).toString() + "px";
        return (
          <svg
            key={i}
            className="petal"
            width={size}
            height={size}
            viewBox="0 0 10 10"
            style={
              {
                left: `${left}%`,
                "--dur": `${dur}s`,
                "--delay": `${delay}s`,
                "--drift": drift,
              } as React.CSSProperties
            }
          >
            <path d="M5 0 C 9 3 9 7 5 10 C 1 7 1 3 5 0 Z" fill={colors[i % colors.length]} opacity=".85" />
          </svg>
        );
      })}
    </div>
  );
}
