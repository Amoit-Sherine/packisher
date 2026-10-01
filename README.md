# Packisher studio site

The site at packisher.com. Plain HTML, no build step.

- `index.html`: the whole page (styles and the scroll effect are inside it)
- `assets/`: logo, ROSC icon and screenshots
- `favicon.svg`

## Colours

Ivory with a slow sage wash behind each section. All colours are the variables
at the top of the `<style>` in `index.html` (light first, then dark mode).

## Deploy (Vercel)

1. Push this folder to its own GitHub repo, e.g. `packisher-studio`.
2. Vercel > Add New > Project > import that repo. Framework: Other. No build command.
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

The News panel (top right of the desktop) and the News window share the same
posts. In `index.html`, search for `nf-list` and copy an existing `<li class="nf-item">`
to the top of BOTH lists. Each post has a tag (Launch, ROSC, Community...), a date,
a title, one or two sentences, and an optional link. Newest goes first.
