"use client";

import { useMemo, useState } from "react";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/cn";

const FILTERS = ["All", "Hair Care", "Satin Care"] as const;
const SORTS = { featured: "Featured", low: "Price: low to high", high: "Price: high to low" } as const;

export function ShopGrid() {
  const [f, setF] = useState<(typeof FILTERS)[number]>("All");
  const [sort, setSort] = useState<keyof typeof SORTS>("featured");
  const list = useMemo(() => {
    const l = PRODUCTS.filter((p) => f === "All" || p.category === f);
    if (sort === "low") return [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [f, sort]);

  return (
    <>
      <h2 className="sr-only">Products</h2>
      <div className="flex flex-col gap-4 border-b border-rose/15 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products">
          {FILTERS.map((x) => (
            <button
              key={x}
              onClick={() => setF(x)}
              aria-pressed={f === x}
              className={cn("min-h-10 rounded-full border px-4 text-sm transition", f === x ? "border-pink bg-pink/15 text-pink" : "border-rose/25 text-champagne/80 hover:border-rose")}
            >
              {x}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-champagne/70">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} className="min-h-10 rounded-full border border-rose/25 bg-garnet px-3 text-champagne">
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="sr-only" aria-live="polite">
        {list.length} products
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {list.map((p, i) => (
          <ProductCard key={p.handle} p={p} priority={i < 3} />
        ))}
      </div>
    </>
  );
}
