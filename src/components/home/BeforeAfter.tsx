"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronsLeftRight } from "lucide-react";

/**
 * Before–after comparison of a real loc reconstruction.
 * Smooth by design: the divider position lives in a CSS variable that is
 * updated once per animation frame (no React re-render while dragging),
 * images can't be native-dragged, and the drag keeps working even if the
 * pointer leaves the box. Click/tap anywhere to jump; arrow keys work too.
 */
export function BeforeAfter({ before, after, beforeAlt, afterAlt }: { before: string; after: string; beforeAlt: string; afterAlt: string }) {
  const box = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setTargetRef = useRef<(v: number) => void>(() => {});
  const target = useRef(50);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.style.setProperty("--pos", "50%");
    let pos = 50;
    let raf = 0;
    const paint = () => {
      // ease toward the target for a buttery follow, snap when close
      const d = target.current - pos;
      pos = Math.abs(d) < 0.05 ? target.current : pos + d * 0.35;
      el.style.setProperty("--pos", `${pos}%`);
      handle.current?.setAttribute("aria-valuenow", String(Math.round(target.current)));
      raf = pos === target.current ? 0 : requestAnimationFrame(paint);
    };
    const setTarget = (v: number) => {
      target.current = Math.max(2, Math.min(98, v));
      if (!raf) raf = requestAnimationFrame(paint);
    };
    setTargetRef.current = setTarget;
    const fromClientX = (x: number) => {
      const r = el.getBoundingClientRect();
      setTarget(((x - r.left) / r.width) * 100);
    };
    let startX = 0;
    let startY = 0;
    let decided = false;

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging.current = true;
      decided = e.pointerType === "mouse";
      startX = e.clientX;
      startY = e.clientY;
      if (decided) {
        el.setPointerCapture(e.pointerId);
        fromClientX(e.clientX);
      }
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      if (!decided) {
        // on touch: horizontal intent drags the slider, vertical lets the page scroll
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx < 6 && dy < 6) return;
        if (dy > dx) {
          dragging.current = false;
          return;
        }
        decided = true;
        el.setPointerCapture(e.pointerId);
      }
      fromClientX(e.clientX);
    };
    const up = (e: PointerEvent) => {
      if (dragging.current && !decided) fromClientX(e.clientX); // a tap jumps there
      dragging.current = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const setTarget = setTargetRef.current;
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") setTarget(target.current - step);
    else if (e.key === "ArrowRight") setTarget(target.current + step);
    else if (e.key === "Home") setTarget(2);
    else if (e.key === "End") setTarget(98);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={box}
      className="relative aspect-[4/5] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[1.5rem] bg-blush shadow-[0_40px_80px_-40px_rgba(59,26,40,.55)] [-webkit-user-select:none]"
      style={{ ["--pos" as string]: "50%" }}
    >
      <Image src={after} alt={afterAlt} fill draggable={false} sizes="(max-width: 768px) 100vw, 560px" className="pointer-events-none object-cover" />
      <div className="pointer-events-none absolute inset-0 will-change-[clip-path]" style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}>
        <Image src={before} alt={beforeAlt} fill draggable={false} sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
      </div>
      <span className="eyebrow pointer-events-none absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 text-[0.66rem] text-champagne backdrop-blur">Before</span>
      <span className="eyebrow pointer-events-none absolute right-4 top-4 rounded-full bg-magenta/90 px-3 py-1.5 text-[0.66rem] text-pearl">After</span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-rose via-pearl to-pink shadow-[0_0_12px_rgba(255,90,168,.8)]" style={{ left: "var(--pos)" }} />
      <div
        ref={handle}
        role="slider"
        tabIndex={0}
        aria-label="Compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        onKeyDown={onKey}
        className="absolute top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-pearl/70 bg-ink/60 text-pearl backdrop-blur transition-transform hover:scale-110 focus-visible:scale-110"
        style={{ left: "var(--pos)" }}
      >
        <ChevronsLeftRight className="size-5" aria-hidden />
      </div>
    </div>
  );
}
