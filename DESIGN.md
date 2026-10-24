# DESIGN.md — TMack The Loctician

Direction: **Glam, made elegant.** Her logo is hot-pink glitter and rose-gold script; her product line is rose-gold metal on black. The site keeps that glamour but restrains it: deep black-garnet night surfaces, one rose-gold metal, one hot-pink accent, blush light sections for her real work, and big editorial serif type. Glitter is a *texture on the line art*, never a background wash.

## Color tokens (`src/app/globals.css` → `@theme`)
| Token | Hex | Use |
|---|---|---|
| `ink` | #0E060B | page background, deepest surface |
| `garnet` | #1A0912 | alternate dark sections, cards, footer |
| `plum` | #2A0C1D | gradients |
| `wine` | #4A1532 | chips, table headers on dark |
| `magenta` | #E0218A | primary gradient start, focus, icons on light |
| `pink` | #FF5AA8 | primary accent, links on dark, active states |
| `orchid` | #B06AD9 | pearl accent (status only, very sparing) |
| `rose` | #E7A98C | rose-gold metal: eyebrows/labels on dark, borders |
| `rose-deep` | #B76E79 | gradients, decorative only (fails contrast on light) |
| `rose-ink` | #8F4656 | eyebrows/labels on light sections |
| `champagne` | #F6E7DC | body text on dark |
| `blush` | #F7DCE6 | light section background, photo backdrop |
| `blush-deep` | #E8B4C7 | photo backdrop gradient |
| `pearl` | #FDF5F7 | lightest surface, text on pink buttons |
| `cocoa` | #3B1A28 | text on light, dark buttons on light |
| `mute` | #6E4A5A | secondary text on light (AA on blush) |
| `ok / warn / bad` | #3FAE7A / #E8A33C / #E2526B | portal statuses only |

Rules: one primary CTA style (`btn-primary`, magenta→pink→rose). Rose-gold metal text = `.text-rosegold` (auto-deepens on blush/pearl sections). Never introduce default Tailwind blues/purples.

## Type
- Display: **Cormorant Garamond 500** (+ italic 500 for the rose-gold accent word in every heading). Class `.display`.
- Body/UI: **Manrope** variable.
- Script: **Pinyon Script** — only the hero word “here.” and the TMack signature. Never for body copy.
- Eyebrows: Manrope 600, 0.72rem, tracking 0.32em, uppercase, preceded by the four-point sparkle.
All fonts self-hosted in `src/app/fonts` via `next/font/local`.

## Spacing & shape
Container `.wrap` max 1240px, 20px gutter (32px ≥768). Sections 96–128px vertical. Cards radius 20px (`--radius-card`), buttons pill. Tap targets ≥44px.

## Signature motion
1. **Hero — “she turns around.”** Four line-art frames (front → twirling a loc → profile → back), recolored with Kie.ai to rose-gold glitter on black-garnet, traced to SVG centerlines (`public/media/hero/lines-*.json`). On load the first frame’s lines **draw themselves** (GSAP stroke-dashoffset), then the embossed still fades in beneath. Scrolling (pinned 340vh) turns her: each frame holds, then the next draws on in a short window. Champagne glitter dots travel along a third of the strands of the active frame only.
2. **One move per section:** a single rose-gold loc strand draws itself down the edge of a section as it scrolls in (`LocStrand`).
3. Reveal on scroll (fade/rise), marquee trust bar, twinkling four-point sparkles, rose-gold sheen on the hero script word.
4. Lenis smooth scroll synced to GSAP’s ticker.
Everything is disabled under `prefers-reduced-motion` (hero becomes a single static frame).

## Photography
- Her real client work, upscaled with the room replaced by a blush studio backdrop (hair never altered). `public/media/work`.
- Products: her real Crown Care products shot on a blush marble pedestal with her Crown Care logo backlit on a black-garnet wall. `public/media/shop`.
- Her portrait: her real photo cut out and placed on the brand backdrop (face untouched).

## Scrollbars
Rose-gold → pink gradient thumb on a garnet track (blush track inside the light cart drawer).
