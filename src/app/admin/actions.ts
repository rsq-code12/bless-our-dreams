"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { ADMIN_COOKIE, adminConfigured, checkPasscode, isAdmin, sessionToken } from "@/lib/auth";
import { getContribution, saveContribution } from "@/lib/store";
import type { ContributionStatus } from "@/lib/types";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "Set ADMIN_PASSCODE (6+ characters) on the server first." };
  const passcode = String(form.get("passcode") ?? "");
  if (!checkPasscode(passcode)) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 800));
    return { error: "That passcode isn't right." };
  }
  (await cookies()).set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  refresh();
  return {};
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  refresh();
}

const STATUSES: ContributionStatus[] = ["pending", "confirmed", "rejected"];

export async function setStatus(form: FormData) {
  if (!(await isAdmin())) throw new Error("Not signed in");
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "") as ContributionStatus;
  if (!STATUSES.includes(status)) throw new Error("Bad status");
  const c = await getContribution(id);
  if (!c) throw new Error("Contribution not found");
  await saveContribution({ ...c, status });
  refresh();
}
