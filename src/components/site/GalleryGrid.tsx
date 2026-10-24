"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { WORK } from "@/lib/gallery";
import { cn } from "@/lib/cn";

const TAGS = ["All", "Retwist", "Microlocs", "Interlocking", "Styles", "Reconstruction"] as const;

export function GalleryGrid() {
  const [tag, setTag] = useState<(typeof TAGS)[number]>("All");
  const [idx, setIdx] = useState<number | null>(null);
  const list = useMemo(() => WORK.filter((w) => tag === "All" || w.tag === tag), [tag]);

  const step = useCallback((d: number) => setIdx((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    if (idx === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", k);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.documentElement.style.overflow = "";
    };
  }, [idx, step]);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gallery">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            aria-pressed={tag === t}
            className={cn("min-h-10 rounded-full border px-4 text-sm transition", tag === t ? "border-cocoa bg-cocoa text-pearl" : "border-rose-deep/30 hover:border-cocoa")}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-8 columns-2 gap-4 md:columns-3 lg:gap-5">
        {list.map((w, i) => (
          <button key={w.src} onClick={() => setIdx(i)} className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl lg:mb-5" aria-label={`Open photo: ${w.alt}`}>
            <Image src={w.src} alt={w.alt} width={1200} height={1490} sizes="(max-width: 768px) 50vw, 33vw" className="h-auto w-full transition-transform duration-[1.2s] group-hover:scale-[1.04]" />
            <span className="absolute bottom-3 left-3 rounded-full bg-pearl/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa">{w.tag}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {idx !== null && list[idx] && (
          <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Photo viewer">
            <button onClick={() => setIdx(null)} className="absolute right-4 top-4 grid size-12 place-items-center rounded-full text-pearl hover:bg-white/10" aria-label="Close viewer" autoFocus>
              <X className="size-6" />
            </button>
            <button onClick={() => step(-1)} className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full text-pearl hover:bg-white/10 sm:left-6" aria-label="Previous photo">
              <ChevronLeft className="size-7" />
            </button>
            <figure className="relative h-[80vh] w-full max-w-3xl">
              <Image src={list[idx].src} alt={list[idx].alt} fill sizes="90vw" className="object-contain" />
              <figcaption className="absolute -bottom-8 inset-x-0 text-center text-sm text-champagne/80">{list[idx].alt}</figcaption>
            </figure>
            <button onClick={() => step(1)} className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full text-pearl hover:bg-white/10 sm:right-6" aria-label="Next photo">
              <ChevronRight className="size-7" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
