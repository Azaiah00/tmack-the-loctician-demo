import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CalendarHeart, HeartHandshake, Leaf, Quote, Sprout } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Accent, SectionTitle } from "@/components/ui/Kit";
import { LocStrand } from "@/components/ui/LocStrand";
import { BOOK_HREF, SITE } from "@/lib/site";
import { REVIEWS } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "About TMack — Master Loctician & Certified Micro Loc Specialist",
  description:
    "Meet TMack, Master Loctician and Certified Micro Loc Specialist in Midlothian, VA, and founder of the all-natural TMack Crown Care Collection.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const quotes = [REVIEWS.find((r) => r.name === "Ruthie E.")!, REVIEWS.find((r) => r.name === "Amaka W.")!, REVIEWS.find((r) => r.name === "Jessika B.")!];
  return (
    <>
      <PageHero
        frame="profile"
        eyebrow="About TMack"
        title={
          <>
            Your crown, in <Accent>caring</Accent> hands.
          </>
        }
        intro="Master Loctician. Certified Micro Loc Specialist. Founder of the TMack Crown Care Collection."
      />

      <section className="relative overflow-hidden bg-ink py-20 lg:py-28" aria-labelledby="story">
        <LocStrand className="pointer-events-none absolute left-0 top-0 hidden h-[640px] w-24 opacity-60 lg:block" />
        <div className="wrap grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div className="reveal relative mx-auto w-full max-w-md lg:sticky lg:top-28">
            <div aria-hidden className="absolute -inset-4 rounded-[2rem] border border-rose/25" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
              <Image src="/media/brand/tmack-portrait.webp" alt="Portrait of TMack, Master Loctician" fill priority sizes="(max-width: 1024px) 90vw, 440px" className="object-cover" />
            </div>
          </div>
          <div>
            <SectionTitle id="story" eyebrow="Her mission" title={<>Healthy hair first. Every visit.</>} />
            <blockquote className="reveal mt-8 rounded-2xl border border-rose/20 bg-garnet p-6 text-lg leading-relaxed text-champagne/90 sm:p-8" data-delay="80">
              <Quote className="mb-3 size-6 text-pink" aria-hidden />
              {SITE.mission}
              <footer className="mt-4 font-[family-name:var(--font-script)] text-3xl text-rosegold">TMack</footer>
            </blockquote>
            <div className="reveal mt-8 space-y-5 leading-relaxed text-champagne/80" data-delay="120">
              <p>
                TMack is a Master Loctician and Certified Micro Loc Specialist with years of hands-on experience caring for locs — from a first set of starter locs to microlocs, interlocking and full reconstructions of locs that have been overdue for a long time.
              </p>
              <p>
                Her studio in Midlothian is private and unhurried. Clients describe a loctician who listens, explains every step, never tires of questions and keeps a gentle hand — the reason so many say she has “hands that grow hair.”
              </p>
              <p>
                Wanting her clients to protect their results between visits, she created the <strong className="text-pearl">TMack Crown Care Collection</strong>: an all-natural Loc Moisturizer Spritz, a herb-infused Chebe Growth Oil and satin bonnets — the same care she trusts in the chair.
              </p>
            </div>
            <div className="reveal mt-10 grid gap-4 sm:grid-cols-2" data-delay="160">
              {[
                { icon: Sprout, t: "Scalp health first", d: "Detox, hydration and gentle tension before style." },
                { icon: BookOpen, t: "Education in the chair", d: "You leave knowing how to care for your locs." },
                { icon: HeartHandshake, t: "Clear, honest pricing", d: "Every price and policy is published up front." },
                { icon: Leaf, t: "All-natural home care", d: "Made with love, cruelty free." },
              ].map((v) => (
                <div key={v.t} className="card-night p-5">
                  <v.icon className="size-5 text-pink" aria-hidden />
                  <p className="mt-3 font-semibold text-pearl">{v.t}</p>
                  <p className="mt-1 text-sm text-champagne/70">{v.d}</p>
                </div>
              ))}
            </div>
            <div className="reveal mt-10 flex flex-wrap gap-3" data-delay="200">
              <Link href={BOOK_HREF} className="btn btn-primary">
                <CalendarHeart className="size-4" aria-hidden /> Book with TMack
              </Link>
              <Link href="/shop" className="btn btn-ghost">
                Shop Crown Care
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blush py-20 text-cocoa lg:py-28" aria-labelledby="words">
        <div className="wrap">
          <SectionTitle tone="light" align="center" id="words" eyebrow="In her clients’ words" title={<>They found their loctician.</>} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {quotes.map((r, i) => (
              <figure key={r.name} className="reveal card-light p-7" data-delay={i * 90}>
                <Quote className="size-6 text-magenta" aria-hidden />
                <blockquote className="mt-4 leading-relaxed">“{r.text}”</blockquote>
                <figcaption className="mt-5 font-semibold">{r.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
