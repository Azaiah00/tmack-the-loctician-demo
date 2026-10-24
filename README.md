# TMack The Loctician — website, Crown Care shop & booking portal

A Couture House Co. build for **TMack The Loctician™** (Master Loctician & Certified Micro Loc Specialist, 11057 Hull Street Rd, Ste 13, Midlothian, VA). Replaces the current Acuity-only site at tmacktheloctician.com.

## What’s inside
| Area | Route | Notes |
|---|---|---|
| Home | `/` | Glitter line-art hero that draws itself and turns around on scroll; reconstruction before/after slider; services; method; meet TMack; gallery; Crown Care shop; real Google reviews; studio; FAQ |
| Services & prices | `/services` | Her full Acuity menu + every add-on, deposits, JSON-LD |
| Gallery | `/gallery` | 17 real client photos, filters, lightbox |
| Shop | `/shop`, `/shop/[product]` | Her 6 real Crown Care products; bag checks out on her **live Shopify** store in one step |
| About / Visit / Policies | `/about`, `/visit`, `/policies` | Mission, map, hours, contact form (Netlify Forms), full booking policy |
| Booking portal (demo) | `/portal` | Demo sign-in → client portal or owner portal |
| Booker | `/portal/book` | 5 steps, live price/time total, hours-aware availability, first-Saturday rule, deposits, policies, .ics |
| Client portal | `/portal/client` | Next visit, reschedule/cancel with her rules, maintenance tracker, loc-journey photos, rewards, reorder |
| Owner portal | `/portal/owner/*` | Overview KPIs, week calendar + block time, appointments (CSV), client CRM, finances (CSV, tax set-aside), shop inventory, services & hours editor |

## Run it
```
npm install
npm run dev
```
Open http://localhost:3000. Requires Node 20.9+.

## Deploy (Netlify)
1. Push to GitHub. 2. Netlify → Add new site → Import the repo. Build command `npm run build`; leave publish directory empty (Netlify’s Next.js runtime handles it). Node is pinned to 20 in `netlify.toml`.
3. After first deploy: Forms → enable email notifications for the `contact` form.
4. Point **tmacktheloctician.com** at Netlify (it currently redirects to Acuity).

## Demo vs live
The portal runs on an in-memory demo data layer (`src/lib/portal/db.ts`) — fictional clients, no real payments, resets on refresh. Site “Book” buttons go to the portal (`BOOKING_MODE = "portal"` in `src/lib/site.ts`). To launch the website first and keep Acuity, set `BOOKING_MODE = "acuity"`.

See DESIGN.md, CLAUDE.md, LAUNCH-NOTES.md and QA-REPORT.md.
