# Bless Our Dreams: a wedding shagun portal

Guests open one link, pick one of the couple's dreams (honeymoon, first home, a café…),
choose a shagun amount and pay **directly to the couple by UPI**. Their name and blessing
appear on the blessings wall, and each dream's progress bar fills up.

- Indian-wedding design: marigold toran, mandala, jharokha arches, Devanagari touches
- Works like an app on phones ("Add to Home Screen"), with a WhatsApp-ready preview card
- UPI on phones: Google Pay, PhonePe, Paytm or any UPI app. On laptops: a scannable QR
- Shagun amounts that end in 1, plus a "+₹1 for shagun?" nudge
- Couple's dashboard at `/admin`: mark each blessing *received* or *not received*, download a CSV for thank-you notes
- Individual amounts are never shown publicly (configurable)

## Make it yours

Everything a guest sees lives in **`src/wedding.config.ts`**: names, date, city, the
celebrations, the letter, the UPI ID and the list of dreams (title, story, goal, illustration).

Illustrations available for a dream: `travel`, `home`, `aurora`, `cafe`, `blessing`.

> Don't change a dream's `id` after guests have contributed to it.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSCODE (6+ characters)
npm run dev
```

Open http://localhost:3000, and http://localhost:3000/admin for the dashboard.
Locally, contributions are saved to `data/contributions.json`.

## Go live (Vercel)

1. Push this folder to GitHub and import it in Vercel.
2. In the Vercel project, add **Upstash Redis** from the Marketplace (Storage tab). It sets
   `KV_REST_API_URL` / `KV_REST_API_TOKEN`, which the app picks up automatically.
3. Add the environment variable `ADMIN_PASSCODE`.
4. Deploy, then share the link on WhatsApp. Links like `https://<site>/#bless-honeymoon-bali`
   open a specific dream directly.

Hosting somewhere else? Set `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` and `SITE_URL`.

## How payments work (and their limits)

The site never touches money. It builds a standard UPI payment link / QR
(`upi://pay?pa=…&am=…`) so the guest's own app pays the couple's UPI ID directly. That
means no gateway, no fees and no KYC, but also:

- **The site can't see whether a payment succeeded.** Guests tap *"I've paid"* (optionally
  with the UTR number) and the blessing shows as *awaiting check*. The couple confirms it in
  `/admin` against their bank/UPI history. Rejected entries disappear from the totals.
- **Some apps limit payment links to personal UPI IDs**, especially for larger amounts.
  The pay screen always offers the QR code and a copy-able UPI ID as a fallback. A merchant
  UPI ID (PhonePe Business, Paytm for Business, BharatPe, or a bank's merchant QR, all free)
  is noticeably more reliable.
- Want automatic confirmation? Swap the pay step for a payment gateway such as Razorpay
  (needs a KYC'd merchant account; charges about 2% per payment).

## Project map

| Path | What it is |
| --- | --- |
| `src/wedding.config.ts` | All the content |
| `src/app/page.tsx` | Guest site |
| `src/components/ContributeSheet.tsx` | Amount → blessing → UPI pay → thank-you flow |
| `src/components/DreamArt.tsx`, `Ornaments.tsx` | Hand-drawn SVG artwork |
| `src/app/admin/` | Couple's dashboard and CSV export |
| `src/lib/store.ts` | Storage (Redis in production, JSON file locally) |
| `src/lib/upi.ts` | UPI link builder |
