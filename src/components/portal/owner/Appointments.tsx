"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { SERVICE_BY_ID } from "@/lib/services";
import { clientName, startOfDay, useDB, useNow, type Appointment, type ApptStatus } from "@/lib/portal/db";
import { StatusBadge, fmtDate, fmtTime, money } from "../ui";
import { ApptDrawer } from "../ApptDrawer";
import { cn } from "@/lib/cn";

const RANGES = { upcoming: "Upcoming", today: "Today", past: "Past 60 days", all: "All" } as const;
const STATUSES: ("all" | ApptStatus)[] = ["all", "booked", "confirmed", "checked-in", "completed", "no-show", "canceled"];

export function OwnerAppointments() {
  const appts = useDB((s) => s.appts);
  const clients = useDB((s) => s.clients);
  const [range, setRange] = useState<keyof typeof RANGES>("upcoming");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Appointment | null>(null);
  const now = useNow();

  const list = useMemo(() => {
    const t0 = startOfDay(new Date()).getTime();
    const t1 = t0 + 86400000;
    const cmap = new Map(clients.map((c) => [c.id, c]));
    return appts
      .filter((a) => {
        const t = new Date(a.start).getTime();
        if (range === "upcoming" && t < now) return false;
        if (range === "today" && (t < t0 || t >= t1)) return false;
        if (range === "past" && (t >= now || t < t0 - 60 * 86400000)) return false;
        if (status !== "all" && a.status !== status) return false;
        if (q) {
          const c = cmap.get(a.clientId);
          const hay = `${c?.first} ${c?.last} ${c?.phone} ${c?.email} ${SERVICE_BY_ID[a.serviceId].name}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      })
      .sort((a, b) => (range === "past" ? b.start.localeCompare(a.start) : a.start.localeCompare(b.start)));
  }, [appts, clients, range, status, q, now]);

  const exportCsv = () => {
    const rows = [["Date", "Time", "Client", "Phone", "Service", "Status", "Total", "Deposit"]].concat(
      list.map((a) => {
        const c = clients.find((x) => x.id === a.clientId);
        return [fmtDate(a.start, { year: "numeric", month: "2-digit", day: "2-digit" }), fmtTime(a.start), clientName(c), c?.phone ?? "", SERVICE_BY_ID[a.serviceId].name, a.status, String(a.price), String(a.deposit)];
      }),
    );
    const csv = rows.map((r) => r.map((x) => `"${x.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const el = document.createElement("a");
    el.href = url;
    el.download = "tmack-appointments.csv";
    el.click();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-rose">Appointments</p>
          <h1 className="display mt-1 text-5xl text-pearl">{list.length} bookings</h1>
        </div>
        <button onClick={exportCsv} className="btn btn-ghost !min-h-11 text-sm">
          <Download className="size-4" aria-hidden /> Export CSV
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Date range">
          {Object.entries(RANGES).map(([k, v]) => (
            <button key={k} onClick={() => setRange(k as keyof typeof RANGES)} aria-pressed={range === k} className={cn("min-h-10 rounded-full border px-4 text-sm", range === k ? "border-pink bg-pink/15 text-pink" : "border-rose/25 text-champagne/75")}>
              {v}
            </button>
          ))}
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])} className="min-h-10 rounded-full border border-rose/25 bg-garnet px-4 text-sm capitalize text-champagne" aria-label="Status">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s.replace("-", " ")}
            </option>
          ))}
        </select>
        <label className="relative lg:ml-auto">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-champagne/40" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search client or service" className="min-h-10 w-full rounded-full border border-rose/25 bg-garnet pl-9 pr-4 text-sm text-pearl placeholder:text-champagne/40 lg:w-72" />
        </label>
      </div>

      <div className="card-night mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-rose/15 text-xs uppercase tracking-[0.14em] text-champagne/50">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">When</th>
              <th scope="col" className="px-3 py-3 font-semibold">Client</th>
              <th scope="col" className="px-3 py-3 font-semibold">Service</th>
              <th scope="col" className="px-3 py-3 font-semibold">Status</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose/10">
            {list.slice(0, 120).map((a) => {
              const c = clients.find((x) => x.id === a.clientId);
              return (
                <tr key={a.id} onClick={() => setOpen(a)} className="cursor-pointer hover:bg-white/[0.03]">
                  <td className="px-5 py-3">
                    <button className="text-left" onClick={() => setOpen(a)}>
                      <span className="block text-pearl">{fmtDate(a.start)}</span>
                      <span className="block text-xs text-champagne/55">{fmtTime(a.start)}</span>
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <span className="block text-pearl">{clientName(c)}</span>
                    <span className="block text-xs text-champagne/55">{c?.phone}</span>
                  </td>
                  <td className="px-3 py-3 text-champagne/85">
                    {SERVICE_BY_ID[a.serviceId].name}
                    {a.addOnIds.length > 0 && <span className="ml-1 text-xs text-champagne/50">+{a.addOnIds.length}</span>}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge s={a.status} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-pearl">{money(a.price)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-10 text-center text-champagne/60">No appointments match.</p>}
      </div>
      <ApptDrawer appt={open} onClose={() => setOpen(null)} />
    </div>
  );
}
