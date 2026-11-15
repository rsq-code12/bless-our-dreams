import type { MetadataRoute } from "next";
import { wedding } from "@/wedding.config";

/** Lets guests "Add to Home Screen" so the portal opens like an app. */
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const couple = `${wedding.bride} & ${wedding.groom}`;
  return {
    name: `${couple} · Bless Our Dreams`,
    short_name: couple,
    description: `Bless ${couple}'s dreams with your shagun, paid by UPI.`,
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff8ee",
    theme_color: "#5a0c18",
    lang: "en-IN",
    categories: ["lifestyle", "social"],
    icons: [
      { src: `${base}/pwa-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${base}/pwa-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${base}/pwa-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
