"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-3">
      <label className="block text-left">
        <span className="text-sm font-medium text-ink">Couple&apos;s passcode</span>
        <input
          name="passcode"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-2xl border border-gold/40 bg-paper px-4 py-3 text-ink outline-none focus:border-maroon focus:ring-4 focus:ring-marigold/25"
        />
      </label>
      {state.error && (
        <p role="alert" className="rounded-xl bg-rani/10 px-3 py-2 text-sm text-rani">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="w-full rounded-full bg-maroon px-5 py-3.5 font-semibold text-ivory transition hover:bg-maroon-deep disabled:opacity-50"
      >
        {pending ? "Checking…" : "Open dashboard"}
      </button>
    </form>
  );
}
