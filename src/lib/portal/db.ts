/**
 * DEMO DATA LAYER for the TMack booking portal.
 * ---------------------------------------------------------------------------
 * Everything lives in memory for the current browser session (no
 * localStorage, no network). All UI talks to this module only, so going live
 * is a backend swap:  // TODO: Supabase (tables mirror the types below)
 *                     // TODO: Stripe (deposits) — replace demoCharge()
 * Clients/appointments below are FICTIONAL demo records. Services, add-ons,
 * prices, hours and policies are TMack's real published ones.
 */
import { useEffect, useState, useSyncExternalStore } from "react";
import { ADD_ONS, SERVICES, SERVICE_BY_ID, type Service } from "@/lib/services";
import { PRODUCTS } from "@/lib/products";

export type Role = "guest" | "client" | "owner";
export type ApptStatus = "booked" | "confirmed" | "checked-in" | "completed" | "no-show" | "canceled";
export type PayMethod = "Apple Pay" | "Cash App" | "PayPal" | "Klarna" | "Affirm" | "Card (deposit)";

export type Client = {
  id: string;
  first: string;
  last: string;
  phone: string;
  email: string;
  locType: "Traditional" | "Microlocs" | "Interlocked" | "Starter";
  since: string; // ISO date
  notes: string;
  music?: string;
  photoConsent: boolean;
  tags: string[];
};

export type Appointment = {
  id: string;
  clientId: string;
  serviceId: string;
  addOnIds: string[];
  start: string; // ISO
  minutes: number; // service + add-ons
  bufferAfter: number;
  price: number; // service + add-ons
  deposit: number;
  status: ApptStatus;
  balanceMethod?: PayMethod;
  rescheduled: number;
  createdAt: string;
  note?: string;
  photoConsent?: boolean;
  music?: string;
  source: "portal" | "acuity-import" | "owner";
};

export type Payment = {
  id: string;
  apptId?: string;
  clientId?: string;
  kind: "deposit" | "balance" | "product" | "fee";
  amount: number;
  method: PayMethod;
  at: string;
  label: string;
};

export type Journey = { id: string; clientId: string; at: string; photo: string; title: string; note: string };

export type Inventory = { handle: string; stock: number; sold30: number; reorderAt: number };

export type Block = { id: string; start: string; minutes: number; label: string };

export type Settings = {
  hours: { open: string | null; close: string | null }[]; // index 0=Sun
  firstSaturdayOnly: boolean;
  saturdayFee: number;
  slotStep: number;
  leadHours: number;
  windowWeeks: number;
  holidays: string[]; // YYYY-MM-DD
  serviceOverrides: Record<string, { price?: number; minutes?: number; active?: boolean }>;
};

type State = {
  session: { role: Role; clientId?: string; name?: string; provider?: string };
  clients: Client[];
  appts: Appointment[];
  payments: Payment[];
  journey: Journey[];
  inventory: Inventory[];
  blocks: Block[];
  settings: Settings;
  toasts: { id: string; text: string }[];
};

// ---------------------------------------------------------------- helpers
let seq = 1000;
export const uid = (p: string) => `${p}_${(seq++).toString(36)}`;

export const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const atTime = (d: Date, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const x = new Date(d);
  x.setHours(h, m, 0, 0);
  return x;
};
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
export const isFirstSaturday = (d: Date) => d.getDay() === 6 && d.getDate() <= 7;

/** Deterministic PRNG so the demo looks the same for everyone. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ---------------------------------------------------------------- seed
const FIRST = ["Aaliyah", "Brianna", "Candace", "Destiny", "Ebony", "Faith", "Gabrielle", "Imani", "Jasmine", "Kendra", "Lauren", "Monique", "Nia", "Octavia", "Precious", "Raven", "Simone", "Tiana", "Unique", "Valencia", "Whitney", "Xavier", "Marcus", "Andre", "Jamal", "Darnell", "Keisha", "Tasha"];
const LAST = ["Brooks", "Carter", "Davis", "Ellis", "Foster", "Green", "Harris", "Jackson", "King", "Lewis", "Moore", "Nelson", "Owens", "Parker", "Quarles", "Robinson", "Scott", "Turner", "Underwood", "Vaughn", "Walker", "Young", "Bell", "Coleman", "Dixon", "Freeman", "Gaines", "Hill"];
const MUSIC = ["R&B", "Gospel", "Neo-soul", "Hip-hop", "Reality TV", "Podcast", "Afrobeats", "Jazz"];

function seed(): State {
  const r = rng(20261023);
  const pick = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)];
  const now = new Date();
  const today = startOfDay(now);

  const clients: Client[] = FIRST.map((f, i) => {
    const locType = (["Traditional", "Microlocs", "Interlocked", "Traditional", "Microlocs", "Starter"] as const)[i % 6];
    return {
      id: `c_${i + 1}`,
      first: f,
      last: LAST[i],
      phone: `(804) 555-${String(1000 + Math.floor(r() * 8999)).slice(0, 4)}`,
      email: `${f.toLowerCase()}.${LAST[i].toLowerCase()}@example.com`,
      locType,
      since: ymd(addDays(today, -Math.floor(60 + r() * 500))),
      notes: i % 3 === 0 ? "Prefers interlocking at the crown. Tender at the nape — gentle tension." : i % 3 === 1 ? "Uses the spritz 3x a week. Wants length retention." : "Likes a two-strand style finish.",
      music: pick(MUSIC),
      photoConsent: r() > 0.25,
      tags: i % 5 === 0 ? ["VIP"] : i % 7 === 0 ? ["New"] : [],
    };
  });
  // the demo "signed-in client"
  clients[0] = { ...clients[0], first: "Aaliyah", last: "Brooks", email: "aaliyah.demo@example.com", locType: "Traditional", tags: ["VIP"], music: "R&B", photoConsent: true };

  const appts: Appointment[] = [];
  const payments: Payment[] = [];
  const methods: PayMethod[] = ["Apple Pay", "Cash App", "PayPal", "Apple Pay", "Cash App", "Klarna"];
  const weights = ["81390736", "81390736", "81390736", "81568611", "81568611", "82143998", "82144171", "98630338", "99212719", "81381263"];

  for (let d = -63; d <= 24; d++) {
    const day = addDays(today, d);
    const dow = day.getDay();
    const open = [0, 3, 4].includes(dow) || isFirstSaturday(day);
    if (!open) continue;
    let cursor = atTime(day, "09:00");
    const end = atTime(day, "19:00");
    const fill = d < 0 ? 0.92 : d < 7 ? 0.5 : 0.32;
    while (cursor < end) {
      if (r() > fill) {
        cursor = new Date(cursor.getTime() + (d < 0 ? 60 : 120) * 60000);
        continue;
      }
      const svc = SERVICE_BY_ID[pick(weights)];
      const addOnIds = svc.addOnIds.filter((id) => !ADD_ONS[id].contactFirst && r() < 0.18).slice(0, 2);
      const minutes = svc.minutes + addOnIds.reduce((n, id) => n + ADD_ONS[id].minutes, 0);
      const finish = new Date(cursor.getTime() + (minutes + svc.bufferAfter) * 60000);
      if (finish > end) break;
      const client = clients[Math.floor(r() * clients.length)];
      const price = svc.price + addOnIds.reduce((n, id) => n + ADD_ONS[id].price, 0);
      const past = finish < now;
      let status: ApptStatus = past ? (r() < 0.05 ? "no-show" : r() < 0.04 ? "canceled" : "completed") : d === 0 && cursor < now ? "checked-in" : r() < 0.7 ? "confirmed" : "booked";
      if (d === 0 && past) status = "completed";
      const id = uid("a");
      const createdAt = addDays(cursor, -Math.floor(3 + r() * 20)).toISOString();
      const method = pick(methods);
      appts.push({ id, clientId: client.id, serviceId: svc.id, addOnIds, start: cursor.toISOString(), minutes, bufferAfter: svc.bufferAfter, price, deposit: svc.deposit, status, balanceMethod: status === "completed" ? method : undefined, rescheduled: 0, createdAt, photoConsent: client.photoConsent, music: client.music, source: d < -20 ? "acuity-import" : "portal" });
      payments.push({ id: uid("p"), apptId: id, clientId: client.id, kind: "deposit", amount: svc.deposit, method: "Card (deposit)", at: createdAt, label: `Deposit · ${svc.name}` });
      if (status === "completed") payments.push({ id: uid("p"), apptId: id, clientId: client.id, kind: "balance", amount: Math.max(0, price - (svc.deposit - (svc.deposit === 104 ? 4 : 2))), method, at: finish.toISOString(), label: `Balance · ${svc.name}` });
      const nextT = finish.getTime() + (r() < 0.4 ? 30 : 0) * 60000;
      cursor = new Date(Math.ceil(nextT / 1800000) * 1800000); // keep starts on the half hour
    }
  }

  // Make sure the demo client has a rich history + one upcoming visit
  const me = clients[0];
  const myPast = [-56, -28].map((dd, k) => {
    const day = addDays(today, dd);
    while (![0, 3, 4].includes(day.getDay())) day.setDate(day.getDate() + 1);
    const svc = SERVICE_BY_ID[k === 0 ? "99212719" : "81390736"];
    const start = atTime(day, "10:00");
    const id = uid("a");
    appts.push({ id, clientId: me.id, serviceId: svc.id, addOnIds: k === 1 ? ["6997429"] : [], start: start.toISOString(), minutes: svc.minutes + (k === 1 ? 30 : 0), bufferAfter: svc.bufferAfter, price: svc.price + (k === 1 ? 65 : 0), deposit: svc.deposit, status: "completed", balanceMethod: "Apple Pay", rescheduled: 0, createdAt: addDays(start, -10).toISOString(), photoConsent: true, music: "R&B", source: "portal" });
    payments.push({ id: uid("p"), apptId: id, clientId: me.id, kind: "deposit", amount: svc.deposit, method: "Card (deposit)", at: addDays(start, -10).toISOString(), label: `Deposit · ${svc.name}` });
    payments.push({ id: uid("p"), apptId: id, clientId: me.id, kind: "balance", amount: svc.price + (k === 1 ? 65 : 0) - (svc.deposit === 104 ? 100 : 30), method: "Apple Pay", at: start.toISOString(), label: `Balance · ${svc.name}` });
    return id;
  });
  void myPast;
  {
    const day = addDays(today, 9);
    while (![0, 3, 4].includes(day.getDay())) day.setDate(day.getDate() + 1);
    const start = atTime(day, "12:00");
    // free that slot from collisions
    for (let i = appts.length - 1; i >= 0; i--) {
      const a = appts[i];
      const s = new Date(a.start).getTime();
      const e = s + (a.minutes + a.bufferAfter) * 60000;
      if (ymd(new Date(a.start)) === ymd(day) && s < start.getTime() + 180 * 60000 && e > start.getTime()) appts.splice(i, 1);
    }
    const svc = SERVICE_BY_ID["81390736"];
    const id = uid("a");
    appts.push({ id, clientId: me.id, serviceId: svc.id, addOnIds: ["6997413"], start: start.toISOString(), minutes: svc.minutes + 29, bufferAfter: 0, price: 170, deposit: 32, status: "confirmed", rescheduled: 0, createdAt: addDays(today, -2).toISOString(), photoConsent: true, music: "R&B", source: "portal" });
    payments.push({ id: uid("p"), apptId: id, clientId: me.id, kind: "deposit", amount: 32, method: "Card (deposit)", at: addDays(today, -2).toISOString(), label: "Deposit · Palm Roll Retwist Maintenance" });
  }

  // Product sales (Shopify orders surfaced in the dashboard)
  for (let d = -60; d <= 0; d++) {
    const n = Math.floor(r() * 3);
    for (let k = 0; k < n; k++) {
      const p = pick(PRODUCTS);
      const q = 1 + Math.floor(r() * 2);
      payments.push({ id: uid("p"), kind: "product", amount: +(p.price * q).toFixed(2), method: pick(["Apple Pay", "Card (deposit)", "PayPal"] as PayMethod[]), at: atTime(addDays(today, d), "14:00").toISOString(), label: `${q} × ${p.name}` });
    }
  }

  const journey: Journey[] = [
    { id: uid("j"), clientId: me.id, at: ymd(addDays(today, -56)), photo: "/media/work/recon-before.webp", title: "Day one: reconstruction", note: "Heavy new growth and conjoining at the crown. We detoxed, re-parted and palm rolled. Start the spritz 3x a week." },
    { id: uid("j"), clientId: me.id, at: ymd(addDays(today, -55)), photo: "/media/work/recon-after-top.webp", title: "Reconstruction complete", note: "Every loc separated and re-parted. Sleep in satin and keep your hands out of the roots for two weeks." },
    { id: uid("j"), clientId: me.id, at: ymd(addDays(today, -28)), photo: "/media/work/retwist-long-back.webp", title: "4-week retwist + detox combo", note: "Parts holding beautifully, scalp is calm. Moisture is much better — keep sealing with the chebe oil." },
  ];

  const inventory: Inventory[] = PRODUCTS.map((p, i) => ({ handle: p.handle, stock: [34, 41, 6, 18, 22, 9][i] ?? 15, sold30: [27, 31, 14, 8, 11, 6][i] ?? 5, reorderAt: 10 }));

  return {
    session: { role: "guest" },
    clients,
    appts: appts.sort((a, b) => a.start.localeCompare(b.start)),
    payments,
    journey,
    inventory,
    blocks: [],
    settings: {
      hours: [
        { open: "09:00", close: "19:00" },
        { open: null, close: null },
        { open: null, close: null },
        { open: "09:00", close: "19:00" },
        { open: "09:00", close: "19:00" },
        { open: null, close: null },
        { open: "09:00", close: "19:00" },
      ],
      firstSaturdayOnly: true,
      saturdayFee: 25,
      slotStep: 30,
      leadHours: 12,
      windowWeeks: 8,
      holidays: ["2026-11-26", "2026-12-24", "2026-12-25", "2026-12-31", "2027-01-01"],
      serviceOverrides: {},
    },
    toasts: [],
  };
}

// ---------------------------------------------------------------- store
let state: State | null = null;
const listeners = new Set<() => void>();
function get(): State {
  if (!state) state = seed();
  return state;
}
function set(fn: (s: State) => State) {
  state = fn(get());
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const serverSnapshot: State = {
  session: { role: "guest" },
  clients: [],
  appts: [],
  payments: [],
  journey: [],
  inventory: [],
  blocks: [],
  settings: { hours: [], firstSaturdayOnly: true, saturdayFee: 25, slotStep: 30, leadHours: 12, windowWeeks: 8, holidays: [], serviceOverrides: {} },
  toasts: [],
};

/** React hook — select any slice of demo state. */
export function useDB<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => sel(get()), () => sel(serverSnapshot));
}
export const db = { get };

/** Current time as state (ticks every minute) so render stays pure. */
export function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);
  return now;
}

// ---------------------------------------------------------------- services (with owner edits)
export function liveService(s: Service, settings = get().settings): Service & { active: boolean } {
  const o = settings.serviceOverrides[s.id] ?? {};
  return { ...s, price: o.price ?? s.price, minutes: o.minutes ?? s.minutes, active: o.active ?? true };
}
export function liveServices() {
  return SERVICES.map((s) => liveService(s));
}

// ---------------------------------------------------------------- availability
export type Slot = { start: Date; label: string; saturdayFee?: boolean };

export function dayStatus(d: Date, s = get().settings): { open: boolean; reason?: string; saturdayRequest?: boolean } {
  const key = ymd(d);
  if (s.holidays.includes(key)) return { open: false, reason: "Closed for the holiday" };
  const h = s.hours[d.getDay()];
  if (!h?.open) return { open: false, reason: "Closed" };
  if (d.getDay() === 6 && s.firstSaturdayOnly && !isFirstSaturday(d)) return { open: false, reason: "Saturday by request", saturdayRequest: true };
  return { open: true };
}

export function slotsFor(d: Date, totalMinutes: number, buffer: number, ignoreApptId?: string, allowSaturdayRequest = false): Slot[] {
  const st = get();
  const s = st.settings;
  const ds = dayStatus(d, s);
  if (!ds.open && !(allowSaturdayRequest && ds.saturdayRequest)) return [];
  const h = s.hours[d.getDay()];
  const open = atTime(d, h.open!);
  const close = atTime(d, h.close!);
  const earliest = Date.now() + s.leadHours * 3600000;
  const busy = st.appts
    .filter((a) => a.id !== ignoreApptId && a.status !== "canceled" && ymd(new Date(a.start)) === ymd(d))
    .map((a) => [new Date(a.start).getTime(), new Date(a.start).getTime() + (a.minutes + a.bufferAfter) * 60000] as const)
    .concat(st.blocks.filter((b) => ymd(new Date(b.start)) === ymd(d)).map((b) => [new Date(b.start).getTime(), new Date(b.start).getTime() + b.minutes * 60000] as const));
  const out: Slot[] = [];
  for (let t = open.getTime(); t + totalMinutes * 60000 <= close.getTime(); t += s.slotStep * 60000) {
    if (t < earliest) continue;
    const e = t + (totalMinutes + buffer) * 60000;
    if (busy.some(([b0, b1]) => t < b1 && e > b0)) continue;
    const dt = new Date(t);
    out.push({ start: dt, label: dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), saturdayFee: !ds.open });
  }
  return out;
}

// ---------------------------------------------------------------- actions
export function toast(text: string) {
  const id = uid("t");
  set((s) => ({ ...s, toasts: [...s.toasts, { id, text }] }));
  setTimeout(() => set((s) => ({ ...s, toasts: s.toasts.filter((t) => t.id !== id) })), 3800);
}

export function signIn(role: Role, provider: string) {
  set((s) => ({ ...s, session: role === "owner" ? { role, name: "TMack", provider } : role === "client" ? { role, clientId: "c_1", name: "Aaliyah", provider } : { role: "guest" } }));
}
export function signOut() {
  set((s) => ({ ...s, session: { role: "guest" } }));
}

/** DEMO payment — never charges. // TODO: Stripe PaymentIntent / Square. */
export async function demoCharge(amount: number) {
  await new Promise((r) => setTimeout(r, 1100));
  return { ok: true, id: uid("pi"), amount };
}

export function createBooking(input: {
  serviceId: string;
  addOnIds: string[];
  start: Date;
  client: { first: string; last: string; phone: string; email: string };
  photoConsent: boolean;
  music?: string;
  note?: string;
  saturdayFee?: boolean;
}) {
  const st = get();
  const svc = liveService(SERVICE_BY_ID[input.serviceId], st.settings);
  let clientId = st.session.role === "client" ? st.session.clientId! : st.clients.find((c) => c.email.toLowerCase() === input.client.email.toLowerCase())?.id;
  const newClient = !clientId;
  if (!clientId) clientId = uid("c");
  const minutes = svc.minutes + input.addOnIds.reduce((n, id) => n + ADD_ONS[id].minutes, 0);
  const price = svc.price + input.addOnIds.reduce((n, id) => n + ADD_ONS[id].price, 0) + (input.saturdayFee ? st.settings.saturdayFee : 0);
  const appt: Appointment = {
    id: uid("a"),
    clientId,
    serviceId: svc.id,
    addOnIds: input.addOnIds,
    start: input.start.toISOString(),
    minutes,
    bufferAfter: svc.bufferAfter,
    price,
    deposit: svc.deposit,
    status: input.saturdayFee ? "booked" : "confirmed",
    rescheduled: 0,
    createdAt: new Date().toISOString(),
    photoConsent: input.photoConsent,
    music: input.music,
    note: input.note,
    source: "portal",
  };
  set((s) => ({
    ...s,
    clients: newClient
      ? [...s.clients, { id: clientId!, ...input.client, locType: svc.category === "Microlocs" ? "Microlocs" : svc.category === "New Locs" ? "Starter" : "Traditional", since: ymd(new Date()), notes: input.note ?? "", music: input.music, photoConsent: input.photoConsent, tags: ["New"] }]
      : s.clients,
    appts: [...s.appts, appt].sort((a, b) => a.start.localeCompare(b.start)),
    payments: [...s.payments, { id: uid("p"), apptId: appt.id, clientId, kind: "deposit", amount: svc.deposit, method: "Card (deposit)", at: new Date().toISOString(), label: `Deposit · ${svc.name}` }],
  }));
  return appt;
}

export function setStatus(id: string, status: ApptStatus, method?: PayMethod) {
  set((s) => {
    const a = s.appts.find((x) => x.id === id);
    if (!a) return s;
    const svc = SERVICE_BY_ID[a.serviceId];
    const payments = [...s.payments];
    if (status === "completed" && a.status !== "completed") {
      const credit = a.deposit - (a.deposit === 104 ? 4 : a.deposit === 32 ? 2 : 0);
      payments.push({ id: uid("p"), apptId: a.id, clientId: a.clientId, kind: "balance", amount: Math.max(0, a.price - credit), method: method ?? "Apple Pay", at: new Date().toISOString(), label: `Balance · ${svc.name}` });
    }
    return { ...s, payments, appts: s.appts.map((x) => (x.id === id ? { ...x, status, balanceMethod: status === "completed" ? method ?? "Apple Pay" : x.balanceMethod } : x)) };
  });
  toast(`Appointment marked ${status.replace("-", " ")}`);
}

export function reschedule(id: string, start: Date, by: "client" | "owner") {
  set((s) => ({ ...s, appts: s.appts.map((x) => (x.id === id ? { ...x, start: start.toISOString(), rescheduled: x.rescheduled + (by === "client" ? 1 : 0), status: "confirmed" as ApptStatus } : x)).sort((a, b) => a.start.localeCompare(b.start)) }));
  toast("Appointment rescheduled — deposit transferred");
}

export function addBlock(start: Date, minutes: number, label: string) {
  set((s) => ({ ...s, blocks: [...s.blocks, { id: uid("b"), start: start.toISOString(), minutes, label }] }));
  toast("Time blocked on your calendar");
}
export function removeBlock(id: string) {
  set((s) => ({ ...s, blocks: s.blocks.filter((b) => b.id !== id) }));
}

export function updateClient(id: string, patch: Partial<Client>) {
  set((s) => ({ ...s, clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
}

export function addJourney(clientId: string, photo: string, title: string, note: string) {
  set((s) => ({ ...s, journey: [...s.journey, { id: uid("j"), clientId, at: ymd(new Date()), photo, title, note }] }));
  toast("Added to the client’s loc journey");
}

export function updateSettings(patch: Partial<Settings>) {
  set((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}
export function overrideService(id: string, patch: { price?: number; minutes?: number; active?: boolean }) {
  set((s) => ({ ...s, settings: { ...s.settings, serviceOverrides: { ...s.settings.serviceOverrides, [id]: { ...s.settings.serviceOverrides[id], ...patch } } } }));
}
export function restock(handle: string, qty: number) {
  set((s) => ({ ...s, inventory: s.inventory.map((i) => (i.handle === handle ? { ...i, stock: i.stock + qty } : i)) }));
  toast("Inventory updated");
}

// ---------------------------------------------------------------- derived
export const clientName = (c?: Client) => (c ? `${c.first} ${c.last}` : "Client");
export function totals(appts: Appointment[], payments: Payment[], from: Date, to: Date) {
  const inR = (iso: string) => {
    const t = new Date(iso).getTime();
    return t >= from.getTime() && t < to.getTime();
  };
  const p = payments.filter((x) => inR(x.at));
  const service = p.filter((x) => x.kind !== "product").reduce((n, x) => n + x.amount, 0);
  const product = p.filter((x) => x.kind === "product").reduce((n, x) => n + x.amount, 0);
  const a = appts.filter((x) => inR(x.start));
  const done = a.filter((x) => x.status === "completed").length;
  const noShow = a.filter((x) => x.status === "no-show").length;
  return { service, product, total: service + product, appts: a.length, done, noShow };
}
