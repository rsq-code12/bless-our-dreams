"use client";

import { useSyncExternalStore } from "react";

export type Device = { mobile: boolean; ios: boolean; ready: boolean };

const SERVER: Device = { mobile: false, ios: false, ready: false };
let cached: Device | null = null;

function read(): Device {
  if (cached) return cached;
  const ua = navigator.userAgent;
  const android = /Android/i.test(ua);
  const ios =
    !android &&
    (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
  const mobile = ios || android || /Mobile/i.test(ua);
  cached = { mobile, ios, ready: true };
  return cached;
}

/** Which kind of phone the guest is on, so we can offer the right UPI buttons. */
export function useDevice(): Device {
  return useSyncExternalStore(
    () => () => {},
    read,
    () => SERVER,
  );
}
