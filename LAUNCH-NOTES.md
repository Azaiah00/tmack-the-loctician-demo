# Launch notes — TMack The Loctician (built 2026-10-23)

## Confirm with TMack before launch
1. **Hours.** MapQuest lists Sun/Wed/Thu/Sat 9 AM–7 PM (Mon/Tue/Fri closed); Google showed “closes 5 PM, opens 9 AM Sat”; her flyer says “Open by appointment only.” The site shows the MapQuest hours plus “by appointment only.” Get her real weekly hours (they also drive the portal’s availability).
2. **Saturday rule.** From her flyer: retwists the first Saturday of each month; other Saturdays by request 24–48 hrs ahead with a $25 fee. Confirm it applies to all services (the portal treats every non-first Saturday as a request).
3. **Chebe Growth Oil price.** Shopify shows **$14.99**; her Google product listing shows **$24.99**. The site uses $14.99 (Shopify = what checkout charges). Fix whichever is wrong.
4. **Phone typo on a flyer.** One Google-posted flyer prints (804) 454-3208; every other source says **(804) 464-8208** (used on the site).
5. **Her name.** Only “TMack” is public. Confirm how she wants to be named and whether to add her first name to the About page.
6. **Gallery labels.** Service-type labels and gallery filters are hidden (`SHOW_TAGS = false` in `GalleryGrid.tsx`) because some guesses were wrong. Get the correct service for each photo from TMack, update `tag` in `src/lib/gallery.ts`, then turn them back on.
7. **Photo consent.** All work photos are her own public Google/Yelp/Acuity uploads, backgrounds replaced with a blush backdrop (hair unaltered). Confirm she’s OK featuring each client (one is a close-up face: `microlocs-client`).
8. **Portrait.** Her Yelp headshot was cut out and placed on the brand backdrop. A new high-res portrait (ideally in the studio) would be better. NEEDS REAL PHOTO (higher resolution).
9. **Reviews.** 12 real Google review excerpts (first name + initial). Excluded one by a family member. Confirm she’s happy with names shown.
10. **Product claims.** Copy uses her own Shopify wording (“supports healthy hair growth”, “helps reduce breakage”) and avoids medical claims (no “grows hair”, no alopecia claims from customer reviews). Ingredients listed from her labels/infographics — confirm the full INCI lists.
11. **Crown Rewards** tiers/perks in the client portal are a suggested concept (labeled) — she sets the real program.
12. **Instagram/TikTok handles.** @tmacktheloctician (IG, TikTok link in bio paa.ge/tmacktheloctician). Shop IG @TMack_crowncare (from the spritz label). Facebook page URL not found publicly — add if she wants it.
13. **Google Maps link** uses her listing CID (`maps?cid=14928887747521058894`). Verify it opens her profile.
14. **Shop checkout.** The bag sends customers to her real Shopify checkout with items pre-filled (verified working: 2 items → $39.98). Shopify checkout offers Ship or Pickup — confirm pickup location/details.
15. **Domain.** tmacktheloctician.com currently redirects to Acuity. Repoint DNS to Netlify at launch (all canonicals/sitemap already use https://tmacktheloctician.com).

## Booking portal (demo → live)
- Demo today: fictional clients/appointments, demo sign-in, demo card (no charge), resets on refresh. Every demo surface is labeled.
- To go live: Supabase tables mirroring `Client`, `Appointment`, `Payment`, `Journey`, `Inventory`, `Settings` in `src/lib/portal/db.ts`; Stripe (or Square) for the $32 / $104 deposits; Google/Apple sign-in; Twilio SMS reminders; Shopify Admin API for live inventory. UI stays the same.
- Her Acuity intake forms are mirrored: appointment policy, photo/video consent, music/TV preference, extended-service acknowledgment (microlocs & reconstruction), reconstruction deposit policy, consultation policy.
- Until the portal is bought: set `BOOKING_MODE = "acuity"` in `src/lib/site.ts` → every Book button opens her current Acuity page.

## Assets still owed by the client
- [ ] Confirmed weekly hours + holiday closures
- [ ] Confirmed Chebe oil price
- [ ] Higher-resolution portrait (and optional studio photos — the studio itself is not pictured yet)
- [ ] Consent to feature client photos; any newer favorites from Instagram (Instagram blocks logged-out access, so recent IG posts weren’t pulled)
- [ ] Full ingredient lists for spritz and oil
- [ ] Rewards program perks (if she wants it)
- [ ] Domain DNS access
- [ ] Netlify form notification email

## Sources (checked 2026-10-23)
- Acuity booking page (tmacktheloctician.as.me) — full service/add-on JSON, intake forms, policy & mission flyers.
- tmackcrowncare.com — products.json (prices, variant IDs, descriptions), About Us, shipping/refund/contact policies.
- Google Business Profile — 5.0★ / 17 reviews, address, phone, “from the business”, photos, posts.
- Yelp photo gallery (18 photos), MapQuest listing (hours).
