# CLAUDE.md

Guidance for future Claude Code sessions working in this repo.

## What this is

Public website for UTSAB (Utsab Bengali Association of Orpington) — event pages, photo galleries,
donations, and a simple admin panel for volunteers to manage events without touching code.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack) — chosen for file-based routing, built-in
  image optimization (important for a photo-heavy site), and easy Vercel deployment.
- **Tailwind CSS v4** for styling. Design tokens (colors, fonts) are defined as CSS variables in
  `src/app/globals.css` under `@theme inline` — see "Design system" below.
- **Prisma** ORM. `prisma/schema.prisma` targets `sqlite` for local dev (zero setup); production
  should switch to `postgresql` (see README "Deployment"). Do not add scalar array fields to the
  schema (`String[]` etc.) — SQLite doesn't support them, which is why gallery images are a
  separate `GalleryImage` model rather than an array field on `Event`.
- **jose** for signing/verifying the admin session JWT, **bcryptjs** for password hashing.
- **@vercel/blob** for production image uploads, with a local-disk fallback (`public/uploads/`)
  when `BLOB_READ_WRITE_TOKEN` is unset — see `src/app/api/admin/upload/route.ts`.
- **yet-another-react-lightbox** for the event photo gallery lightbox.

## Running locally

```bash
npm install
npx prisma migrate dev
npm run dev
```

Dev server runs at `http://localhost:3000`. See README.md for environment variable setup and
admin login.

## Project structure

```
src/
  app/
    page.tsx                    Home (hero = current/next event, auto-derived status)
    events/page.tsx             Past events archive (client-side filter by type/year)
    events/[slug]/page.tsx      Event detail + photo gallery lightbox
    about/, donate/, donation-terms/, tickets/, contact/    Static-ish content pages
    admin/                      Password-protected admin UI (list/create/edit/delete events)
    api/admin/                  Admin API routes (login, logout, events CRUD, image upload)
    api/contact/                Public contact form handler
    icon.tsx, apple-icon.tsx, opengraph-image.tsx    Generated favicon/OG image (next/og)
    robots.ts, sitemap.ts       SEO
  components/                   Shared UI: SiteHeader, SiteFooter, EventCard, StatusBadge
  lib/
    prisma.ts                   Prisma client singleton
    auth.ts                     Admin session JWT sign/verify
    eventTypes.ts                Event type enum + labels (durga_puja | saraswati_puja | other)
    eventStatus.ts              Status derivation (live/upcoming/past) + hero event selection
    format.ts                   Date range formatting
    site.ts                     Site-wide constants (name, nav links, env-backed placeholders)
  middleware.ts                 Guards /admin/* and /api/admin/* routes via session cookie
prisma/
  schema.prisma                 Event + GalleryImage models
  seed.ts                       One-off import from site-dump/events.json (see below)
site-dump/                      Cleaned content extracted from the old WordPress site (kept in
                                 git as a content reference; NOT read by the app at runtime)
site-dump-raw/                  Raw WordPress backup extraction (gitignored, large — only needed
                                 if re-running prisma/seed.ts against fresh source images)
```

## Event data model

Events are the only content type stored in the database (`prisma/schema.prisma`):

- `Event`: title, slug, `type` (a plain string — `"durga_puja" | "saraswati_puja" | "other"`,
  validated against `src/lib/eventTypes.ts` rather than a native Prisma enum, since SQLite doesn't
  support enums), `startDate`/`endDate` (nullable — many historical events have no recorded exact
  date and are shown by year only), `venueName`/`venueAddress`, `description` (plain text,
  paragraphs separated by blank lines), `coverImage`, `published`.
- `GalleryImage`: belongs to an `Event`, `url` + `order`. The first `GalleryImage` (by `order`) is
  conventionally also `Event.coverImage`.

**Status (live / upcoming / past) is never stored** — it's computed on every render from
`startDate`/`endDate` vs. the current date in `src/lib/eventStatus.ts`. The homepage hero picks,
in order: the live event, else the soonest upcoming dated event, else the most recent past event
(graceful fallback for when nothing is currently live or upcoming — see `selectHeroEvent`).

Pages (About, Donation terms, etc.) are hand-written React components, not database-driven — there
was no requirement for volunteers to edit that copy themselves, only events.

## Seeding / re-importing content

`prisma/seed.ts` reads `site-dump/events.json`, re-encodes each referenced photo through `sharp`
(strips ICC profiles — some of the original WhatsApp-exported photos had profiles that hang
Chrome's image decoder), copies them into `public/images/archive/`, and creates `Event` +
`GalleryImage` rows. It's idempotent-ish (clears and re-inserts events each run) and only needs
re-running if `site-dump/events.json` changes or the database is reset. Requires
`site-dump-raw/uploads/` to exist locally (gitignored — re-extract from the original WordPress
backup if needed; it is not required for normal development).

## Design system

"Indigo Night Mela" palette — see `design_handoff_utsab_redesign/README.md` for the full spec —
defined in `src/app/globals.css`: deep indigo (`--color-indigo-*`, `950`/`975` darkest → `800`
card surfaces) as the page background, violet (`--color-violet-*`) as the primary/nav-active
color, marigold (`--color-marigold-*`) as the main accent for CTAs and links, magenta
(`--color-magenta-*`) as a secondary festive accent, and a lavender text scale
(`--color-lavender-*`, `50` lightest → `700` faintest) for all text on dark. Display font is
Unbounded (`font-display`, weights 700/800), body font is Work Sans (`font-sans`).

Reusable texture/motion utilities in `globals.css`: `.dot-grid` (marigold dot-grid background,
used sparingly behind hero/CTA sections), `.gradient-bar` (5px marigold→magenta→violet→marigold
divider), `.surface-shadow` (hairline + soft drop shadow for cards/photos), `.glow-marigold`
(glow shadow for primary CTA buttons), `.alpona-divider` (dotted-line divider, kept from the
original design, recolored to marigold-on-dark). `src/components/Reveal.tsx` fades+slides content
up on scroll into view (IntersectionObserver); `src/components/ParallaxImage.tsx` translates an
image ~0.06x scroll distance, capped 40px — both used on the homepage hero/sections.

## Known gotcha: `.env` and bcrypt hashes

Next.js's built-in env loader performs variable expansion on `.env` values (`$VAR` gets replaced).
Raw bcrypt hashes contain `$` delimiters (e.g. `$2b$10$...`) and get silently mangled. This is why
`ADMIN_PASSWORD_HASH_B64` stores the hash **base64-encoded** rather than as `ADMIN_PASSWORD_HASH`
— decode it in code (`Buffer.from(val, "base64").toString()`) rather than reverting to a raw env
var.

## Current status — Vercel migration in progress (Oct 2026)

Hosting decision: the site stays on **Vercel** (project `utsab-vercel-site`, domain www.utsablondon.org).
Email stays with iFastnet — do not touch MX records. Production deploys from the `main` branch of
GitHub `utsaborpington/utsab-website`; work on a branch (e.g. `initial-import`) and check the Vercel
preview before merging to `main`.

History: the live site was originally deployed with `vercel deploy` (CLI) from a collaborator's
machine, apparently with a bundled SQLite file and no Vercel environment variables. This repo was
reconstructed from that collaborator's source zip.

Vercel project lives in the **utsaborpington** Vercel account (team `utsaborpington-2243s-projects`),
not ranjanm1's personal account — log the CLI into that account (`vercel login`) to manage it. This
folder is linked via `.vercel/` (gitignored).

Done so far:
- Fonts self-hosted via `next/font/local` (`src/app/fonts/`) — Google Fonts fetch failed on Vercel builds.
- `postinstall: prisma generate` added (Vercel dependency cache needs it).
- Prisma datasource switched to `postgresql`; migration `prisma/migrations/20261002230000_init`
  (verified identical to `prisma migrate diff` output, and applied successfully on Neon).
- `build` script runs `prisma migrate deploy && next build`. Schema uses `directUrl =
  env("DATABASE_URL_UNPOOLED")` because migrations can't run through Neon's pooler.
- Neon Postgres `utsab-db` (Vercel Marketplace) connected to Production + Preview — note both
  environments share **one** database, so admin edits on a preview change live data.
- Blob store `utsab-uploads` (public, lhr1) connected to Production + Preview; `next.config.ts`
  allows `*.public.blob.vercel-storage.com` in `next/image`.
- `SESSION_SECRET` set (separate values for Production and Preview).
- Database seeded (13 events, 45 gallery images). To run the seed or other Prisma commands against
  Neon: `vercel env pull <file> --environment=preview`, export it, then `npx prisma db seed`.
- Admin event API routes call `revalidatePath("/", "layout")` so ISR-cached public pages
  (`revalidate = 3600`) update immediately after edits.

Still to do:
1. Set `ADMIN_PASSWORD_HASH_B64` (Production + Preview) — admin login won't work until it is.
2. Set real `GOFUNDME_URL`, `PAYPAL_URL`, `CONTACT_EMAIL`, `CONTACT_PHONE` (Production + Preview);
   the site falls back to placeholders from `src/lib/site.ts` until then.
3. Confirm with the collaborator whether any events were added/edited via the live admin since
   July — that data lives only in the old deployment's SQLite file and would be lost.
4. When the preview is correct: merge/push to `main` to go live (domain `utsablondon.org` is
   already in the Vercel account).
