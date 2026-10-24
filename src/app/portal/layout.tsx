import type { Metadata } from "next";
import { DemoBanner, Toasts } from "@/components/portal/ui";
import { CartDrawer } from "@/components/shop/CartDrawer";

export const metadata: Metadata = {
  title: { default: "Booking Portal (Demo)", template: "%s · TMack Booking Portal" },
  description: "TMack The Loctician's branded booking portal — client booking and owner dashboard (demo).",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: {
    type: "website",
    siteName: "TMack The Loctician",
    title: "Book with TMack — Booking Portal",
    description: "Pick your service and time in under a minute. Deposits, reminders and your loc journey in one place.",
    images: [{ url: "/og/tmack-booking.jpg", width: 1200, height: 630, type: "image/jpeg", alt: "TMack booking portal with TMack The Loctician and Crown Care logos" }],
  },
  twitter: { card: "summary_large_image", title: "Book with TMack — Booking Portal", images: ["/og/tmack-booking.jpg"] },
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
