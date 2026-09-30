# Packisher studio site

The site at packisher.com. Plain HTML, no build step.

- `index.html`: the whole page (styles and the scroll effect are inside it)
- `assets/`: logo, ROSC icon and screenshots
- `favicon.svg`

## Colours

Three looks are built in. Preview any of them by adding `?palette=` to the address:

- `/?palette=stone` (default)
- `/?palette=chalk`
- `/?palette=night`

Dark mode always uses night. To change the default, edit the first block of
colours at the top of the `<style>` in `index.html`.

## Deploy (Vercel)

1. Push this folder to its own GitHub repo, e.g. `packisher-studio`.
2. Vercel > Add New > Project > import that repo. Framework: Other. No build command.
3. Settings > Domains > add `packisher.com` and `www.packisher.com`
   (after moving them off the logistics project, see below).

The logistics site (`packisher-tech`) keeps its own repo and Vercel project and
moves to `logistics.packisher.com`.
