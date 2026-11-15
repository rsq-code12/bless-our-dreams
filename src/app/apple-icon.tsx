import { ImageResponse } from "next/og";
import { IconArt, initials, loadGoogleFont } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await loadGoogleFont("Cormorant Garamond:wght@600", initials);
  return new ImageResponse(<IconArt size={180} font={font ? "Cormorant" : undefined} />, {
    ...size,
    fonts: font ? [{ name: "Cormorant", data: font, weight: 600 }] : undefined,
  });
}
