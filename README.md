# Packisher studio site

The site at www.packisher.com. Plain HTML, plus one small Node script (`build.mjs`) that makes the window pages.

- `index.html`: the home page and the one file you edit (styles, scripts and every window are inside it)
- `build.mjs`: makes the window pages below from `index.html`, see "One page per window"
- `assets/`: logo, ROSC icon and screenshots
- `favicon.svg`

## One page per window

Every window has its own address, so it can be shared, bookmarked and found on Google:

| Window | Address |
| --- | --- |
| ROSC | `/rosc/` |
| Services | `/services/` |
| Process | `/process/` |
| Platforms | `/platforms/` |
| Contact us | `/contact/` |
| The team | `/team/` |
| News | `/news/` |

On a laptop the home page holds every window, so they open instantly and the address
bar follows (`/contact/` while Contact is open, `/` when none is). Each address is also a
real page that opens the desktop with that window already open. Old `/#contact` links
still work and turn into `/contact/`.

The window pages are made from `index.html` by `build.mjs`. Never edit them by hand.
After changing `index.html`, run `node build.mjs` and commit the result (Vercel also runs
it on every deploy, see `buildCommand` in `vercel.json`). To change a page's title or
description for Google, edit its entry at the top of `build.mjs`. A new window needs
an entry in `build.mjs`, in `ROUTES` at the bottom of `index.html`, and in `sitemap.xml`.

## Colours

Ivory with a slow sage wash behind each section. All colours are the variables
at the top of the `<style>` in `index.html` (light first, then dark mode).

## Deploy (Vercel)

1. Push this folder to its own GitHub repo, e.g. `packisher-studio`.
2. Vercel > Add New > Project > import that repo. Framework: Other. The build command (`node build.mjs`) comes from `vercel.json`, so leave the dashboard field empty.
3. Settings > Domains > add `packisher.com` and `www.packisher.com`
   (after moving them off the logistics project, see below).

The logistics site (`packisher-tech`) keeps its own repo and Vercel project and
moves to `logistics.packisher.com`.

## Contact form email

The form posts to `/api/contact` (a Vercel function in `api/contact.js`), which
sends the enquiry to support@packisher.com through Resend with the subject
"[Studio site] New project enquiry from ...". Reply goes straight to the sender.

In Vercel > Project > Settings > Environment Variables add:

- `RESEND_API_KEY`: the Resend key (same one ROSC uses). Never commit it.
- Optional: `CONTACT_TO` (default support@packisher.com) and `CONTACT_FROM`
  (default "Packisher Studio Site <support@packisher.com>").

If the key is missing or sending fails, the form falls back to opening the
visitor's email app.

## Posting news

All posts live in `assets/news.js`. Copy one block, paste it at the top of the
list, change the type, date, title and text, then commit and push. The desktop
News panel and the News window both update from that one file.

Types: launch, rosc, community, studio, research (each has its own icon and colour).

## Search and sharing (SEO)

The main address is `https://www.packisher.com/`. `packisher.com` redirects to it
(the `redirects` block in `vercel.json`), and every page names the www address as its
canonical.

- `index.html` head: the title and description Google shows, the canonical link, the
  link-preview tags (`og:` and `twitter:`), and the structured data (JSON-LD) that
  describes Packisher, its seven services and ROSC. Keep it matching the words on the page.
- `robots.txt`: lets all crawlers in (search and AI) and points to the sitemap.
- `sitemap.xml`: add a block for every new page and update its `lastmod` when it changes.
- `assets/og-image.png`: the 1200 x 630 picture shown when the link is shared. Replace the
  file to change it. WhatsApp and LinkedIn cache previews, so re-scrape after changing it.
- `favicon-48.png`, `apple-touch-icon.png`, `assets/icon-192.png`, `assets/icon-512.png`:
  PNG versions of the logo for Google results, iPhones and the structured data.

Positioning: Packisher is described as a venture studio whose current venture is ROSC, with client
work as a second line. Keep the title, description and structured data in `index.html`, and the
entries in `build.mjs`, in step with the hero text. ROSC records contributions and does not hold
or move money, so no page should say it does until that is true and approved.

After a deploy that changes the home page: Google Search Console > URL Inspection >
paste `https://www.packisher.com/` > Request indexing.
