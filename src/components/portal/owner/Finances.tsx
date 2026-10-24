"use client";

import { useMemo, useState } from "react";
import { Download, PiggyBank, Receipt, ShoppingBag, Sparkles, Wallet } from "lucide-react";
import { SERVICE_BY_ID } from "@/lib/services";
import { addDays, startOfDay, useDB } from "@/lib/portal/db";
import { Bars, Panel, Stat, fmtDate, money } from "../ui";
import { cn } from "@/lib/cn";

const PERIODS = { month: "This month", last: "Last month", d90: "Last 90 days" } as const;

export function OwnerFinances() {
  const appts = useDB((s) => s.appts);
  const payments = useDB((s) => s.payments);
  const [period, setPeriod] = useState<keyof typeof PERIODS>("month");

  const f = useMemo(() => {
    const today = startOfDay(new Date());
    const [from, to] =
      period === "month"
        ? [new Date(today.getFullYear(), today.getMonth(), 1), addDays(today, 1)]
        : period === "last"
          ? [new Date(today.getFullYear(), today.getMonth() - 1, 1), new Date(today.getFullYear(), today.getMonth(), 1)]
          : [addDays(today, -90), addDays(today, 1)];
    const inR = (iso: string) => new Date(iso) >= from && new Date(iso) < to;
    const pay = payments.filter((p) => inR(p.at));
    const services = pay.filter((p) => p.kind !== "product").reduce((n, p) => n + p.amount, 0);
    const products = pay.filter((p) => p.kind === "product").reduce((n, p) => n + p.amount, 0);
    const deposits = pay.filter((p) => p.kind === "deposit").reduce((n, p) => n + p.amount, 0);
    const done = appts.filter((a) => inR(a.start) && a.status === "completed");
    const noShowKept = appts.filter((a) => inR(a.start) && a.status === "no-show").reduce((n, a) => n + a.deposit, 0);
    const avgTicket = done.length ? done.reduce((n, a) => n + a.price, 0) / done.length : 0;
    const bySvc = new Map<string, number>();
    done.forEach((a) => bySvc.set(a.serviceId, (bySvc.get(a.serviceId) ?? 0) + a.price));
    const byMethod = new Map<string, number>();
    pay.filter((p) => p.kind === "balance").forEach((p) => byMethod.set(p.method, (byMethod.get(p.method) ?? 0) + p.amount));
    const weeks: { label: string; value: number; sub: number }[] = [];
    for (let s = new Date(from); s < to; s = addDays(s, 7)) {
      const e = addDays(s, 7);
      const w = payments.filter((p) => new Date(p.at) >= s && new Date(p.at) < e && new Date(p.at) < to);
      weeks.push({ label: s.toLocaleDateString("en-US", { month: "numeric", day: "numeric" }), value: w.filter((p) => p.kind !== "product").reduce((n, p) => n + p.amount, 0), sub: w.filter((p) => p.kind === "product").reduce((n, p) => n + p.amount, 0) });
    }
    return { pay: pay.sort((a, b) => b.at.localeCompare(a.at)), services, products, deposits, done: done.length, noShowKept, avgTicket, bySvc: [...bySvc.entries()].sort((a, b) => b[1] - a[1]), byMethod: [...byMethod.entries()].sort((a, b) => b[1] - a[1]), weeks };
  }, [appts, payments, period]);

  const gross = f.services + f.products;
  const maxSvc = Math.max(1, ...f.bySvc.map((x) => x[1]));
  const maxMethod = Math.max(1, ...f.byMethod.map((x) => x[1]));

  const exportCsv = () => {
    const rows = [["Date", "Type", "Description", "Method", "Amount"], ...f.pay.map((p) => [new Date(p.at).toLocaleDateString("en-US"), p.kind, p.label, p.method, p.amount.toFixed(2)])];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `tmack-finances-${period}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-rose">Finances</p>
          <h1 className="display mt-1 text-5xl text-pearl">{money(Math.round(gross))}</h1>
          <p className="text-sm text-champagne/60">Gross revenue · {PERIODS[period].toLowerCase()}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PERIODS).map(([k, v]) => (
            <button key={k} onClick={() => setPeriod(k as keyof typeof PERIODS)} aria-pressed={period === k} className={cn("min-h-10 rounded-full border px-4 text-sm", period === k ? "border-pink bg-pink/15 text-pink" : "border-rose/25 text-champagne/75")}>
              {v}
            </button>
          ))}
          <button onClick={exportCsv} className="btn btn-ghost !min-h-10 text-sm">
            <Download className="size-4" aria-hidden /> CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Services" value={money(Math.round(f.services))} sub={`${f.done} completed`} icon={Sparkles} />
        <Stat label="Crown Care shop" value={money(Math.round(f.products))} sub="Shopify orders" icon={ShoppingBag} tone="rose" />
        <Stat label="Average ticket" value={money(Math.round(f.avgTicket))} sub="per completed visit" icon={Receipt} />
        <Stat label="Deposits" value={money(Math.round(f.deposits))} sub={`${money(f.noShowKept)} kept from no-shows`} icon={Wallet} tone="rose" />
      </div>

      <div className="grid [&>*]:min-w-0 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Revenue by week">
          <Bars data={f.weeks} height={200} />
        </Panel>
        <Panel title="Set aside" action={<PiggyBank className="size-5 text-rose" aria-hidden />}>
          <p className="text-sm text-champagne/70">A simple guide so tax time is never a surprise.</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-champagne/70">Gross revenue</dt>
              <dd className="text-pearl">{money(Math.round(gross))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-champagne/70">Suggested tax set-aside (25%)</dt>
              <dd className="font-semibold text-warn">{money(Math.round(gross * 0.25))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-champagne/70">Product restock budget (40% of shop)</dt>
              <dd className="text-pearl">{money(Math.round(f.products * 0.4))}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[11px] text-champagne/45">Estimates only — confirm percentages with your accountant.</p>
        </Panel>
      </div>

      <div className="grid [&>*]:min-w-0 gap-6 xl:grid-cols-2">
        <Panel title="By service">
          <ul className="space-y-3">
            {f.bySvc.map(([id, v]) => (
              <li key={id}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0 text-champagne/85">{SERVICE_BY_ID[id].name}</span>
                  <span className="tabular-nums text-pearl">{money(Math.round(v))}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink">
                  <div className="h-full rounded-full bg-gradient-to-r from-rose-deep to-pink" style={{ width: `${(v / maxSvc) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="How clients pay (balances)">
          <ul className="space-y-3">
            {f.byMethod.map(([m, v]) => (
              <li key={m}>
                <div className="flex justify-between text-sm">
                  <span className="text-champagne/85">{m}</span>
                  <span className="tabular-nums text-pearl">{money(Math.round(v))}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink">
                  <div className="h-full rounded-full bg-gradient-to-r from-rose to-champagne" style={{ width: `${(v / maxMethod) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Transactions">
        <div className="md:overflow-x-auto">
          <table className="block w-full text-left text-sm md:table md:min-w-[560px]">
            <thead className="hidden text-xs uppercase tracking-[0.14em] text-champagne/50 md:table-header-group">
              <tr>
                <th scope="col" className="py-2 font-semibold">Date</th>
                <th scope="col" className="py-2 font-semibold">Description</th>
                <th scope="col" className="py-2 font-semibold">Method</th>
                <th scope="col" className="py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="block divide-y divide-rose/10 md:table-row-group">
              {f.pay.slice(0, 40).map((p) => (
                <tr key={p.id} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 py-3 md:table-row md:py-0">
                  <td className="col-start-1 row-start-2 text-xs text-champagne/60 md:whitespace-nowrap md:py-2.5 md:pr-3 md:text-sm md:text-champagne/70">{fmtDate(p.at, { month: "short", day: "numeric" })}</td>
                  <td className="col-start-1 row-start-1 min-w-0 text-pearl md:py-2.5 md:pr-3">
                    {p.label}
                    <span className={cn("ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", p.kind === "product" ? "bg-rose/15 text-rose" : p.kind === "deposit" ? "bg-ok/15 text-ok" : "bg-pink/15 text-pink")}>{p.kind}</span>
                  </td>
                  <td className="col-start-2 row-start-2 text-right text-xs text-champagne/60 md:py-2.5 md:pr-3 md:text-left md:text-sm md:text-champagne/70">{p.method}</td>
                  <td className="col-start-2 row-start-1 text-right tabular-nums text-pearl md:py-2.5">{money(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
