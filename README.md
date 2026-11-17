# Shaadi ka card + Bless Our Dreams

A digital Indian wedding invitation with a gentle gift portal behind it.

**The invitation (`/`)** opens like a real card: sealed palace doors with the guest's name, which
swing open by themselves. The invitation then plays like a story with no scrolling needed:
- kalash, bells and rangoli;
- the couple, with a pair of peacocks;
- "Dear Sharma Family", with the date and a countdown;
- the celebrations;
- the lake palace at dusk;
- RSVP on WhatsApp;
- "Your presence is our present".

Guests can swipe at any time, and the story picks up again when they stop.

**The gift portal (`/gift/`)** is where guests who want to can bless one of the couple's dreams.
Tap a dream, tap an amount, tap a UPI app, then tap "Send my blessing" (WhatsApp opens with the
details filled in). No typing needed.

**For the couple:**
- **`/send/`:** type a guest's name and send them a personal invitation on WhatsApp in one tap.
  Personal links look like `/?to=Sharma%20Family`.
- **`/qr/`:** a printable table card with a QR code that opens the gift portal directly, for the
  engagement or the wedding entrance.

Hosted free on **GitHub Pages**. No server, no database, no payment gateway, no fees.

## 1. Make it yours: `src/wedding.config.ts`

Names, parents' names, date, venue, the celebrations (with icons: `ring`, `haldi`, `mehendi`,
`sangeet`, `pheras`, `reception`), the opening line (e.g. `॥ श्री गणेशाय नमः ॥`, or `""` to hide it),
the dreams (title, story, goal, illustration), and:

- `upi.vpa`: the couple's UPI ID. **While it's empty the site is in demo mode**: a banner says
  payments are off and no payment buttons or QR code are shown.
- `whatsapp`: the couple's WhatsApp number with country code, digits only (e.g. `919876543210`).
  This switches on the RSVP scene and the "Send my blessing" message.

Illustrations available for a dream: `travel`, `home`, `aurora`, `cafe`, `blessing`.

### Music & mandap sounds

When a guest taps the doors open, they hear a shankh and temple bells, then an original shehnai
melody (Raag Bhupali) over a tanpura drone and soft tabla. Each scene adds its own touch:
- ghungroo as the names appear;
- a bell as the date's heart is drawn;
- a dhol beat for the celebrations;
- wind chimes at the venue;
- a coin clink for the shagun.

Everything is synthesised in the browser (`src/lib/sound.ts`), so there are no audio files and
no copyright issues. Guests can turn it off with the button in the top corner, and the choice
is remembered. Browsers only allow sound after a tap, so if the doors open by themselves, the
first tap anywhere starts the music.

To use your own song instead, put it in `public/music/` and set `music.src` in the config (only
use a track you're allowed to share publicly).

## 2. Record gifts: `src/gifts.ts`

When a shagun lands in the UPI app, open `src/gifts.ts` on GitHub, click the pencil icon, add a
line and press **Commit changes**:

```ts
{ date: "2026-12-10", name: "Mehta Family, Pune", side: "both", dream: "honeymoon-bali", amount: 3101, message: "Sada khush raho!" },
```

Add `showOnWall: false` for guests who asked to stay private (they still count in the totals).
The site rebuilds and goes live again in about two minutes (watch the **Actions** tab).

## Publishing

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes
it to `https://<user>.github.io/<repo>/`. GitHub Pages must be set to **Source: GitHub Actions**
(Settings → Pages).

Share links like `https://<user>.github.io/<repo>/#bless-honeymoon-bali` to open a
specific dream directly.

## Run it on your computer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## How payments work (and their limits)

The site never touches money. It builds a standard UPI payment link / QR
(`upi://pay?pa=…&am=…`) so the guest's own app pays the couple's UPI ID directly.

- **The site can't see whether a payment went through.** That's why gifts are added by the
  couple, after checking their UPI app, rather than automatically.
- **Some apps limit payment links to personal UPI IDs**, especially for larger amounts. The pay
  screen also shows the QR code and a copy-able UPI ID. A free merchant UPI ID (PhonePe Business,
  Paytm for Business, BharatPe, or a bank's merchant QR) is more reliable.

## Want automatic tracking and a private dashboard?

The `server-version` git tag has a fuller version (guests' blessings saved instantly, a
passcode-protected `/admin` dashboard to confirm payments, CSV export). It needs a host that
runs a server, such as Vercel with Upstash Redis, so it can't run on GitHub Pages.

## Project map

| Path | What it is |
| --- | --- |
| `src/wedding.config.ts` | All the content, UPI ID, WhatsApp number |
| `src/gifts.ts` | Gifts received (drives progress bars and the blessings wall) |
| `src/app/page.tsx`, `src/components/invite/` | The animated invitation (doors, scenes, illustrations) |
| `src/app/gift/page.tsx` | The gift portal |
| `src/app/send/`, `src/app/qr/` | Personal invite links, printable QR card |
| `src/components/ContributeSheet.tsx` | One-screen amount → UPI app → WhatsApp → thank-you flow |
| `src/components/DreamArt.tsx`, `Ornaments.tsx` | Hand-drawn SVG artwork |
| `src/lib/upi.ts` | UPI link builder |
| `.github/workflows/deploy.yml` | Build & publish to GitHub Pages |
