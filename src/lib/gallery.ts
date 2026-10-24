/**
 * Her real client work (Google Business Profile, Yelp and Acuity uploads),
 * upscaled with the original background replaced by a blush studio backdrop.
 * The hair itself is unaltered. Client must confirm consent to feature these.
 * Alt text is kept neutral and `tag` is not displayed until TMack confirms which
 * service each photo shows (some guesses were wrong).
 */
export type Work = { src: string; alt: string; tag: "Retwist" | "Microlocs" | "Interlocking" | "Styles" | "Reconstruction"; tall?: boolean };

export const WORK: Work[] = [
  { src: "/media/work/retwist-long-back.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 1", tag: "Retwist", tall: true },
  { src: "/media/work/interloc-zigzag.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 2", tag: "Interlocking" },
  { src: "/media/work/microlocs-client.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 3", tag: "Microlocs" },
  { src: "/media/work/two-strand-twist-style.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 4", tag: "Styles", tall: true },
  { src: "/media/work/micro-retie-top.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 5", tag: "Microlocs" },
  { src: "/media/work/updo-buns.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 6", tag: "Styles" },
  { src: "/media/work/two-strand-camo.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 7", tag: "Styles" },
  { src: "/media/work/interloc-parts.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 8", tag: "Interlocking", tall: true },
  { src: "/media/work/retwist-side-mens.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 9", tag: "Retwist" },
  { src: "/media/work/long-loc-ponytail.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 10", tag: "Styles" },
  { src: "/media/work/two-strand-pink.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 11", tag: "Retwist" },
  { src: "/media/work/retwist-cutout.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 12", tag: "Styles" },
  { src: "/media/work/ponytail-mens.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 13", tag: "Retwist", tall: true },
  { src: "/media/work/recon-after-top.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 14", tag: "Reconstruction" },
  { src: "/media/work/recon-after-back.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 15", tag: "Reconstruction" },
  { src: "/media/work/retwist-top-mens.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 16", tag: "Retwist" },
  { src: "/media/work/recon-before.webp", alt: "Client locs by TMack The Loctician, Midlothian VA — photo 17", tag: "Reconstruction" },
];
