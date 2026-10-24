"use client";

import dynamic from "next/dynamic";

/** Overlays that are not needed for first paint load after hydration. */
const CartDrawer = dynamic(() => import("@/components/shop/CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const CrownJewelPopup = dynamic(() => import("./CrownJewelPopup").then((m) => m.CrownJewelPopup), { ssr: false });

export function LazyOverlays() {
  return (
    <>
      <CartDrawer />
      <CrownJewelPopup />
    </>
  );
}
