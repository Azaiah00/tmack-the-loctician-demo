"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

/** Drag / keyboard before–after comparison of a real loc reconstruction. */
export function BeforeAfter({ before, after, beforeAlt, afterAlt }: { before: string; after: string; beforeAlt: string; afterAlt: string }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(3, Math.min(97, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={box}
      className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-[1.5rem] bg-blush shadow-[0_40px_80px_-40px_rgba(59,26,40,.55)]"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && move(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      style={{ touchAction: "pan-y" }}
    >
      <Image src={after} alt={afterAlt} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={beforeAlt} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
      </div>
      <span className="eyebrow absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 text-[0.6rem] text-champagne backdrop-blur">Before</span>
      <span className="eyebrow absolute right-4 top-4 rounded-full bg-magenta/90 px-3 py-1.5 text-[0.6rem] text-pearl">After</span>
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -left-px w-0.5 bg-gradient-to-b from-rose via-pearl to-pink shadow-[0_0_12px_rgba(255,90,168,.8)]" />
      </div>
      <input
        type="range"
        min={3}
        max={97}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare before and after"
        className="absolute inset-x-0 bottom-0 h-12 w-full cursor-ew-resize opacity-0"
      />
      <div className="pointer-events-none absolute top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-pearl/70 bg-ink/60 text-pearl backdrop-blur" style={{ left: `${pos}%` }}>
        <ChevronsLeftRight className="size-5" aria-hidden />
      </div>
    </div>
  );
}
