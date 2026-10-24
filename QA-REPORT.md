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

## Responsive QA (automated + visual, 2026-10-24)
Scripted audit (`qa/audit.py`, Playwright) on 12 sizes — 320, 360, 375, 390, 414, phone landscape 844×390, 768, 820, 1024, 1280, 1440, 1920 — across 30+ screens and states each: every site page, mobile menu, cart drawer, gallery lightbox, portal sign-in/role, all 5 booking steps + confirmation, client portal, all 7 owner pages, owner phone menu, appointment drawer (364 screen × size checks). Checks: horizontal page overflow, content pushed off-screen, clipped/truncated text, tap targets under 40 px on touch sizes, text under 11.5 px, console/page errors. Final run: zero overflow, zero clipped text, zero errors.

Fixed in this pass:
- Owner Overview, Finances, Settings and the client portal scrolled sideways on phones (cards had no min-width reset) — fixed at the shared `Panel`/`Stat` components and portal grids.
- Phone landscape: hero headline was cut off under the header — hero now grows to fit its content.
- Settings → Service menu: price/minutes fields were off-screen on phones — now a stacked, labeled layout under 768 px.
- Finances → Transactions and Appointments list: cramped/cut-off columns on phones — now card rows under 768 px (table on tablet/desktop; table also fits 1024 px laptops).
- Owner phone menu: hidden under the demo banner and had no Sign out / View website / Client booking view — fixed.
- Website phone menu: now scrolls on short/landscape screens.
- Booking header no longer wraps on phones; selected service name wraps instead of being cut off.
- iOS zoom-on-focus: all form fields render at 16 px on touch-size screens.
- Tap targets raised to ≥40–44 px (footer/visit phone & email, cart +/−/Remove, variant chips, service jump chips, add-on toggles, booking step pills, payment-method chips, owner links/Nudge/remove buttons).
- Smallest labels raised to ≥10 px; product-card "Add" button no longer squeezes on 2-column phone grids; hero location line wraps cleanly.
Known/by design: the week calendar truncates long names inside narrow day columns (full details open on tap).

## Functional checks
- Hero (loop mode): draws on load, then turns front → hand → profile → back → front continuously with the same transition as the scroll version; pauses off-screen/hidden tab; reduced-motion shows a single static frame.
- Before/after slider: drag starting on the photo, leaving the box and releasing outside never sticks; click/tap jumps; arrow keys work; on phones a sideways swipe drags and an up/down swipe still scrolls the page.
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
