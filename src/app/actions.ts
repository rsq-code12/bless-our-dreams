"use server";

import { randomUUID } from "node:crypto";
import { wedding } from "@/wedding.config";
import { saveContribution } from "@/lib/store";
import { cleanUtr } from "@/lib/upi";
import type { GuestSide } from "@/lib/types";

export type BlessingInput = {
  dreamId: string;
  amount: number;
  name: string;
  side: GuestSide;
  message: string;
  utr: string;
  isPublic: boolean;
};

export type BlessingResult = { ok: true; id: string } | { ok: false; error: string };

const MAX_AMOUNT = 10_00_000; // UPI's usual per-transaction ceiling for P2P

export async function recordBlessing(input: BlessingInput): Promise<BlessingResult> {
  const dream = wedding.dreams.find((d) => d.id === input.dreamId);
  if (!dream) return { ok: false, error: "That dream doesn't exist any more. Please refresh the page." };

  const amount = Math.round(Number(input.amount));
  if (!Number.isFinite(amount) || amount < 1 || amount > MAX_AMOUNT) {
    return { ok: false, error: "Please enter an amount between ₹1 and ₹10,00,000." };
  }

  const name = String(input.name ?? "").trim().replace(/\s+/g, " ").slice(0, 60);
  if (name.length < 2) return { ok: false, error: "Please tell the couple who this blessing is from." };

  const side: GuestSide = ["bride", "groom", "both"].includes(input.side) ? input.side : "both";
  const message = String(input.message ?? "").trim().slice(0, 300);

  try {
    const id = randomUUID();
    await saveContribution({
      id,
      dreamId: dream.id,
      amount,
      name,
      side,
      message,
      utr: cleanUtr(String(input.utr ?? "")),
      isPublic: Boolean(input.isPublic),
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    return { ok: true, id };
  } catch (err) {
    console.error("recordBlessing failed", err);
    return { ok: false, error: "We couldn't save your blessing just now. Please try again in a moment." };
  }
}
