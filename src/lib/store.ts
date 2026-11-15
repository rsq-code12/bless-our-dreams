import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Contribution } from "./types";

/**
 * Contribution storage.
 *
 *  - Production (e.g. Vercel): set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *    (or the KV_REST_API_URL + KV_REST_API_TOKEN pair the Vercel Marketplace
 *    adds for Upstash). Contributions live in one Redis hash.
 *  - Local development: falls back to data/contributions.json.
 */

const HASH_KEY = "shagun:contributions";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const useRedis = Boolean(redisUrl && redisToken);

async function redis<T>(command: (string | number)[]): Promise<T> {
  const res = await fetch(redisUrl!, {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis ${command[0]} failed: ${res.status}`);
  const json = (await res.json()) as { result: T; error?: string };
  if (json.error) throw new Error(json.error);
  return json.result;
}

const filePath = path.join(process.cwd(), "data", "contributions.json");

async function readFile(): Promise<Contribution[]> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as Contribution[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeFile(all: Contribution[]) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(all, null, 2));
  await fs.rename(tmp, filePath);
}

/** Serialise file writes so two guests submitting at once don't clobber each other. */
let fileLock: Promise<unknown> = Promise.resolve();
function withFileLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = fileLock.then(fn, fn);
  fileLock = run.catch(() => undefined);
  return run;
}

export async function listContributions(): Promise<Contribution[]> {
  let all: Contribution[];
  if (useRedis) {
    // HGETALL over REST returns a flat [field, value, field, value, ...] array.
    const flat = (await redis<string[] | null>(["HGETALL", HASH_KEY])) ?? [];
    all = [];
    for (let i = 1; i < flat.length; i += 2) all.push(JSON.parse(flat[i]) as Contribution);
  } else {
    all = await readFile();
  }
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveContribution(c: Contribution): Promise<void> {
  if (useRedis) {
    await redis(["HSET", HASH_KEY, c.id, JSON.stringify(c)]);
    return;
  }
  if (process.env.VERCEL) {
    throw new Error(
      "No database configured. Add Upstash Redis from the Vercel Marketplace so contributions can be saved.",
    );
  }
  await withFileLock(async () => {
    const all = await readFile();
    const i = all.findIndex((x) => x.id === c.id);
    if (i >= 0) all[i] = c;
    else all.push(c);
    await writeFile(all);
  });
}

export async function getContribution(id: string): Promise<Contribution | undefined> {
  if (useRedis) {
    const raw = await redis<string | null>(["HGET", HASH_KEY, id]);
    return raw ? (JSON.parse(raw) as Contribution) : undefined;
  }
  return (await readFile()).find((c) => c.id === id);
}
