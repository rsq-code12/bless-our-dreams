import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { wedding } from "@/wedding.config";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { listContributions } from "@/lib/store";
import { rupees, rupeesShort, timeAgo } from "@/lib/format";
import type { Contribution, ContributionStatus } from "@/lib/types";
import { Diya, Divider } from "@/components/Ornaments";
import { LoginForm } from "./LoginForm";
import { logout, setStatus } from "./actions";

export const metadata: Metadata = {
  title: "Couple's dashboard",
  robots: { index: false, follow: false },
};

type Filter = "all" | ContributionStatus;

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <main className="bg-blockprint min-h-dvh px-4 py-8 sm:px-6">
      <Suspense fallback={<p className="pt-20 text-center text-muted">Opening dashboard…</p>}>
        <Gate searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Gate({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  if (!(await isAdmin())) return <Login />;
  const show = (await searchParams).show;
  const filter: Filter =
    show === "pending" || show === "confirmed" || show === "rejected" ? show : "all";
  return <Dashboard filter={filter} />;
}

function Login() {
  return (
    <div className="mx-auto mt-16 max-w-sm rounded-[28px] border border-gold/30 bg-paper p-8 text-center shadow-card">
      <Diya className="mx-auto h-14 w-14" />
      <h1 className="mt-2 font-display text-3xl font-semibold text-maroon">Couple&apos;s dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        For {wedding.bride} &amp; {wedding.groom} only.
      </p>
      {adminConfigured() ? (
        <LoginForm />
      ) : (
        <p className="mt-6 rounded-2xl bg-rani/10 p-4 text-left text-sm text-rani">
          The dashboard is locked until <code className="font-mono">ADMIN_PASSCODE</code> (6+ characters) is set in
          the server environment.
        </p>
      )}
    </div>
  );
}

const statusStyle: Record<ContributionStatus, string> = {
  pending: "bg-marigold/20 text-[#8a5300]",
  confirmed: "bg-leaf/15 text-leaf",
  rejected: "bg-rani/10 text-rani",
};
const statusLabel: Record<ContributionStatus, string> = {
  pending: "Awaiting check",
  confirmed: "Received",
  rejected: "Not received",
};
const sideLabel = { bride: `${wedding.bride}'s side`, groom: `${wedding.groom}'s side`, both: "Both sides" };

async function Dashboard({ filter }: { filter: Filter }) {
  const all = await listContributions();
  const sum = (xs: Contribution[]) => xs.reduce((s, c) => s + c.amount, 0);
  const by = (s: ContributionStatus) => all.filter((c) => c.status === s);
  const confirmed = by("confirmed");
  const pending = by("pending");
  const shown = filter === "all" ? all : by(filter);

  const tabs: { key: Filter; label: string; n: number }[] = [
    { key: "all", label: "All", n: all.length },
    { key: "pending", label: "To check", n: pending.length },
    { key: "confirmed", label: "Received", n: confirmed.length },
    { key: "rejected", label: "Not received", n: by("rejected").length },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-deva text-rani">शुभ विवाह</p>
          <h1 className="font-display text-4xl font-semibold text-maroon">Your blessings</h1>
          <p className="text-sm text-muted">
            Check each one against your UPI app or bank statement, then mark it received.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/export"
            className="rounded-full border border-maroon/30 bg-paper px-4 py-2 text-sm font-semibold text-maroon hover:border-maroon"
          >
            Download CSV
          </a>
          <form action={logout}>
            <button className="rounded-full px-4 py-2 text-sm font-medium text-muted hover:text-maroon">Sign out</button>
          </form>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Received" value={rupees(sum(confirmed))} accent="text-leaf" />
        <Tile label="Awaiting check" value={rupees(sum(pending))} accent="text-[#8a5300]" />
        <Tile label="Blessings" value={String(all.length - by("rejected").length)} />
        <Tile
          label="Families"
          value={String(new Set(all.filter((c) => c.status !== "rejected").map((c) => c.name.toLowerCase())).size)}
        />
      </section>

      <section className="mt-6 rounded-[24px] border border-gold/30 bg-paper p-5 shadow-card">
        <h2 className="font-display text-2xl font-semibold text-maroon">By dream</h2>
        <Divider className="mt-1 mb-3 h-4 w-36" />
        <ul className="space-y-3">
          {wedding.dreams.map((d) => {
            const mine = all.filter((c) => c.dreamId === d.id);
            const got = sum(mine.filter((c) => c.status === "confirmed"));
            const wait = sum(mine.filter((c) => c.status === "pending"));
            const pctGot = Math.min(100, (got / d.goal) * 100);
            const pctWait = Math.min(100 - pctGot, (wait / d.goal) * 100);
            return (
              <li key={d.id}>
                <div className="flex flex-col text-sm sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
                  <span className="font-semibold text-ink">{d.title}</span>
                  <span className="text-muted">
                    <strong className="text-leaf">{rupees(got)}</strong>
                    {wait > 0 && <span className="text-[#8a5300]"> + {rupees(wait)} to check</span>} /{" "}
                    {rupeesShort(d.goal)}
                  </span>
                </div>
                <div className="mt-1 flex h-2.5 overflow-hidden rounded-full bg-cream">
                  <div className="bg-leaf" style={{ width: `${pctGot}%` }} />
                  <div className="bg-marigold/70" style={{ width: `${pctWait}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <nav className="mt-8 flex gap-2 overflow-x-auto pb-1" aria-label="Filter">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key === "all" ? "/admin" : `/admin?show=${t.key}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
              filter === t.key ? "bg-maroon text-ivory" : "border border-gold/40 bg-paper text-maroon"
            }`}
          >
            {t.label} <span className="opacity-70">{t.n}</span>
          </Link>
        ))}
      </nav>

      {shown.length === 0 ? (
        <p className="mt-10 text-center text-muted">Nothing here yet.</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {shown.map((c) => (
            <ContributionRow key={c.id} c={c} />
          ))}
        </ul>
      )}

      <p className="mt-10 text-center text-xs text-muted">
        <Link href="/" className="underline">
          View the guest site
        </Link>
      </p>
    </div>
  );
}

function Tile({ label, value, accent = "text-maroon" }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-gold/30 bg-paper px-4 py-3 shadow-card">
      <div className={`font-display text-2xl font-semibold sm:text-3xl ${accent}`}>{value}</div>
      <div className="text-xs tracking-wider text-muted uppercase">{label}</div>
    </div>
  );
}

function ContributionRow({ c }: { c: Contribution }) {
  const dream = wedding.dreams.find((d) => d.id === c.dreamId);
  return (
    <li className="rounded-2xl border border-gold/25 bg-paper p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink">{c.name}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyle[c.status]}`}>
              {statusLabel[c.status]}
            </span>
            {!c.isPublic && (
              <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] text-muted">Private</span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {sideLabel[c.side]} · {dream?.title ?? c.dreamId} · {timeAgo(c.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-semibold text-maroon">{rupees(c.amount)}</div>
          <div className="font-mono text-[11px] text-muted">{c.utr ? `UTR ${c.utr}` : "No UTR given"}</div>
        </div>
      </div>
      {c.message && <p className="mt-2 rounded-xl bg-cream/60 px-3 py-2 text-sm text-ink">“{c.message}”</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {c.status !== "confirmed" && <StatusButton id={c.id} status="confirmed" label="✓ Received" tone="leaf" />}
        {c.status !== "rejected" && <StatusButton id={c.id} status="rejected" label="Not received" tone="rani" />}
        {c.status !== "pending" && <StatusButton id={c.id} status="pending" label="Undo" tone="muted" />}
      </div>
    </li>
  );
}

function StatusButton({
  id,
  status,
  label,
  tone,
}: {
  id: string;
  status: ContributionStatus;
  label: string;
  tone: "leaf" | "rani" | "muted";
}) {
  const cls = {
    leaf: "bg-leaf text-white hover:brightness-110",
    rani: "border border-rani/40 text-rani hover:bg-rani/5",
    muted: "border border-gold/40 text-muted hover:text-ink",
  }[tone];
  return (
    <form action={setStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${cls}`}>{label}</button>
    </form>
  );
}
