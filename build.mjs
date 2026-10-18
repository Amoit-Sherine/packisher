// build.mjs: makes one page per window from index.html.
//
// WHY: Google (and anyone sharing a link) needs a real address for each window, like
// https://www.packisher.com/contact/ instead of https://www.packisher.com/#contact.
// index.html is the home page and the single place you edit. It holds every window.
// This script copies it once per window, keeping only that window, and gives each copy
// its own title, description, address and main heading. Nothing else is changed, so every
// page looks exactly like the home page with that window open.
//
// RUN IT:   node build.mjs      (Vercel runs it for you on every deploy, see vercel.json)
// It needs no installs, only Node. The pages it writes (rosc/, services/, process/,
// platforms/, contact/, team/, news/) are committed too, so you can read them on GitHub.
// Never edit those by hand: edit index.html and run this again.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SITE = 'https://www.packisher.com';

// One entry per window. `id` is the section id in index.html, `path` is its address.
// Keep `path` in step with ROUTES in the script at the bottom of index.html and with sitemap.xml.
const PAGES = [
  {
    id: 'rosc', path: '/rosc/', name: 'ROSC',
    title: 'ROSC: Savings Group App for Chamas | Packisher',
    description: 'ROSC is a shared record for rotating savings groups (chamas): who paid, who received and whose turn is next. Built by Packisher, in closed testing on iOS and Android.',
  },
  {
    id: 'services', path: '/services/', name: 'Services',
    title: 'App and Web Development Services in Kenya | Packisher',
    description: 'Packisher builds Flutter mobile apps, websites, backends, integrations and dashboards for businesses and community groups in Kenya, then looks after them after launch.',
  },
  {
    id: 'process', path: '/process/', name: 'Process',
    title: 'How We Build Apps and Websites | Packisher',
    description: 'How Packisher builds apps and websites: listen, design, build and launch, with something to see at every step and a written plan before any work begins.',
  },
  {
    id: 'platforms', path: '/platforms/', name: 'Platforms',
    title: 'Flutter, Next.js and Supabase Development | Packisher',
    description: 'The tools Packisher builds on: Flutter and Dart for mobile, Next.js and React for web, Supabase, PostgreSQL and Firebase for backends, and Figma for design.',
  },
  {
    id: 'contact', path: '/contact/', name: 'Contact us',
    title: 'Start a Project | Contact Packisher',
    description: 'Tell Packisher about your app, website or backend. We reply within two business days with questions or a first outline, then a written plan covering scope, timeline and price.',
  },
  {
    id: 'note', path: '/team/', name: 'The team',
    title: 'The Team Behind Packisher',
    description: 'Meet the people behind Packisher: founder Sherine A. leads product and engineering, with a trusted network of independent design, engineering and testing specialists.',
  },
  {
    id: 'news', path: '/news/', name: 'News',
    title: 'News and Updates | Packisher',
    description: 'Launches, product updates and notes from Packisher and ROSC, in The Packisher Report.',
  },
];

const home = readFileSync('index.html', 'utf8');

// ---- small helpers -------------------------------------------------------

// Fail loudly if a line we rely on has moved, instead of quietly making a broken page.
function swap(html, pattern, replacement, what) {
  if (!pattern.test(html)) throw new Error(`build.mjs: could not find ${what} in index.html`);
  return html.replace(pattern, replacement);
}

// Find every window (<section ... win-sec ... id="...">) with its start and end position.
// Windows can contain smaller <section> tags (the ROSC demo screens), so we count nesting.
function findWindows(html) {
  const found = [];
  const tag = /<section\b[^>]*>|<\/section>/g;
  let depth = 0, current = null, m;
  while ((m = tag.exec(html))) {
    if (m[0] === '</section>') {
      depth--;
      if (depth === 0 && current) { current.end = m.index + m[0].length; found.push(current); current = null; }
    } else {
      if (depth === 0 && /\bwin-sec\b/.test(m[0])) current = { id: /\bid="([^"]+)"/.exec(m[0])[1], start: m.index };
      depth++;
    }
  }
  return found;
}

const windows = findWindows(home);
const escAttr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const escJson = s => s.replace(/</g, '\\u003c');

// ---- build ---------------------------------------------------------------

for (const page of PAGES) {
  if (!windows.some(w => w.id === page.id)) throw new Error(`build.mjs: no window with id "${page.id}" in index.html`);
  const url = SITE + page.path;
  let html = home;

  // 1. Keep only this page's window (cut the others out, last one first so positions stay right).
  for (const w of [...windows].reverse()) if (w.id !== page.id) html = html.slice(0, w.start) + html.slice(w.end);

  // 2. This page's own head: title, description, address and sharing previews.
  const t = escAttr(page.title);
  const d = escAttr(page.description);
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`, '<title>');
  html = swap(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${d}">`, 'meta description');
  html = swap(html, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`, 'canonical link');
  html = swap(html, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${t}">`, 'og:title');
  html = swap(html, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${d}">`, 'og:description');
  html = swap(html, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`, 'og:url');
  html = swap(html, /<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${t}">`, 'twitter:title');
  html = swap(html, /<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${d}">`, 'twitter:description');

  // 3. A breadcrumb for Google: Packisher > this page.
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Packisher', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: page.name, item: url },
    ],
  };
  html = swap(html, /<\/head>/, `<script type="application/ld+json">\n${escJson(JSON.stringify(crumbs, null, 2))}\n</script>\n</head>`, '</head>');

  // 4. Tell the page's script which window it belongs to (it opens that window on laptops).
  html = swap(html, /<html lang="en">/, `<html lang="en" data-route="${page.id}">`, '<html lang="en">');

  // 5. One main heading per page. The home page's headline becomes a plain line (same look),
  //    and this window's own heading becomes the page's <h1> (same look, see "h1.h2" in the CSS).
  html = swap(html, /<h1>([\s\S]*?)<\/h1>/, '<p class="h1">$1</p>', 'the home headline');
  const start = html.search(new RegExp(`<section\\b[^>]*\\bid="${page.id}"`));
  if (start < 0) throw new Error(`build.mjs: lost the "${page.id}" window`);
  const heading = /<h2>([\s\S]*?)<\/h2>/g;
  heading.lastIndex = start;
  const hm = heading.exec(html);
  if (!hm) throw new Error(`build.mjs: no <h2> in the "${page.id}" window`);
  html = html.slice(0, hm.index) + `<h1 class="h2">${hm[1]}</h1>` + html.slice(hm.index + hm[0].length);

  // 6. A note for anyone reading the file.
  html = html.replace('<!doctype html>', '<!doctype html>\n<!-- Made by build.mjs from index.html. Do not edit this file: edit index.html and run "node build.mjs". -->');

  if ((html.match(/<h1\b/g) || []).length !== 1) throw new Error(`build.mjs: ${page.path} should have exactly one <h1>`);
  mkdirSync(page.path.slice(1), { recursive: true });
  writeFileSync(page.path.slice(1) + 'index.html', html);
  console.log(`${page.path.padEnd(12)} ${(html.length / 1024).toFixed(0)} KB  ${page.title}`);
}
