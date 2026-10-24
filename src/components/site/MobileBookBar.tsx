"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarHeart, Phone } from "lucide-react";
import { BOOK_HREF, SITE } from "@/lib/site";

/** Thumb-zone booking bar on phones, appears after the hero. */
export function MobileBookBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.9);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 flex gap-2 rounded-full border border-rose/25 bg-ink/85 p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-500 sm:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <a href={SITE.phoneHref} className="grid size-12 shrink-0 place-items-center rounded-full border border-rose/30 text-champagne" aria-label={`Call ${SITE.phone}`}>
        <Phone className="size-5" />
      </a>
      <Link href={BOOK_HREF} className="btn btn-primary flex-1 !min-h-12">
        <CalendarHeart className="size-4" aria-hidden /> Book your appointment
      </Link>
    </div>
  );
}
