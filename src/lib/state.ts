import { wedding } from "@/wedding.config";
import { gifts } from "@/gifts";
import type { PublicState } from "./types";

/** Progress, totals and the blessings wall, worked out from src/gifts.ts at build time. */
export function getPublicState(): PublicState {
  const progress: PublicState["progress"] = {};
  for (const d of wedding.dreams) progress[d.id] = { dreamId: d.id, raised: 0, count: 0 };

  let totalRaised = 0;
  const guests = new Set<string>();
  const valid = gifts.filter((g) => progress[g.dream] && Number.isFinite(g.amount) && g.amount > 0);

  for (const g of valid) {
    progress[g.dream].raised += g.amount;
    progress[g.dream].count += 1;
    totalRaised += g.amount;
    guests.add(g.name.trim().toLowerCase());
  }

  const blessings = valid
    .map((g, i) => ({ g, i }))
    .filter(({ g }) => g.showOnWall !== false)
    .sort((a, b) => b.g.date.localeCompare(a.g.date) || b.i - a.i)
    .slice(0, 60)
    .map(({ g, i }) => ({
      id: `${g.date}-${i}`,
      dreamId: g.dream,
      name: g.name,
      side: g.side ?? "both",
      message: g.message ?? "",
      amount: wedding.showAmountsPublicly ? g.amount : null,
      date: g.date,
    }));

  return { progress, totalRaised, totalGuests: guests.size, blessings };
}
