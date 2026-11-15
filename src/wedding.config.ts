/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE to personalise the portal for the couple.
 *  Everything a guest sees (names, dates, dreams, UPI ID)
 *  comes from here. No other file needs to change.
 * ─────────────────────────────────────────────────────────────
 */

export type DreamArt = "travel" | "home" | "aurora" | "cafe" | "car" | "blessing";

export type Dream = {
  /** Short, URL-safe id. Never change it once guests have contributed. */
  id: string;
  title: string;
  /** Optional Hindi (or any language) subtitle shown above the title. */
  localTitle?: string;
  tagline: string;
  /** A few lines in the couple's own words. */
  story: string;
  /** Goal in rupees. */
  goal: number;
  art: DreamArt;
};

export const wedding = {
  bride: "Ananya",
  groom: "Rohan",
  /** Shown at the very top, like the first line of a wedding card. */
  invocation: "॥ शुभ विवाह ॥",
  hashtag: "#AnRoKiShaadi",
  /** Main ceremony date & time, in IST. */
  weddingDate: "2026-12-12T19:30:00+05:30",
  city: "Udaipur, Rajasthan",

  /** The celebrations, shown as a small timeline. */
  events: [
    { name: "Engagement", local: "सगाई", date: "2026-12-09", place: "The Leela Palace" },
    { name: "Haldi & Mehendi", local: "हल्दी · मेहंदी", date: "2026-12-10", place: "Poolside Lawns" },
    { name: "Sangeet", local: "संगीत", date: "2026-12-11", place: "Durbar Hall" },
    { name: "Pheras", local: "फेरे", date: "2026-12-12", place: "Lakeside Mandap" },
  ],

  /** A short note from the couple to their guests. */
  letter: [
    "Your blessings, your laughter and your presence at our wedding are the greatest gifts we could ask for.",
    "If you'd still like to give us something, we'd love it if, instead of a boxed gift, you helped us build one of the dreams we've been talking about for years. Every rupee goes straight to us through UPI.",
  ],

  /**
   * Where guests' money goes. Use the couple's UPI ID.
   * A merchant/business UPI ID (PhonePe Business, Paytm for Business,
   * BharatPe, a bank's merchant QR) is more reliable than a personal one,
   * because some apps block large "pay" links to personal IDs.
   */
  upi: {
    /**
     * Leave empty to run in DEMO MODE: guests can try the whole flow,
     * but no payment link or QR is shown, so no money can move.
     * Example: "ananya.sharma@okaxis"
     */
    vpa: "",
    payeeName: "Ananya Sharma",
  },

  /** Hide individual amounts on the public blessings wall (totals still show). */
  showAmountsPublicly: false,
  /**
   * Count contributions that guests say they've paid but the couple hasn't
   * confirmed yet towards the progress bars. Rejected ones never count.
   */
  countUnconfirmedInProgress: true,

  /** Quick-pick amounts. Shagun traditionally ends in 1. */
  shagunAmounts: [501, 1100, 2100, 5100, 11000, 21000],

  dreams: [
    {
      id: "honeymoon-bali",
      title: "Honeymoon in Bali",
      localTitle: "हनीमून",
      tagline: "Rice terraces, temples and a villa by the sea",
      story:
        "We've had a Bali board on Pinterest since our second date. Ten days of sunrises at Ubud, scuba in Amed and absolutely no laptops.",
      goal: 300000,
      art: "travel",
    },
    {
      id: "first-home",
      title: "Our First Home",
      localTitle: "अपना घर",
      tagline: "The down payment on a little place of our own",
      story:
        "A balcony full of plants, a kitchen big enough for both of us, and a guest room that's always ready for you.",
      goal: 1000000,
      art: "home",
    },
    {
      id: "northern-lights",
      title: "Northern Lights, Norway",
      localTitle: "पहली सालगिरह",
      tagline: "Our first anniversary under the aurora",
      story:
        "Ananya has wanted to see the Northern Lights since she was eight. We'd like to stand under them together on our first anniversary.",
      goal: 400000,
      art: "aurora",
    },
    {
      id: "chai-cafe",
      title: "Our Little Chai Café",
      localTitle: "सपनों की दुकान",
      tagline: "Seed money for the café we keep sketching on napkins",
      story:
        "Kulhad chai, books on every wall and Rohan's mother's samosa recipe. One day. With your help, sooner.",
      goal: 500000,
      art: "cafe",
    },
    {
      id: "where-needed",
      title: "Wherever It's Needed",
      localTitle: "आशीर्वाद",
      tagline: "Let the couple decide",
      story:
        "Can't choose? Your shagun goes into a common pot and we'll put it towards whichever dream is closest to coming true.",
      goal: 200000,
      art: "blessing",
    },
  ] satisfies Dream[],
};

export type WeddingConfig = typeof wedding;

/** True until the couple's real UPI ID is filled in above. */
export const isDemo = !wedding.upi.vpa.trim();
