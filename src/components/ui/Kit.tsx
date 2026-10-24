import { cn } from "@/lib/cn";
import { Sparkle } from "@/components/site/BrandIcons";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-2 text-rose-ink", className)}>
      <Sparkle className="size-2.5 text-magenta" />
      {children}
    </p>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  id?: string;
}) {
  return (
    <div className={cn("reveal max-w-2xl", align === "center" && "mx-auto text-center")}>
      <Eyebrow className={cn(align === "center" && "justify-center", tone === "dark" ? "text-rose" : "text-rose-ink")}>{eyebrow}</Eyebrow>
      <h2 id={id} className={cn("display mt-4 text-[clamp(2.3rem,5.4vw,4.2rem)]", tone === "dark" ? "text-pearl" : "text-cocoa")}>
        {title}
      </h2>
      {intro && <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-champagne/80" : "text-mute")}>{intro}</p>}
    </div>
  );
}

/** Italic rose-gold accent word inside display headings. */
export function Accent({ children }: { children: React.ReactNode }) {
  return <em className="text-rosegold pr-1 italic">{children}</em>;
}
