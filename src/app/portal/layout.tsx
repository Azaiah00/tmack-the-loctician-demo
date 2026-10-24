import type { Metadata } from "next";
import { DemoBanner, Toasts } from "@/components/portal/ui";
import { CartDrawer } from "@/components/shop/CartDrawer";

export const metadata: Metadata = {
  title: { default: "Booking Portal (Demo)", template: "%s · TMack Booking Portal" },
  description: "TMack The Loctician's branded booking portal — client booking and owner dashboard (demo).",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-ink">
      <DemoBanner />
      <main id="main">{children}</main>
      <Toasts />
      <CartDrawer />
    </div>
  );
}
