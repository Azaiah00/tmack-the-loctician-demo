import type { Metadata } from "next";
import Link from "next/link";
import { CalendarHeart, Car, Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Accent } from "@/components/ui/Kit";
import { ContactForm } from "@/components/site/ContactForm";
import { BOOK_HREF, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit the Studio — 11057 Hull Street Rd, Midlothian, VA",
  description: "TMack The Loctician's private studio at 11057 Hull Street Rd, Ste 13, Midlothian, VA 23112. Hours, directions, parking and contact.",
  alternates: { canonical: "/visit" },
};

function fmt(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h >= 12 ? "PM" : "AM"}`;
}

export default function VisitPage() {
  return (
    <>
      <PageHero
        frame="front"
        eyebrow="Visit"
        title={
          <>
            Come see <Accent>us.</Accent>
          </>
        }
        intro="A private studio on Hull Street Rd in Midlothian — serving Chesterfield, Richmond and the surrounding area. By appointment only."
      />
      <section className="bg-ink pb-24" aria-label="Studio details">
        <div className="wrap grid gap-6 lg:grid-cols-3">
          <div className="card-night p-7">
            <MapPin className="size-6 text-pink" aria-hidden />
            <h2 className="display mt-4 text-3xl text-pearl">Address</h2>
            <address className="mt-2 not-italic leading-relaxed text-champagne/85">
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.region} {SITE.address.zip}
            </address>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="btn btn-ghost mt-6">
              <Navigation className="size-4" aria-hidden /> Get directions
            </a>
            <p className="mt-5 flex gap-2 text-sm text-champagne/70">
              <Car className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden /> Parking on site. Suite 13.
            </p>
          </div>
          <div className="card-night p-7">
            <Clock className="size-6 text-pink" aria-hidden />
            <h2 className="display mt-4 text-3xl text-pearl">Hours</h2>
            <table className="mt-3 w-full text-sm">
              <caption className="sr-only">Studio hours</caption>
              <tbody>
                {SITE.hours.map((h) => (
                  <tr key={h.day} className="border-b border-rose/10 last:border-0">
                    <th scope="row" className="py-2 text-left font-normal text-champagne/80">
                      {h.day}
                    </th>
                    <td className="py-2 text-right tabular-nums text-pearl">{h.open ? `${fmt(h.open)} – ${fmt(h.close!)}` : <span className="text-champagne/50">Closed</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs leading-relaxed text-champagne/60">By appointment only — live availability is on the booking calendar. Retwists the first Saturday of each month. Closed on major holidays.</p>
          </div>
          <div className="card-night p-7">
            <Phone className="size-6 text-pink" aria-hidden />
            <h2 className="display mt-4 text-3xl text-pearl">Contact</h2>
            <ul className="mt-3 space-y-3 text-champagne/85">
              <li>
                <a href={SITE.phoneHref} className="-my-2.5 inline-block py-2.5 hover:text-pearl">
                  Call or text {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-rose" aria-hidden />
                <a href={`mailto:${SITE.email}`} className="-my-2.5 inline-block break-all py-2.5 hover:text-pearl">
                  {SITE.email}
                </a>
              </li>
            </ul>
            <Link href={BOOK_HREF} className="btn btn-primary mt-6">
              <CalendarHeart className="size-4" aria-hidden /> Book online
            </Link>
          </div>
        </div>

        <div className="wrap mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-[1.25rem] border border-rose/15">
            <iframe
              title="Map to TMack The Loctician, 11057 Hull Street Rd, Midlothian, VA"
              src="https://www.google.com/maps?q=11057+Hull+Street+Rd+Ste+13,+Midlothian,+VA+23112&output=embed"
              className="absolute inset-0 size-full grayscale-[35%] invert-[88%] hue-rotate-[290deg]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="card-night p-7">
            <h2 className="display text-3xl text-pearl">Send a message</h2>
            <p className="mt-1 text-sm text-champagne/70">Questions about your locs or a product? TMack will get back to you.</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
