/**
 * Her real client work (Google Business Profile, Yelp and Acuity uploads),
 * upscaled with the original background replaced by a blush studio backdrop.
 * The hair itself is unaltered. Client must confirm consent to feature these.
 */
export type Work = { src: string; alt: string; tag: "Retwist" | "Microlocs" | "Interlocking" | "Styles" | "Reconstruction"; tall?: boolean };

export const WORK: Work[] = [
  { src: "/media/work/retwist-long-back.webp", alt: "Long traditional locs after a palm-roll retwist, crisp square parts", tag: "Retwist", tall: true },
  { src: "/media/work/interloc-zigzag.webp", alt: "Interlocked locs with sharp zig-zag parts on a client", tag: "Interlocking" },
  { src: "/media/work/microlocs-client.webp", alt: "Smiling client with a full head of fresh microlocs", tag: "Microlocs" },
  { src: "/media/work/two-strand-twist-style.webp", alt: "Two-strand twist style over freshly retwisted locs", tag: "Styles", tall: true },
  { src: "/media/work/micro-retie-top.webp", alt: "Top view of a microloc retie with neat grid parts", tag: "Microlocs" },
  { src: "/media/work/updo-buns.webp", alt: "Loc updo with two sculpted buns", tag: "Styles" },
  { src: "/media/work/two-strand-camo.webp", alt: "Short locs finished in a two-strand twist style, back view", tag: "Styles" },
  { src: "/media/work/interloc-parts.webp", alt: "Interlocked traditional locs, top view with clean parts", tag: "Interlocking", tall: true },
  { src: "/media/work/retwist-side-mens.webp", alt: "Men's retwist with defined parts, side view", tag: "Retwist" },
  { src: "/media/work/long-loc-ponytail.webp", alt: "Waist-length locs styled in a sculpted ponytail, back view", tag: "Styles" },
  { src: "/media/work/two-strand-pink.webp", alt: "Retwisted locs finished with barrel-twist ends", tag: "Retwist" },
  { src: "/media/work/retwist-cutout.webp", alt: "Short locs retwisted and styled in two-strand twists", tag: "Styles" },
  { src: "/media/work/ponytail-mens.webp", alt: "Retwisted locs pulled into a high ponytail with clean side parts", tag: "Retwist", tall: true },
  { src: "/media/work/recon-after-top.webp", alt: "Locs after reconstruction: separated, re-parted and retwisted", tag: "Reconstruction" },
  { src: "/media/work/recon-after-back.webp", alt: "Back view after reconstruction: clean, even parts and defined locs", tag: "Reconstruction" },
  { src: "/media/work/retwist-top-mens.webp", alt: "Crown retwist, top view with tight, clean parts", tag: "Retwist" },
  { src: "/media/work/recon-before.webp", alt: "Before reconstruction: overdue, conjoined locs", tag: "Reconstruction" },
];
