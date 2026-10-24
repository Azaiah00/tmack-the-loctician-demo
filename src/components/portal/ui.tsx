"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useDB, type ApptStatus } from "@/lib/portal/db";
import { cn } from "@/lib/cn";

export function DemoBanner() {
  return (
    <div className="relative z-[60] bg-gradient-to-r from-rose-deep via-magenta to-rose-deep px-4 py-1.5 text-center text-[11px] font-semibold tracking-wide text-pearl">
      DEMO MODE · sample clients & appointments · no real payments are taken · resets when you refresh
    </div>
  );
}

export function PortalLogo({ href = "/portal", sub = "Booking Portal" }: { href?: string; sub?: string }) {
  return (
    <Link href={href} className="flex min-w-0 items-center gap-3">
      <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-rose/50">
        <Image src="/media/brand/tmack-logo.webp" alt="" fill sizes="40px" className="object-cover" />
      </span>
      <span className="leading-none">
        <span className="display block text-2xl text-rosegold">TMack</span>
        <span className="eyebrow block whitespace-nowrap text-[0.62rem] tracking-[0.22em] text-champagne/70 min-[400px]:tracking-[0.32em]">{sub}</span>
      </span>
    </Link>
  );
}

export function Toasts() {
  const toasts = useDB((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[100] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center gap-3 rounded-2xl border border-rose/25 bg-ink/95 px-4 py-3 text-sm text-pearl shadow-2xl backdrop-blur"
          >
            <CheckCircle2 className="size-5 shrink-0 text-ok" aria-hidden /> {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const STATUS: Record<ApptStatus, string> = {
  booked: "bg-warn/15 text-warn",
  confirmed: "bg-pink/15 text-pink",
  "checked-in": "bg-orchid/20 text-orchid",
  completed: "bg-ok/15 text-ok",
  "no-show": "bg-bad/15 text-bad",
  canceled: "bg-champagne/10 text-champagne/60",
};
export function StatusBadge({ s }: { s: ApptStatus }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", STATUS[s])}>{s.replace("-", " ")}</span>;
}

export function Stat({ label, value, sub, icon: Icon, tone }: { label: string; value: string; sub?: React.ReactNode; icon?: React.ComponentType<{ className?: string }>; tone?: "pink" | "rose" }) {
  return (
    <div className="card-night min-w-0 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-champagne/60">{label}</p>
        {Icon && <Icon className={cn("size-4", tone === "rose" ? "text-rose" : "text-pink")} />}
      </div>
      <p className="display mt-2 break-words text-3xl tabular-nums text-pearl sm:text-4xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-champagne/60">{sub}</p>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("card-night min-w-0 p-5 sm:p-6", className)} aria-label={title}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h2 className="display text-2xl text-pearl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.button className="absolute inset-0 bg-ink/70 backdrop-blur-sm" aria-label="Close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-rose/20 bg-garnet text-champagne"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-rose/15 bg-garnet/95 px-6 py-4 backdrop-blur">
              <h2 className="display text-2xl text-pearl">{title}</h2>
              <button onClick={onClose} className="grid size-10 place-items-center rounded-full hover:bg-white/5" aria-label="Close" autoFocus>
                <X className="size-5" />
              </button>
            </header>
            <div className="flex-1 px-6 py-5">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Lightweight SVG bar chart (no chart library). */
export function Bars({ data, height = 180, money = true }: { data: { label: string; value: number; sub?: number }[]; height?: number; money?: boolean }) {
  const max = Math.max(1, ...data.map((d) => d.value + (d.sub ?? 0)));
  return (
    <div>
      <div className="flex items-end gap-1.5 sm:gap-2" style={{ height }} role="img" aria-label={data.map((d) => `${d.label}: ${money ? "$" : ""}${Math.round(d.value + (d.sub ?? 0))}`).join(", ")}>
        {data.map((d, i) => {
          const h = ((d.value + (d.sub ?? 0)) / max) * 100;
          const hs = ((d.sub ?? 0) / max) * 100;
          return (
            <div key={i} className="group relative flex h-full flex-1 flex-col justify-end">
              <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[10px] text-pearl group-hover:block">
                {money ? "$" : ""}
                {Math.round(d.value + (d.sub ?? 0)).toLocaleString()}
              </span>
              <div className="w-full rounded-t-md bg-gradient-to-t from-rose-deep to-pink transition-all duration-700" style={{ height: `${h - hs}%` }} />
              {d.sub ? <div className="w-full bg-rose/60" style={{ height: `${hs}%` }} /> : null}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1.5 sm:gap-2">
        {data.map((d, i) => (
          <span key={i} className="flex-1 truncate text-center text-[10px] text-champagne/50">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
export const fmtDate = (iso: string | Date, o: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }) => new Date(iso).toLocaleDateString("en-US", o);
export const fmtTime = (iso: string | Date) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
