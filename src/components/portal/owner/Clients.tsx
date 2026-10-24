"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Camera, Mail, MessageCircle, Phone, Search, Star } from "lucide-react";
import { SERVICE_BY_ID } from "@/lib/services";
import { toast, updateClient, useDB, type Client } from "@/lib/portal/db";
import { Drawer, StatusBadge, fmtDate, money } from "../ui";
import { cn } from "@/lib/cn";

export function OwnerClients() {
  const clients = useDB((s) => s.clients);
  const appts = useDB((s) => s.appts);
  const payments = useDB((s) => s.payments);
  const journey = useDB((s) => s.journey);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [sel, setSel] = useState<Client | null>(null);

  const rows = useMemo(() => {
    return clients
      .map((c) => {
        const mine = appts.filter((a) => a.clientId === c.id);
        const done = mine.filter((a) => a.status === "completed");
        const last = done.at(-1);
        const next = mine.find((a) => new Date(a.start).getTime() > Date.now() && a.status !== "canceled");
        const spend = payments.filter((p) => p.clientId === c.id && p.kind !== "product").reduce((n, p) => n + p.amount, 0);
        return { c, visits: done.length, last, next, spend, noShows: mine.filter((a) => a.status === "no-show").length };
      })
      .filter((r) => (type === "All" || r.c.locType === type) && `${r.c.first} ${r.c.last} ${r.c.phone} ${r.c.email}`.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => b.spend - a.spend);
  }, [clients, appts, payments, q, type]);

  const selRow = sel ? rows.find((r) => r.c.id === sel.id) : null;
  const live = sel ? clients.find((c) => c.id === sel.id) ?? sel : null;

  return (
    <div>
      <p className="eyebrow text-rose">Clients</p>
      <h1 className="display mt-1 text-5xl text-pearl">{clients.length} loc queens & kings</h1>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search clients</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-champagne/40" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone or email" className="min-h-11 w-full rounded-full border border-rose/25 bg-garnet pl-9 pr-4 text-sm text-pearl placeholder:text-champagne/40" />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Loc type">
          {["All", "Traditional", "Microlocs", "Interlocked", "Starter"].map((t) => (
            <button key={t} onClick={() => setType(t)} aria-pressed={type === t} className={cn("min-h-11 rounded-full border px-4 text-sm", type === t ? "border-pink bg-pink/15 text-pink" : "border-rose/25 text-champagne/75")}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) => (
          <button key={r.c.id} onClick={() => setSel(r.c)} className="card-night p-5 text-left transition hover:border-pink/50">
            <div className="flex items-center gap-3">
              <span className="display grid size-12 place-items-center rounded-full bg-gradient-to-br from-rose to-rose-deep text-xl text-ink">
                {r.c.first[0]}
                {r.c.last[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 truncate font-semibold text-pearl">
                  {r.c.first} {r.c.last}
                  {r.c.tags.includes("VIP") && <Star className="size-3.5 fill-rose text-rose" aria-label="VIP" />}
                </p>
                <p className="text-xs text-champagne/55">
                  {r.c.locType} · {r.visits} visits
                </p>
              </div>
              <p className="display text-2xl text-rosegold">{money(Math.round(r.spend))}</p>
            </div>
            <p className="mt-3 text-xs text-champagne/60">
              {r.next ? <span className="text-ok">Next: {fmtDate(r.next.start)}</span> : r.last ? `Last visit ${fmtDate(r.last.start)} · not rebooked` : "No visits yet"}
            </p>
          </button>
        ))}
      </div>

      <Drawer open={!!sel} onClose={() => setSel(null)} title={live ? `${live.first} ${live.last}` : ""}>
        {live && selRow && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["Visits", String(selRow.visits)],
                ["Lifetime", money(Math.round(selRow.spend))],
                ["No-shows", String(selRow.noShows)],
              ].map(([l, v]) => (
                <div key={l} className="rounded-xl bg-ink/40 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-champagne/50">{l}</p>
                  <p className="display text-2xl text-pearl">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={`tel:${live.phone}`} className="btn btn-ghost !min-h-10 text-xs">
                <Phone className="size-4" aria-hidden /> Call
              </a>
              <button onClick={() => toast(`Text sent to ${live.first} (demo)`)} className="btn btn-ghost !min-h-10 text-xs">
                <MessageCircle className="size-4" aria-hidden /> Text
              </button>
              <a href={`mailto:${live.email}`} className="btn btn-ghost !min-h-10 text-xs">
                <Mail className="size-4" aria-hidden /> Email
              </a>
            </div>
            <dl className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs text-champagne/50">Loc type</dt>
                <dd>
                  <select value={live.locType} onChange={(e) => updateClient(live.id, { locType: e.target.value as Client["locType"] })} className="mt-1 w-full rounded-lg border border-rose/25 bg-ink/60 px-2 py-2 text-pearl">
                    {["Traditional", "Microlocs", "Interlocked", "Starter"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-champagne/50">Client since</dt>
                <dd className="mt-2 text-pearl">{fmtDate(live.since + "T12:00:00", { month: "short", year: "numeric" })}</dd>
              </div>
              <div>
                <dt className="text-xs text-champagne/50">Music / show</dt>
                <dd className="mt-1 text-pearl">{live.music || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-champagne/50">Photo consent</dt>
                <dd className="mt-1 text-pearl">{live.photoConsent ? "Yes" : "No"}</dd>
              </div>
            </dl>
            <label className="block text-xs text-champagne/50">
              Private notes (only you see these)
              <textarea key={live.id} defaultValue={live.notes} onBlur={(e) => { updateClient(live.id, { notes: e.target.value }); }} rows={3} className="mt-1 w-full rounded-xl border border-rose/25 bg-ink/60 px-3 py-2 text-sm text-pearl focus:border-pink focus:outline-none" />
            </label>
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne/50">
                <Camera className="size-4 text-pink" aria-hidden /> Loc journey
              </p>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                {journey.filter((j) => j.clientId === live.id).map((j) => (
                  <div key={j.id} className="relative size-24 shrink-0 overflow-hidden rounded-xl">
                    <Image src={j.photo} alt={j.title} fill sizes="96px" className="object-cover" />
                  </div>
                ))}
                {journey.filter((j) => j.clientId === live.id).length === 0 && <p className="text-xs text-champagne/50">Add photos when you check a visit out.</p>}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-champagne/50">History</p>
              <ul className="mt-2 divide-y divide-rose/10">
                {appts
                  .filter((a) => a.clientId === live.id)
                  .slice()
                  .reverse()
                  .slice(0, 8)
                  .map((a) => (
                    <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                      <span>
                        <span className="block text-pearl">{SERVICE_BY_ID[a.serviceId].name}</span>
                        <span className="block text-xs text-champagne/55">{fmtDate(a.start, { month: "short", day: "numeric", year: "numeric" })}</span>
                      </span>
                      <StatusBadge s={a.status} />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
