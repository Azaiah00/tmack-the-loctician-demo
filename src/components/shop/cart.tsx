"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCT_BY_HANDLE, SHOP, shopifyCartUrl } from "@/lib/products";

export type CartLine = { handle: string; variantId: string; qty: number };

type CartCtx = {
  lines: CartLine[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (handle: string, variantId: string, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  checkoutUrl: string;
  freeShipRemaining: number;
  promoEligibleCount: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "tmack-bag-v1";

function readSaved(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed.filter((l) => PRODUCT_BY_HANDLE[l.handle] && l.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Restore the bag after hydration (per-viewer convenience only).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(readSaved());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable: bag lives in memory only */
    }
  }, [lines, hydrated]);

  const add = useCallback((handle: string, variantId: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.variantId === variantId);
      if (found) return prev.map((l) => (l.variantId === variantId ? { ...l, qty: Math.min(20, l.qty + qty) } : l));
      return [...prev, { handle, variantId, qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.variantId !== variantId) : prev.map((l) => (l.variantId === variantId ? { ...l, qty: Math.min(20, qty) } : l)),
    );
  }, []);

  const remove = useCallback((variantId: string) => setLines((prev) => prev.filter((l) => l.variantId !== variantId)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + (PRODUCT_BY_HANDLE[l.handle]?.price ?? 0) * l.qty, 0);
    const promoEligibleCount = lines.reduce((n, l) => n + (PRODUCT_BY_HANDLE[l.handle]?.noPromos ? 0 : l.qty), 0);
    return {
      lines,
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
      count,
      subtotal,
      checkoutUrl: shopifyCartUrl(lines.map((l) => ({ variantId: l.variantId, qty: l.qty }))),
      freeShipRemaining: Math.max(0, SHOP.freeShippingOver - subtotal),
      promoEligibleCount,
    };
  }, [lines, open, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
