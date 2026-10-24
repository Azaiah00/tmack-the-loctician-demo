"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, X } from "lucide-react";
import { SHOP } from "@/lib/products";
import { CrownMark, Sparkle } from "./BrandIcons";

const SEEN = "tmack-jewel-seen";

/**
 * Gamified exit-intent (agency Gamified Popup Library: "scratch-off").
 * Scratch the rose-gold jewel to reveal her real shop code TMACK10
 * (10% off 2+ items on tmackcrowncare.com). No data is collected.
 */
export function CrownJewelPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const trigger = useCallback(() => {
    try {
      if (window.sessionStorage.getItem(SEEN)) return;
      window.sessionStorage.setItem(SEEN, "1");
    } catch {
      /* ignore */
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    if (pathname.startsWith("/portal")) return;
    const desktop = window.matchMedia("(pointer: fine)").matches;
    let armed = false;
    const arm = window.setTimeout(() => (armed = true), 12000);
    const onLeave = (e: MouseEvent) => {
      if (armed && e.clientY <= 0 && !e.relatedTarget) trigger();
    };
    let mobileTimer = 0;
    if (desktop) document.addEventListener("mouseout", onLeave);
    else mobileTimer = window.setTimeout(trigger, 50000);
    return () => {
      window.clearTimeout(arm);
      window.clearTimeout(mobileTimer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [pathname, trigger]);

  // Scratch surface
  useEffect(() => {
    if (!open || revealed) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = c.clientWidth;
    const h = c.clientHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#f9d2c0");
    g.addColorStop(0.35, "#e7a98c");
    g.addColorStop(0.55, "#fff1e8");
    g.addColorStop(0.8, "#b76e79");
    g.addColorStop(1, "#e7a98c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7})`;
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(59,26,40,.75)";
    ctx.font = "600 13px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH TO REVEAL", w / 2, h / 2 + 5);
    ctx.globalCompositeOperation = "destination-out";

    let down = false;
    let moves = 0;
    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const scratch = (e: PointerEvent) => {
      if (!down) return;
      const [x, y] = pos(e);
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      if (++moves % 12 === 0) {
        const data = ctx.getImageData(0, 0, c.width, c.height).data;
        let clear = 0;
        for (let i = 3; i < data.length; i += 64) if (data[i] === 0) clear++;
        if (clear / (data.length / 64) > 0.45) setRevealed(true);
      }
    };
    const onDown = (e: PointerEvent) => {
      down = true;
      c.setPointerCapture(e.pointerId);
      scratch(e);
    };
    const onUp = () => (down = false);
    c.addEventListener("pointerdown", onDown);
    c.addEventListener("pointermove", scratch);
    c.addEventListener("pointerup", onUp);
    c.addEventListener("pointercancel", onUp);
    return () => {
      c.removeEventListener("pointerdown", onDown);
      c.removeEventListener("pointermove", scratch);
      c.removeEventListener("pointerup", onUp);
      c.removeEventListener("pointercancel", onUp);
    };
  }, [open, revealed]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SHOP.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="jewel-title">
          <button className="absolute inset-0 bg-ink/75 backdrop-blur-sm" aria-label="Close" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ y: 30, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="card-night relative w-full max-w-md overflow-hidden p-7 text-center shadow-[0_40px_120px_-30px_rgba(224,33,138,.6)]"
          >
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 grid size-10 place-items-center rounded-full text-champagne/70 hover:text-pearl" aria-label="Close">
              <X className="size-5" />
            </button>
            <CrownMark className="mx-auto h-8 w-12 text-rose" />
            <p className="eyebrow mt-3 text-rose">A little crown jewel for you</p>
            <h2 id="jewel-title" className="display mt-2 text-4xl text-pearl">
              Before you go, <em className="text-rosegold">queen</em>
            </h2>
            <p className="mt-2 text-sm text-champagne/80">Scratch the jewel for a Crown Care Collection treat.</p>

            <div className="relative mx-auto mt-6 h-32 w-full max-w-xs overflow-hidden rounded-2xl border border-rose/40 bg-garnet">
              <div className="absolute inset-0 grid place-items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-rose">Your code</p>
                  <p className="display text-5xl tracking-wider text-pearl">{SHOP.promoCode}</p>
                  <p className="text-xs text-champagne/80">{SHOP.promoText}</p>
                </div>
              </div>
              {!revealed && <canvas ref={canvasRef} className="absolute inset-0 size-full touch-none" aria-label="Scratch-off card. Drag to scratch, or use the reveal button." />}
              {revealed &&
                [10, 30, 70, 88].map((x, i) => (
                  <Sparkle key={i} className="absolute size-3 animate-[twinkle_2s_ease-in-out_infinite] text-pink" style={{ left: `${x}%`, top: `${i % 2 ? 20 : 70}%`, animationDelay: `${i * 0.3}s` }} />
                ))}
            </div>
            {!revealed ? (
              <button onClick={() => setRevealed(true)} className="mt-3 text-xs text-champagne/70 underline underline-offset-4">
                Reveal without scratching
              </button>
            ) : (
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button onClick={copy} className="btn btn-ghost">
                  {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />} {copied ? "Copied" : "Copy code"}
                </button>
                <Link href="/shop" onClick={() => setOpen(false)} className="btn btn-primary">
                  Shop now
                </Link>
              </div>
            )}
            <p className="mt-4 text-[11px] leading-relaxed text-mute-dark">Valid on 2+ eligible items at tmackcrowncare.com. Travel-size spritz excluded from promotions.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
