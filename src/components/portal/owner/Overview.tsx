"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, BellRing, CalendarCheck2, CircleDollarSign, Clock, PackageOpen, Repeat2, ShoppingBag, UserX } from "lucide-react";
import { SERVICE_BY_ID, fmtDuration } from "@/lib/services";
import { PRODUCT_BY_HANDLE } from "@/lib/products";
import { addDays, clientName, startOfDay, toast, totals, useDB, ymd, type Appointment } from "@/lib/portal/db";
import { Bars, Panel, Stat, StatusBadge, fmtDate, fmtTime, money } from "../ui";
import { ApptDrawer } from "../ApptDrawer";

export function OwnerOverview() {
  const appts = useDB((s) => s.appts);
  const payments = useDB((s) => s.payments);
  const clients = useDB((s) => s.clients);
  const inventory = useDB((s) => s.inventory);
  const [open, setOpen] = useState<Appointment | null>(null);

  const d = useMemo(() => {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const weekStart = addDays(today, -today.getDay());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const todayList = appts.filter((a) => ymd(new Date(a.start)) === ymd(today) && a.status !== "canceled");
    // If the studio is closed today, preview the next day with bookings
    let chairDay = today;
    let chairList = todayList;
    for (let i = 1; chairList.length === 0 && i < 14; i++) {
      chairDay = addDays(today, i);
      chairList = appts.filter((a) => ymd(new Date(a.start)) === ymd(chairDay) && a.status !== "canceled");
    }
    const week = totals(appts, payments, weekStart, addDays(weekStart, 7));
    const month = totals(appts, payments, monthStart, tomorrow);
    const lastSame = totals(appts, payments, lastMonthStart, addDays(lastMonthStart, today.getDate()));
    const last60 = appts.filter((a) => new Date(a.start) >= addDays(today, -60) && new Date(a.start) < today);
    const noShowRate = last60.length ? (last60.filter((a) => a.status === "no-show").length / last60.length) * 100 : 0;
    // rebook: completed in last 60d whose client has a future booking
    const futureClients = new Set(appts.filter((a) => new Date(a.start) >= today && a.status !== "canceled").map((a) => a.clientId));
    const doneClients = new Set(last60.filter((a) => a.status === "completed").map((a) => a.clientId));
    const rebook = doneClients.size ? ([...doneClients].filter((c) => futureClients.has(c)).length / doneClients.size) * 100 : 0;
    const weeks = Array.from({ length: 8 }, (_, i) => {
      const s = addDays(weekStart, (i - 7) * 7);
      const t = totals(appts, payments, s, addDays(s, 7));
      return { label: s.toLocaleDateString("en-US", { month: "numeric", day: "numeric" }), value: t.service, sub: t.product };
    });
    const upcoming = appts.filter((a) => new Date(a.start) >= tomorrow && a.status !== "canceled").slice(0, 6);
    const lastVisit = new Map<string, Date>();
    appts.forEach((a) => {
      if (a.status === "completed") lastVisit.set(a.clientId, new Date(a.start));
    });
    const dueClients = clients
      .filter((c) => {
        const lv = lastVisit.get(c.id);
        return lv && !futureClients.has(c.id) && (today.getTime() - lv.getTime()) / 86400000 > 35;
      })
      .slice(0, 5)
      .map((c) => ({ c, last: lastVisit.get(c.id)! }));
    const deposits = payments.filter((p) => p.kind === "deposit" && new Date(p.at) >= monthStart).reduce((n, p) => n + p.amount, 0);
    const lowStock = inventory.filter((i) => i.stock <= i.reorderAt);
    return { todayList, chairDay, chairList, week, month, lastSame, noShowRate, rebook, weeks, upcoming, dueClients, deposits, lowStock };
  }, [appts, payments, clients, inventory]);

  const name = (id: string) => clientName(clients.find((c) => c.id === id));
  const growth = d.lastSame.total ? ((d.month.total - d.lastSame.total) / d.lastSame.total) * 100 : 0;
  const hour = new Date().getHours();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-rose">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1 className="display mt-1 text-5xl text-pearl">Good {hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening"}, TMack</h1>
        </div>
        <Link href="/portal/owner/calendar" className="btn btn-primary">
          <CalendarCheck2 className="size-4" aria-hidden /> Open calendar
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Today" value={String(d.todayList.length)} sub={`appointment${d.todayList.length === 1 ? "" : "s"}`} icon={CalendarCheck2} />
        <Stat label="This week" value={money(Math.round(d.week.total))} sub={`${d.week.appts} bookings`} icon={CircleDollarSign} />
        <Stat label="Month to date" value={money(Math.round(d.month.total))} sub={<span className={growth >= 0 ? "text-ok" : "text-bad"}>{growth >= 0 ? "▲" : "▼"} {Math.abs(growth).toFixed(0)}% vs same point last month</span>} icon={CircleDollarSign} tone="rose" />
        <Stat label="Rebook rate" value={`${d.rebook.toFixed(0)}%`} sub={`No-shows ${d.noShowRate.toFixed(1)}% · 60 days`} icon={Repeat2} tone="rose" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Panel
          title={d.todayList.length ? "Today’s chair" : `Next up · ${fmtDate(d.chairDay)}`}
          action={<span className="text-xs text-champagne/50">{d.todayList.length ? "Tap to manage" : "Studio closed today"}</span>}
        >
          {d.chairList.length === 0 ? (
            <p className="py-8 text-center text-champagne/60">No appointments coming up — time to post an opening.</p>
          ) : (
            <ol className="relative space-y-3 before:absolute before:bottom-2 before:left-[3.4rem] before:top-2 before:w-px before:bg-rose/20">
              {d.chairList.map((a) => (
                <li key={a.id}>
                  <button onClick={() => setOpen(a)} className="flex w-full items-center gap-4 rounded-2xl p-2 text-left hover:bg-white/5">
                    <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-champagne/70">{fmtTime(a.start).replace(" ", " ")}</span>
                    <span className="relative z-10 size-2.5 shrink-0 rounded-full bg-pink ring-4 ring-garnet" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-pearl">{name(a.clientId)}</span>
                      <span className="block truncate text-xs text-champagne/60">
                        {SERVICE_BY_ID[a.serviceId].name} · {fmtDuration(a.minutes)}
                      </span>
                    </span>
                    <StatusBadge s={a.status} />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </Panel>

        <Panel title="Revenue · 8 weeks" action={<Link href="/portal/owner/finances" className="text-xs font-semibold text-pink">Finances</Link>}>
          <Bars data={d.weeks} />
          <div className="mt-4 flex gap-4 text-xs text-champagne/60">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-pink" /> Services
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-rose/60" /> Crown Care shop
            </span>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Coming up" action={<Link href="/portal/owner/appointments" className="text-xs font-semibold text-pink">All</Link>}>
          <ul className="divide-y divide-rose/10">
            {d.upcoming.map((a) => (
              <li key={a.id}>
                <button onClick={() => setOpen(a)} className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm">
                  <span className="min-w-0">
                    <span className="block truncate text-pearl">{name(a.clientId)}</span>
                    <span className="block text-xs text-champagne/55">
                      {fmtDate(a.start)} · {fmtTime(a.start)}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-champagne/40" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Due for maintenance" action={<BellRing className="size-4 text-pink" aria-hidden />}>
          <p className="-mt-2 mb-3 text-xs text-champagne/55">Clients 5+ weeks out with nothing booked.</p>
          <ul className="space-y-2">
            {d.dueClients.map(({ c, last }) => (
              <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl bg-ink/40 px-3 py-2.5 text-sm">
                <span>
                  <span className="block text-pearl">
                    {c.first} {c.last}
                  </span>
                  <span className="block text-xs text-champagne/55">Last visit {fmtDate(last)}</span>
                </span>
                <button onClick={() => toast(`Rebook text sent to ${c.first} (demo)`)} className="rounded-full border border-pink/40 px-3 py-1.5 text-xs font-semibold text-pink hover:bg-pink/10">
                  Nudge
                </button>
              </li>
            ))}
            {d.dueClients.length === 0 && <li className="text-sm text-champagne/60">Everyone is booked. Love that.</li>}
          </ul>
        </Panel>

        <Panel title="Money in" action={<ShoppingBag className="size-4 text-rose" aria-hidden />}>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-champagne/70">Services (month)</dt>
              <dd className="font-semibold text-pearl">{money(Math.round(d.month.service))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-champagne/70">Crown Care sales (month)</dt>
              <dd className="font-semibold text-pearl">{money(Math.round(d.month.product))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-champagne/70">Deposits collected (month)</dt>
              <dd className="font-semibold text-ok">{money(Math.round(d.deposits))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-1.5 text-champagne/70">
                <UserX className="size-4 text-warn" aria-hidden /> No-show deposits kept
              </dt>
              <dd className="font-semibold text-pearl">{money(appts.filter((a) => a.status === "no-show").reduce((n, a) => n + a.deposit, 0))}</dd>
            </div>
          </dl>
          {d.lowStock.length > 0 && (
            <Link href="/portal/owner/shop" className="mt-5 flex items-start gap-2 rounded-xl bg-warn/10 p-3 text-sm text-champagne">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
              <span>
                Low stock: {d.lowStock.map((i) => PRODUCT_BY_HANDLE[i.handle].name).join(", ")}
              </span>
            </Link>
          )}
          <p className="mt-4 flex items-center gap-1.5 text-xs text-champagne/45">
            <Clock className="size-3.5" aria-hidden /> Updated live as you check clients out
            <PackageOpen className="ml-auto size-3.5" aria-hidden />
          </p>
        </Panel>
      </div>

      <ApptDrawer appt={open} onClose={() => setOpen(null)} />
    </div>
  );
}
