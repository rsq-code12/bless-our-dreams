/**
 * UPI "pay" links, following the NPCI UPI linking spec:
 *   upi://pay?pa=<vpa>&pn=<payee name>&am=<amount>&cu=INR&tn=<note>
 *
 * Android shows an app chooser for upi://. iOS has no system chooser,
 * so each app's own scheme is offered as well.
 */

export type UpiApp = "any" | "gpay" | "phonepe" | "paytm";

export type UpiPayment = {
  vpa: string;
  payeeName: string;
  amount: number;
  note: string;
};

function query({ vpa, payeeName, amount, note }: UpiPayment) {
  const params = new URLSearchParams({
    pa: vpa,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: "INR",
    // Most apps truncate the note around 50 characters.
    tn: note.slice(0, 50),
  });
  // UPI apps expect %20 for spaces (not "+") and a literal "@" in the UPI ID.
  return params.toString().replace(/\+/g, "%20").replace(/%40/g, "@");
}

export function upiLink(p: UpiPayment, app: UpiApp = "any", isIOS = false) {
  const q = query(p);
  switch (app) {
    case "gpay":
      return isIOS ? `gpay://upi/pay?${q}` : `tez://upi/pay?${q}`;
    case "phonepe":
      return `phonepe://pay?${q}`;
    case "paytm":
      return `paytmmp://pay?${q}`;
    default:
      return `upi://pay?${q}`;
  }
}

/** Basic sanity check for a UPI transaction reference (UTR is 12 digits; some apps show alphanumeric ids). */
export function cleanUtr(raw: string) {
  return raw.replace(/[^a-zA-Z0-9]/g, "").slice(0, 35);
}
