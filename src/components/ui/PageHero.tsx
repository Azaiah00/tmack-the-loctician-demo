import Image from "next/image";
import { Eyebrow } from "./Kit";

/** Compact inner-page hero using one of the brand line-art frames. */
export function PageHero({
  eyebrow,
  title,
  intro,
  frame = "profile",
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  frame?: "front" | "hand" | "profile" | "back";
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-16 pt-36 lg:pb-24 lg:pt-44">
      <Image src={`/media/hero/${frame}.webp`} alt="" fill priority fetchPriority="high" quality={45} sizes="(max-width: 768px) 60vw, 70vw" className="-z-20 object-cover object-[70%_30%] opacity-55" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-ink to-transparent" />
      <div className="wrap">
        <div className="max-w-2xl">
          <Eyebrow className="text-rose">{eyebrow}</Eyebrow>
          <h1 className="display mt-4 text-[clamp(2.8rem,7vw,5.6rem)] text-pearl">{title}</h1>
          {intro && <p className="mt-5 max-w-xl text-lg leading-relaxed text-champagne/80">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
