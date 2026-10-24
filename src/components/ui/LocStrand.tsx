"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * A single hand-drawn loc strand in rose-gold glitter that draws itself as the
 * section scrolls into view — the brand's "one move per section" signature.
 */
export function LocStrand({ className, flip = false, tone = "dark" }: { className?: string; flip?: boolean; tone?: "dark" | "light" }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const paths = svg.querySelectorAll<SVGPathElement>(".s");
    const ctx = gsap.context(() => {
      paths.forEach((p) => {
        const l = p.getTotalLength();
        gsap.set(p, { strokeDasharray: l, strokeDashoffset: l });
      });
      gsap.to(paths, {
        strokeDashoffset: 0,
        ease: "none",
        stagger: 0.08,
        scrollTrigger: { trigger: svg, start: "top 85%", end: "bottom 45%", scrub: 1 },
      });
    }, svg);
    return () => ctx.revert();
  }, []);

  const id = flip ? "strand-b" : "strand-a";
  return (
    <svg ref={ref} viewBox="0 0 120 600" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} fill="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone === "dark" ? "#fff1e8" : "#b76e79"} stopOpacity="0" />
          <stop offset=".15" stopColor="#e7a98c" />
          <stop offset=".55" stopColor="#ff5aa8" />
          <stop offset="1" stopColor="#e7a98c" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${id})`} strokeLinecap="round" strokeWidth="1.6">
        <path className="s" d="M60 0c-14 40 18 70 2 112s-26 70-6 110 22 76 2 118-20 80 2 120 14 70 0 100c-6 14-4 26 6 30" />
        <path className="s" d="M74 20c-10 34 14 62 2 98s-22 66-6 104 18 72 0 112-16 78 4 116" opacity=".6" />
        <path className="s" d="M46 40c-12 30 10 60-2 92s-20 62-4 98 16 70-2 108" opacity=".45" />
      </g>
      <g fill="#fff4ec">
        <circle cx="62" cy="114" r="1.3" />
        <circle cx="58" cy="226" r="1" />
        <circle cx="62" cy="342" r="1.4" />
        <circle cx="62" cy="464" r="1" />
      </g>
    </svg>
  );
}
