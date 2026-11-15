# Bless Our Dreams: a wedding shagun portal

Guests open one link, pick one of the couple's dreams (honeymoon, first home, a café…),
choose a shagun amount and pay **directly to the couple by UPI**. Then they send the couple a
ready-made WhatsApp message with their name, amount and blessing. When the money arrives, the
couple adds one line to a file on GitHub, and the dream's progress bar and the blessings wall
update on their own.

Hosted free on **GitHub Pages**. No server, no database, no payment gateway, no fees.

- Indian-wedding design: marigold toran, mandala, jharokha arches, Devanagari touches
- Works like an app on phones ("Add to Home Screen"), with a WhatsApp-ready preview card
- UPI on phones: Google Pay, PhonePe, Paytm or any UPI app. On laptops: a scannable QR
- Shagun amounts that end in 1, plus a "+₹1 for shagun?" nudge
- Individual amounts are never shown publicly (configurable)

## 1. Make it yours: `src/wedding.config.ts`

Names, date, city, the celebrations, the letter to guests, the dreams (title, story, goal,
illustration), and:

- `upi.vpa`: the couple's UPI ID. **While it's empty the site is in demo mode**: a banner says
  payments are off and no payment buttons or QR code are shown.
- `whatsapp`: the couple's WhatsApp number with country code, digits only (e.g. `919876543210`).

Illustrations available for a dream: `travel`, `home`, `aurora`, `cafe`, `blessing`.

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
| `src/app/page.tsx` | The site |
| `src/components/ContributeSheet.tsx` | Amount → blessing → UPI pay → WhatsApp → thank-you flow |
| `src/components/DreamArt.tsx`, `Ornaments.tsx` | Hand-drawn SVG artwork |
| `src/lib/upi.ts` | UPI link builder |
| `.github/workflows/deploy.yml` | Build & publish to GitHub Pages |
