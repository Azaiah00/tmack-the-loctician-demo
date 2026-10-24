/**
 * TMack Crown Care Collection — verified from tmackcrowncare.com/products.json
 * on 2026-10-23. Variant IDs are her real Shopify variant IDs, so the bag
 * checks out on her live store in one step via a Shopify cart permalink.
 */
export type Variant = { id: string; label: string };

export type Product = {
  handle: string;
  shopifyHandle: string;
  name: string;
  short: string;
  price: number;
  size?: string;
  category: "Hair Care" | "Satin Care";
  image: string;
  imageAlt: string;
  gallery?: { src: string; alt: string }[];
  variants: Variant[];
  description: string;
  benefits: string[];
  perfectFor?: string[];
  ingredients?: string[];
  howTo?: string[];
  note?: string;
  noPromos?: boolean;
  badge?: string;
};

export const SHOP = {
  domain: "https://tmackcrowncare.com",
  freeShippingOver: 100,
  promoCode: "TMACK10",
  promoText: "10% off 2+ items",
  shipsOn: "Orders ship every Monday",
  returns:
    "All sales are final for sanitary reasons. Damaged, defective or incorrect items must be reported within 48 hours of delivery to info@tmackcrowncare.com with your order number and photos.",
};

export const PRODUCTS: Product[] = [
  {
    handle: "loc-moisturizer-spritz",
    shopifyHandle: "tmack-crown-care-collection-loc-moisturizer-spritz-16-oz",
    name: "Loc Moisturizer Spritz",
    short: "Lightweight daily moisture for locs and scalp.",
    price: 24.99,
    size: "16 oz / 473 mL",
    category: "Hair Care",
    image: "/media/shop/spritz-16oz.webp",
    imageAlt: "TMack Crown Care Loc Moisturizer Spritz 16 oz bottle on a blush marble pedestal",
    gallery: [{ src: "/media/shop/routine-duo.webp", alt: "Loc Moisturizer Spritz and Chebe Growth Oil together" }],
    variants: [{ id: "52426435363036", label: "16 oz" }],
    description:
      "Hydration your hair will love. Keep your locs and natural hair hydrated, refreshed and healthy with a lightweight spritz designed to combat dryness without heavy buildup, supporting soft, manageable hair and a healthy-looking scalp.",
    benefits: [
      "Hydrates dry locs and natural hair",
      "Helps reduce dryness and breakage",
      "Refreshes the scalp and hair",
      "Lightweight, non-greasy formula",
      "All natural & organic ingredients",
      "Cruelty free",
    ],
    perfectFor: ["Traditional locs", "Microlocs", "Starter locs", "Braids & twists", "Natural hair"],
    ingredients: ["Distilled water", "Organic aloe vera", "Emu oil", "Rosemary oil", "Lavender oil", "Peppermint oil", "Lemongrass essential oil"],
    howTo: ["Shake well.", "Spray evenly on locs, natural hair or scalp as needed.", "Massage and style as desired.", "Use 2–3 times weekly, or as needed, to keep locs hydrated and fresh."],
    badge: "Best seller",
  },
  {
    handle: "chebe-growth-oil",
    shopifyHandle: "tmack-crown-care-collection™-chebe-growth-oil",
    name: "Chebe Growth Oil",
    short: "Real herbs and natural oils to seal in moisture.",
    price: 14.99,
    size: "4 fl oz / 118 mL",
    category: "Hair Care",
    image: "/media/shop/chebe-oil.webp",
    imageAlt: "TMack Crown Care Chebe Growth Oil bottle with herbs inside, on a blush marble pedestal",
    variants: [{ id: "51812229611740", label: "4 fl oz" }],
    description:
      "Nourish your crown naturally. A lightweight, non-greasy oil infused with real herbs and premium natural oils to help strengthen hair, reduce breakage and soothe the scalp. Perfect for locs, microlocs, natural hair, braids, twists and protective styles.",
    benefits: [
      "Supports healthy hair growth",
      "Helps reduce breakage & shedding",
      "Nourishes a dry scalp",
      "Strengthens weak, damaged hair",
      "Lightweight & non-greasy",
      "Safe for all hair types",
    ],
    ingredients: ["Chebe herbs", "Biotin", "Fenugreek", "Jamaican black castor oil", "Cherry seed oil", "Peppermint oil", "Rosemary oil", "Shea oil", "Sweet almond oil", "Grapeseed oil", "Lavender", "Cloves"],
    howTo: ["Step 1: mist with the Loc Moisturizer Spritz.", "Step 2: apply a few drops of oil to the scalp and along the locs to seal.", "Massage in gently."],
    badge: "Seal it in",
  },
  {
    handle: "travel-loc-moisturizer-spritz",
    shopifyHandle: "tmack-crown-care-collection-travel-size-loc-moisturizer-spritz-2-oz",
    name: "Travel Size Loc Moisturizer Spritz",
    short: "Same care, anywhere you go. Refillable.",
    price: 7.99,
    size: "2 oz / 59 mL",
    category: "Hair Care",
    image: "/media/shop/spritz-2oz.webp",
    imageAlt: "TMack Crown Care travel-size Loc Moisturizer Spritz 2 oz bottle",
    variants: [{ id: "52426432151772", label: "2 oz" }],
    description:
      "Keep your locs hydrated no matter where life takes you. TSA-approved and perfect for vacations, gym bags, purses, carry-ons and work. Refill it anytime from your 16 oz bottle.",
    benefits: ["TSA-approved travel size", "Hydrates and refreshes between styles", "No heavy buildup", "Refillable from the 16 oz", "All natural & organic", "Cruelty free"],
    note: "This item is not eligible for promotional discounts, coupon codes or bundle offers.",
    noPromos: true,
  },
  {
    handle: "double-layer-satin-bonnet",
    shopifyHandle: "tmack-crown-care-double-layer-satin-bonnet",
    name: "Double-Layer Satin Bonnet",
    short: "Adjustable ties, with a satin storage bag.",
    price: 24.99,
    category: "Satin Care",
    image: "/media/shop/double-bonnet-white.webp",
    imageAlt: "White double-layer satin bonnet with pink rose print on a mannequin, with its black satin storage bag",
    gallery: [{ src: "/media/shop/double-bonnet-black.webp", alt: "Black double-layer satin bonnet with pink rose print" }],
    variants: [
      { id: "50816225149148", label: "White" },
      { id: "50816225181916", label: "Black" },
    ],
    description:
      "Protect your hair while you sleep. Double-layer satin helps retain moisture and reduce frizz and breakage for locs, natural hair, braids and protective styles. Includes a complimentary satin storage bag.",
    benefits: ["Double-layer satin", "Helps retain moisture", "Reduces frizz & breakage", "Adjustable tie design", "Complimentary satin storage bag"],
  },
  {
    handle: "womens-large-satin-bonnet",
    shopifyHandle: "tmack-crown-care-large-women-s-satin-bonnet",
    name: "Large Women's Satin Bonnet",
    short: "Spacious satin for long locs, curls and braids.",
    price: 19.99,
    category: "Satin Care",
    image: "/media/shop/womens-bonnet-black.webp",
    imageAlt: "Black long satin bonnet with bow and pink rose print on a mannequin",
    gallery: [{ src: "/media/shop/womens-bonnet-white.webp", alt: "White long satin bonnet with bow and rose print" }],
    variants: [
      { id: "50984201715932", label: "Black" },
      { id: "50984201748700", label: "White" },
    ],
    description:
      "Sleep beautifully. Luxurious 100% satin helps preserve your style, retain moisture and reduce the friction that leads to breakage, with room for locs, curls, braids, twists and natural hair.",
    benefits: ["Helps retain natural moisture", "Reduces frizz, tangles and split ends", "Protects styles while sleeping", "Gentle on edges", "Room for long locs"],
  },
  {
    handle: "mens-large-satin-bonnet",
    shopifyHandle: "tmack-crown-care-large-men-s-satin-bonnet",
    name: "Large Men's Satin Bonnet",
    short: "Oversized satin for long or full styles.",
    price: 14.99,
    category: "Satin Care",
    image: "/media/shop/mens-bonnet.webp",
    imageAlt: "Black long men's satin bonnet with rose-gold TMack Crown Care logo on a mannequin",
    variants: [{ id: "50951428899036", label: "Black" }],
    description:
      "Protect your crown while you sleep. An oversized 100% satin bonnet with room for locs, braids, twists, curls and natural hair that reduces friction, minimizes breakage and preserves moisture overnight.",
    benefits: ["Helps prevent dryness and breakage", "Reduces frizz and lint buildup", "Protects locs, braids and twists", "Comfortable overnight fit", "Ideal for long, thick styles"],
  },
];

export const PRODUCT_BY_HANDLE = Object.fromEntries(PRODUCTS.map((p) => [p.handle, p]));

/** Shopify cart permalink → her real checkout with the bag pre-filled. */
export function shopifyCartUrl(lines: { variantId: string; qty: number }[]) {
  const items = lines.filter((l) => l.qty > 0).map((l) => `${l.variantId}:${l.qty}`).join(",");
  return `${SHOP.domain}/cart/${items}`;
}

export function shopifyProductUrl(p: Product) {
  return `${SHOP.domain}/products/${encodeURI(p.shopifyHandle)}`;
}
