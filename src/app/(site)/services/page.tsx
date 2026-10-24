import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarHeart, Check, Clock, Info, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Accent, SectionTitle } from "@/components/ui/Kit";
import { FaqList } from "@/components/ui/FaqList";
import { ADD_ONS, SERVICES, fmtDuration, fmtMoney } from "@/lib/services";
import { BOOK_HREF, SITE } from "@/lib/site";
import { FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Loc Services & Prices — Retwists, Microlocs, Interlocking, Reconstruction",
  description:
    "Full loc service menu with prices: palm roll retwist $120, microloc retie from $175, interlocking from $125, loc reconstruction from $325, microloc consultation $32. Midlothian, VA.",
  alternates: { canonical: "/services" },
};

const order = ["Restoration", "Maintenance", "Microlocs", "Interlocking", "New Locs"] as const;

export default function ServicesPage() {
  const groups = order.map((c) => ({ c, items: SERVICES.filter((s) => s.category === c) })).filter((g) => g.items.length);
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.name,
        description: s.description,
        provider: { "@id": `${SITE.url}/#business` },
        offers: { "@type": "Offer", price: s.price, priceCurrency: "USD" },
      },
    })),
  };
  const bookFor = (id: string) => (BOOK_HREF.startsWith("/") ? `${BOOK_HREF}?service=${id}` : BOOK_HREF);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd).replace(/</g, "\\u003c") }} />
      <PageHero
        frame="hand"
        eyebrow="Services & prices"
        title={
          <>
            The <Accent>menu.</Accent>
          </>
        }
        intro="Every service, every add-on, every price — exactly as you’ll see them when you book. A $30 deposit + $2 booking fee secures most appointments and applies to your service."
      >
        <nav aria-label="Service categories" className="mt-8 flex flex-wrap gap-2">
          {groups.map((g) => (
            <a key={g.c} href={`#${g.c.toLowerCase().replace(/\s/g, "-")}`} className="inline-flex min-h-11 items-center rounded-full border border-rose/30 px-4 text-sm text-champagne/85 hover:border-pink hover:text-pearl">
              {g.c}
            </a>
          ))}
          <a href="#add-ons" className="inline-flex min-h-11 items-center rounded-full border border-rose/30 px-4 text-sm text-champagne/85 hover:border-pink hover:text-pearl">
            Add-ons
          </a>
        </nav>
      </PageHero>

      <div className="bg-ink pb-24">
        <div className="wrap space-y-20">
          {groups.map((g) => (
            <section key={g.c} id={g.c.toLowerCase().replace(/\s/g, "-")} aria-labelledby={`h-${g.c}`} className="scroll-mt-28">
              <h2 id={`h-${g.c}`} className="eyebrow mb-6 flex items-center gap-4 text-rose">
                {g.c}
                <span className="glitter-line flex-1" aria-hidden />
              </h2>
              <div className="grid gap-6">
                {g.items.map((s) => (
                  <article key={s.id} id={s.slug} className="card-night reveal grid scroll-mt-28 overflow-hidden md:grid-cols-[320px_1fr]">
                    <div className="relative aspect-[4/3] bg-blush md:aspect-auto">
                      <Image src={s.image} alt={s.imageAlt} fill sizes="(max-width: 768px) 100vw, 320px" className="object-cover" />
                    </div>
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="display text-3xl leading-tight text-pearl sm:text-4xl">{s.name}</h3>
                          <p className="mt-1 text-champagne/70">{s.short}</p>
                        </div>
                        <div className="text-right">
                          <p className="display text-4xl text-rosegold">{fmtMoney(s.price, s.from)}</p>
                          <p className="mt-1 flex items-center justify-end gap-1.5 text-sm text-champagne/70">
                            <Clock className="size-4 text-pink" aria-hidden /> {fmtDuration(s.minutes)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-5 leading-relaxed text-champagne/85">{s.description}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {s.includes.map((i) => (
                          <li key={i} className="flex items-center gap-1.5 rounded-full bg-wine/50 px-3 py-1.5 text-xs text-champagne">
                            <Check className="size-3.5 text-pink" aria-hidden /> {i}
                          </li>
                        ))}
                      </ul>
                      {s.notFor && <p className="mt-4 text-sm font-semibold text-pink">{s.notFor}</p>}
                      <div className="mt-6 flex flex-col gap-4 border-t border-rose/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-start gap-2 text-sm text-champagne/70">
                          <Info className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden /> {s.depositNote}
                        </p>
                        <Link href={bookFor(s.id)} className="btn btn-primary shrink-0">
                          <CalendarHeart className="size-4" aria-hidden /> Book
                        </Link>
                      </div>
                      {s.addOnIds.length > 0 && (
                        <details className="group mt-5">
                          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center text-sm font-semibold text-rose hover:text-pink [&::-webkit-details-marker]:hidden">
                            <span className="group-open:hidden">Show {s.addOnIds.length} available add-ons</span>
                            <span className="hidden group-open:inline">Hide add-ons</span>
                          </summary>
                          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                            {s.addOnIds.map((id) => {
                              const a = ADD_ONS[id];
                              return (
                                <li key={id} className="flex items-start justify-between gap-3 rounded-xl bg-garnet px-3 py-2.5 text-sm">
                                  <span className="text-champagne/85">{a.name}</span>
                                  <span className="shrink-0 font-semibold text-pearl">{a.contactFirst ? "Contact first" : `+${fmtMoney(a.price, a.from)}`}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </details>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section id="add-ons" aria-labelledby="addons-title" className="scroll-mt-28">
            <SectionTitle
              id="addons-title"
              eyebrow="Add-ons"
              title={
                <>
                  Make it <Accent>yours.</Accent>
                </>
              }
              intro="Add treatments, length, density or a finishing style when you book. Times are added to your appointment automatically."
            />
            <div className="mt-10 overflow-hidden rounded-[1.25rem] border border-rose/15">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Add-on services with added time and price</caption>
                <thead className="bg-wine/40 text-xs uppercase tracking-[0.18em] text-rose">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold sm:px-6">
                      Add-on
                    </th>
                    <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">
                      Adds
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-6">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose/10">
                  {Object.values(ADD_ONS).map((a) => (
                    <tr key={a.id} className="bg-garnet/60">
                      <td className="px-4 py-3.5 sm:px-6">
                        <p className="text-pearl">{a.name}</p>
                        {a.detail && <p className="mt-0.5 text-xs text-champagne/60">{a.detail}</p>}
                      </td>
                      <td className="hidden px-4 py-3.5 text-champagne/70 sm:table-cell">{a.contactFirst ? "Varies" : fmtDuration(a.minutes)}</td>
                      <td className="px-4 py-3.5 text-right font-semibold text-pearl sm:px-6">{a.contactFirst ? "Contact first" : fmtMoney(a.price, a.from)}</td>
                    </tr>
                  ))}
                  <tr className="bg-garnet/60">
                    <td className="px-4 py-3.5 sm:px-6">
                      <p className="text-pearl">Microlocs with extensions</p>
                      <p className="mt-0.5 text-xs text-champagne/60">Quoted at your consultation.</p>
                    </td>
                    <td className="hidden px-4 py-3.5 text-champagne/70 sm:table-cell">4 hr+</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-pearl sm:px-6">$350+</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-champagne/60">Extended time beyond what’s reserved may be $50/hour — always discussed and approved by you first.</p>
          </section>

          <section aria-labelledby="svc-faq" className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionTitle id="svc-faq" eyebrow="Before you book" title={<>Service questions</>} />
              <a href={SITE.phoneHref} className="btn btn-ghost mt-8">
                <Phone className="size-4" aria-hidden /> Ask TMack
              </a>
            </div>
            <FaqList tone="dark" items={FAQ.slice(1, 5)} />
          </section>
        </div>
      </div>
    </>
  );
}
