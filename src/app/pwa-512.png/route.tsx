import { ImageResponse } from "next/og";
import { IconArt, initials, loadGoogleFont } from "@/lib/brand";

export async function GET() {
  const font = await loadGoogleFont("Cormorant Garamond:wght@600", initials);
  return new ImageResponse(<IconArt size={512} font={font ? "Cormorant" : undefined} />, {
    width: 512,
    height: 512,
    fonts: font ? [{ name: "Cormorant", data: font, weight: 600 }] : undefined,
  });
}
