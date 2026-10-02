# Extraction Notes

Source: `site-dump-raw/db/utsab.xo.je_wpvivid-*_backup_db.sql` (parsed directly with a hand-rolled Python
SQL-insert parser — no MySQL/WordPress was installed or run) plus `site-dump-raw/uploads/uploads/`.

## Summary of what was found

- **13 event records** (`events.json`): Durga Puja pages for 2018–2025, Saraswati Puja pages for 2019, 2020,
  2023, 2025, 2026. Only **3 have explicit, stated dates** in the page text or plugin data:
  - Durga Puja 2024: 11–13 Oct 2024 (from The Events Calendar plugin tables `wpdo_tec_events`/`wpdo_tec_occurrences`)
  - Saraswati Puja 2019: 10 Feb 2019 (stated in page text)
  - Saraswati Puja 2025: 02 Feb 2025 (stated in page text)
  - Saraswati Puja 2026: 25 Jan 2026 (stated in page text)
  All other year pages (Durga Puja 2018/2019/2020/2021/2022/2023/2025, Saraswati Puja 2020/2023) contain **only
  a photo/banner or gallery block with no descriptive text**, so no date could be extracted without fabricating
  one. Left `startDate`/`endDate` as `null` for these and noted the reason in each record's `dateSource` field.
- **8 pages** (`pages.json`): Sample Page, Privacy Policy, Donation and Sponsorship terms, About, Events,
  Contact Us, Donate via PayPal, Utsab Book Stall.
- **Site info** (`site-info.json`): site title "UTSAB", tagline "A Celebration of Life", live URL
  `https://utsab.xo.je`. See "Contact info" section below — no confirmed public contact email/phone was found.
- **Team info**: none found (see below) — `team.json` is an empty array.
- **Images**: 304 files on disk across 2023–2026 upload folders; **63 are true originals** (the rest are
  WordPress's auto-generated resized thumbnails of those same 63 originals). Full breakdown in
  `images-inventory.md`.

## Duplicate/ambiguous "Durga Puja 2024" record

There are **two different WordPress posts both titled "UTSAB Durga Puja 2024"**:
- Post ID **170** — a regular Page (`post_type=page`, slug `utsab-durga-puja-2024`), linked in the site's main
  nav menu, with full rich content (banner image, venue address text, Facebook link, sponsor shortcode). This is
  almost certainly the actual page visitors saw.
- Post ID **162** — a "The Events Calendar" plugin event (`post_type=tribe_events`), with only a one-line
  description ("UTSAB invites everyone to join us in celebrating the arrival of Maa Durga.") but a structured,
  reliable start/end date (2024-10-11 to 2024-10-13, Europe/London) via `wpdo_tec_events`/`wpdo_tec_occurrences`,
  plus a linked Venue post (163, "Sanderson Hall") and Organizer post (164, "UTSAB").
- This TEC event (162) is the **only** row in `wpdo_tec_events`/`wpdo_tec_occurrences` in the whole database —
  every other year's puja page is a plain WordPress Page with no Events Calendar entry at all. It looks like TEC
  was installed in Sept 2024 and used once, experimentally, alongside the normal page-based workflow, rather than
  becoming the site's standard event system.
- **Decision made**: `events.json` treats post 170 as the canonical "UTSAB Durga Puja 2024" event, using its
  page content for the description/images, but borrows the reliable start/end dates and venue address from the
  TEC event (162)/venue (163) records since they describe the same real-world event. The relationship is
  recorded via `sourcePostId: 170` and `relatedDuplicatePostId: 162` in that event's JSON record. Verify this
  reasoning is correct with the client if precision matters (e.g., were there really two separate happenings, or
  is this just leftover plugin cruft?).

## Contact info — NOT confidently resolved

No dedicated "Contact"/"Team"/"Committee" page or custom post type with real contact details was found. Details:
- `wpdo_options.admin_email` = `ranjanm1@gmail.com` — this is the **WordPress administrator's own account
  email**, not a stated public org contact. Treat as private; do not publish without checking with the org.
- The "Donation and Sponsorship terms" page (post 70) contains one email address: `info@utsab.local`. This uses
  the `.local` domain that WordPress uses for local/staging development (the real site is `utsab.xo.je`), so this
  looks like a **placeholder that was never replaced** with a real address — it will not deliver mail. Do not
  publish as-is; flag to the client to supply the real address.
- The "Contact Us" page (post 141) only contains a WPForms contact-form embed (form ID 139); the form's own
  fields/settings were not present in the tables parsed (would require the `wpdo_wpforms_*` payload tables, which
  hold submissions/logs, not the form field definitions — the form builder's field schema is normally stored as
  post meta on a `wpforms` post; only one `wpforms` post existed and its meta wasn't examined in the field-schema
  format needed to reconstruct the form. If the new site needs the same form fields, this would need re-checking).
- The only real, repeatedly-used phone number in the data is `07722288179`, stored as the **Venue's** phone number
  (`_VenuePhone` postmeta on the "Sanderson Hall" TEC venue post, 163) — likely the hall's own phone, not
  necessarily UTSAB's. Included in `site-info.json` notes but not asserted as UTSAB's contact number.
- Only one social link was found anywhere in the content: a Facebook group,
  `https://www.facebook.com/groups/338494123336023`, repeated on the 2024/2025/2026 event pages. No
  Instagram/Twitter/YouTube links found.

## Team/Committee info — none found

- Only **one** WordPress user exists in `wpdo_users`: `admin` (login `user19143632528494`,
  email `ranjanm1@gmail.com`, display name "admin"). Its `usermeta.description` (bio field) is an empty string.
- No "Team", "Committee", or "About Us — Our People" style page or custom post type was found anywhere in
  `wpdo_posts`. The "About" page (77) describes UTSAB's purpose and activities in general terms but names no
  individuals.
- `team.json` is therefore an empty array — do not invent committee members.

## Stale / outdated content flagged

- **Sample Page** (post 2, published) and **Privacy Policy** (post 3, draft) are unmodified WordPress default
  boilerplate content ("Hello world!"/generic privacy policy template) from initial site setup — not real content,
  should not be carried into the rebuild.
- **Donate via PayPal** (post 159, draft, empty slug) contains only a `[paypal-donation purpose="Durga Puja"]`
  shortcode with no other text — it's an unfinished/abandoned draft page, never published. Its shortcode also
  won't function outside WordPress with the PayPal Donations plugin, so it's not directly portable.
- **UTSAB Durga Puja 2024** page (170) contains a live "ANNOUNCEMENT — Sindoor Khela will start from 1 PM today
  (13/10/2024)" banner, duplicated twice in the content. This is now stale/in-the-past framing ("today") that
  should be rewritten as historical/past-tense copy for the rebuild, not carried over verbatim as if current.
- The "Events" page (post 90, published) has **completely empty `post_content`** — it likely relied entirely on
  the "Neve" theme's page-builder blocks or an Events Calendar archive shortcode/widget that isn't stored as
  content in `post_content` (e.g., a full-site-editing template part, or the default TEC events list auto-inserted
  by the theme/plugin at render time rather than saved into the page body). Nothing usable could be extracted from
  the DB for this page's body text.
- Sponsor/market-stall shortcodes (`[gslogo id=1]`, `[wpgmza id="1"]`) appear in several event pages'
  descriptions in `events.json` — these are plugin shortcodes (Logo Slider, WP Google Maps) that only rendered
  something meaningful on the live WordPress site; the sponsor logo images themselves were resolved separately
  (see below) but the shortcodes themselves are inert text in the extracted description and should be stripped/
  replaced when building the new site.

## Sponsor logos (separate from the "events" gallery images)

Found via the `gs-logo-slider` custom post type + `logo-category` taxonomy (term "durgapuja-sponsor", 5 posts
tagged) plus one `logoshowcase` post ("Durga Puja 2024 Sponsors"). These were NOT folded into `events.json`
(which only carries images actually embedded in each event page's `post_content`), but the underlying image files
are on disk and listed in `images-inventory.md`:
- Hawke (client_url: https://www.hawkefs.com) — thumbnail attachment 187 (`Silver_Genie.png`... note: the
  `_thumbnail_id` values for these sponsor posts point to shared/reused attachment IDs in a few cases; treat with
  caution — the mapping between sponsor name and exact logo file could not be 100% confirmed for all 5 entries.
  hdfc → attachment 186 (`HDFC-Home-Loan.png`), Chillika → attachment 189 (`Chillika.jpeg`), Galaxy of Homes →
  attachment 193 (`GOH.png`), Indya → attachment 264 (`Indya-Logo.jpeg`) were confirmed with confidence via
  `_thumbnail_id` postmeta on each `gs-logo-slider` post.
- The 2025 Durga Puja page (231) separately embeds market-stall/sponsor images directly in its content
  (manisha-catering, Anjanye, Boho-Mantra, Arts-fashions) rather than via the `gs-logo-slider` CPT — these ARE
  captured in that event's `images` array in `events.json` since they're inline in `post_content`.

## Other tables / data NOT used (and why)

- `wpdo_wpgmza_maps` (WP Google Maps plugin) — could contain the exact lat/long pin for "Sanderson Hall" used by
  the `[wpgmza id="1"]` shortcode, but wasn't parsed; the venue's plain-text address was already available and
  sufficient, so map coordinates were treated as out of scope.
- `wpdo_wpforms_*` tables (form submissions/logs/payments) — deliberately not extracted; these are user
  submission records (potentially containing real visitors' personal data), not site content, and extracting them
  would be a privacy concern outside this task's scope.
- `wpdo_epi_embed` posts (41 published posts like "Amazon Kindle", "Facebook", "Google Maps") are **default
  stub content from the "Embed Any Document"/oEmbed-helper plugin** (`post_type=epi_embed`), not real site
  content — every post is just a boilerplate "Click here to display content from X" placeholder. Ignored.
- `content/` folder (mu-plugins, cache files) — glanced at; no Elementor/page-builder JSON with real page content
  was found, just plugin cache/temp files. Not a source of real content.
- The one real blog `post` (post_type=post, ID 1, "Hello world!") is unmodified WordPress default content, not
  extracted into pages.json/events.json (it's neither a page nor an event).

## Assumptions made

- Treated `post_status IN ('publish')` as the primary set for pages.json, but included the 2 non-publish pages
  (Privacy Policy = draft, Donate via PayPal = draft) since they were explicitly in the target ID list and are
  informative for flagging stale/unfinished content — both are clearly marked `status: "draft"` in the output so
  the rebuild can decide whether to use them.
- For events without an explicit venue mentioned in page text (2018–2023 Durga Puja pages, 2020/2023 Saraswati
  Puja pages), left `venue: null` rather than assuming it was always "Sanderson Hall" — the 2019 Saraswati Puja
  page shows the venue actually changed over time (Crofton Halls in 2019 vs Sanderson Hall from ~2024 onward), so
  guessing would risk being wrong for earlier years.
- Image `relativePath` values in `events.json`/`pages.json` point at `uploads/uploads/<year>/<month>/<filename>`
  relative to `site-dump-raw/`, matching the exact size variant that was embedded in the original page content
  (not necessarily the "original" full-size file — see `images-inventory.md` for the true original of each).
