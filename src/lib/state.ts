import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { wedding } from "@/wedding.config";
import { listContributions } from "./store";
import type { Contribution, PublicState } from "./types";

export function countsTowardsProgress(c: Contribution) {
  if (c.status === "rejected") return false;
  if (c.status === "pending") return wedding.countUnconfirmedInProgress;
  return true;
}

/** Everything the public pages need, with private fields stripped. */
export const getPublicState = cache(async (): Promise<PublicState> => {
  await connection();
  const all = await listContributions();

  const progress: PublicState["progress"] = {};
  for (const d of wedding.dreams) progress[d.id] = { dreamId: d.id, raised: 0, count: 0 };

  let totalRaised = 0;
  const guests = new Set<string>();
  for (const c of all) {
    if (!countsTowardsProgress(c) || !progress[c.dreamId]) continue;
    progress[c.dreamId].raised += c.amount;
    progress[c.dreamId].count += 1;
    totalRaised += c.amount;
    guests.add(c.name.trim().toLowerCase());
  }

  const blessings = all
    .filter((c) => c.isPublic && c.status !== "rejected")
    .slice(0, 60)
    .map((c) => ({
      id: c.id,
      dreamId: c.dreamId,
      name: c.name,
      side: c.side,
      message: c.message,
      amount: wedding.showAmountsPublicly ? c.amount : null,
      createdAt: c.createdAt,
    }));

  return { progress, totalRaised, totalGuests: guests.size, blessings, generatedAt: Date.now() };
});
