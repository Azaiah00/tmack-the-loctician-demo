/**
 * Service menu — copied from her live Acuity configuration on 2026-10-23
 * (appointment type + add-on IDs kept so the portal can map 1:1 to Acuity
 * or a future backend). Prices are her published prices; "from" prices
 * vary by length/density as she states. NEEDS CLIENT CONFIRMATION before launch.
 */
export type AddOn = {
  id: string;
  name: string;
  detail?: string;
  minutes: number;
  price: number;
  from?: boolean;
  contactFirst?: boolean;
};

export type Service = {
  id: string;
  slug: string;
  name: string;
  short: string;
  category: "Maintenance" | "Microlocs" | "Interlocking" | "Restoration" | "New Locs";
  price: number;
  from?: boolean;
  minutes: number;
  bufferAfter: number;
  deposit: number; // amount due at booking incl. booking fee
  depositNote: string;
  description: string;
  includes: string[];
  notFor?: string;
  addOnIds: string[];
  image: string;
  imageAlt: string;
  signature?: boolean;
};

export const ADD_ONS: Record<string, AddOn> = {
  "6997193": { id: "6997193", name: "Shampoo wash", minutes: 10, price: 25 },
  "6997138": { id: "6997138", name: "Locs past mid-back or longer", minutes: 30, price: 20 },
  "7363599": { id: "7363599", name: "Interlocking method — top of head only", minutes: 30, price: 15 },
  "7363415": { id: "7363415", name: "Extra-small microlocs / high density", minutes: 120, price: 75 },
  "7348519": { id: "7348519", name: "Interlocking method upgrade", minutes: 60, price: 75 },
  "6998058": { id: "6998058", name: "Microloc retie — 8 to 10 weeks", minutes: 90, price: 50 },
  "6998040": { id: "6998040", name: "Microloc retie — 11 to 13 weeks", minutes: 120, price: 100 },
  "6997183": {
    id: "6997183",
    name: "Microloc retie — 14+ weeks overdue",
    detail: "Contact TMack before booking. A hair assessment with photos may be required.",
    minutes: 300,
    price: 0,
    contactFirst: true,
  },
  "7040165": { id: "7040165", name: "Over 90 locs (interlocking)", minutes: 60, price: 30 },
  "6997413": { id: "6997413", name: "Two/three strand twist style — mid-back or shorter", minutes: 29, price: 50 },
  "7366465": { id: "7366465", name: "Two/three strand twist style — past mid-back", minutes: 60, price: 55 },
  "6997420": { id: "6997420", name: "Pipe cleaners / flexi rods", detail: "Price varies by size and length.", minutes: 44, price: 55, from: true },
  "6997401": { id: "6997401", name: "Single barrel twists / single braids style", detail: "Price varies by length.", minutes: 29, price: 45, from: true },
  "6997429": { id: "6997429", name: "Loc detox + hydration steam combo", minutes: 30, price: 65 },
  "6997431": {
    id: "6997431",
    name: "Loc detox",
    detail: "Deep-cleansing treatment that removes buildup, oils, lint and impurities from locs and scalp.",
    minutes: 30,
    price: 50,
  },
  "6997428": {
    id: "6997428",
    name: "Loc hydration steam treatment",
    detail: "Restores hydration, reduces dryness and nourishes locs and scalp.",
    minutes: 10,
    price: 25,
  },
  "6997208": { id: "6997208", name: "Loc repair", detail: "$10 per loc.", minutes: 60, price: 10, from: true },
  "7366721": { id: "7366721", name: "Two/three strand twist — top of head only", minutes: 30, price: 25 },
};

const STANDARD_DEPOSIT = 32; // $30 deposit + $2 booking fee

export const SERVICES: Service[] = [
  {
    id: "99212719",
    slug: "loc-reconstruction",
    name: "Loc Reconstruction Package",
    short: "Bring overdue, matted or thinning locs back to health.",
    category: "Restoration",
    price: 325,
    from: true,
    minutes: 300,
    bufferAfter: 120,
    deposit: 104,
    depositNote: "$104 due at booking ($100 deposit + $4 booking fee). $100 applies to your balance.",
    description:
      "This is not a regular retwist. Designed for locs with excessive new growth, conjoining, matting, thinning or overdue maintenance. Up to 5 hours are reserved just for you; additional time is $50/hour and always discussed and approved before work continues.",
    includes: ["Deep cleanse shampoo", "Loc detox", "Hydration steam treatment", "Re-parting", "Palm roll maintenance"],
    addOnIds: ["7348519"],
    image: "/media/work/recon-after-top.webp",
    imageAlt: "Locs after a reconstruction by TMack: clean parts and separated, healthy locs",
    signature: true,
  },
  {
    id: "81390736",
    slug: "palm-roll-retwist",
    name: "Palm Roll Retwist Maintenance",
    short: "Clean parts, fresh roots, simple style — the regular reset.",
    category: "Maintenance",
    price: 120,
    minutes: 120,
    bufferAfter: 0,
    deposit: STANDARD_DEPOSIT,
    depositNote: "$32 due at booking ($30 deposit + $2 booking fee), applied to your service.",
    description:
      "Regular palm-roll maintenance for locs to mid-back and shorter. Locs must be maintained regularly and kept on a consistent schedule. Longer locs are an add-on.",
    includes: ["Shampoo wash", "Palm roll retwist", "Simple style"],
    notFor: "Not for locs needing reconstruction.",
    addOnIds: ["6997138", "6997413", "7366465", "6997420", "6997401", "6997429", "6997431", "6997428", "6997208"],
    image: "/media/work/retwist-long-back.webp",
    imageAlt: "Freshly palm-rolled traditional locs with clean square parts, back view",
    signature: true,
  },
  {
    id: "81568611",
    slug: "microloc-retie",
    name: "Microloc Retie Maintenance",
    short: "Precise retightening for microlocs, 4–7 weeks of growth.",
    category: "Microlocs",
    price: 175,
    from: true,
    minutes: 180,
    bufferAfter: 30,
    deposit: STANDARD_DEPOSIT,
    depositNote: "$32 due at booking ($30 deposit + $2 booking fee), applied to your service.",
    description:
      "Priced by maintenance interval, loc size, density and condition. 4–7 weeks starts at $175; longer intervals move to a higher category. Extra-small microlocs are a $75 add-on. Shampoo is available as an add-on. If your appointment runs past the allotted time, $50/hour may apply — discussed and approved first.",
    includes: ["Microloc retightening", "Edge and part clean-up"],
    addOnIds: ["6997193", "7363415", "6998058", "6998040", "6997183", "6997420", "6997429", "6997431", "6997428", "6997208"],
    image: "/media/work/micro-retie-top.webp",
    imageAlt: "Top view of freshly retied microlocs with neat grid parts",
    signature: true,
  },
  {
    id: "82143998",
    slug: "interlocking-short",
    name: "Traditional Loc Interlocking — Short",
    short: "Shoulder length and up, under 90 locs.",
    category: "Interlocking",
    price: 125,
    minutes: 150,
    bufferAfter: 30,
    deposit: STANDARD_DEPOSIT,
    depositNote: "$32 due at booking ($30 deposit + $2 booking fee), applied to your service.",
    description:
      "Interlocking holds tighter and lasts longer between visits for many clients. Shampoo wash and basic styling are included. More than 90 locs? Add the Over 90 Locs add-on.",
    includes: ["Shampoo wash", "Interlocking", "Basic style"],
    addOnIds: ["7040165", "6997413", "6997420", "6997401", "6997429", "6997431", "6997428", "6997208"],
    image: "/media/work/interloc-zigzag.webp",
    imageAlt: "Interlocked traditional locs with crisp zig-zag parts",
    signature: true,
  },
  {
    id: "82144171",
    slug: "interlocking-medium-long",
    name: "Traditional Loc Interlocking — Medium/Long",
    short: "Past the shoulders to the waist, under 90 locs.",
    category: "Interlocking",
    price: 150,
    minutes: 165,
    bufferAfter: 0,
    deposit: STANDARD_DEPOSIT,
    depositNote: "$32 due at booking ($30 deposit + $2 booking fee), applied to your service.",
    description:
      "Interlocking for medium to long locs. Shampoo wash and basic styling are included. More than 90 locs? Add the Over 90 Locs add-on.",
    includes: ["Shampoo wash", "Interlocking", "Basic style"],
    addOnIds: ["7040165", "6997413", "7366465", "6997420", "6997401", "6997429", "6997431", "6997428", "6997208"],
    image: "/media/work/interloc-parts.webp",
    imageAlt: "Medium-length interlocked locs with even parts, top view",
  },
  {
    id: "98630338",
    slug: "retwist-top-of-head",
    name: "Palm Roll Retwist — Top of Head Only",
    short: "Crown-only maintenance between full visits.",
    category: "Maintenance",
    price: 65,
    minutes: 60,
    bufferAfter: 0,
    deposit: STANDARD_DEPOSIT,
    depositNote: "$32 due at booking ($30 deposit + $2 booking fee), applied to your service.",
    description:
      "Maintenance for traditional locs on the top/crown area only. This is not a full-head service: locs on the sides and back are not included. Prefer interlocking? Add the $15 interlocking add-on.",
    includes: ["Shampoo wash", "Crown retwist", "Basic style"],
    addOnIds: ["7363599", "7366721"],
    image: "/media/work/retwist-top-mens.webp",
    imageAlt: "Retwisted locs on the crown of the head, top view",
  },
  {
    id: "81381263",
    slug: "microloc-starter-loc-consultation",
    name: "Microloc & Starter Loc Consultation",
    short: "Required first step to start your loc journey.",
    category: "New Locs",
    price: 32,
    minutes: 30,
    bufferAfter: 0,
    deposit: 32,
    depositNote: "$32 paid at booking ($30 consultation + $2 fee). The $30 applies to your install if you book.",
    description:
      "A consultation is required before a microloc installation or starter locs. TMack assesses your hair type, explains the process and makes sure your hair is healthy and ready. Final price depends on density and number of locs. A 25% non-refundable down payment books your install; Buy Now, Pay Later options are available. Microlocs with extensions start at $350.",
    includes: ["Hair and scalp assessment", "Loc size and parting plan", "Personal quote", "Install date planning"],
    addOnIds: [],
    image: "/media/work/microlocs-client.webp",
    imageAlt: "Client smiling with a fresh set of microlocs",
    signature: true,
  },
];

export const SERVICE_BY_ID = Object.fromEntries(SERVICES.map((s) => [s.id, s]));

export function fmtMoney(n: number, from = false) {
  const s = n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
  return from ? `${s}+` : s;
}

export function fmtDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  if (!m) return `${h} hr`;
  return `${h} hr ${m} min`;
}
