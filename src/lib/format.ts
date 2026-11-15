const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** ₹1,25,000 (Indian digit grouping). */
export function rupees(n: number) {
  return `₹${inr.format(Math.round(n))}`;
}

/** ₹3 L, ₹10 L, ₹1.2 Cr, ₹75K for compact labels. */
export function rupeesShort(n: number) {
  if (n >= 1_00_00_000) return `₹${trim(n / 1_00_00_000)} Cr`;
  if (n >= 1_00_000) return `₹${trim(n / 1_00_000)} L`;
  if (n >= 1_000) return `₹${trim(n / 1_000)}K`;
  return `₹${n}`;
}

function trim(x: number) {
  return x.toFixed(x < 10 ? 1 : 0).replace(/\.0$/, "");
}

export function timeAgo(iso: string, now = Date.now()) {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} day${d > 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", ...opts });
}
