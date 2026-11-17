import type { Metadata } from "next";
import { QrCard } from "./QrCard";

export const metadata: Metadata = {
  title: "Shagun QR card",
  robots: { index: false, follow: false },
};

/** A printable table card whose QR code opens the gift page directly. */
export default function QrPage() {
  return <QrCard />;
}
