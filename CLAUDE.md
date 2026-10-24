# CLAUDE.md — working in this repo

TMack The Loctician — marketing site + Crown Care shop + demo booking portal. Built by Couture House Co.

## Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS v4 (CSS-first `@theme` in `src/app/globals.css`) · GSAP + ScrollTrigger · Lenis · Framer Motion · Lucide icons. Fonts self-hosted via `next/font/local`.

## Commands
```
npm install
npm run dev        # http://localhost:3000
npm run build      # must pass with zero errors
npm run lint       # eslint . — must be clean
npm run typecheck
```

## Map
- `src/app/(site)/*` — public website (home, services, gallery, shop, shop/[handle], about, visit, policies). Shared chrome in `(site)/layout.tsx`.
- `src/app/portal/*` — booking portal: `/portal` sign-in (demo OAuth), `/portal/book` 5-step booker, `/portal/client` client portal, `/portal/owner/*` owner dashboard (overview, calendar, appointments, clients, finances, shop, settings).
- `src/lib/site.ts` — verified business facts, hours, policies, `BOOKING_MODE` switch.
- `src/lib/services.ts` — her real Acuity menu (IDs, prices, durations, add-ons).
- `src/lib/products.ts` — her real Shopify products + variant IDs (bag checks out via Shopify cart permalink).
- `src/lib/reviews.ts`, `gallery.ts`, `faq.ts` — content.
- `src/lib/portal/db.ts` — **the only data layer for the portal** (in-memory demo store, seeded fictional clients). `pricing.ts` — deposit/balance math + .ics.

## Rules
- Follow DESIGN.md exactly: only the `@theme` tokens, `.display` for headings, one accent word per heading via `<Accent>`.
- Never invent business facts. Prices/hours change only in `lib/*.ts`. Anything unconfirmed goes in LAUNCH-NOTES.md.
- Portal UI must go through `lib/portal/db.ts`. `useDB(selector)` selectors must return existing state slices (derive with `useMemo` in the component) — never return new arrays/objects from a selector.
- No `Date.now()` in render: use `useNow()`.
- Keep the demo honest: “Demo” labels on sign-in, payments, rewards. No real card fields.
- Respect `prefers-reduced-motion` in every animation. Keep Lighthouse ≥95 on inner pages.
- Going live: replace `db.ts` internals with Supabase (`// TODO: Supabase`), `demoCharge()` with Stripe (`// TODO: Stripe`), and real Google/Apple auth. The UI does not change. Flip `BOOKING_MODE` to `"acuity"` to launch the website before the portal.
