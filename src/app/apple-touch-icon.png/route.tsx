import { ImageResponse } from "next/og";
import { IconArt, initials, loadGoogleFont } from "@/lib/brand";

export const dynamic = "force-static";

const size = { width: 180, height: 180 };

export async function GET() {
  const font = await loadGoogleFont("Cormorant Garamond:wght@600", initials);
  return new ImageResponse(<IconArt size={180} font={font ? "Cormorant" : undefined} />, {
    ...size,
    fonts: font ? [{ name: "Cormorant", data: font, weight: 600 }] : undefined,
  });
}
