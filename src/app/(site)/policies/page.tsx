import type { Metadata } from "next";
import Link from "next/link";
import { CalendarHeart } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Accent } from "@/components/ui/Kit";
import { BOOK_HREF, POLICIES } from "@/lib/site";
import { SHOP } from "@/lib/products";

export const metadata: Metadata = {
  title: "Booking & Payment Policies",
  description: "Deposits, late arrivals, cancellations, rescheduling, Saturday appointments, loc reconstruction and microloc policies for TMack The Loctician.",
  alternates: { canonical: "/policies" },
};

export default function PoliciesPage() {
  return (
    <>
      <PageHero
        frame="hand"
        eyebrow="Booking & payment policy"
        title={
          <>
            The fine <Accent>print,</Accent> made simple.
          </>
        }
        intro="By booking, you agree to the policies below. They protect your reserved time — and everyone else’s."
      />
      <section className="bg-ink pb-24" aria-label="Policies">
        <div className="wrap grid gap-4 md:grid-cols-2">
          {POLICIES.map((p, i) => (
            <article key={p.title} className="card-night p-6 sm:p-7">
              <p className="display text-5xl text-rose/40">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="display mt-2 text-3xl text-pearl">{p.title}</h2>
              <p className="mt-3 leading-relaxed text-champagne/80">{p.body}</p>
            </article>
          ))}
          <article className="card-night p-6 sm:p-7 md:col-span-2">
            <h2 className="display text-3xl text-pearl">Shop orders</h2>
            <p className="mt-3 leading-relaxed text-champagne/80">
              {SHOP.shipsOn}. {SHOP.returns}
            </p>
          </article>
        </div>
        <div className="wrap mt-12 text-center">
          <Link href={BOOK_HREF} className="btn btn-primary">
            <CalendarHeart className="size-4" aria-hidden /> I’m ready to book
          </Link>
        </div>
      </section>
    </>
  );
}
