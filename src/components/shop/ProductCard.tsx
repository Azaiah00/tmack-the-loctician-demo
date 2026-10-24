"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { fmtMoney } from "@/lib/services";
import { useCart } from "./cart";
import { cn } from "@/lib/cn";

export function ProductCard({ p, tone = "dark", priority = false }: { p: Product; tone?: "dark" | "light"; priority?: boolean }) {
  const { add } = useCart();
  const [variant, setVariant] = useState(p.variants[0].id);
  return (
    <article className={cn("group relative flex flex-col overflow-hidden rounded-[1.25rem]", tone === "dark" ? "card-night" : "card-light")}>
      <Link href={`/shop/${p.handle}`} className="relative block aspect-[4/5] overflow-hidden bg-garnet" tabIndex={-1} aria-hidden="true">
        <Image
          src={p.image}
          alt={p.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-lux)] group-hover:scale-[1.05]"
        />
        {p.badge && <span className="absolute left-3 top-3 rounded-full bg-pearl/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cocoa">{p.badge}</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className={cn("text-[10px] font-semibold uppercase tracking-[0.22em]", tone === "dark" ? "text-rose" : "text-rose-ink")}>{p.category}</p>
        <h3 className={cn("display mt-1 text-xl leading-tight sm:text-2xl", tone === "dark" ? "text-pearl" : "text-cocoa")}>
          <Link href={`/shop/${p.handle}`} className="hover:underline hover:decoration-pink/60 hover:underline-offset-4">
            {p.name}
          </Link>
        </h3>
        <p className={cn("mt-1 text-sm", tone === "dark" ? "text-champagne/70" : "text-mute")}>{p.size ?? p.short}</p>
        {p.variants.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`${p.name} color`}>
            {p.variants.map((v) => (
              <button
                key={v.id}
                role="radio"
                aria-checked={variant === v.id}
                onClick={() => setVariant(v.id)}
                className={cn(
                  "min-h-8 rounded-full border px-3 text-xs transition",
                  variant === v.id
                    ? "border-pink bg-pink/15 text-pink"
                    : tone === "dark"
                      ? "border-rose/30 text-champagne/80 hover:border-rose"
                      : "border-rose-deep/30 text-cocoa/80 hover:border-rose-deep",
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className={cn("display text-2xl tabular-nums", tone === "dark" ? "text-pearl" : "text-cocoa")}>{fmtMoney(p.price)}</span>
          <button
            onClick={() => add(p.handle, variant)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-gradient-to-r from-magenta to-pink px-4 text-sm font-semibold text-pearl shadow-[0_8px_20px_-8px_rgba(224,33,138,.7)] transition hover:-translate-y-0.5"
            aria-label={`Add ${p.name} to bag`}
          >
            <Plus className="size-4" aria-hidden /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
