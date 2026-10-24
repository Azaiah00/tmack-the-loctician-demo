"use client";

import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarHeart, ChevronDown, Star } from "lucide-react";
import { BOOK_HREF, SITE } from "@/lib/site";
import { Sparkle } from "@/components/site/BrandIcons";

gsap.registerPlugin(ScrollTrigger);

/**
 * HERO_MODE
 * - "loop":   plays on its own like a continuous video — she draws on, holds,
 *             then turns (front → hand → profile → back → front) forever.
 * - "scroll": the original pinned version where scrolling turns her around.
 * Both use the exact same transition (fade out → new lines draw on → embossed
 * still fades in → lines settle). Flip this one value to switch back.
 */
export const HERO_MODE: "loop" | "scroll" = "loop";
const HOLD = 3.2; // seconds each pose is held in loop mode
const K = 5; // loop seconds per scroll "segment" — keeps the scroll timing proportions

/**
 * Signature hero: four line-art frames of a woman with locs, recolored to the
 * brand (rose-gold glitter on black-garnet). Each frame's line art is traced
 * into SVG paths that DRAW ON in glitter, then the embossed still fades in
 * beneath. Scrolling turns her around: front → hand in locs → profile → back.
 */
const FRAMES = [
  { key: "front", alt: "Rose-gold glitter line drawing of a woman with shoulder-length locs, facing forward", caption: "Healthy locs start here" },
  { key: "hand", alt: "Line drawing of a woman twirling a loc between her fingers", caption: "Retwists · Microlocs · Interlocking" },
  { key: "profile", alt: "Line drawing of a woman in profile, long locs falling over her shoulder", caption: "Reconstruction — it’s never too late" },
  { key: "back", alt: "Line drawing of a woman from behind showing long healthy locs", caption: "Protect your crown" },
] as const;

type Lines = { w: number; h: number; paths: string[]; lens: number[] };

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<(Lines | null)[]>([null, null, null, null]);
  const [active, setActive] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  // Load traced line art: first frame immediately, the rest after idle.
  useEffect(() => {
    let alive = true;
    const load = (i: number) =>
      fetch(`/media/hero/lines-${FRAMES[i].key}.json`)
        .then((r) => r.json())
        .then((d: Lines) => alive && setLines((prev) => prev.map((p, j) => (j === i ? d : p))))
        .catch(() => {});
    load(0);
    // Frames 2–4 load on first scroll/touch intent (or after 5s, 1.5s in loop mode) to keep the first paint light.
    let started = false;
    const rest = () => {
      if (started) return;
      started = true;
      [1, 2, 3].forEach(load);
    };
    const evs = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
    evs.forEach((e) => window.addEventListener(e, rest, { once: true, passive: true }));
    const t = window.setTimeout(rest, HERO_MODE === "loop" ? 1500 : 5000);
    return () => {
      alive = false;
      window.clearTimeout(t);
      evs.forEach((e) => window.removeEventListener(e, rest));
    };
  }, []);

  const allLoaded = lines.every(Boolean);

  // Safety net: never leave the hero image hidden if line art fails to load.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const r = root.current?.querySelector<HTMLElement>('[data-frame="0"] .raster');
      if (r && Number(getComputedStyle(r).opacity) < 0.5 && !root.current?.querySelector('[data-frame="0"] svg.draw')) gsap.to(r, { opacity: 1, duration: 1 });
    }, 2500);
    return () => window.clearTimeout(t);
  }, []);

  // Intro draw-on for frame 0 (time based, not scroll based)
  useEffect(() => {
    if (!lines[0] || !root.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const svg = root.current.querySelector<SVGSVGElement>('[data-frame="0"] svg.draw');
    const raster = root.current.querySelector<HTMLElement>('[data-frame="0"] .raster');
    if (!svg || !raster) return;
    const paths = svg.querySelectorAll<SVGPathElement>("path.ln");
    if (reduce) {
      gsap.set(paths, { strokeDashoffset: 0 });
      gsap.set(raster, { opacity: 1 });
      gsap.set(svg.querySelector(".lines"), { opacity: 0.22 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(paths, { strokeDashoffset: (_i: number, el: SVGPathElement) => Number(el.dataset.len ?? 0) });
      const tl = gsap.timeline({ delay: 0.2, onComplete: () => setIntroDone(true) });
      tl.to(paths, { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut", stagger: { amount: 1.1, from: "start" } })
        .to(raster, { opacity: 1, duration: 1.6, ease: "power2.out" }, 1.9)
        .to(svg.querySelector(".lines"), { opacity: 0.22, duration: 1.4 }, 2.6);
    }, root);
    return () => ctx.revert();
  }, [lines[0]]); // eslint-disable-line react-hooks/exhaustive-deps

  // LOOP: continuous, video-like — same transition as the scroll version, driven by time.
  useEffect(() => {
    if (HERO_MODE !== "loop" || !allLoaded || !introDone || !root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tl: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>("[data-frame]");
      frames.forEach((f, i) => {
        if (i === 0) return;
        gsap.set(f.querySelectorAll("path.ln"), { strokeDashoffset: (_i: number, el: SVGPathElement) => Number(el.dataset.len ?? 0) });
        gsap.set(f.querySelector(".raster"), { opacity: 0 });
        gsap.set(f, { autoAlpha: 1 });
      });
      tl = gsap.timeline({ repeat: -1, defaults: { ease: "power1.inOut" } });
      let t = HOLD - 1; // frame 0 was just drawn by the intro
      const order = [1, 2, 3, 0];
      order.forEach((ci, n) => {
        const prev = frames[n === 0 ? 0 : order[n - 1]];
        const cur = frames[ci];
        // prepare the incoming frame (invisible) right before its turn
        tl!.set(cur.querySelector("svg.draw"), { opacity: 1 }, t)
          .set(cur.querySelector(".lines"), { opacity: 1 }, t)
          .set(cur.querySelector(".raster"), { opacity: 0 }, t)
          .set(cur.querySelectorAll("path.ln"), { strokeDashoffset: (_i: number, el: SVGPathElement) => Number(el.dataset.len ?? 0) }, t);
        // identical choreography to the scroll version, scaled to seconds
        tl!.to(prev.querySelector(".raster"), { opacity: 0, duration: 0.22 * K }, t)
          .to(prev.querySelector("svg.draw"), { opacity: 0, duration: 0.22 * K }, t)
          .to(cur.querySelectorAll("path.ln"), { strokeDashoffset: 0, duration: 0.26 * K, ease: "power2.inOut", stagger: { amount: 0.08 * K } }, t + 0.02 * K)
          .to(cur.querySelector(".raster"), { opacity: 1, duration: 0.2 * K }, t + 0.26 * K)
          .to(cur.querySelector(".lines"), { opacity: 0.22, duration: 0.15 * K }, t + 0.36 * K)
          .call(() => setActive(ci), [], t + 0.15 * K);
        t += 0.51 * K + HOLD;
      });
      tl.to({}, { duration: 0.01 }, t);
      // slow "breathing" drift of the whole stage
      gsap.to(stage.current, { scale: 1.04, duration: 12, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, root);
    // pause while off-screen or the tab is hidden
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl?.resume() : tl?.pause()), { threshold: 0.05 });
    io.observe(root.current);
    const vis = () => (document.hidden ? tl?.pause() : tl?.resume());
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      ctx.revert();
    };
  }, [allLoaded, introDone]);

  // SCROLL: she turns around (desktop + mobile), pinned stage.
  useEffect(() => {
    if (HERO_MODE !== "scroll" || !allLoaded || !root.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>("[data-frame]");
      frames.forEach((f, i) => {
        if (i === 0) return;
        const p = f.querySelectorAll<SVGPathElement>("path.ln");
        gsap.set(p, { strokeDashoffset: (_i: number, el: SVGPathElement) => Number(el.dataset.len ?? 0) });
        gsap.set(f.querySelector(".raster"), { opacity: 0 });
        gsap.set(f, { autoAlpha: 1 });
      });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (st) => setActive(Math.min(3, Math.floor(st.progress * 3.999))),
        },
      });
      for (let i = 1; i < frames.length; i++) {
        const prev = frames[i - 1];
        const cur = frames[i];
        // Each frame holds for most of its scroll segment; the change happens in a short window.
        const at = (i - 1) * 1 + 0.3;
        tl.to(prev.querySelector(".raster"), { opacity: 0, duration: 0.22 }, at)
          .to(prev.querySelector("svg.draw"), { opacity: 0, duration: 0.22 }, at)
          .to(cur.querySelectorAll("path.ln"), { strokeDashoffset: 0, duration: 0.26, stagger: { amount: 0.08 } }, at + 0.02)
          .to(cur.querySelector(".raster"), { opacity: 1, duration: 0.2 }, at + 0.26)
          .fromTo(cur.querySelector(".lines"), { opacity: 1 }, { opacity: 0.22, duration: 0.15 }, at + 0.36);
      }
      tl.to({}, { duration: 0.2 });

      // gentle parallax drift of the whole stage
      gsap.to(stage.current, { scale: 1.06, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, [allLoaded]);

  // Pointer parallax (desktop only)
  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const qx = gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" });
    const qy = gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" });
    const on = (e: PointerEvent) => {
      qx((e.clientX / window.innerWidth - 0.5) * -14);
      qy((e.clientY / window.innerHeight - 0.5) * -10);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);

  return (
    <section ref={root} aria-labelledby="hero-title" className={`relative min-h-[100svh] bg-ink ${HERO_MODE === "scroll" ? "motion-safe:h-[340vh]" : ""}`}>
      <div className="sticky top-0 min-h-[100svh] overflow-hidden">
        {/* Stage */}
        <div ref={stage} className="absolute inset-x-[-2%] top-14 h-[52svh] will-change-transform [mask-image:linear-gradient(#000_72%,transparent)] lg:inset-y-[-2%] lg:left-[17%] lg:right-[-21%] lg:h-auto lg:[mask-image:none]">
          {FRAMES.map((f, i) => (
            <div key={f.key} data-frame={i} className="absolute inset-0" style={i === 0 ? undefined : { visibility: "hidden" }}>
              <picture>
                <source media="(max-width: 820px)" srcSet={`/media/hero/${f.key}-1200.webp`} />
                <img
                  src={`/media/hero/${f.key}.webp`}
                  alt={i === 0 ? f.alt : ""}
                  aria-hidden={i === 0 ? undefined : true}
                  className={`raster absolute inset-0 size-full object-cover ${i === 0 ? "motion-reduce:!opacity-100" : ""}`}
                  style={{ opacity: i === 0 ? 0.14 : 0 }}
                  fetchPriority={i === 0 ? "high" : "low"}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  width={2400}
                  height={1340}
                />
              </picture>
              {lines[i] && <LineArt data={lines[i]!} id={f.key} glitter={i === active} delay={i === 0 && !introDone ? 2.2 : 0.4} />}
            </div>
          ))}
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/hero/front.webp" alt={FRAMES[0].alt} className="absolute inset-0 size-full object-cover" />
          </noscript>
        </div>

        {/* Ambient sparkles */}
        <Twinkles />

        {/* Readability veils */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(14,6,11,.55)_100%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink via-ink/80 to-transparent lg:h-[40%]" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[45%] bg-gradient-to-r from-ink/90 via-ink/50 to-transparent lg:block" />

        {/* Copy */}
        <div className="wrap relative flex min-h-[100svh] flex-col justify-end pb-24 pt-28 lg:justify-center lg:pb-0">
          <div className="max-w-xl">
            <p className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1 text-rose">
              <Sparkle className="size-3 text-pink" aria-hidden />
              <span>Master Loctician</span>
              <span aria-hidden className="hidden min-[420px]:inline">·</span>
              <span className="basis-full pl-5 min-[420px]:basis-auto min-[420px]:pl-0">Midlothian, VA</span>
            </p>
            <h1 id="hero-title" className="display mt-4 text-[clamp(2.9rem,8.4vw,6.4rem)] text-pearl">
              Healthy locs
              <span className="block">
                start <em className="text-rosegold text-rosegold-anim not-italic font-[family-name:var(--font-script)] text-[1.08em] leading-[0.8] tracking-normal">here.</em>
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-champagne/85 sm:text-lg">
              Retwists, microlocs, interlocking and full loc reconstruction in a private studio — gentle hands, healthy scalp, locs that last.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={BOOK_HREF} className="btn btn-primary">
                <CalendarHeart className="size-4" aria-hidden /> Book your appointment
              </Link>
              <Link href="/shop" className="btn btn-ghost">
                Shop Crown Care
              </Link>
            </div>
            <a href={SITE.googleUrl} target="_blank" rel="noopener" className="mt-5 inline-flex min-h-11 items-center gap-3 text-sm text-champagne/85 hover:text-pearl">
              <span className="flex text-pink" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </span>
              <span>
                <strong className="text-pearl">5.0</strong> from {SITE.rating.count} Google reviews
              </span>
            </a>
          </div>
        </div>

        {/* Frame caption + progress */}
        <div className="pointer-events-none absolute bottom-6 right-5 hidden items-center gap-4 md:flex lg:right-10">
          <p className="eyebrow text-right text-champagne/70" aria-live="polite">
            {FRAMES[active].caption}
          </p>
          <div className="flex flex-col gap-1.5" aria-hidden>
            {FRAMES.map((f, i) => (
              <span key={f.key} className={`h-6 w-[2px] rounded-full transition-colors duration-500 ${i === active ? "bg-pink" : "bg-champagne/20"}`} />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center text-champagne/60 motion-safe:flex">
          <span className="eyebrow text-[0.64rem]">Scroll</span>
          <ChevronDown className="size-4 animate-bounce" aria-hidden />
        </div>
      </div>
    </section>
  );
}

const LineArt = memo(function LineArt({ data, id, glitter, delay }: { data: Lines; id: string; glitter: boolean; delay: number }) {
  return (
    <svg className="draw pointer-events-none absolute inset-0 size-full" viewBox={`0 0 ${data.w} ${data.h}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={`rg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd9c9" />
          <stop offset=".35" stopColor="#e7a98c" />
          <stop offset=".55" stopColor="#ff8cc2" />
          <stop offset=".8" stopColor="#e7a98c" />
          <stop offset="1" stopColor="#fff1e8" />
        </linearGradient>
      </defs>
      <g className="lines" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {data.paths.map((d, i) => (
          <path key={i} className="ln" d={d} stroke={`url(#rg-${id})`} strokeWidth={2.2} strokeDasharray={data.lens[i] + 2} strokeDashoffset={0} data-len={data.lens[i] + 2} />
        ))}
      </g>
      {/* Glitter: champagne sparkle dots travelling along a third of the strands (active frame only) */}
      {glitter && (
        <g fill="none" strokeLinecap="round" className="glitter" style={{ animationDelay: `${delay}s` }}>
          {data.paths.map((d, i) =>
            i % 3 === 0 ? <path key={i} d={d} stroke="#fff4ec" strokeWidth={1.4} strokeDasharray={`0.1 ${12 + (i % 5) * 3}`} /> : null,
          )}
        </g>
      )}
      <style>{`
        .glitter{opacity:0;animation:glitIn 1.2s ease forwards}
        .glitter path{animation:glint 3.4s linear infinite}
        .glitter path:nth-child(2n){animation-duration:4.6s;animation-direction:reverse}
        @keyframes glint{to{stroke-dashoffset:-60}}
        @keyframes glitIn{to{opacity:.65}}
        @media (prefers-reduced-motion: reduce){.glitter{animation:none;opacity:.6}.glitter path{animation:none}}
      `}</style>
    </svg>
  );
});

const SPARKS = [
  [12, 22, 10, 0],
  [86, 18, 14, 1.2],
  [70, 62, 9, 2.1],
  [28, 70, 12, 0.6],
  [55, 12, 8, 3],
  [92, 48, 11, 1.7],
  [40, 38, 7, 2.6],
  [64, 30, 10, 0.3],
  [18, 46, 8, 3.4],
  [78, 80, 9, 1],
] as const;

function Twinkles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {SPARKS.map(([x, y, s, d], i) => (
        <Sparkle
          key={i}
          className="absolute text-champagne motion-safe:animate-[twinkle_3.6s_ease-in-out_infinite] opacity-0 motion-reduce:opacity-40"
          style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${d}s`, filter: "drop-shadow(0 0 6px #ff5aa8)" }}
        />
      ))}
    </div>
  );
}
