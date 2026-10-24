import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarHeart,
  Clock,
  Coffee,
  CreditCard,
  Droplets,
  Gem,
  HeartHandshake,
  Music2,
  Phone,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Star,
  Wifi,
} from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { ProductCard } from "@/components/shop/ProductCard";
import { LocStrand } from "@/components/ui/LocStrand";
import { Accent, Eyebrow, SectionTitle } from "@/components/ui/Kit";
import { CrownMark, Sparkle } from "@/components/site/BrandIcons";
import { BOOK_HREF, SITE } from "@/lib/site";
import { SERVICES, fmtDuration, fmtMoney } from "@/lib/services";
import { PRODUCT_BY_HANDLE, PRODUCTS, SHOP } from "@/lib/products";
import { REVIEWS } from "@/lib/reviews";
import { WORK } from "@/lib/gallery";
import { FAQ } from "@/lib/faq";
import { FaqList } from "@/components/ui/FaqList";

export default function HomePage() {
  const signature = SERVICES.filter((s) => s.signature);
  const duo = [PRODUCT_BY_HANDLE["loc-moisturizer-spritz"], PRODUCT_BY_HANDLE["chebe-growth-oil"]];
  return (
    <>
      <Hero />

      {/* Trust marquee */}
      <section aria-label="Highlights" className="relative overflow-hidden border-y border-rose/15 bg-garnet py-5">
        <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-10 whitespace-nowrap pr-10 motion-reduce:animate-none">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-10" aria-hidden={k === 1}>
              {[
                "Master Loctician",
                "Certified Micro Loc Specialist",
                "5.0 ★ on Google",
                "All-natural Crown Care products",
                "Private studio in Midlothian",
                "Free snacks & beverages",
                "Klarna & Affirm accepted",
                "Hands that grow hair",
              ].map((t) => (
                <span key={t} className="eyebrow flex items-center gap-10 text-champagne/80">
                  {t}
                  <Sparkle className="size-3 text-pink" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Problem → solution: reconstruction */}
      <section aria-labelledby="restore-title" className="relative overflow-hidden bg-blush text-cocoa">
        <LocStrand tone="light" className="pointer-events-none absolute -left-6 top-10 hidden h-[640px] w-28 opacity-80 lg:block" />
        <div className="wrap grid items-center gap-12 py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:py-32">
          <div>
            <SectionTitle
              tone="light"
              id="restore-title"
              eyebrow="Loc reconstruction"
              title={
                <>
                  Overdue, matted or thinning? It’s <Accent>never</Accent> too late.
                </>
              }
              intro="Conjoined roots, excessive new growth and thinning locs don’t mean starting over. TMack’s Loc Reconstruction Package brings them back to clean parts and healthy, separated locs — with up to five hours reserved just for you."
            />
            <ul className="reveal mt-8 grid gap-3 sm:grid-cols-2" data-delay="120">
              {["Deep cleanse shampoo", "Loc detox", "Hydration steam treatment", "Re-parting & palm roll maintenance"].map((t) => (
                <li key={t} className="flex items-center gap-3 rounded-2xl border border-rose-deep/15 bg-pearl/70 px-4 py-3 text-sm">
                  <Gem className="size-4 shrink-0 text-magenta" aria-hidden /> {t}
                </li>
              ))}
            </ul>
            <div className="reveal mt-8 flex flex-wrap items-center gap-4" data-delay="200">
              <Link href={`${BOOK_HREF}${BOOK_HREF.startsWith("/") ? "?service=99212719" : ""}`} className="btn btn-dark">
                <CalendarHeart className="size-4" aria-hidden /> Book a reconstruction
              </Link>
              <p className="text-sm text-mute">
                From <strong className="text-cocoa">$325</strong> · $104 deposit secures 5 hours
              </p>
            </div>
            <blockquote className="reveal mt-10 border-l-2 border-magenta pl-5" data-delay="260">
              <p className="display text-2xl italic leading-snug">“My hair needed a reconstruction bad and she did her thing with fixing it.”</p>
              <footer className="mt-2 text-sm text-mute">Shacoria C., Google review</footer>
            </blockquote>
          </div>
          <div className="reveal relative" data-delay="100">
            <BeforeAfter
              before="/media/work/recon-before.webp"
              after="/media/work/recon-after-top.webp"
              beforeAlt="Before: overdue locs with heavy new growth and conjoined roots"
              afterAlt="After TMack’s reconstruction: re-parted, separated and retwisted locs"
            />
            <p className="mt-3 text-center text-xs text-mute">Real client. Drag to compare.</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section aria-labelledby="services-title" className="relative overflow-hidden bg-ink py-24 lg:py-32">
        <div aria-hidden className="absolute right-[-20%] top-0 h-[40rem] w-[40rem] rounded-full bg-magenta/10 blur-3xl" />
        <div className="wrap relative">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionTitle
              id="services-title"
              eyebrow="Signature services"
              title={
                <>
                  Loc care, done the <Accent>right</Accent> way.
                </>
              }
              intro="From your very first consultation to the retwist that keeps you fresh, every service starts with scalp health and ends with locs that hold."
            />
            <Link href="/services" className="reveal btn btn-ghost self-start lg:self-auto">
              Full menu & add-ons <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {signature.map((s, i) => (
              <article key={s.id} className="reveal card-night group flex flex-col overflow-hidden" data-delay={i * 70}>
                <div className="relative aspect-[5/4] overflow-hidden bg-blush">
                  <Image src={s.image} alt={s.imageAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-ink/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose backdrop-blur">{s.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="display text-[1.75rem] leading-tight text-pearl">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-champagne/75">{s.short}</p>
                  <div className="mt-5 flex items-center gap-4 text-sm text-champagne/80">
                    <span className="display text-3xl text-rosegold">{fmtMoney(s.price, s.from)}</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-4 text-pink" aria-hidden /> {fmtDuration(s.minutes)}
                    </span>
                  </div>
                  <Link
                    href={BOOK_HREF.startsWith("/") ? `${BOOK_HREF}?service=${s.id}` : BOOK_HREF}
                    className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-pink transition-all hover:gap-3"
                  >
                    Book this service <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
            <article className="reveal flex flex-col justify-between overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-magenta via-pink to-rose p-7 text-pearl" data-delay="350">
              <div>
                <CrownMark className="h-9 w-14" />
                <h3 className="display mt-5 text-4xl leading-none">Not sure what your locs need?</h3>
                <p className="mt-4 text-pearl/90">Text a photo of your locs and TMack will point you to the right service — or book a $32 consultation to start microlocs or starter locs.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`sms:+18044648208`} className="btn bg-pearl text-cocoa hover:bg-champagne">
                  <Phone className="size-4" aria-hidden /> Text TMack
                </a>
                <Link href="/services" className="btn border border-pearl/60 text-pearl hover:bg-pearl/10">
                  See every service
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Method */}
      <section aria-labelledby="method-title" className="relative bg-garnet py-24 lg:py-32">
        <div className="wrap">
          <SectionTitle
            align="center"
            id="method-title"
            eyebrow="The Crown Care method"
            title={
              <>
                Clean parts. Healthy scalp. <Accent>Fresh start.</Accent>
              </>
            }
          />
          <ol className="relative mt-16 grid gap-6 md:grid-cols-4">
            <div aria-hidden className="glitter-line absolute left-[12%] right-[12%] top-9 hidden md:block" />
            {[
              { icon: ScanSearch, t: "Assess", d: "Every visit starts with your scalp and new growth — so you get the method your locs actually need." },
              { icon: Droplets, t: "Detox & hydrate", d: "Loc detox lifts buildup, lint and oils; the hydration steam restores moisture before a single twist." },
              { icon: Sparkles, t: "Retwist · retie · interlock", d: "Palm roll, microloc retie or interlocking with precise, even parts and gentle tension." },
              { icon: ShieldCheck, t: "Protect at home", d: "Hydrate with the spritz, seal with chebe oil, sleep in satin. Then book your next visit on schedule." },
            ].map((s, i) => (
              <li key={s.t} className="reveal relative text-center" data-delay={i * 90}>
                <div className="relative mx-auto grid size-[4.5rem] place-items-center rounded-full border border-rose/40 bg-ink text-pink shadow-[0_0_40px_-10px_rgba(255,90,168,.6)]">
                  <s.icon className="size-7" aria-hidden />
                  <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-gradient-to-br from-rose to-rose-deep text-xs font-bold text-ink">{i + 1}</span>
                </div>
                <h3 className="display mt-6 text-3xl text-pearl">{s.t}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-champagne/75">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Meet TMack */}
      <section aria-labelledby="about-title" className="relative overflow-hidden bg-ink py-24 lg:py-32">
        <LocStrand flip className="pointer-events-none absolute right-2 top-0 hidden h-[700px] w-28 opacity-70 lg:block" />
        <div className="wrap grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div className="reveal relative mx-auto w-full max-w-md">
            <div aria-hidden className="absolute -inset-4 rounded-[2rem] border border-rose/25" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
              <Image src="/media/brand/tmack-portrait.webp" alt="TMack, Master Loctician, smiling in a red top with copper-red locs" fill sizes="(max-width: 1024px) 90vw, 440px" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-2 rounded-2xl border border-rose/30 bg-ink/90 px-5 py-4 backdrop-blur sm:-right-8">
              <p className="font-[family-name:var(--font-script)] text-3xl leading-none text-rosegold">TMack</p>
              <p className="eyebrow mt-1 text-[0.58rem] text-champagne/70">Master Loctician</p>
            </div>
          </div>
          <div>
            <SectionTitle
              id="about-title"
              eyebrow="Meet your loctician"
              title={
                <>
                  Hands that <Accent>grow</Accent> hair.
                </>
              }
            />
            <p className="reveal mt-6 text-lg leading-relaxed text-champagne/85" data-delay="80">
              {SITE.mission}
            </p>
            <p className="reveal mt-4 leading-relaxed text-champagne/70" data-delay="140">
              TMack is a Master Loctician and Certified Micro Loc Specialist. Clients come back for her patience, her precise parts and a private studio where you can relax — your music or show on, snacks and drinks on the house.
            </p>
            <dl className="reveal mt-10 grid grid-cols-3 gap-4 border-y border-rose/15 py-6" data-delay="200">
              {[
                ["5.0", "Google rating"],
                ["7", "Loc services"],
                ["100%", "Natural home care"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="display text-4xl text-rosegold sm:text-5xl">{n}</dd>
                  <dd className="mt-1 text-xs uppercase tracking-[0.18em] text-champagne/60">{l}</dd>
                </div>
              ))}
            </dl>
            <div className="reveal mt-8 flex flex-wrap gap-3" data-delay="260">
              <Link href="/about" className="btn btn-ghost">
                Her story <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href={BOOK_HREF} className="btn btn-primary">
                <CalendarHeart className="size-4" aria-hidden /> Book with TMack
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery teaser */}
      <section aria-labelledby="gallery-title" className="bg-pearl py-24 text-cocoa lg:py-32">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              tone="light"
              id="gallery-title"
              eyebrow="Real results"
              title={
                <>
                  Real locs. Real <Accent>confidence.</Accent>
                </>
              }
            />
            <Link href="/gallery" className="reveal btn btn-outline-dark self-start md:self-auto">
              View the gallery <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-12 columns-2 gap-4 md:columns-3 lg:gap-5">
            {WORK.slice(0, 6).map((w, i) => (
              <figure key={w.src} className="reveal group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl lg:mb-5" data-delay={(i % 3) * 80}>
                <Image src={w.src} alt={w.alt} width={1200} height={1490} sizes="(max-width: 768px) 50vw, 33vw" className="h-auto w-full transition-transform duration-[1.2s] group-hover:scale-[1.04]" />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-pearl/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa">{w.tag}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Shop */}
      <section aria-labelledby="shop-title" className="relative overflow-hidden bg-ink py-24 lg:py-32">
        <div aria-hidden className="absolute left-[-15%] top-1/3 h-[36rem] w-[36rem] rounded-full bg-magenta/10 blur-3xl" />
        <div className="wrap relative">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="reveal relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
              <Image src="/media/shop/routine-duo.webp" alt="TMack Crown Care Loc Moisturizer Spritz and Chebe Growth Oil on a blush marble pedestal" fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
            </div>
            <div>
              <SectionTitle
                id="shop-title"
                eyebrow="TMack Crown Care Collection"
                title={
                  <>
                    Hydrate. Seal. <Accent>Grow.</Accent>
                  </>
                }
                intro="The same all-natural care TMack uses in the chair, made for your routine at home. Spritz to hydrate, then seal with chebe oil — moisture that lasts between visits."
              />
              <ol className="reveal mt-8 space-y-3" data-delay="100">
                {duo.map((p, i) => (
                  <li key={p.handle} className="flex items-center gap-4 rounded-2xl border border-rose/20 bg-garnet/70 p-3 pr-5">
                    <span className="display grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose to-rose-deep text-2xl text-ink">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-pearl">{p.name}</p>
                      <p className="text-sm text-champagne/70">{p.short}</p>
                    </div>
                    <span className="display text-2xl text-rosegold">{fmtMoney(p.price)}</span>
                  </li>
                ))}
              </ol>
              <p className="reveal mt-5 text-sm text-champagne/70" data-delay="160">
                Free shipping over ${SHOP.freeShippingOver} · Code <strong className="text-pearl">{SHOP.promoCode}</strong> takes {SHOP.promoText}
              </p>
              <Link href="/shop" className="reveal btn btn-primary mt-7" data-delay="200">
                Shop the collection <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {PRODUCTS.slice(0, 4).map((p) => (
              <ProductCard key={p.handle} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section aria-labelledby="reviews-title" className="relative overflow-hidden bg-garnet py-24 lg:py-32">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionTitle
              id="reviews-title"
              eyebrow="Loc queens & kings"
              title={
                <>
                  Every appointment feels like a <Accent>reset.</Accent>
                </>
              }
            />
            <a href={SITE.googleUrl} target="_blank" rel="noopener" className="reveal flex items-center gap-4 rounded-2xl border border-rose/25 bg-ink/60 px-5 py-4">
              <span className="display text-5xl text-rosegold">5.0</span>
              <span>
                <span className="flex text-pink" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" aria-hidden />
                  ))}
                </span>
                <span className="mt-1 block text-sm text-champagne/80">{SITE.rating.count} Google reviews</span>
              </span>
            </a>
          </div>
        </div>
        <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:thin] md:px-[max(2rem,calc((100vw-1240px)/2+2rem))]" tabIndex={0} aria-label="Client reviews, scroll horizontally">
          {REVIEWS.slice(0, 9).map((r) => (
            <figure key={r.name} className="card-night flex w-[85vw] max-w-[380px] shrink-0 snap-start flex-col p-6">
              <span className="flex text-pink" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </span>
              <blockquote className="mt-4 flex-1 text-[0.98rem] leading-relaxed text-champagne/90">“{r.text}”</blockquote>
              <figcaption className="mt-5 border-t border-rose/15 pt-4">
                <p className="font-semibold text-pearl">{r.name}</p>
                <p className="text-xs text-champagne/60">{r.service ?? "Google review"}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Studio experience */}
      <section aria-labelledby="studio-title" className="bg-blush py-24 text-cocoa lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <SectionTitle
            tone="light"
            id="studio-title"
            eyebrow="The studio"
            title={
              <>
                A private studio made for <Accent>you.</Accent>
              </>
            }
            intro={`${SITE.address.street}, ${SITE.address.city}, VA — by appointment only.`}
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: HeartHandshake, t: "Private, one-on-one", d: "No crowded salon floor. Just you and TMack." },
              { icon: Coffee, t: "Snacks & beverages", d: "On the house while you sit — clients love this." },
              { icon: Music2, t: "Your music or show", d: "Tell us your vibe when you book." },
              { icon: Wifi, t: "Wi-Fi & easy parking", d: "Right on Hull Street Rd in Midlothian." },
              { icon: CreditCard, t: "Pay your way", d: "Apple Pay, Cash App, PayPal. Klarna & Affirm available." },
              { icon: CalendarHeart, t: "First-Saturday retwists", d: "Loc retwists the first Saturday of every month." },
            ].map((a, i) => (
              <li key={a.t} className="reveal flex gap-4 rounded-2xl bg-pearl/80 p-5" data-delay={i * 60}>
                <a.icon className="mt-0.5 size-5 shrink-0 text-magenta" aria-hidden />
                <div>
                  <p className="font-semibold">{a.t}</p>
                  <p className="mt-0.5 text-sm text-mute">{a.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="bg-pearl py-24 text-cocoa lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionTitle tone="light" id="faq-title" eyebrow="Good to know" title={<>Questions, answered.</>} />
            <Link href="/policies" className="reveal btn btn-outline-dark mt-8">
              Read booking policies
            </Link>
          </div>
          <FaqList items={FAQ.slice(0, 6)} />
        </div>
      </section>

      {/* Final CTA */}
      <section aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-ink">
        <Image src="/media/hero/back.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-60" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
        <div className="wrap py-28 lg:py-40">
          <div className="max-w-xl">
            <Eyebrow className="text-rose">Your next visit</Eyebrow>
            <h2 id="cta-title" className="display reveal mt-4 text-[clamp(2.6rem,6vw,5rem)] text-pearl">
              Protect your crown. <Accent>Love</Accent> your crown.
            </h2>
            <p className="reveal mt-5 text-lg text-champagne/80" data-delay="80">
              Limited openings each month for retwists, starter locs and microloc reties. Lock in your spot.
            </p>
            <div className="reveal mt-8 flex flex-wrap gap-3" data-delay="140">
              <Link href={BOOK_HREF} className="btn btn-primary">
                <CalendarHeart className="size-4" aria-hidden /> Book your appointment
              </Link>
              <a href={SITE.phoneHref} className="btn btn-ghost">
                <Phone className="size-4" aria-hidden /> {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
