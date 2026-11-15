import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Great_Vibes, Tiro_Devanagari_Hindi } from "next/font/google";
import { wedding } from "@/wedding.config";
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

const couple = `${wedding.bride} & ${wedding.groom}`;

export const metadata: Metadata = {
  // On Vercel this is filled in automatically; elsewhere set SITE_URL so WhatsApp previews work.
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title: `${couple} · Bless Our Dreams`,
  description: `Instead of gifts, help ${couple} build the dreams they'll share. Contribute your shagun by UPI.`,
  applicationName: "Bless Our Dreams",
  appleWebApp: { capable: true, title: couple, statusBarStyle: "black-translucent" },
  openGraph: {
    title: `${couple} are getting married!`,
    description: "Skip the boxed gift. Bless one of our dreams instead.",
    type: "website",
  },
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
      className={`${display.variable} ${script.variable} ${deva.variable} ${sans.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
