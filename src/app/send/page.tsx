import type { Metadata } from "next";
import { SendInvites } from "./SendInvites";

export const metadata: Metadata = {
  title: "Send invitations",
  robots: { index: false, follow: false },
};

/** For the couple: make a personal invitation link for each guest and send it on WhatsApp. */
export default function SendPage() {
  return <SendInvites />;
}
