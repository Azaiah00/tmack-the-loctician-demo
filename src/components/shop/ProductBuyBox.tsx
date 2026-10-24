"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import type { Product } from "@/lib/products";
import { shopifyCartUrl } from "@/lib/products";
import { useCart } from "./cart";
import { cn } from "@/lib/cn";

export function ProductBuyBox({ p }: { p: Product }) {
  const { add } = useCart();
  const [variant, setVariant] = useState(p.variants[0].id);
  const [qty, setQty] = useState(1);
  return (
    <div className="mt-8 space-y-5">
      {p.variants.length > 1 && (
        <fieldset>
          <legend className="text-sm font-semibold text-pearl">Color</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.variants.map((v) => (
              <label
                key={v.id}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center rounded-full border px-5 text-sm transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pink",
                  variant === v.id ? "border-pink bg-pink/15 text-pink" : "border-rose/30 text-champagne/80",
                )}
              >
                <input type="radio" name="variant" value={v.id} checked={variant === v.id} onChange={() => setVariant(v.id)} className="sr-only" />
                {v.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-rose/30">
          <button className="grid size-12 place-items-center text-champagne" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center tabular-nums text-pearl" aria-live="polite" aria-label={`Quantity ${qty}`}>
            {qty}
          </span>
          <button className="grid size-12 place-items-center text-champagne" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity">
            <Plus className="size-4" />
          </button>
        </div>
        <button onClick={() => add(p.handle, variant, qty)} className="btn btn-primary flex-1">
          <ShoppingBag className="size-4" aria-hidden /> Add to bag
        </button>
      </div>
      <a href={shopifyCartUrl([{ variantId: variant, qty }])} className="btn btn-ghost w-full">
        <Zap className="size-4" aria-hidden /> Buy now
      </a>
    </div>
  );
}
