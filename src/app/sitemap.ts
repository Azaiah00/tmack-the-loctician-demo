import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/services", "/gallery", "/shop", "/about", "/visit", "/policies"];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...PRODUCTS.map((p) => ({ url: `${SITE.url}/shop/${p.handle}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
