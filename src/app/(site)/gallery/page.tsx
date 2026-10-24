import type { Metadata } from "next";
import Link from "next/link";
import { CalendarHeart } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Accent } from "@/components/ui/Kit";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { BOOK_HREF, SITE } from "@/lib/site";
import { InstagramIcon } from "@/components/site/BrandIcons";

export const metadata: Metadata = {
  title: "Gallery — Real Loc Retwists, Microlocs, Interlocking & Reconstructions",
  description: "Real client work by TMack The Loctician in Midlothian, VA: retwists, microloc reties, interlocking, loc styles and loc reconstructions.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        frame="back"
        eyebrow="Gallery"
        title={
          <>
            Real locs. Real <Accent>results.</Accent>
          </>
        }
        intro="Every photo here is a real client from TMack’s chair. Tap any photo to see it larger."
      />
      <section className="bg-pearl py-16 text-cocoa lg:py-24" aria-label="Client work">
        <div className="wrap">
          <GalleryGrid />
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <p className="display text-4xl">Love what you see?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={BOOK_HREF} className="btn btn-dark">
                <CalendarHeart className="size-4" aria-hidden /> Book your appointment
              </Link>
              <a href={SITE.socials.instagram} target="_blank" rel="noopener" className="btn btn-outline-dark">
                <InstagramIcon className="size-4" /> More on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
