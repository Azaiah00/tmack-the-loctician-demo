"use client";

import { ShoppingBag } from "lucide-react";
import { PRODUCT_BY_HANDLE, SHOP } from "@/lib/products";
import { fmtMoney } from "@/lib/services";
import { useCart } from "./cart";

/** Adds the spritz + oil routine in one tap (2 items → TMACK10 eligible). */
export function BundleCard() {
  const { add } = useCart();
  const s = PRODUCT_BY_HANDLE["loc-moisturizer-spritz"];
  const o = PRODUCT_BY_HANDLE["chebe-growth-oil"];
  const total = s.price + o.price;
  const withCode = total * 0.9;
  return (
    <div className="mt-10 rounded-2xl border border-rose-deep/20 bg-pearl p-6">
      <p className="font-semibold">The Hydrate + Seal routine</p>
      <p className="mt-1 text-sm text-mute">
        {s.name} + {o.name}
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <p>
          <span className="display text-4xl">{fmtMoney(Number(withCode.toFixed(2)))}</span>{" "}
          <span className="text-sm text-mute line-through">{fmtMoney(Number(total.toFixed(2)))}</span>
          <span className="block text-xs text-mute">with code {SHOP.promoCode} at checkout</span>
        </p>
        <button
          onClick={() => {
            add(s.handle, s.variants[0].id);
            add(o.handle, o.variants[0].id);
          }}
          className="btn btn-dark"
        >
          <ShoppingBag className="size-4" aria-hidden /> Add the routine
        </button>
      </div>
    </div>
  );
}
