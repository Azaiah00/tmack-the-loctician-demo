/**
 * Verified business facts for TMack The Loctician.
 * Sources (checked 2026-10-23): Google Business Profile, Acuity booking page
 * (tmacktheloctician.as.me), her own flyers on Acuity, tmackcrowncare.com.
 * Anything marked NEEDS CLIENT CONFIRMATION is listed in LAUNCH-NOTES.md.
 */
export const SITE = {
  name: "TMack The Loctician",
  legalName: "TMack The Loctician LLC",
  owner: "TMack",
  title: "Master Loctician & Certified Micro Loc Specialist",
  url: "https://tmacktheloctician.com",
  phone: "(804) 464-8208",
  phoneHref: "tel:+18044648208",
  email: "info@tmackcrowncare.com",
  address: {
    street: "11057 Hull Street Rd, Ste 13",
    city: "Midlothian",
    region: "VA",
    zip: "23112",
    county: "Chesterfield County",
  },
  geo: { lat: 37.4366, lng: -77.5979673 },
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=11057+Hull+Street+Rd+Ste+13+Midlothian+VA+23112",
  googleUrl: "https://www.google.com/maps?cid=14928887747521058894",
  rating: { value: 5.0, count: 17 },
  /** Live booking today (her current Acuity page). */
  acuityUrl: "https://tmacktheloctician.as.me/schedule/0d0cde23",
  /** Her real Shopify store for the Crown Care Collection. */
  shopUrl: "https://tmackcrowncare.com",
  socials: {
    instagram: "https://www.instagram.com/tmacktheloctician",
    tiktok: "https://www.tiktok.com/@tmacktheloctician",
    shopInstagram: "https://www.instagram.com/tmack_crowncare",
  },
  /**
   * Hours: her flyer says "Open by appointment only". MapQuest lists
   * Sun, Wed, Thu, Sat 9 AM–7 PM. NEEDS CLIENT CONFIRMATION.
   * 0 = Sunday … 6 = Saturday. null = closed.
   */
  hours: [
    { day: "Sunday", open: "09:00", close: "19:00" },
    { day: "Monday", open: null, close: null },
    { day: "Tuesday", open: null, close: null },
    { day: "Wednesday", open: "09:00", close: "19:00" },
    { day: "Thursday", open: "09:00", close: "19:00" },
    { day: "Friday", open: null, close: null },
    { day: "Saturday", open: "09:00", close: "19:00" },
  ] as { day: string; open: string | null; close: string | null }[],
  mission:
    "Our mission is to provide exceptional service — loc retwists, micro locs and loc maintenance on natural locs. We focus on promoting healthy hair to ensure your crown remains fresh and confident with every visit!",
  fromTheBusiness:
    "We specialize in professional loc care, maintenance, and healthy hair solutions in a welcoming, private studio setting.",
  paymentMethods: ["Apple Pay", "Cash App ($TMacktheloctician)", "PayPal (Tmacktheloctician)"],
  bnpl: ["Klarna", "Affirm"],
} as const;

/**
 * Which booking experience the site's "Book" buttons open.
 * - "portal": the new branded booking portal (/portal) — demo mode until launch.
 * - "acuity": her current live Acuity page.
 * Flip to "acuity" to go live with the website before the portal is purchased.
 */
export const BOOKING_MODE: "portal" | "acuity" = "portal";
export const BOOK_HREF = BOOKING_MODE === "portal" ? "/portal/book" : SITE.acuityUrl;

export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/visit", label: "Visit" },
] as const;

export const POLICIES = [
  {
    title: "Deposit required",
    body: "A $30 non-refundable deposit (plus a $2 booking fee on electronic payments) secures your appointment. Your appointment is not confirmed until the deposit is received.",
  },
  {
    title: "Remaining balance",
    body: "The balance is due at your appointment by Apple Pay, Cash App or PayPal only. Klarna and Affirm are available for qualifying services.",
  },
  {
    title: "Running late",
    body: "There is a 10–15 minute grace period. After 15 minutes with no call or text, the appointment may be canceled.",
  },
  {
    title: "Cancellations & no-shows",
    body: "Deposits are non-refundable. Cancellations and no-shows forfeit the deposit.",
  },
  {
    title: "Rescheduling",
    body: "One reschedule is allowed with 24 hours' notice and your deposit transfers. Last-minute changes need a new deposit.",
  },
  {
    title: "Arrive ready",
    body: "Please arrive with clean, product-free hair. No extra guests unless they are being serviced.",
  },
  {
    title: "Saturday appointments",
    body: "Loc retwists are offered the first Saturday of each month. For another Saturday, contact TMack 24–48 hours ahead; a $25 availability fee applies if approved.",
  },
  {
    title: "Loc reconstruction",
    body: "$104 is due at booking ($100 deposit + $4 booking fee); $100 applies to your balance. Up to 5 hours are reserved for you; extra time is $50/hour, always discussed and approved first.",
  },
  {
    title: "Microlocs & starter locs",
    body: "A $32 consultation ($30 + $2 fee) is required first; the $30 applies to your service. A 25% non-refundable down payment books your install. Minor slippage is normal: anything that unravels is fixed free within 3 weeks.",
  },
] as const;
