"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Minus, Plus, ShoppingBag, Truck, X } from "lucide-react";
import { useCart } from "./cart";
import { PRODUCT_BY_HANDLE, SHOP } from "@/lib/products";
import { fmtMoney } from "@/lib/services";

export function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, subtotal, count, checkoutUrl, freeShipRemaining, promoEligibleCount } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, [open, setOpen]);

  const pct = Math.min(100, (subtotal / SHOP.freeShippingOver) * 100);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Your bag">
          <motion.button
            aria-label="Close bag"
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="light-scroll absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-pearl text-cocoa shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-rose-deep/15 px-6 py-5">
              <div>
                <p className="eyebrow text-rose-ink">Crown Care Collection</p>
                <h2 className="display text-3xl">Your bag {count > 0 && <span className="text-mute">({count})</span>}</h2>
              </div>
              <button ref={closeRef} onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full hover:bg-blush" aria-label="Close bag">
                <X className="size-5" />
              </button>
            </header>

            <div className="border-b border-rose-deep/15 px-6 py-4">
              <p className="flex items-center gap-2 text-sm">
                <Truck className="size-4 text-magenta" aria-hidden />
                {freeShipRemaining > 0 ? (
                  <span>
                    You are <strong>{fmtMoney(Number(freeShipRemaining.toFixed(2)))}</strong> away from free shipping
                  </span>
                ) : (
                  <strong>You unlocked free shipping</strong>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blush" aria-hidden>
                <div className="h-full rounded-full bg-gradient-to-r from-magenta via-pink to-rose transition-[width] duration-700" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <ShoppingBag className="mx-auto size-10 text-rose-deep" aria-hidden />
                    <p className="display mt-4 text-2xl">Your bag is empty</p>
                    <p className="mt-2 text-sm text-mute">Hydrate. Seal. Grow. Start with the spritz.</p>
                    <Link href="/shop" onClick={() => setOpen(false)} className="btn btn-dark mt-6">
                      Shop the collection
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="space-y-4">
                  {lines.map((l) => {
                    const p = PRODUCT_BY_HANDLE[l.handle];
                    if (!p) return null;
                    const v = p.variants.find((x) => x.id === l.variantId);
                    return (
                      <li key={l.variantId} className="flex gap-4 rounded-2xl border border-rose-deep/15 bg-white/60 p-3">
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-garnet">
                          <Image src={p.image} alt="" fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold leading-tight">{p.name}</p>
                          <p className="text-xs text-mute">{p.variants.length > 1 ? v?.label : p.size}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-rose-deep/25">
                              <button className="grid size-11 place-items-center" onClick={() => setQty(l.variantId, l.qty - 1)} aria-label={`Decrease ${p.name} quantity`}>
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                                {l.qty}
                              </span>
                              <button className="grid size-11 place-items-center" onClick={() => setQty(l.variantId, l.qty + 1)} aria-label={`Increase ${p.name} quantity`}>
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <p className="font-semibold tabular-nums">{fmtMoney(Number((p.price * l.qty).toFixed(2)))}</p>
                          </div>
                          <button onClick={() => remove(l.variantId)} className="mt-1 inline-flex min-h-10 items-center pr-3 text-xs text-mute underline-offset-2 hover:underline">
                            Remove
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-rose-deep/15 px-6 py-5">
                {promoEligibleCount >= 2 && (
                  <p className="mb-3 rounded-xl bg-blush px-3 py-2 text-sm">
                    Use code <strong className="tracking-wider">{SHOP.promoCode}</strong> at checkout for {SHOP.promoText}.
                  </p>
                )}
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-mute">Subtotal</span>
                  <span className="display text-3xl tabular-nums">{fmtMoney(Number(subtotal.toFixed(2)))}</span>
                </div>
                <p className="mt-1 text-xs text-mute">Shipping and tax calculated at checkout. {SHOP.shipsOn}.</p>
                <a href={checkoutUrl} className="btn btn-primary mt-4 w-full" rel="noopener">
                  <Lock className="size-4" aria-hidden /> Secure checkout
                </a>
                <p className="mt-2 text-center text-[11px] text-mute">Checkout is on TMack Crown Care’s secure Shopify store.</p>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
