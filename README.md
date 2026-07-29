# muntasirmasum.com

Personal academic website of **Muntasir Masum, PhD** — Assistant Professor of
Epidemiology & Biostatistics, University at Albany (SUNY).

Plain static site: no framework, no build step. Open `index.html` in a browser
and it works; push the folder to any static host and it's live.

## Structure

```
index.html           Home (hero, highlights, selected pubs, news)
about.html           Bio, appointments, education, places map
research.html        Research themes + interactive body map
publications.html    Selected grid, by-year list, under review
dispatches.html      Talks, media, writing
teaching.html        Courses, mentoring
studio.html          Data-viz gallery
404.html             Not-found page
site.css             All design tokens + .mm-* components (one file)
site.js              Dark mode, ⌘K search, topic pop-ups, mobile nav
DESIGN.md            Design system (design.md spec — tokens + rules)
DEPLOY.md            Hosting steps (Vercel / GitHub Pages)
```

## Editing

- **Design decisions live in [`DESIGN.md`](DESIGN.md)** — colors, type,
  components, do's & don'ts. AI coding agents should read it first.
- Nav, CTA banner, and footer are repeated inline on **every page** — a chrome
  change means editing all seven pages.
- When adding a publication/talk/section, add a matching entry to the `IDX`
  array in `site.js` so site search can find it.
- Chronological lists are newest-first. Colors only via the CSS variables in
  `site.css` (`:root` light / `.quarto-dark` dark) so dark mode keeps working.

## Adding a plain-language summary

The "Plain-language summaries" block on the publications page is generated.
Point the script at a `research_summary/` folder (the Quarto one-pager output)
and it copies the PDF, builds the thumbnail, and updates the page and search:

```
python3 scripts/add_summary.py "/path/to/research_summary"
python3 scripts/add_summary.py "/path/to/research_summary" --dry-run   # preview
```

`scripts/` is version-controlled but excluded from the deployment by
`.vercelignore`, so it never ships to the live site.

Title, venue, subtitle, and DOI are read from the folder's `.qmd`. Override any
of them with `--title / --venue / --desc / --doi`, and set search keywords with
`--keywords sdoh,chronic`.

Entries live in `scripts/summaries.json` (newest first) — edit that file for
wording changes, then run `add_summary.py --regen`. Don't hand-edit between the
`SUMMARIES:START` / `SUMMARIES:END` markers in `publications.html` or `site.js`;
those regions are overwritten. Re-running on a folder refreshes the title, venue,
and DOI while keeping curated prose and keywords.

## Local preview

Any static server works, e.g.:

```
python3 -m http.server 8000
# → http://localhost:8000
```

(Opening `index.html` directly also works; the about-page map just needs
network access for tiles.)

## Deploy

See [`DEPLOY.md`](DEPLOY.md). Short version: import this repo in Vercel,
framework preset **Other**, no build command, then attach the domain.

## Reusing this as a template

Fork it, then: replace the content in the seven pages, swap
`headshot-circle.png` / `bodymap-figure.png` / `cv.pdf`, retheme by editing
the tokens in `site.css` + `DESIGN.md`, and rebuild the `IDX` search array in
`site.js` for your own content.
