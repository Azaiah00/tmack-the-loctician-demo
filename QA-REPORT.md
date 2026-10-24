# QA report — 2026-10-23

## Build
- `next build` (Next 16.4.3): passes, 27 routes prerendered, zero errors.
- `tsc --noEmit`: clean. `eslint .` (next core-web-vitals + typescript + React Compiler rules): clean.
- `npm audit --omit=dev`: 0 vulnerabilities.

## Lighthouse (production build, local)
| Page | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| Home — desktop | 99 (LCP 0.9 s, TBT 10 ms) | — | — | — |
| Home — mobile (simulated slow 4G, 4× CPU) | 76 | 100 | 100 | 100 |
| Services — mobile | 97 | 100 | 100 | 100 |
| Shop — mobile | 93 | 100 | 100 | 100 |
| Booker — mobile | 86 | 100 | 100 | 69 (intentional `noindex` on the demo portal) |
Home mobile is below the 95 target because of the signature animated hero (four traced SVG line-art frames + glitter). Done to reduce cost: glitter on the active frame only and on a third of the strands, frames 2–4 load on first scroll, overlays lazy-loaded, fonts cut from 7 to 4 preloads, no SVG filters. Real (unthrottled) LCP on mobile measured ~0.3 s. Services meets the 95 target; shop is 93 and the booker 86 under the same heavy throttling.

## Responsive QA (Playwright screenshots)
375/390, 768, 1440 px — home, services, shop, product page, gallery, about, visit, policies, portal sign-in, all 5 booking steps, confirmation, client portal, all 7 owner pages. No overflow, no console errors, no page errors.

## Functional checks
- Hero: draws on load, turns front → hand → profile → back on scroll; reduced-motion shows a single static frame.
- Shopify: bag → `tmackcrowncare.com/cart/<variant>:<qty>,…` opens her real checkout with items and correct total ($39.98 for spritz + oil, verified live).
- Booker deep link from every “Book” button (`?service=` skips to add-ons). Totals: Palm Roll + detox combo = $185, $32 today, $155 at appointment; Reconstruction = $325+, $104 today, $225+ at appointment; Saturday request adds $25 and books as “pending”.
- Availability respects open days, first-Saturday rule, holidays, buffers, 12-hour notice, existing bookings and owner-blocked time.
- Client portal: reschedule limited to 1 with 24 hours’ notice; cancel warns about deposit forfeit; .ics download.
- Owner: status changes (confirm, check-in, complete with payment method, no-show, cancel) update finances live; CSV exports download; price/time/hours edits change booking availability instantly.
- Exit-intent scratch-off (desktop mouse-leave after 12 s; mobile after 50 s; once per session) reveals her real code TMACK10.
- Contact form posts to Netlify Forms (`/__forms.html`) — works once deployed.

## Accessibility
Skip link, landmarks, focus-visible rings, labeled icon buttons, ≥44 px tap targets, keyboardable lightbox/drawers (Esc closes), before/after slider has a range input, reduced-motion respected everywhere, AA contrast on light sections (`mute` #6E4A5A, `rose-ink` #8F4656).

## SEO
Unique titles/descriptions per page, canonical URLs, Open Graph image (`/og.jpg`), `HairSalon` JSON-LD with real NAP, geo, hours, rating, offer catalog; `ItemList`/`Service`/`Product` JSON-LD on services/shop/products; sitemap.xml, robots.txt (portal disallowed), llms.txt.

## Placeholder & CTA check
- No lorem or fake contact data on the public site. Fictional people appear only inside the labeled demo portal.
- One primary action per page (Book), phone and address verified against Google.
- Items still needing TMack: see LAUNCH-NOTES.md → “Assets still owed”.

## Known
- `retwist-long-back.webp` shows faint light bands at the sides from the original photo’s framing — replace with a fresh photo when available.
- Google Maps iframe can’t load in the offline test sandbox; it loads normally online.
