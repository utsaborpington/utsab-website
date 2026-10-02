# Handoff: UTSAB Website Redesign — "Indigo Night Mela"

## Overview
A full visual redesign of the UTSAB (Utsab Bengali Association of Orpington) Next.js website. The
brief was "modern and jazzy": bold festive energy with a glowing night-market palette, replacing
the current maroon/cream Durga-Puja theme. This package covers all main public pages.

## About the Design Files
The bundled HTML file (`utsab-redesign.dc.html`, opened in a browser) is a **design reference**,
not production code — it's a static HTML/inline-CSS prototype built to show exact look, layout,
and content. The task is to **recreate these designs inside the existing Next.js + Tailwind CSS v4
codebase**, using its established patterns:
- Keep the existing component structure (`SiteHeader`, `SiteFooter`, `EventCard`, `StatusBadge`,
  page files under `src/app/**`) and just restyle them to match.
- Replace the current `--color-maroon-*` / `--color-marigold-*` / `--color-cream-*` design tokens
  in `src/app/globals.css` with the new palette below.
- Keep all data-driven behavior as-is (Prisma-backed events, `selectHeroEvent`, `getEventStatus`,
  admin CRUD, contact form submission) — this is a **visual** redesign only, no functional changes.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and layout in the HTML file are final — recreate
pixel-close using Tailwind utilities/arbitrary values in the existing component files.

## Design System

### Palette (dark, glowing, festive)
- Page background: `#181229` (deep indigo-black)
- Alternate section background: `#1e1734`
- Card / surface background: `#241c3d`
- Footer background: `#120c20`
- Body text (primary, on dark): `#d8cfe8`
- Body text (secondary/muted): `#b7abcf`, `#9d90b8`, `#a79bc4` (use for de-emphasized copy)
- Faint utility text: `#7a6f96`
- Light text on colored surfaces (buttons, badges): `#fbeee0`, `#e8dcf5`
- **Violet** (primary / nav active / secondary buttons): `#6c3fc9`; deep variant `#2c1a4d`
- **Marigold** (primary accent — CTAs, links, glow): `#f0b545`
- **Magenta** (secondary accent — festive pops, badges): `#d94aa8`
- Card badge background on photos: `rgba(20,12,36,0.6)` with `#e8dcf5` text

Replace old tokens 1:1 conceptually: maroon→violet/indigo-black, marigold stays marigold (slightly
adjusted hue), cream text → light lavender text, vermillion→magenta.

### Typography
- **Display font:** Unbounded (Google Font), weights 700/800. Bold, geometric, expressive — used
  for all headings (h1/h2/h3).
- **Body font:** Work Sans (Google Font), weights 400–700. Used for paragraphs, nav, buttons, labels.
- Headings are tight line-height (1.02–1.15), uppercase eyebrow labels use 11.5–13px with
  letter-spacing 0.06–0.08em and weight 700.

### Texture & motion (signature elements)
- Soft glowing radial-gradient blobs (violet/magenta/marigold at ~30-55% opacity, large blur-like
  spread via `radial-gradient(circle at X% Y%, color, transparent 45-70%)`) layered behind hero and
  CTA sections — this is the "night mela lights" motif, use it sparingly (1–2 per page, not every
  section).
- A faint dot-grid overlay (`radial-gradient(circle, marigold 1.5px, transparent 1.5px)`, 26–30px
  tile, ~12–16% opacity) over hero/CTA backgrounds.
- A 4–5px gradient bar (marigold → magenta → violet → marigold, 90deg) as a divider between hero
  and next section on the homepage — a modern reinterpretation of the old `.alpona-divider` dotted
  motif. Elsewhere, the dotted alpona-style divider (radial-gradient dots, repeat-x) is kept as-is
  but recolored to marigold on dark background — still used sparingly on text-heavy pages (About,
  Donation Terms).
- Cards, hero photos, and image frames get a `box-shadow: 0 0 0 1px rgba(255,255,255,0.06)` hairline
  plus a soft drop shadow — no borders.
- **Scroll-reveal:** sections below the fold (the "Who we are" block, the recent-celebrations grid,
  the donate CTA band) fade + slide up 28px on scroll into view (IntersectionObserver, threshold
  0.15, `opacity/transform` transition 0.7s ease). Reference implementation: see
  `UTSAB Homepage Redesign.dc.html` (option "1b") from the earlier exploration round, which has this
  wired up live — copy that logic pattern (IntersectionObserver + fade/slide) rather than the static
  multi-page file in this bundle, which is intentionally static for clarity.
- **Parallax:** the hero photo on the homepage translates ~0.06× scroll distance (capped ~40px) on
  scroll, for subtle depth. Same reference file demonstrates this.
- Buttons: marigold pill CTAs get a colored glow shadow (`box-shadow: 0 0 40px -8px marigold`);
  hover should scale up slightly (~1.03–1.05) with a transition, consistent with current site's
  `hover:scale-105` pattern.

### Border radius
- Page/section frame corners: 24px
- Cards: 18–22px
- Photos inside cards: same as card radius, or 14px for smaller gallery thumbnails
- Buttons/badges/nav pills: fully rounded (999px)

## Screens / Pages
All 8 pages are laid out full-width in `utsab-redesign.dc.html`, each in its own rounded "frame"
card for clarity when scrolling through the reference file (that frame is a presentation device for
this document only — in production each page is simply full-bleed with sticky header + footer, no
outer frame/border-radius).

1. **Home** — Sticky header (logo + tagline + nav pills + Donate button) → full-bleed hero with
   glowing gradient background, dot-grid, large rotated event photo bottom-right, status badge +
   event type label, big Unbounded headline, description, two CTAs (View details / Donate) → 5px
   gradient divider bar → "Who we are" split section (photo left, copy + link right) → "Recent
   celebrations" 3-card grid (photo, status badge, type label, title, venue) → full-width Donate CTA
   band on a violet gradient → footer (3-column: brand/address, Explore links, Get in touch).
2. **Past Events (archive)** — Header/hero intro ("Our history" / "Past Celebrations" + description)
   → two rows of filter pills (Type: All/Durga Puja/Saraswati Puja/Other Celebration; Year: All/2025/
   2024/2023) with the active pill in violet fill, inactive pills in card-surface color → responsive
   grid of event cards (same card component as homepage).
3. **Event Detail** — Back link ("← Past Events") over a large muted cover-photo hero with gradient
   fade to background, status + type badges, big title, Dates/Venue info row → body copy (plain
   paragraphs) → "Photo Gallery" heading with small gradient underline accent → responsive photo grid
   (square thumbnails, 3 columns).
4. **About** — Centered hero band with two soft gradient blobs, eyebrow + big headline → single-column
   copy → dotted divider → "Our Purpose" as a list of bold-lead-in paragraphs → dotted divider →
   "What We Do" 2×2 card grid (title + description) → centered "Thank you" sign-off in marigold.
5. **Donate** — Centered hero (eyebrow, headline, intro) → 2-column card row: "Featured appeal" (A
   New Durga Maa Idol, marigold CTA) and "Ad-hoc donation" (General Donation, violet CTA) → centered
   "How your donation is used" copy block with a link to Donation Terms → thank-you sign-off.
6. **Tickets** — Minimal centered "Coming soon" state: eyebrow pill, headline, copy, single violet
   CTA back to Contact. Very sparse — no image, low visual weight is correct here (interim status).
7. **Contact** — Left column of contact details (Email/Phone/Venue/Facebook, each with an uppercase
   label) + right column contact form (Name/Email/Message fields, marigold submit button) in a card
   surface. Header/footer standard.
8. **Donation & Sponsorship Terms** — Simple legal content page: headline, dotted divider, then plain
   copy under H2 subheadings (Purpose of the Association / Donations and Sponsorships / Changes to
   Terms). Minimal chrome header (logo + Home + Donate only, no full nav) since this is a rarely
   visited linked policy page — production should probably keep the full site header here instead for
   consistency; use judgement.

## Interactions & Behavior
- Nav pill for the current page is filled violet (`#6c3fc9`) with light text; other pills are
  transparent/text-only until hover.
- Filter pills on the Past Events page: clicking toggles active state (violet fill) and re-filters
  the grid — this logic already exists in `EventsArchive.tsx`, only needs re-skinning.
- Contact form: existing submit/loading/success/error states in `ContactForm.tsx` are unchanged
  functionally; only restyle the success message card and error text color (use magenta `#d94aa8`
  for error text instead of vermillion).
- Hover states: CTA buttons scale 1.03–1.05 with glow-shadow intensifying slightly; card hover
  raises shadow and slightly scales the photo inside (matches existing `group-hover:scale-105`
  pattern in `EventCard.tsx`).
- Responsive: at mobile widths, hero splits to stacked (photo below text, smaller), grids collapse
  to 1 column, nav collapses to the existing hamburger menu pattern (keep `SiteHeader.tsx`'s
  existing mobile menu logic, just restyle colors).

## State Management
No new state needed — this is a visual restyle. Existing state (nav mobile-menu open/closed, event
filter selections, contact form status) is unchanged.

## Assets
Photos used in the reference mockups all come from the site's own existing content set at
`public/images/archive/**` (already in the repo, migrated from the old WordPress site — see
`site-dump/images-inventory.md`). No new photography is needed. Fonts (Unbounded, Work Sans) are
loaded from Google Fonts.

## Files
- `utsab-redesign.dc.html` — all 8 pages, static HTML reference (open directly in a browser).
