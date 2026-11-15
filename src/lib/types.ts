export type GuestSide = "bride" | "groom" | "both";

/** One shagun the couple has received, as listed in src/gifts.ts. */
export type Gift = {
  /** "YYYY-MM-DD" */
  date: string;
  name: string;
  side?: GuestSide;
  /** The dream's `id` from wedding.config.ts */
  dream: string;
  amount: number;
  message?: string;
  /** Show the name and message on the public blessings wall. Defaults to true. */
  showOnWall?: boolean;
};

/** What the public site shows about one gift. */
export type PublicBlessing = {
  id: string;
  dreamId: string;
  name: string;
  side: GuestSide;
  message: string;
  amount: number | null;
  date: string;
};

export type DreamProgress = {
  dreamId: string;
  raised: number;
  count: number;
};

export type PublicState = {
  progress: Record<string, DreamProgress>;
  totalRaised: number;
  totalGuests: number;
  blessings: PublicBlessing[];
};
