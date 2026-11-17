import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Cormorant_Garamond, DM_Sans, Great_Vibes, Tiro_Devanagari_Hindi } from "next/font/google";
import { wedding } from "@/wedding.config";
import { SoundToggle } from "@/components/SoundToggle";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--nf-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const script = Great_Vibes({ variable: "--nf-script", subsets: ["latin"], weight: "400" });

const deva = Tiro_Devanagari_Hindi({
  variable: "--nf-deva",
  subsets: ["devanagari", "latin"],
  weight: "400",
});

const sans = DM_Sans({ variable: "--nf-sans", subsets: ["latin"] });

const wrap = Bricolage_Grotesque({ variable: "--nf-wrap", subsets: ["latin"], weight: ["500", "700", "800"] });

const couple = `${wedding.bride} & ${wedding.groom}`;
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Absolute address of the share image (set by the deploy workflow), so WhatsApp can fetch it. */
const ogImage = process.env.SITE_URL ? `${process.env.SITE_URL.replace(/\/$/, "")}/og-image.png` : `${base}/og-image.png`;

export const metadata: Metadata = {
  title: `${couple} · Wedding Invitation`,
  description: `You're invited to celebrate the wedding of ${couple}. Tap to open your invitation.`,
  applicationName: "Bless Our Dreams",
  appleWebApp: { capable: true, title: couple, statusBarStyle: "black-translucent" },
  icons: {
    icon: { url: `${base}/icon.svg`, type: "image/svg+xml" },
    apple: { url: `${base}/apple-touch-icon.png`, sizes: "180x180" },
  },
  openGraph: {
    title: `You're invited: ${couple} are getting married!`,
    description: "Tap to open your invitation 💌",
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: `${couple}: bless our dreams` }],
  },
  twitter: { card: "summary_large_image", images: [ogImage] },
};

export const viewport: Viewport = {
  themeColor: "#5a0c18",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${display.variable} ${script.variable} ${deva.variable} ${sans.variable} ${wrap.variable} antialiased`}
    >
      <body className="min-h-dvh">
        {children}
        <SoundToggle />
      </body>
    </html>
  );
}
