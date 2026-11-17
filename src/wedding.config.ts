/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE to personalise the portal for the couple.
 *  Everything a guest sees (names, dates, dreams, UPI ID)
 *  comes from here. No other file needs to change.
 * ─────────────────────────────────────────────────────────────
 */

export type EventIcon = "ring" | "haldi" | "mehendi" | "sangeet" | "pheras" | "reception";

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
  /** First line of the invitation, like the top of a printed card. Set to "" to hide. */
  openingLine: "॥ श्री गणेशाय नमः ॥",
  /** The big greeting on the opening scene and the gift page. */
  invocation: "॥ शुभ विवाह ॥",
  hashtag: "#AnRoKiShaadi",
  /** Main ceremony date & time, in IST. */
  weddingDate: "2026-12-12T19:30:00+05:30",
  city: "Udaipur, Rajasthan",

  /** Shown under each name on the invitation. Leave "" to hide. */
  brideFamily: "Daughter of Mrs. Meera & Mr. Rakesh Sharma",
  groomFamily: "Son of Mrs. Kavita & Mr. Anil Verma",

  /** Main venue, shown on the invitation with a "Get directions" button. */
  venue: {
    name: "The Leela Palace",
    address: "Lake Pichola, Udaipur, Rajasthan",
    /** Any Google Maps link. Leave "" to search for the name + address. */
    mapsUrl: "",
  },

  /** The celebrations, in order. `icon`: ring | haldi | mehendi | sangeet | pheras | reception */
  events: [
    { name: "Engagement", local: "सगाई", date: "2026-12-09", time: "7:00 PM", place: "The Leela Palace", icon: "ring" },
    { name: "Haldi & Mehendi", local: "हल्दी · मेहंदी", date: "2026-12-10", time: "11:00 AM", place: "Poolside Lawns", icon: "mehendi" },
    { name: "Sangeet", local: "संगीत", date: "2026-12-11", time: "8:00 PM", place: "Durbar Hall", icon: "sangeet" },
    { name: "Pheras", local: "फेरे", date: "2026-12-12", time: "7:30 PM", place: "Lakeside Mandap", icon: "pheras" },
  ] satisfies { name: string; local: string; date: string; time: string; place: string; icon: EventIcon }[],

  /** The love story, told Wrapped-style in the invitation. All sample text: make it yours. */
  story: {
    /** The day you met (counts "days together" on the invitation). */
    metOn: "2019-11-23",
    /** Fun numbers. Keep them short. */
    stats: [
      { value: 412, label: "cutting chai dates" },
      { value: 9, label: "cities explored" },
      { value: 1, label: "very nervous proposal" },
    ],
    /** A quick quiz for guests. `answer` is the index of the right option (0, 1 or 2). */
    quiz: {
      question: "Where did we first meet?",
      options: ["A college fest", "A friend's sangeet", "On a dating app"],
      answer: 1,
      reveal: "At Priya's sangeet, fighting over the last gulab jamun 🍯",
    },
    /** Your top 5 moments, like a "top songs" list. */
    moments: [
      "First cutting chai at Marine Drive",
      "The Goa trip that almost went wrong",
      "Meeting the parents (we survived)",
      "A proposal in the Mumbai rain",
      "Saying yes to forever",
    ],
  },

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

  /**
   * The couple's WhatsApp number with country code, digits only (e.g. "919876543210").
   * After paying, guests tap "I've paid" and WhatsApp opens with their name, amount,
   * dream and blessing already typed out, ready to send to this number.
   * Leave empty to skip the WhatsApp step.
   */
  whatsapp: "",

  /**
   * Background music, which starts when a guest taps to open the doors.
   * Leave `src` empty for the built-in shehnai, tanpura and tabla (composed for
   * this site, so there are no copyright worries). To use your own song instead,
   * put the file in /public/music/ and set e.g. src: "/music/our-song.mp3".
   * Only use a track you're allowed to share publicly.
   */
  music: { src: "" },

  /** Hide individual amounts on the public blessings wall (totals still show). */
  showAmountsPublicly: false,

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
