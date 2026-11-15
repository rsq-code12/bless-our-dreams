import { wedding } from "@/wedding.config";

/** Shared artwork for app icons and the WhatsApp/social preview image (rendered by next/og). */

export const initials = `${wedding.bride[0]}${wedding.groom[0]}`;

function petalRing(size: number, count: number, r: number, len: number, w: number, color: string) {
  const c = size / 2;
  return Array.from({ length: count }, (_, i) => {
    const a = (360 / count) * i;
    return (
      <path
        key={`${r}-${i}`}
        d={`M${c} ${c - r} Q ${c + w} ${c - r - len / 2} ${c} ${c - r - len} Q ${c - w} ${c - r - len / 2} ${c} ${c - r} Z`}
        fill={color}
        transform={`rotate(${a} ${c} ${c})`}
      />
    );
  });
}

/** Square app icon: maroon tile, marigold mandala, gold monogram. */
export function IconArt({ size, font }: { size: number; font?: string }) {
  const s = size;
  return (
    <div
      style={{
        width: s,
        height: s,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 40%, #8a1a30 0%, #4a0a14 70%)",
        position: "relative",
      }}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ position: "absolute", top: 0, left: 0 }}>
        {petalRing(s, 16, s * 0.3, s * 0.13, s * 0.045, "#e46b0e")}
        {petalRing(s, 16, s * 0.27, s * 0.1, s * 0.035, "#f4a417")}
        <circle cx={s / 2} cy={s / 2} r={s * 0.265} fill="#4a0a14" stroke="#e2c27a" strokeWidth={s * 0.012} />
      </svg>
      <div
        style={{
          display: "flex",
          color: "#f2d48a",
          fontSize: s * 0.26,
          fontFamily: font ?? "serif",
          letterSpacing: -s * 0.005,
          marginTop: font ? -s * 0.02 : 0,
        }}
      >
        {initials}
      </div>
    </div>
  );
}

/** Fetch a Google font as TTF for next/og (it can't read woff2). Returns null if offline. */
export async function loadGoogleFont(family: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}
