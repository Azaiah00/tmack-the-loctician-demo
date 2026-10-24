import type { Metadata } from "next";
import Image from "next/image";
import { Leaf, PackageCheck, RefreshCcw, Truck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Accent } from "@/components/ui/Kit";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { BundleCard } from "@/components/shop/BundleCard";
import { PRODUCTS, SHOP } from "@/lib/products";
import { PRODUCT_REVIEWS } from "@/lib/reviews";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop the TMack Crown Care Collection — Loc Spritz, Chebe Oil & Satin Bonnets",
  description:
    "All-natural loc care from TMack The Loctician: Loc Moisturizer Spritz, Chebe Growth Oil and satin bonnets. Free shipping over $100. Code TMACK10 for 10% off 2+ items.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE.url}/shop/${p.handle}`,
      name: p.name,
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <PageHero
        frame="front"
        eyebrow="TMack Crown Care Collection"
        title={
          <>
            Crown care, <Accent>at home.</Accent>
          </>
        }
        intro="Protect your crown. Nurture your crown. Love your crown. All-natural loc care and satin essentials, made by your loctician."
      >
        <div className="mt-8 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-pink/15 px-4 py-2 text-pink">Free shipping over ${SHOP.freeShippingOver}</span>
          <span className="rounded-full bg-rose/15 px-4 py-2 text-rose">
            Code {SHOP.promoCode} · {SHOP.promoText}
          </span>
        </div>
      </PageHero>

      <section className="bg-ink pb-24" aria-label="Products">
        <div className="wrap">
          <ShopGrid />
        </div>
      </section>

      <section aria-labelledby="routine-title" className="bg-blush py-24 text-cocoa">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-garnet">
            <Image src="/media/shop/routine-duo.webp" alt="Loc Moisturizer Spritz and Chebe Growth Oil together" fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow text-rose-ink">The two-step routine</p>
            <h2 id="routine-title" className="display mt-4 text-[clamp(2.3rem,5vw,4rem)]">
              Hydrate. Seal. <Accent>Grow.</Accent>
            </h2>
            <ol className="mt-8 space-y-5">
              <li className="flex gap-4">
                <span className="display grid size-11 shrink-0 place-items-center rounded-full bg-cocoa text-xl text-pearl">1</span>
                <p className="leading-relaxed text-mute">
                  <strong className="text-cocoa">Spritz.</strong> Mist the Loc Moisturizer Spritz over locs and scalp to hydrate and refresh.
                </p>
              </li>
              <li className="flex gap-4">
                <span className="display grid size-11 shrink-0 place-items-center rounded-full bg-cocoa text-xl text-pearl">2</span>
                <p className="leading-relaxed text-mute">
                  <strong className="text-cocoa">Seal.</strong> Follow with Chebe Growth Oil to lock moisture in and nourish the scalp — moisture that lasts longer.
                </p>
              </li>
              <li className="flex gap-4">
                <span className="display grid size-11 shrink-0 place-items-center rounded-full bg-cocoa text-xl text-pearl">3</span>
                <p className="leading-relaxed text-mute">
                  <strong className="text-cocoa">Protect.</strong> Sleep in satin to cut friction, frizz and lint between visits.
                </p>
              </li>
            </ol>
            <BundleCard />
          </div>
        </div>
      </section>

      <section aria-labelledby="shop-trust" className="bg-pearl py-20 text-cocoa">
        <h2 id="shop-trust" className="sr-only">
          Shopping details
        </h2>
        <div className="wrap grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Leaf, t: "All natural & organic", d: "Cruelty free formulas made with love." },
            { icon: Truck, t: "Ships every Monday", d: `Free shipping over $${SHOP.freeShippingOver}. Local pickup available at checkout.` },
            { icon: PackageCheck, t: "Secure Shopify checkout", d: "Your bag checks out on tmackcrowncare.com." },
            { icon: RefreshCcw, t: "Sanitary, final sale", d: "Report damaged or incorrect items within 48 hours." },
          ].map((f) => (
            <div key={f.t} className="card-light p-6">
              <f.icon className="size-6 text-magenta" aria-hidden />
              <p className="mt-4 font-semibold">{f.t}</p>
              <p className="mt-1 text-sm text-mute">{f.d}</p>
            </div>
          ))}
        </div>
        <div className="wrap mt-10 grid gap-4 md:grid-cols-2">
          {PRODUCT_REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-rose-deep/15 bg-blush/50 p-6">
              <p className="display text-2xl">“{r.title}”</p>
              <blockquote className="mt-2 text-mute">{r.text}</blockquote>
              <figcaption className="mt-3 text-sm font-semibold">{r.name}</figcaption>
            </figure>
          ))}
        </div>
        <p className="wrap mt-6 text-xs text-mute">{SHOP.returns}</p>
      </section>
    </>
  );
}
