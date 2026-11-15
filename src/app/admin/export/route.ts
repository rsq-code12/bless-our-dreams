import { wedding } from "@/wedding.config";
import { isAdmin } from "@/lib/auth";
import { listContributions } from "@/lib/store";

/** CSV of every blessing, for thank-you notes and matching against the bank statement. */
export async function GET() {
  if (!(await isAdmin())) return new Response("Not signed in", { status: 401 });

  const rows = await listContributions();
  const esc = (v: string | number | boolean) => {
    const s = String(v);
    // Quote, and neutralise spreadsheet formulas in guest-typed text.
    return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
  };
  const header = ["Date (IST)", "Name", "Side", "Dream", "Amount (INR)", "Status", "UTR", "Message", "Public"];
  const lines = rows.map((c) =>
    [
      new Date(c.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      c.name,
      c.side,
      wedding.dreams.find((d) => d.id === c.dreamId)?.title ?? c.dreamId,
      c.amount,
      c.status,
      c.utr,
      c.message,
      c.isPublic ? "yes" : "no",
    ]
      .map(esc)
      .join(","),
  );
  const csv = "﻿" + [header.map(esc).join(","), ...lines].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="blessings-${wedding.bride}-${wedding.groom}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
