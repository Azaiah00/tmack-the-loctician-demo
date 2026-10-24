/**
 * Real Google reviews (5.0 ★, 17 reviews) — collected 2026-10-23 from her
 * Google Business Profile. Excerpts are verbatim; long reviews are trimmed
 * with an ellipsis. Names shortened to first name + initial.
 */
export type Review = { name: string; text: string; service?: string; when: string };

export const REVIEWS: Review[] = [
  {
    name: "Sabrina",
    service: "Loc detox + interlocking retwist",
    when: "October 2026",
    text: "I had a great experience with my loc detox and retwist! The booking process was easy and convenient, and TMack was very knowledgeable about loc care. I specifically requested the interlocking method, which TMack recommended to me… She’s talented, thorough, and great at what she does.",
  },
  {
    name: "Amaka W.",
    service: "Microlocs",
    when: "2026",
    text: "She is very kind, a great listener, super professional, and on top of that she does a very good job on my locks, you can tell she has hands that grow hair and not hands that destroy hair… she offers free snacks and beverages while you get your hair done.",
  },
  {
    name: "Shacoria C.",
    service: "Loc reconstruction",
    when: "October 2026",
    text: "My hair needed a reconstruction bad and she did her thing with fixing it. I highly recommend her.",
  },
  {
    name: "Jessika B.",
    when: "2026",
    text: "My Loctician is everything. Every appointment feels like a reset for my hair and my spirit. She’s gentle, she’s fast, she knows what she’s doing, and my locs have never looked better.",
  },
  {
    name: "Angelique S.",
    when: "2026",
    text: "She was patient, very easy to talk to and laugh with, gentle on my locs (I now believe I am not tender headed, ppl are just rough)… If you’re looking for someone to bless your head, I’d HIGHLY recommend this beautiful woman!",
  },
  {
    name: "Syrah E.",
    when: "2026",
    text: "Been going to her since December of 2025, my hair grew so much and became stronger and I have so many compliments. The QUALITY of the work she does is fulfilling and helps my hair so much.",
  },
  {
    name: "Ruthie E.",
    service: "Starting her loc journey",
    when: "2026",
    text: "She is not here just to talk your money. She explained everything to me… and she never got tired of me asking questions. Service is so EXCELLENT. You will never be disappointed.",
  },
  {
    name: "Ty T.",
    service: "Loc reconstruction",
    when: "2026",
    text: "She did great on reconstructing my locs & made me feel comfortable. Very satisfied.",
  },
  {
    name: "Virginia P.",
    when: "2026",
    text: "T Mack is awesome with a positive attitude, she is patient and takes her time with your hair. I just love my hair! Great atmosphere!",
  },
  {
    name: "Lo M.",
    service: "Microloc retie",
    when: "2026",
    text: "Exceptional job on my hair! She was on time, courteous, professional and knowledgeable. Her energy and skills are amazing. Can’t wait for my next retie.",
  },
  {
    name: "Ashley B.",
    when: "October 2026",
    text: "Wonderful work, great service, comfortable environment. Check out her at home care products.",
  },
  {
    name: "Saul S.",
    when: "2026",
    text: "Consistently high quality and fast.",
  },
];

/** Product reviews published on tmackcrowncare.com (customer experiences, not clinical claims). */
export const PRODUCT_REVIEWS = [
  { name: "WBX, Google review", title: "Get you a bottle or 2!", text: "I also bought 2 bottles of her handmade all natural loc spray! Keeps locs moisturized and shiny and healthy." },
  { name: "Ashley B., Google review", title: "Check out her at home care products", text: "Wonderful work, great service, comfortable environment. Check out her at home care products." },
];
