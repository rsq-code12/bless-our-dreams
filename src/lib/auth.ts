import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal passcode login for the couple's dashboard.
 * Set ADMIN_PASSCODE in the environment; the cookie holds an HMAC of it,
 * so changing the passcode signs everyone out.
 */

export const ADMIN_COOKIE = "shagun_admin";

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSCODE && process.env.ADMIN_PASSCODE.length >= 6);
}

function token(passcode: string) {
  return createHmac("sha256", passcode).update("shagun-admin-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPasscode(input: string) {
  const real = process.env.ADMIN_PASSCODE;
  return Boolean(real) && safeEqual(token(input), token(real!));
}

export function sessionToken() {
  return token(process.env.ADMIN_PASSCODE!);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(value) && safeEqual(value!, sessionToken());
}
