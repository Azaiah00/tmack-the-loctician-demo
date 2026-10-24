import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Leaf, Truck } from "lucide-react";
import { PRODUCTS, PRODUCT_BY_HANDLE, SHOP, shopifyProductUrl } from "@/lib/products";
import { fmtMoney } from "@/lib/services";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductBuyBox } from "@/components/shop/ProductBuyBox";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const p = PRODUCT_BY_HANDLE[handle];
  if (!p) return {};
  return {
    title: `${p.name}${p.size ? ` (${p.size})` : ""} — TMack Crown Care Collection`,
    description: `${p.short} ${p.description}`.slice(0, 158),
    alternates: { canonical: `/shop/${p.handle}` },
    openGraph: { images: [{ url: p.image, alt: p.imageAlt }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = PRODUCT_BY_HANDLE[handle];
  if (!p) notFound();
  const others = PRODUCTS.filter((x) => x.handle !== p.handle).slice(0, 3);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `TMack Crown Care Collection ${p.name}`,
    image: `${SITE.url}${p.image}`,
    description: p.description,
    brand: { "@type": "Brand", name: "TMack Crown Care Collection" },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "USD",
      url: shopifyProductUrl(p),
      seller: { "@type": "Organization", name: "TMack Crown Care" },
    },
  };
  const images = [{ src: p.image, alt: p.imageAlt }, ...(p.gallery ?? [])];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <section className="bg-ink pb-20 pt-28 lg:pt-32">
        <div className="wrap">
          <Link href="/shop" className="inline-flex min-h-11 items-center gap-1 text-sm text-champagne/70 hover:text-pearl">
            <ChevronLeft className="size-4" aria-hidden /> All products
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery images={images} />
            <div className="lg:pt-6">
              <p className="eyebrow text-rose">TMack Crown Care Collection</p>
              <h1 className="display mt-3 text-[clamp(2.4rem,5vw,4rem)] text-pearl">{p.name}</h1>
              <p className="mt-2 text-champagne/70">{p.size ?? p.short}</p>
              <p className="display mt-6 text-4xl text-rosegold">{fmtMoney(p.price)}</p>
              <p className="mt-6 leading-relaxed text-champagne/85">{p.description}</p>
              <ProductBuyBox p={p} />
              <div className="mt-6 grid gap-2 text-sm text-champagne/75">
                <p className="flex items-center gap-2">
                  <Truck className="size-4 text-pink" aria-hidden /> {SHOP.shipsOn}. Free shipping over ${SHOP.freeShippingOver}.
                </p>
                <p className="flex items-center gap-2">
                  <Leaf className="size-4 text-pink" aria-hidden /> All natural &amp; organic · Made with love
                </p>
              </div>
              {p.note && <p className="mt-4 rounded-xl bg-wine/40 px-4 py-3 text-sm text-champagne/85">{p.note}</p>}

              <div className="mt-10 divide-y divide-rose/15 border-y border-rose/15">
                <Detail title="Benefits" open>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {p.benefits.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-pink" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                </Detail>
                {p.perfectFor && <Detail title="Perfect for">{p.perfectFor.join(" · ")}</Detail>}
                {p.ingredients && <Detail title="Key ingredients">{p.ingredients.join(", ")}.</Detail>}
                {p.howTo && (
                  <Detail title="How to use">
                    <ol className="list-decimal space-y-1 pl-5">
                      {p.howTo.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ol>
                  </Detail>
                )}
                <Detail title="Shipping & returns">{SHOP.returns}</Detail>
              </div>
              <p className="mt-4 text-xs text-champagne/50">For external use only. Results vary by person and hair care routine.</p>
            </div>
          </div>
        </div>
      </section>
      <section aria-labelledby="more" className="bg-garnet py-20">
        <div className="wrap">
          <h2 id="more" className="display text-4xl text-pearl">
            Complete your routine
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {others.map((o) => (
              <ProductCard key={o.handle} p={o} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Detail({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="group py-1" open={open}>
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-semibold text-pearl [&::-webkit-details-marker]:hidden">
        {title}
        <span className="text-xl text-pink transition-transform group-open:rotate-45" aria-hidden>
          +
        </span>
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-champagne/80">{children}</div>
    </details>
  );
}
