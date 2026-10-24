import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { IS_DEMO_HOST, SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { CartProvider } from "@/components/shop/cart";

const cormorant = localFont({
  src: [
    { path: "./fonts/cormorant-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorant-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});
const manrope = localFont({ src: "./fonts/manrope-var.woff2", variable: "--font-manrope", display: "swap", weight: "200 800" });
const pinyon = localFont({ src: "./fonts/pinyon.woff2", variable: "--font-pinyon", display: "swap", weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "TMack The Loctician | Loctician in Midlothian, VA — Retwists, Microlocs & Loc Repair",
    template: "%s | TMack The Loctician — Midlothian, VA",
  },
  description:
    "Master Loctician & Certified Micro Loc Specialist in Midlothian, VA (Chesterfield). Loc retwists, microloc reties, interlocking, loc detox and full loc reconstruction. 5.0★ on Google. Book online.",
  applicationName: SITE.name,
  keywords: [
    "loctician Midlothian VA",
    "loctician Chesterfield VA",
    "loctician Richmond VA",
    "microlocs Midlothian",
    "loc retwist Midlothian",
    "loc reconstruction Virginia",
    "interlocking locs Richmond",
    "starter locs Midlothian",
    "loc detox",
  ],
  // Share card (iMessage, Android Messages, WhatsApp, Facebook, Instagram DMs). No og:url on purpose:
  // previews always open exactly the link that was sent.
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    title: "TMack The Loctician — Healthy locs start here.",
    description: "Master Loctician in Midlothian, VA · Retwists, microlocs, interlocking & loc reconstruction · TMack Crown Care products · 5.0★ on Google.",
    images: [{ url: "/og/tmack-site.jpg", width: 1200, height: 630, type: "image/jpeg", alt: "TMack The Loctician and TMack Crown Care logos — Healthy locs start here" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TMack The Loctician — Healthy locs start here.",
    description: "Master Loctician in Midlothian, VA · Retwists, microlocs, interlocking & loc reconstruction · 5.0★ on Google.",
    images: ["/og/tmack-site.jpg"],
  },
  ...(IS_DEMO_HOST ? { robots: { index: false, follow: false } } : {}),
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0e060b",
  width: "device-width",
  initialScale: 1,
};

const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": `${SITE.url}/#business`,
  name: SITE.name,
  legalName: SITE.legalName,
  description: SITE.fromTheBusiness,
  url: SITE.url,
  telephone: "+1-804-464-8208",
  email: SITE.email,
  image: [`${SITE.url}/og.jpg`, `${SITE.url}/media/brand/tmack-portrait.webp`],
  logo: `${SITE.url}/media/brand/tmack-logo-512.png`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.zip,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  areaServed: ["Midlothian VA", "Chesterfield County VA", "Richmond VA", "Brandermill VA", "Moseley VA"],
  openingHoursSpecification: SITE.hours
    .filter((h) => h.open)
    .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${dayMap[SITE.hours.indexOf(h)]}`, opens: h.open, closes: h.close })),
  aggregateRating: { "@type": "AggregateRating", ratingValue: SITE.rating.value, reviewCount: SITE.rating.count, bestRating: 5 },
  sameAs: [SITE.socials.instagram, SITE.socials.tiktok, SITE.shopUrl],
  paymentAccepted: "Apple Pay, Cash App, PayPal, Klarna, Affirm",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Loc services",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      price: s.price,
      priceCurrency: "USD",
      itemOffered: { "@type": "Service", name: s.name, description: s.short },
    })),
  },
  founder: { "@type": "Person", name: "TMack", jobTitle: "Master Loctician" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${pinyon.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
