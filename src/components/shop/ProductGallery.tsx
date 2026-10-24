"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function ProductGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-garnet">
        <Image key={images[i].src} src={images[i].src} alt={images[i].alt} fill priority sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((im, k) => (
            <button
              key={im.src}
              onClick={() => setI(k)}
              aria-label={`Show image ${k + 1}: ${im.alt}`}
              aria-current={i === k}
              className={cn("relative size-20 overflow-hidden rounded-xl border-2 transition", i === k ? "border-pink" : "border-transparent opacity-70 hover:opacity-100")}
            >
              <Image src={im.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
