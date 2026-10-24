"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarHeart, LayoutDashboard, Menu, ShoppingBag, X } from "lucide-react";
import { BOOK_HREF, NAV, SITE } from "@/lib/site";
import { useCart } from "@/components/shop/cart";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { count, setOpen } = useCart();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-full bg-pearl px-4 py-2 text-cocoa focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "border-b border-rose/15 bg-ink/80 py-2 backdrop-blur-xl" : "bg-gradient-to-b from-ink/70 to-transparent py-4",
        )}
      >
        <div className="wrap flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative size-11 overflow-hidden rounded-full ring-1 ring-rose/50 transition-transform duration-500 group-hover:rotate-6">
              <Image src="/media/brand/tmack-logo.webp" alt="" fill sizes="44px" className="object-cover" priority />
            </span>
            <span className="leading-none">
              <span className="display block text-[1.55rem] text-rosegold">TMack</span>
              <span className="eyebrow block text-[0.56rem] text-champagne/80">The Loctician</span>
            </span>
          </Link>

          <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm text-champagne/85 transition-colors hover:text-pearl",
                  pathname.startsWith(n.href) && "text-pearl",
                )}
              >
                {n.label}
                {pathname.startsWith(n.href) && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-pink to-transparent" />}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <Link href="/portal" className="hidden items-center gap-2 rounded-full border border-rose/40 px-3.5 py-2 text-xs font-semibold text-champagne transition hover:border-pink hover:text-pearl md:inline-flex">
              <LayoutDashboard className="size-4 text-pink" aria-hidden /> Booking Portal
              <span className="rounded-full bg-rose/20 px-1.5 py-0.5 text-[9px] tracking-widest text-rose">DEMO</span>
            </Link>
            <button onClick={() => setOpen(true)} className="relative grid size-11 place-items-center rounded-full text-champagne hover:bg-white/5" aria-label={`Open bag, ${count} items`}>
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-magenta px-1 text-[10px] font-bold text-pearl">{count}</span>
              )}
            </button>
            <Link href={BOOK_HREF} className="btn btn-primary hidden !min-h-11 !px-5 !py-2 text-sm sm:inline-flex">
              <CalendarHeart className="size-4" aria-hidden /> Book
            </Link>
            <button onClick={() => setMenu(true)} className="grid size-11 place-items-center rounded-full text-champagne hover:bg-white/5 lg:hidden" aria-label="Open menu" aria-expanded={menu}>
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-ink/97 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="wrap flex items-center justify-between py-4">
              <span className="display text-2xl text-rosegold">TMack</span>
              <button onClick={() => setMenu(false)} className="grid size-11 place-items-center rounded-full text-champagne" aria-label="Close menu">
                <X className="size-6" />
              </button>
            </div>
            <nav aria-label="Mobile" className="wrap mt-6 flex flex-col">
              {[{ href: "/", label: "Home" }, ...NAV].map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link href={n.href} onClick={() => setMenu(false)} className="display block border-b border-rose/10 py-4 text-4xl text-champagne">
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="wrap mt-auto grid gap-3 pb-10">
              <Link href={BOOK_HREF} onClick={() => setMenu(false)} className="btn btn-primary w-full">
                <CalendarHeart className="size-4" aria-hidden /> Book your appointment
              </Link>
              <Link href="/portal" onClick={() => setMenu(false)} className="btn btn-ghost w-full">
                <LayoutDashboard className="size-4" aria-hidden /> Booking portal (demo)
              </Link>
              <a href={SITE.phoneHref} className="text-center text-sm text-champagne/70">
                Call or text {SITE.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
