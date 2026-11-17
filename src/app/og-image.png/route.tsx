import { ImageResponse } from "next/og";
import { wedding } from "@/wedding.config";
import { formatDate } from "@/lib/format";
import { loadGoogleFont } from "@/lib/brand";

/** The preview card WhatsApp, Instagram and iMessage show when the link is shared. */

export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

export async function GET() {
  const names = `${wedding.bride} & ${wedding.groom}`;
  const date = formatDate(wedding.weddingDate, { day: "numeric", month: "long", year: "numeric" });
  const line1 = "You're invited";
  const line2 = "to celebrate our wedding";

  // The image renderer can't shape Devanagari conjuncts, so the card uses the romanised greeting.
  const greeting = "Shubh Vivah";
  const [script, serif] = await Promise.all([
    loadGoogleFont("Great Vibes", names),
    loadGoogleFont("Cormorant Garamond:ital,wght@1,600", `${line1}${line2}${date} · ${wedding.city}${greeting}`),
  ]);

  const fonts = [
    script && { name: "Script", data: script, weight: 400 as const },
    serif && { name: "Serif", data: serif, weight: 600 as const, style: "italic" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 600; style?: "italic" }[];

  const strands = Array.from({ length: 21 }, (_, i) => i);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at 50% 0%, #8a1a3e 0%, #4a0a14 60%, #2e0710 100%)",
          color: "#f2d48a",
          position: "relative",
        }}
      >
        {/* marigold toran */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-around" }}>
          {strands.map((i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {Array.from({ length: i % 2 ? 3 : 5 }, (_, j) => (
                <div
                  key={j}
                  style={{
                    width: 26 - j * 2,
                    height: 26 - j * 2,
                    borderRadius: 999,
                    background: j % 2 ? "#f4a417" : "#e46b0e",
                    marginTop: -3,
                  }}
                />
              ))}
              <div style={{ width: 10, height: 10, borderRadius: 999, background: "#c2185b", marginTop: 2 }} />
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: serif ? "Serif" : "serif",
            fontStyle: "italic",
            fontSize: 34,
            color: "#e2c27a",
            marginTop: 70,
          }}
        >
          <div style={{ display: "flex", width: 60, height: 1, background: "#b88a2a", marginRight: 18 }} />
          {greeting}
          <div style={{ display: "flex", width: 60, height: 1, background: "#b88a2a", marginLeft: 18 }} />
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: script ? "Script" : "serif",
            fontSize: 138,
            lineHeight: 1.1,
            color: "#f2d48a",
            marginTop: 6,
          }}
        >
          {names}
        </div>
        <div style={{ display: "flex", width: 360, height: 2, background: "#b88a2a", margin: "8px 0 22px" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: serif ? "Serif" : "serif",
            fontStyle: "italic",
            fontSize: 44,
            color: "#fff8ee",
          }}
        >
          <span>{line1}</span>
          <span style={{ color: "#f4a417" }}>{line2}</span>
        </div>
        <div style={{ display: "flex", fontFamily: serif ? "Serif" : "serif", fontSize: 28, color: "#e2c27a", marginTop: 24 }}>
          {date} · {wedding.city}
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
