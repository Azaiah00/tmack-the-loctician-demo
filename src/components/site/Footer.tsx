import Image from "next/image";
import Link from "next/link";
import { CalendarHeart, Mail, MapPin, Phone } from "lucide-react";
import { BOOK_HREF, NAV, SITE } from "@/lib/site";
import { InstagramIcon, TikTokIcon } from "./BrandIcons";

export function Footer() {
  const year = 2026;
  return (
    <footer className="relative overflow-hidden border-t border-rose/15 bg-garnet">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-magenta/15 blur-3xl" />
      <div className="wrap relative grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative size-16 overflow-hidden rounded-full ring-1 ring-rose/40">
              <Image src="/media/brand/tmack-logo.webp" alt="TMack The Loctician logo" fill sizes="64px" className="object-cover" />
            </span>
            <div>
              <p className="display text-3xl text-rosegold">TMack</p>
              <p className="eyebrow text-[0.64rem] text-champagne/70">The Loctician™</p>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mute-dark">
            Master Loctician &amp; Certified Micro Loc Specialist. Healthy locs start here — in a private studio in Midlothian, Virginia.
          </p>
          <div className="mt-5 flex gap-2">
            <a href={SITE.socials.instagram} target="_blank" rel="noopener" className="grid size-11 place-items-center rounded-full border border-rose/25 text-champagne hover:border-pink hover:text-pink" aria-label="TMack on Instagram">
              <InstagramIcon className="size-5" />
            </a>
            <a href={SITE.socials.tiktok} target="_blank" rel="noopener" className="grid size-11 place-items-center rounded-full border border-rose/25 text-champagne hover:border-pink hover:text-pink" aria-label="TMack on TikTok">
              <TikTokIcon className="size-5" />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow text-rose">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[{ href: "/", label: "Home" }, ...NAV, { href: "/policies", label: "Booking policies" }, { href: "/portal", label: "Booking portal (demo)" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-champagne/80 hover:text-pearl">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-rose">Studio hours</p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {SITE.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4 text-champagne/80">
                <span>{h.day.slice(0, 3)}</span>
                <span className="tabular-nums">{h.open ? `${fmt(h.open)} – ${fmt(h.close!)}` : "Closed"}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-mute-dark">By appointment only. Closed on major holidays.</p>
        </div>

        <div>
          <p className="eyebrow text-rose">Visit</p>
          <ul className="mt-4 space-y-3 text-sm text-champagne/85">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-pink" aria-hidden />
              <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="hover:text-pearl">
                {SITE.address.street}
                <br />
                {SITE.address.city}, {SITE.address.region} {SITE.address.zip}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-pink" aria-hidden />
              <a href={SITE.phoneHref} className="-my-2.5 inline-block py-2.5 hover:text-pearl">
                {SITE.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-pink" aria-hidden />
              <a href={`mailto:${SITE.email}`} className="-my-2.5 inline-block break-all py-2.5 hover:text-pearl">
                {SITE.email}
              </a>
            </li>
          </ul>
          <Link href={BOOK_HREF} className="btn btn-primary mt-6">
            <CalendarHeart className="size-4" aria-hidden /> Book now
          </Link>
        </div>
      </div>
      <div className="glitter-line" />
      <div className="wrap flex flex-col items-center justify-between gap-3 py-6 text-xs text-mute-dark sm:flex-row">
        <p>
          © {year} {SITE.legalName}. Protect your crown. Nurture your crown. Love your crown.
        </p>
        <p>
          Site by <span className="text-champagne/80">Couture House Co.</span>
        </p>
      </div>
    </footer>
  );
}

function fmt(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return m ? `${hh}:${String(m).padStart(2, "0")} ${ap}` : `${hh} ${ap}`;
}
