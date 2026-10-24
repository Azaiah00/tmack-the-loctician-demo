"use client";

import Image from "next/image";
import { AlertTriangle, ExternalLink, PackagePlus } from "lucide-react";
import { PRODUCT_BY_HANDLE, SHOP, shopifyProductUrl } from "@/lib/products";
import { restock, useDB, useNow } from "@/lib/portal/db";
import { Panel, Stat, money } from "../ui";
import { cn } from "@/lib/cn";

export function OwnerShop() {
  const inventory = useDB((s) => s.inventory);
  const payments = useDB((s) => s.payments);
  const since = useNow() - 30 * 86400000;
  const sales30 = payments.filter((p) => p.kind === "product" && new Date(p.at).getTime() >= since).reduce((n, p) => n + p.amount, 0);
  const units = inventory.reduce((n, i) => n + i.sold30, 0);
  const low = inventory.filter((i) => i.stock <= i.reorderAt).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-rose">Crown Care Collection</p>
        <h1 className="display mt-1 text-5xl text-pearl">Shop & inventory</h1>
        <p className="mt-1 text-sm text-champagne/60">Orders check out on your Shopify store ({SHOP.domain.replace("https://", "")}). At launch, stock syncs from Shopify automatically.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Sales · 30 days" value={money(Math.round(sales30))} />
        <Stat label="Units · 30 days" value={String(units)} tone="rose" />
        <Stat label="Products" value={String(inventory.length)} />
        <Stat label="Low stock" value={String(low)} sub={low ? "Reorder soon" : "All good"} tone="rose" />
      </div>
      <Panel title="Inventory">
        <ul className="divide-y divide-rose/10">
          {inventory.map((i) => {
            const p = PRODUCT_BY_HANDLE[i.handle];
            const weeks = i.sold30 ? (i.stock / i.sold30) * 4.3 : 99;
            const isLow = i.stock <= i.reorderAt;
            return (
              <li key={i.handle} className="flex flex-wrap items-center gap-4 py-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                  <Image src={p.image} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-pearl">{p.name}</p>
                  <p className="text-xs text-champagne/55">
                    {money(p.price)} · {i.sold30} sold in 30 days · ~{weeks > 50 ? "50+" : weeks.toFixed(1)} weeks of stock
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn("display text-3xl tabular-nums", isLow ? "text-warn" : "text-pearl")}>{i.stock}</p>
                  <p className="text-[10px] uppercase tracking-wider text-champagne/50">in stock</p>
                </div>
                {isLow && (
                  <span className="flex items-center gap-1 rounded-full bg-warn/15 px-2.5 py-1 text-xs text-warn">
                    <AlertTriangle className="size-3.5" aria-hidden /> Low
                  </span>
                )}
                <div className="flex gap-2">
                  <button onClick={() => restock(i.handle, 24)} className="btn btn-ghost !min-h-10 !px-3 text-xs">
                    <PackagePlus className="size-4" aria-hidden /> +24
                  </button>
                  <a href={shopifyProductUrl(p)} target="_blank" rel="noopener" className="grid size-10 place-items-center rounded-full border border-rose/25 text-champagne/70 hover:text-pearl" aria-label={`Open ${p.name} on Shopify`}>
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
