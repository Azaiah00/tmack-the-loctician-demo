import { Plus } from "lucide-react";

export function FaqList({ items, tone = "light" }: { items: { q: string; a: string }[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className={dark ? "divide-y divide-rose/15 border-y border-rose/15" : "divide-y divide-rose-deep/15 border-y border-rose-deep/15"}>
      {items.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-lg font-semibold [&::-webkit-details-marker]:hidden ${dark ? "text-pearl" : "text-cocoa"}`}>
            {f.q}
            <Plus className="size-5 shrink-0 text-magenta transition-transform duration-300 group-open:rotate-45" aria-hidden />
          </summary>
          <p className={`pb-5 pr-10 leading-relaxed ${dark ? "text-champagne/75" : "text-mute"}`}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
