export type ContributionStatus = "pending" | "confirmed" | "rejected";

export type GuestSide = "bride" | "groom" | "both";

export type Contribution = {
  id: string;
  dreamId: string;
  name: string;
  side: GuestSide;
  amount: number;
  message: string;
  /** UPI transaction / reference number the guest typed, if any. */
  utr: string;
  /** Show this guest's name and message on the public wall. */
  isPublic: boolean;
  status: ContributionStatus;
  createdAt: string;
};

/** What the public site is allowed to see about one contribution. */
export type PublicBlessing = {
  id: string;
  dreamId: string;
  name: string;
  side: GuestSide;
  message: string;
  amount: number | null;
  createdAt: string;
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
  /** Server time when this snapshot was taken (for "2 min ago" labels). */
  generatedAt: number;
};
