"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CalendarClock, CalendarHeart, CalendarPlus, Camera, ChevronRight, Crown, Gift, LogOut, MapPin, Music2, RefreshCcw, ShoppingBag, Sparkles, XCircle } from "lucide-react";
import { SERVICE_BY_ID, fmtDuration } from "@/lib/services";
import { PRODUCT_BY_HANDLE } from "@/lib/products";
import { SITE } from "@/lib/site";
import { addDays, setStatus, signOut, slotsFor, startOfDay, useDB, useNow, reschedule, updateClient, dayStatus, type Appointment } from "@/lib/portal/db";
import { icsFor } from "@/lib/portal/pricing";
import { useCart } from "@/components/shop/cart";
import { Drawer, PortalLogo, StatusBadge, fmtDate, fmtTime, money } from "./ui";
import { cn } from "@/lib/cn";

const TIERS = [
  { name: "Crown", min: 0, perk: "Birthday treat + early access to openings" },
  { name: "Jewel", min: 500, perk: "Free hydration steam with every retwist" },
  { name: "Royal", min: 1500, perk: "Priority first-Saturday booking + 10% off Crown Care" },
];

export function ClientPortal() {
  const router = useRouter();
  const session = useDB((s) => s.session);
  const clients = useDB((s) => s.clients);
  const appts = useDB((s) => s.appts);
  const payments = useDB((s) => s.payments);
  const journey = useDB((s) => s.journey);
  const { add } = useCart();
  const [resch, setResch] = useState<Appointment | null>(null);
  const [cancel, setCancel] = useState<Appointment | null>(null);

  const me = clients.find((c) => c.id === session.clientId);
  const mine = useMemo(() => appts.filter((a) => a.clientId === session.clientId), [appts, session.clientId]);
  const now = useNow();
  const upcoming = mine.filter((a) => new Date(a.start).getTime() > now && !["canceled", "no-show"].includes(a.status));
  const past = mine.filter((a) => new Date(a.start).getTime() <= now && a.status === "completed").reverse();
  const spent = payments.filter((p) => p.clientId === session.clientId && p.kind !== "product").reduce((n, p) => n + p.amount, 0);
  const points = Math.round(spent);
  const tier = [...TIERS].reverse().find((t) => points >= t.min)!;
  const nextTier = TIERS.find((t) => t.min > points);
  const lastVisit = past[0] ? new Date(past[0].start) : null;
  const cadenceDays = me?.locType === "Microlocs" ? 42 : 35;
  const due = lastVisit ? addDays(lastVisit, cadenceDays) : null;
  const daysToDue = due ? Math.ceil((due.getTime() - now) / 86400000) : null;
  const pct = lastVisit ? Math.min(100, ((now - lastVisit.getTime()) / (cadenceDays * 86400000)) * 100) : 0;
  const myJourney = journey.filter((j) => j.clientId === session.clientId).sort((a, b) => a.at.localeCompare(b.at));

  if (session.role !== "client" || !me)
    return (
      <div className="wrap grid min-h-[70svh] place-items-center text-center">
        <div>
          <p className="display text-4xl text-pearl">Sign in to see your portal</p>
          <Link href="/portal" className="btn btn-primary mt-6">
            Sign in (demo)
          </Link>
        </div>
      </div>
    );

  const next = upcoming[0];
  const spritz = PRODUCT_BY_HANDLE["loc-moisturizer-spritz"];
  const oil = PRODUCT_BY_HANDLE["chebe-growth-oil"];

  return (
    <div className="pb-20">
      <header className="border-b border-rose/15">
        <div className="wrap flex items-center gap-3 py-3">
          <PortalLogo href="/portal/client" sub="Client portal" />
          <div className="ml-auto flex items-center gap-2">
            <Link href="/shop" className="hidden text-sm text-champagne/75 hover:text-pearl sm:inline">
              Shop
            </Link>
            <Link href="/portal/book" className="btn btn-primary !min-h-10 !px-4 text-sm">
              <CalendarHeart className="size-4" aria-hidden /> Book
            </Link>
            <button
              onClick={() => {
                signOut();
                router.push("/portal");
              }}
              className="grid size-10 place-items-center rounded-full text-champagne/70 hover:bg-white/5"
              aria-label="Sign out"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="wrap pt-8">
        <p className="eyebrow text-rose">Welcome back</p>
        <h1 className="display mt-2 text-5xl text-pearl sm:text-6xl">
          Hey, loc queen <span className="text-rosegold">{me.first}</span>
        </h1>

        <div className="mt-8 grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
          {/* Next appointment */}
          <section className="card-night relative overflow-hidden p-6 sm:p-7" aria-label="Next appointment">
            <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-magenta/20 blur-3xl" />
            <p className="eyebrow text-rose">Next appointment</p>
            {next ? (
              <>
                <h2 className="display mt-3 text-4xl text-pearl">{fmtDate(next.start, { weekday: "long", month: "long", day: "numeric" })}</h2>
                <p className="mt-1 text-lg text-champagne/85">
                  {fmtTime(next.start)} · {SERVICE_BY_ID[next.serviceId].name}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-champagne/70">
                  <StatusBadge s={next.status} />
                  <span>{fmtDuration(next.minutes)}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-4 text-pink" aria-hidden /> Suite 13
                  </span>
                  {next.music && (
                    <span className="flex items-center gap-1">
                      <Music2 className="size-4 text-pink" aria-hidden /> {next.music}
                    </span>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const url = URL.createObjectURL(icsFor(`Loc appointment with TMack`, new Date(next.start), next.minutes, `${SITE.address.street}, Midlothian, VA`, "Arrive with clean, product-free hair."));
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "tmack-appointment.ics";
                      a.click();
                    }}
                    className="btn btn-ghost !min-h-10 text-sm"
                  >
                    <CalendarPlus className="size-4" aria-hidden /> Add to calendar
                  </button>
                  <button onClick={() => setResch(next)} className="btn btn-ghost !min-h-10 text-sm">
                    <RefreshCcw className="size-4" aria-hidden /> Reschedule
                  </button>
                  <button onClick={() => setCancel(next)} className="btn !min-h-10 text-sm text-champagne/70 hover:text-bad">
                    <XCircle className="size-4" aria-hidden /> Cancel
                  </button>
                </div>
                <p className="mt-4 text-xs text-champagne/50">Deposit {money(next.deposit)} paid · balance due at your visit by Apple Pay, Cash App or PayPal.</p>
              </>
            ) : (
              <div className="mt-3">
                <p className="text-champagne/80">No upcoming appointment.</p>
                <Link href="/portal/book" className="btn btn-primary mt-4">
                  Book your next visit
                </Link>
              </div>
            )}
          </section>

          {/* Maintenance tracker */}
          <section className="card-night p-6 sm:p-7" aria-label="Maintenance tracker">
            <p className="eyebrow text-rose">Maintenance tracker</p>
            <div className="mt-4 flex items-center gap-5">
              <Ring pct={pct} />
              <div>
                <p className="display text-3xl text-pearl">{daysToDue === null ? "—" : daysToDue > 0 ? `${daysToDue} days` : "Due now"}</p>
                <p className="text-sm text-champagne/70">until your next {me.locType === "Microlocs" ? "retie" : "retwist"} is due</p>
                {lastVisit && <p className="mt-1 text-xs text-champagne/50">Last visit {fmtDate(lastVisit)} · every {Math.round(cadenceDays / 7)} weeks</p>}
              </div>
            </div>
            <p className="mt-5 text-sm text-champagne/70">Staying on schedule keeps your parts clean and avoids extended-time fees.</p>
          </section>
        </div>

        {/* Loc journey */}
        <section className="mt-5 card-night p-6 sm:p-7" aria-labelledby="journey">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-rose">Your loc journey</p>
              <h2 id="journey" className="display mt-2 text-4xl text-pearl">
                Watch your crown grow
              </h2>
            </div>
            <p className="flex items-center gap-2 text-xs text-champagne/55">
              <Camera className="size-4 text-pink" aria-hidden /> TMack adds a photo and notes after each visit
            </p>
          </div>
          <ol className="mt-6 flex snap-x gap-4 overflow-x-auto pb-3">
            {myJourney.map((j) => (
              <li key={j.id} className="w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-rose/15 bg-ink/50">
                <div className="relative aspect-[4/5]">
                  <Image src={j.photo} alt={j.title} fill sizes="256px" className="object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold text-champagne">{fmtDate(j.at + "T12:00:00", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-pearl">{j.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-champagne/70">{j.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-5 grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_1fr]">
          {/* Rewards */}
          <section className="card-night p-6 sm:p-7" aria-labelledby="rewards">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-rose">Crown Rewards</p>
              <span className="demo-badge">Concept</span>
            </div>
            <h2 id="rewards" className="display mt-2 flex items-center gap-3 text-4xl text-pearl">
              <Crown className="size-8 text-rose" aria-hidden /> {tier.name} member
            </h2>
            <p className="mt-1 text-sm text-champagne/70">{points.toLocaleString()} points · 1 point per $1 of service</p>
            {nextTier && (
              <>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink">
                  <div className="h-full rounded-full bg-gradient-to-r from-magenta to-rose" style={{ width: `${Math.min(100, (points / nextTier.min) * 100)}%` }} />
                </div>
                <p className="mt-2 text-xs text-champagne/55">
                  {(nextTier.min - points).toLocaleString()} points to {nextTier.name}
                </p>
              </>
            )}
            <ul className="mt-5 space-y-2">
              {TIERS.map((t) => (
                <li key={t.name} className={cn("flex items-start gap-3 rounded-xl px-3 py-2 text-sm", t.name === tier.name ? "bg-pink/10 text-pearl" : "text-champagne/60")}>
                  <Gift className={cn("mt-0.5 size-4 shrink-0", t.name === tier.name ? "text-pink" : "text-champagne/40")} aria-hidden />
                  <span>
                    <strong>{t.name}</strong> ({t.min}+): {t.perk}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-champagne/45">Rewards perks are a suggested program for TMack to customize.</p>
          </section>

          {/* Reorder */}
          <section className="card-night p-6 sm:p-7" aria-labelledby="reorder">
            <p className="eyebrow text-rose">Your home care</p>
            <h2 id="reorder" className="display mt-2 text-4xl text-pearl">
              Running low?
            </h2>
            <p className="mt-1 text-sm text-champagne/70">Hydrate, then seal. Reorder in one tap.</p>
            <div className="mt-5 grid gap-3">
              {[spritz, oil].map((p) => (
                <div key={p.handle} className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-rose/15 bg-ink/50 p-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                    <Image src={p.image} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-pearl">{p.name}</p>
                    <p className="text-xs text-champagne/60">{p.size}</p>
                  </div>
                  <button onClick={() => add(p.handle, p.variants[0].id)} className="btn btn-primary !min-h-10 shrink-0 !px-4 text-xs max-[359px]:w-full">
                    <ShoppingBag className="size-4" aria-hidden /> {money(p.price)}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* History + profile */}
        <div className="mt-5 grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
          <section className="card-night p-6 sm:p-7" aria-labelledby="history">
            <h2 id="history" className="display text-3xl text-pearl">
              Visit history
            </h2>
            <ul className="mt-4 divide-y divide-rose/10">
              {past.slice(0, 6).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="text-pearl">{SERVICE_BY_ID[a.serviceId].name}</p>
                    <p className="text-xs text-champagne/55">{fmtDate(a.start, { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <span className="tabular-nums text-champagne/80">{money(a.price)}</span>
                </li>
              ))}
            </ul>
            <Link href="/portal/book" className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-pink">
              Book again <ChevronRight className="size-4" aria-hidden />
            </Link>
          </section>
          <section className="card-night p-6 sm:p-7" aria-labelledby="prefs">
            <h2 id="prefs" className="display text-3xl text-pearl">
              Preferences
            </h2>
            <label className="mt-4 block text-sm text-champagne/80">
              Music or show
              <input defaultValue={me.music} onBlur={(e) => updateClient(me.id, { music: e.target.value })} className="mt-1 w-full rounded-xl border border-rose/25 bg-ink/60 px-4 py-3 text-pearl focus:border-pink focus:outline-none" />
            </label>
            <label className="mt-4 flex items-center justify-between gap-3 text-sm text-champagne/80">
              Photos & videos during appointments
              <input type="checkbox" checked={me.photoConsent} onChange={(e) => updateClient(me.id, { photoConsent: e.target.checked })} className="size-5 accent-[#ff5aa8]" />
            </label>
            <p className="mt-4 text-xs text-champagne/50">
              {me.email} · {me.phone}
            </p>
          </section>
        </div>
      </div>

      <RescheduleDrawer appt={resch} onClose={() => setResch(null)} />
      <Drawer open={!!cancel} onClose={() => setCancel(null)} title="Cancel appointment?">
        {cancel && (
          <div className="space-y-4 text-sm">
            <p className="text-champagne/85">
              {SERVICE_BY_ID[cancel.serviceId].name} on {fmtDate(cancel.start, { weekday: "long", month: "long", day: "numeric" })} at {fmtTime(cancel.start)}.
            </p>
            <p className="rounded-xl bg-bad/10 p-4 text-champagne">Deposits are non-refundable — canceling forfeits your {money(cancel.deposit)} deposit. Rescheduling with 24 hours’ notice keeps it.</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setResch(cancel);
                  setCancel(null);
                }}
                className="btn btn-primary"
              >
                Reschedule instead
              </button>
              <button
                onClick={() => {
                  setStatus(cancel.id, "canceled");
                  setCancel(null);
                }}
                className="btn btn-ghost"
              >
                Cancel anyway
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function Ring({ pct }: { pct: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="size-24 shrink-0 -rotate-90" role="img" aria-label={`${Math.round(pct)}% of your maintenance cycle`}>
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(231,169,140,.15)" strokeWidth="7" />
      <circle cx="40" cy="40" r={r} fill="none" stroke="url(#ringg)" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      <defs>
        <linearGradient id="ringg">
          <stop offset="0" stopColor="#e0218a" />
          <stop offset="1" stopColor="#e7a98c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RescheduleDrawer({ appt, onClose, by = "client" }: { appt: Appointment | null; onClose: () => void; by?: "client" | "owner" }) {
  const [day, setDay] = useState<Date | null>(null);
  useDB((s) => s.appts);
  const now = useNow();
  const tooLate = appt ? new Date(appt.start).getTime() - now < 24 * 3600000 : false;
  const used = appt ? appt.rescheduled >= 1 && by === "client" : false;
  const days = useMemo(() => {
    const t = startOfDay(new Date());
    return Array.from({ length: 35 }, (_, i) => addDays(t, i + 1)).filter((d) => dayStatus(d).open);
  }, []);
  return (
    <Drawer
      open={!!appt}
      onClose={() => {
        setDay(null);
        onClose();
      }}
      title="Reschedule"
    >
      {appt && (
        <div className="text-sm">
          <p className="text-champagne/80">
            {SERVICE_BY_ID[appt.serviceId].name} · {fmtDuration(appt.minutes)}
          </p>
          {by === "client" && (tooLate || used) ? (
            <p className="mt-4 rounded-xl bg-warn/10 p-4 text-champagne">{used ? "You’ve used your one free reschedule for this booking." : "It’s within 24 hours of your appointment."} Last-minute changes need a new deposit — please text TMack at {SITE.phone}.</p>
          ) : (
            <>
              <p className="mt-1 flex items-center gap-2 text-xs text-champagne/55">
                <CalendarClock className="size-4" aria-hidden /> Your deposit transfers to the new time{by === "client" ? " (1 free reschedule with 24 hours’ notice)" : ""}.
              </p>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {days.map((d) => {
                  const n = slotsFor(d, appt.minutes, appt.bufferAfter, appt.id).length;
                  return (
                    <button
                      key={d.toISOString()}
                      disabled={!n}
                      onClick={() => setDay(d)}
                      className={cn("flex min-w-16 flex-col items-center rounded-xl border px-3 py-2 disabled:opacity-30", day?.toDateString() === d.toDateString() ? "border-pink bg-pink/15 text-pink" : "border-rose/25 text-pearl")}
                    >
                      <span className="text-[10px] uppercase">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                      <span className="display text-2xl">{d.getDate()}</span>
                      <span className="text-[10px] text-champagne/50">{d.toLocaleDateString("en-US", { month: "short" })}</span>
                    </button>
                  );
                })}
              </div>
              {day && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {slotsFor(day, appt.minutes, appt.bufferAfter, appt.id).map((s) => (
                    <button
                      key={s.label}
                      onClick={() => {
                        reschedule(appt.id, s.start, by);
                        setDay(null);
                        onClose();
                      }}
                      className="min-h-11 rounded-xl border border-rose/25 font-semibold text-pearl hover:border-pink hover:bg-pink/10"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-6 flex items-center gap-2 text-xs text-champagne/45">
                <Sparkles className="size-3.5" aria-hidden /> Only times that fit your full appointment are shown.
              </p>
            </>
          )}
        </div>
      )}
    </Drawer>
  );
}
