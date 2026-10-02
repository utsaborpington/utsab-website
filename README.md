# UTSAB Website

Website for UTSAB — Utsab Bengali Association of Orpington — a community organisation hosting
Durga Puja, Saraswati Puja, and other Bengali cultural celebrations in Orpington, Kent, UK.

For stack details, project structure, and the event data model, see [CLAUDE.md](./CLAUDE.md).

## Local setup

Requires Node 20+.

```bash
npm install
cp .env.example .env      # then fill in real values, see below
npx prisma migrate dev    # creates the local SQLite database
npm run db:seed           # imports events + photos from site-dump/ (optional, one-off)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Database connection string. `file:./dev.db` for local SQLite. |
| `ADMIN_PASSWORD_HASH_B64` | **Base64-encoded** bcrypt hash of the admin password. See "Admin access" below — do not paste a raw bcrypt hash here, it will be corrupted by Next's env-var expansion. |
| `SESSION_SECRET` | Random string used to sign admin session cookies. Generate with `openssl rand -hex 32`. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for image uploads in production. Leave blank locally — uploads fall back to `public/uploads/`. |
| `GOFUNDME_URL` | GoFundMe link for the Durga Maa idol appeal (optional — defaults to the current appeal in `src/lib/site.ts`). |
| `CONTACT_EMAIL` / `CONTACT_PHONE` | Public contact details (optional — default to the real ones in `src/lib/site.ts`). |

## Admin access

The admin area at `/admin` is protected by a single shared password (no user accounts — intended
to be simple enough for non-technical volunteers to hand off).

**Local dev default password:** `utsab-admin-2026`

To set a real password for production:

```bash
node -e "console.log(Buffer.from(require('bcryptjs').hashSync('your-new-password', 10)).toString('base64'))"
```

Paste the output into `ADMIN_PASSWORD_HASH_B64`.

**Adding an event:** log in at `/admin`, click "New event", fill in the details, upload photos
(the first photo becomes the cover image), and save. It appears on the public site immediately —
no code changes or redeploy needed. Whether it shows as "Upcoming", "Happening now", or "Past
event" is calculated automatically from the dates you enter.

## Deployment (Vercel)

1. Push this repo to GitHub and import it into [Vercel](https://vercel.com/new).
2. Create a Postgres database (e.g. via [Neon](https://neon.tech), which has a generous free tier)
   and set `DATABASE_URL` to its connection string in Vercel's environment variables.
3. In `prisma/schema.prisma`, change the datasource provider from `sqlite` to `postgresql`, commit,
   and redeploy — SQLite is for local dev only; Vercel's filesystem is ephemeral and can't hold a
   SQLite file.
4. Run `npx prisma migrate deploy` against the production database (via Vercel's build command or
   locally with `DATABASE_URL` pointed at production).
5. Create a [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store and set
   `BLOB_READ_WRITE_TOKEN` — this is required for admin-uploaded images to persist (local disk
   storage does not survive redeploys on Vercel).
6. Set all remaining environment variables from the table above (real donation URLs, contact
   details, a fresh `ADMIN_PASSWORD_HASH_B64`, and a strong random `SESSION_SECRET`).

## Contact form

The contact form at `/contact` currently validates input and logs submissions server-side
(`src/app/api/contact/route.ts`) but does not send email yet. Before launch, wire it to an email
service — e.g. [Resend](https://resend.com) — by adding the send call in that route.

## Content source

The initial events, photos, and page copy were migrated from the previous WordPress site. See
[`site-dump/`](./site-dump/) for the cleaned source data and `site-dump/NOTES.md` for what was
(and wasn't) confidently recoverable — notably, most pre-2024 events have no exact date on record
and are shown by year only.
