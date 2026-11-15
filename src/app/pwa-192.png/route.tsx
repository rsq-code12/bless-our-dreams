import { ImageResponse } from "next/og";
import { IconArt, initials, loadGoogleFont } from "@/lib/brand";

export const dynamic = "force-static";

export async function GET() {
  const font = await loadGoogleFont("Cormorant Garamond:wght@600", initials);
  return new ImageResponse(<IconArt size={192} font={font ? "Cormorant" : undefined} />, {
    width: 192,
    height: 192,
    fonts: font ? [{ name: "Cormorant", data: font, weight: 600 }] : undefined,
  });
}
