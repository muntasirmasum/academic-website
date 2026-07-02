# Muntasir Masum — static website

A plain, hand-editable static site (HTML + CSS + a little JS). No build step, no
toolchain. Open any `.html` file in a browser and it just works. This is the
deployable version of the design mockup — Quarto is no longer required.

## Files

```
index.html          Home
about.html          Bio, appointments, education, places map, contact
research.html       Research themes, interactive body map, funding
publications.html   Selected + by-year + under review
dispatches.html     Talks, conference presentations, writing, newsletter
teaching.html       Courses, materials, RPubs collection, mentoring
studio.html         Visualizations, tools, experiments (filterable)
404.html            Not-found page

site.css            All styling + light/dark color tokens (shared by every page)
site.js             Dark-mode toggle, ⌘K / “/” search overlay, topic pop-ups, mobile menu
favicon.svg         Site icon (the “MM” mark)
sitemap.xml         Page list for search engines  ·  robots.txt
headshot-circle.png Profile photo  ·  bodymap-figure.png  ·  cv.pdf
```

Everything a page needs loads from a CDN (Google Fonts, Iconify, MapLibre for the
About map) or from these local files — so it runs anywhere static files are served.

---

## Deploy — GitHub Pages (free)

1. Create a repo on GitHub (e.g. `muntasirmasum.github.io` for a user site, or any
   name for a project site).
2. Upload **the contents of this `design-port/` folder** to the repo root
   (so `index.html` sits at the top level), then commit/push.
3. Repo **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*,
   Branch = `main`, folder = `/ (root)`. Save.
4. Wait ~1 minute. Your site is live at `https://<username>.github.io/<repo>/`
   (or `https://<username>.github.io/` for a user site).

**Custom domain (e.g. muntasirmasum.com):** Settings → Pages → Custom domain. Add
the domain, then create the DNS records GitHub shows you at your registrar. GitHub
provisions HTTPS automatically. (Adding the domain creates a `CNAME` file in the repo.)

## Deploy — Vercel (free)

1. Push this folder to a GitHub repo (as above).
2. On vercel.com → **Add New → Project → Import** the repo.
3. Framework Preset = **Other**. Build Command = *(leave empty)*.
   Output Directory = *(leave empty / `.`)* — it's already static.
4. **Deploy.** Every future `git push` redeploys automatically.
5. Custom domain: Project → Settings → Domains → add `muntasirmasum.com` and follow
   the DNS instructions. HTTPS is automatic.

No `vercel.json` or build script is needed — this is pure static hosting.

> Tip: you can also just drag-and-drop the folder onto **Netlify Drop**
> (app.netlify.com/drop) or Cloudflare Pages for an instant deploy with no Git.

---

## Updating content

Each kind of content lives in one file. Open it in any text editor, copy an existing
block, change the text, save, and push. The design takes care of itself.

- **New publication** → `publications.html`. For a “by year” entry, duplicate one
  `<div class="yr">…</div>` block. For a Selected card, duplicate an
  `<article class="mm-card">…</article>` inside `.mm-pubgrid`.
- **New talk / writing note** → `dispatches.html` (duplicate a `.mm-row`).
- **New grant** → `research.html` (duplicate a `.mm-row` under Current funding).
- **New tool / viz / experiment** → `studio.html` (duplicate a `.mm-tallcard` or
  `.mm-viz-card`). The viz/experiment cards show striped placeholder boxes
  (`<div class="mm-viz-media mm-ph">…</div>`) describing the figure that belongs
  there — when you have the real image, drop the file in this folder and replace
  that line with `<img class="mm-viz-media" src="your-figure.png" alt="…">`.
- **Home “News” / “Selected”** → `index.html`.

**Two things to keep in sync when you add an item** (otherwise it just won't appear
in those features — nothing breaks):

1. **Search + topic pop-ups** — add a matching entry to the `IDX` array near the top
   of `site.js` so the new item is findable via ⌘K and the research-interest tags.
2. **Nav / footer** — these are repeated in every `.html` file. If you change a nav
   label or footer link, change it in all pages (find-and-replace), or ask Claude to
   do it across the set.

**Colors / fonts** are defined once at the top of `site.css` (the `:root` block for
light mode, `.quarto-dark` for dark mode). Change them there and every page updates.

The accent color is `#46166b`. Dark mode is remembered per visitor (localStorage).

---

## SEO & your domain

These files assume your site lives at **https://muntasirmasum.com/**. That base URL
appears in `sitemap.xml`, `robots.txt`, and the `canonical` / `og:url` / `og:image`
tags in each page's `<head>`, plus the JSON-LD `Person` record on the home page. If you
deploy somewhere else (e.g. a `github.io` address), update that base in those files —
or ask Claude to. Nothing breaks with the wrong base; only link previews and search
indexing benefit from it being correct.

Added for search engines & sharing:
- `sitemap.xml` + `robots.txt` — help Google/Bing discover every page.
- Per-page `<title>`, description, Open Graph + Twitter-card tags — nicer link previews.
- JSON-LD `Person` schema on the home page — richer Google results.
- `favicon.svg` — the browser-tab icon.

The top navigation collapses into a tap-to-open menu below ~900px wide.
