"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, CalendarHeart, ClipboardList, Crown, ExternalLink, LayoutDashboard, LogOut, Menu, Settings2, ShoppingBag, Users, Wallet, X } from "lucide-react";
import { signIn, signOut, useDB } from "@/lib/portal/db";
import { PortalLogo } from "./ui";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/portal/owner", label: "Overview", icon: LayoutDashboard },
  { href: "/portal/owner/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/portal/owner/appointments", label: "Appointments", icon: ClipboardList },
  { href: "/portal/owner/clients", label: "Clients", icon: Users },
  { href: "/portal/owner/finances", label: "Finances", icon: Wallet },
  { href: "/portal/owner/shop", label: "Shop & inventory", icon: ShoppingBag },
  { href: "/portal/owner/settings", label: "Services & hours", icon: Settings2 },
];

export function OwnerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = useDB((s) => s.session.role);
  const [open, setOpen] = useState(false);

  if (role !== "owner")
    return (
      <div className="wrap grid min-h-[80svh] place-items-center text-center">
        <div className="max-w-md">
          <Crown className="mx-auto size-10 text-rose" aria-hidden />
          <h1 className="display mt-4 text-5xl text-pearl">Owner portal</h1>
          <p className="mt-3 text-champagne/75">This side is for TMack only. For the demo, open it with one tap.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => signIn("owner", "Google")} className="btn btn-primary">
              Enter as TMack (demo)
            </button>
            <Link href="/portal" className="btn btn-ghost">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );

  const nav = (
    <nav aria-label="Owner" className="flex flex-col gap-1">
      {NAV.map((n) => {
        const active = n.href === "/portal/owner" ? pathname === n.href : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition", active ? "bg-gradient-to-r from-pink/20 to-transparent font-semibold text-pearl" : "text-champagne/70 hover:bg-white/5 hover:text-pearl")}
            aria-current={active ? "page" : undefined}
          >
            <n.icon className={cn("size-[18px]", active ? "text-pink" : "text-champagne/50")} aria-hidden />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-[calc(100svh-28px)] flex-col border-r border-rose/15 bg-garnet p-5 lg:flex">
        <PortalLogo href="/portal/owner" sub="Owner portal" />
        <div className="mt-8 flex-1">{nav}</div>
        <div className="space-y-2 border-t border-rose/15 pt-4 text-sm">
          <Link href="/portal/book" className="flex min-h-10 items-center gap-2 text-champagne/70 hover:text-pearl">
            <CalendarHeart className="size-4" aria-hidden /> Client booking view
          </Link>
          <Link href="/" className="flex min-h-10 items-center gap-2 text-champagne/70 hover:text-pearl">
            <ExternalLink className="size-4" aria-hidden /> View website
          </Link>
          <button
            onClick={() => {
              signOut();
              router.push("/portal");
            }}
            className="flex min-h-10 items-center gap-2 text-champagne/70 hover:text-pearl"
          >
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-rose/15 bg-ink/90 px-4 py-3 backdrop-blur-xl lg:hidden">
          <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full text-champagne" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <PortalLogo href="/portal/owner" sub="Owner portal" />
        </header>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Owner menu">
            <button className="absolute inset-0 bg-ink/70" onClick={() => setOpen(false)} aria-label="Close menu" />
            <div className="absolute inset-y-0 left-0 w-72 bg-garnet p-5">
              <div className="mb-6 flex items-center justify-between">
                <PortalLogo href="/portal/owner" sub="Owner portal" />
                <button onClick={() => setOpen(false)} className="grid size-10 place-items-center text-champagne" aria-label="Close menu">
                  <X className="size-5" />
                </button>
              </div>
              {nav}
            </div>
          </div>
        )}
        <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
