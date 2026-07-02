---
version: alpha
name: Muntasir Masum — Academic Site
description: >
  Editorial academic personal site: serif display type over a cool near-white
  ground, one deep-violet accent, hairline borders, light + dark themes.
  Implemented as a static site (7 pages + site.css + site.js); every component
  class is namespaced .mm-*.
colors:
  bg: "#f5f6f8"
  surface: "#ffffff"
  ink: "#1f2d3a"
  body: "#3b4651"
  muted: "#5a6571"
  muted2: "#74808b"
  faint: "#9aa4ae"
  border: "#e7eaee"
  hair: "#eef0f3"
  btnborder: "#cfd6dd"
  primary: "#46166b"
  primary-hover: "#341050"
  primary-tint: "#f1ecf7"
  primary-underline: "#dccfe8"
  on-primary: "#ffffff"
  gold: "#c2a23a"
  gold-tint: "#fbf3e0"
  gold-text: "#a07d12"
typography:
  display:
    fontFamily: Newsreader
    fontSize: 46px
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: -0.5px
  h1:
    fontFamily: Newsreader
    fontSize: 42px
    fontWeight: 600
    letterSpacing: -0.4px
  h2:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: 600
    letterSpacing: -0.3px
  h3-card:
    fontFamily: Newsreader
    fontSize: 21px
    fontWeight: 600
  pub-title:
    fontFamily: Newsreader
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16.5px
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14.5px
    fontWeight: 400
    lineHeight: 1.55
  ui:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 600
  nav-link:
    fontFamily: IBM Plex Sans
    fontSize: 14.5px
    fontWeight: 500
  label-caps:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: 600
    letterSpacing: 0.12em
  mono-note:
    fontFamily: ui-monospace
    fontSize: 12px
    fontWeight: 500
rounded:
  sm: 8px
  md: 10px
  lg: 12px
  xl: 14px
  pill: 999px
spacing:
  xs: 8px
  sm: 12px
  md: 20px
  lg: 28px
  xl: 54px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.ui}"
    rounded: "{rounded.sm}"
    padding: 10px 18px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.ui}"
    rounded: 7px
    padding: 7px 13px
  cv-button:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 7px 14px
  cv-button-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  tag-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: 6px 13px
  tag-chip-hover:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary}"
  topic-pill:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: 3px 10px
  status-pill-review:
    backgroundColor: "{colors.gold-tint}"
    textColor: "{colors.gold-text}"
    rounded: "{rounded.pill}"
    padding: 2px 9px
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: 24px
  pub-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 20px 22px
  section-label:
    textColor: "{colors.primary}"
    typography: "{typography.label-caps}"
  social-icon:
    backgroundColor: transparent
    textColor: "{colors.body}"
    rounded: "{rounded.pill}"
    size: 42px
  callout-banner:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.ink}"
  footer:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted2}"
---

## Overview

Quiet editorial academia: a high-end journal article, not a tech landing page.
Newsreader (serif) carries every display moment — name, headings, publication
titles, stat numbers; IBM Plex Sans carries everything functional. One deep
violet (`primary`, #46166b) does all interactive and emphasis work against
cool near-white grounds. Depth comes from hairline borders, not shadows;
motion is a small hover lift, nothing else. The whole palette swaps for dark
mode with a single `.quarto-dark` class on `<html>`.

## Colors

Every color is a CSS custom property in `site.css` (`:root` = light,
`.quarto-dark` = dark). Token → CSS var mapping: `primary` ↔ `--accent`,
`primary-hover` ↔ `--accent-hover`, `primary-tint` ↔ `--accent-tint`,
`primary-underline` ↔ `--accent-underline`; all other names match their var
(`bg` ↔ `--bg`, etc.). In light mode `--accent-text` equals `--accent`;
in dark mode it lightens to keep contrast — always use `var(--accent-text)`
for accent-colored *text*, `var(--accent)` for accent-colored *fills*.

- **ink** — headlines and strong text. **body** — running text.
- **muted / muted2 / faint** — descending emphasis: card prose, metadata, footer legalese.
- **border / hair** — 1px structural lines; `hair` for intra-list row separators, `border` for card edges.
- **primary** — links, buttons, active states, section labels, left-accent bars. Never body text, never backgrounds larger than the CTA tint band.
- **primary-tint** — hover fills, note boxes, the site-wide CTA band.
- **gold family** — one job only: "under review / planned" status (pills, pub-card left border). Not decorative.

Dark theme values (`.quarto-dark`): bg #141118, surface #1f1b27, ink #f4f2f8,
body #cdc9d6, muted #aaa6b5, muted2 #928da0, faint #6f6b7c, border #332e3e,
hair #28232f, btnborder #4a4456, accent #7a4fb0, accent-text #cbb1e8,
accent-hover #6b41a0, accent-tint #2a2138, accent-underline #4a3b60,
gold-tint #332b16, gold-text #d8b84e. Never hard-code a hex in page markup —
add or reuse a var so dark mode keeps working.

## Typography

Two families, loaded from Google Fonts (see page `<head>`):

- **Newsreader** (600) — display and identity: hero name (46px), page h1 (42px),
  section h2 (28px), card h3 (19–22px), publication titles (17–18px/1.3),
  stat numbers, footer name, brand wordmark. Tight letter-spacing (−0.3 to −0.5px)
  at display sizes.
- **IBM Plex Sans** — everything else: body 16.5px/1.65, secondary text
  13.5–15px, nav 14.5px/500, buttons 13–14px/600.
- **Caps labels** (`label-caps`): 10.5–12px, 600, letter-spacing .07–.12em,
  uppercase — section labels (in primary), stat labels and metadata (in muted2).
- **Monospace** only inside striped image placeholders.

Body text never drops below 13px; caps labels never below 9.5px. No third font.

## Layout

- Content column: 860px default (`.mm-page`), 760px narrow (about),
  1080px wide (nav, footer, card grids), 720px hero, 640px max for lead paragraphs.
  Horizontal gutter 28px at all sizes (16px at ≤480px).
- Vertical rhythm: 54px between home sections (`.mm-section-pad`), 34px above
  section labels, 40px footer padding.
- Grids: 3-up cards (home), 2-up cards (publications selected, teaching,
  dispatches, studio), home pubs/news split 1.55fr/1fr — all `gap` 16–20px.
- The chronology pattern is `.mm-rows`: flex rows, hairline top borders,
  bold item + muted detail on the left, nowrap date on the right.
- Breakpoints: **1050px** nav collapses to hamburger (injected by site.js);
  **820px** all grids go single-column, display type steps down (name 38px,
  h1 36px); **640px / 480px** compact type and spacing. Chronological lists
  are always newest-first.

## Elevation & Depth

Flat by default; structure comes from 1px borders. Exactly three uses of shadow:

- Card hover: `box-shadow: 0 10px 28px rgba(31,45,58,.09)` + `translateY(-2px)`,
  transition .18s ease.
- Hero portrait: soft ambient `0 6px 22px rgba(31,45,58,.12)`.
- Search overlay panel: `0 26px 64px rgba(15,12,20,.34)` over a blurred scrim.

The sticky nav floats via translucency (`color-mix` 86% bg + backdrop blur),
not shadow. Respect `prefers-reduced-motion` (already handled globally).

## Shapes

- Radii: 8px buttons, 10px note boxes, 12px accent cards / map, 14px standard
  cards, 15px overlay panel, 999px chips and pills, 50% portrait and social icons.
- A 3px **left accent bar** marks emphasized containers: publication cards
  (violet; gold when under review), note boxes, body-map info panels,
  hovered search rows.
- Image placeholders are 45° stripes (`hair`/`border`) with a monospace caption
  describing the asset to drop in — never hand-drawn artwork.

## Components

Token values in the front matter; behavioral notes:

- **Nav** (`.mm-nav`): sticky, translucent, 1080px inner row — serif brand,
  page links, "Alcohol Intelligence" accent link, search / dark-mode icon
  buttons, outlined CV button. Active page link = 600 weight, accent color.
- **Hero** (home only): centered column — 168px circular portrait, name, role,
  affiliation, one-paragraph intro, action row (filled email circle, tinted
  "Alcohol Intelligence ↗" pill, five outlined social circles that wrap as a
  group on mobile), stats, 2×2 interest chips.
- **Cards**: `.mm-card` (generic, hover-lift), `.mm-pub-card` (left accent bar),
  `.mm-tallcard` (eyebrow + serif h3 + flexing description), `.mm-viz-card`
  (media on top, studio). Whole cards are links where a primary target exists.
- **Chips & pills**: `.mm-tag` outlined interest chips (open the topic overlay
  via `data-mm-topic`); `.mm-pill` tinted topic pills; `.mm-ur-pill` gold status;
  `.mm-filter` studio filter (active = filled primary).
- **Buttons**: `.mm-btn` filled primary, `.mm-btn-ghost` outlined,
  `.mm-cv` outlined-to-filled. One filled button per card, max.
- **Note boxes**: `.mm-note` (tint + accent bar + caps label), `.mm-evalbox` (tint only).
- **Table** (`.mm-table` in `.mm-tablewrap`): caps-label header row, hairline
  row separators, tint row hover; wrapper scrolls horizontally on mobile.
- **CTA band** (`.mm-callout`): full-width primary-tint strip above the footer
  on every page — serif title, short text, one filled button.
- **Footer** (`.mm-footer`): surface background, 1.4fr/1fr/1fr grid —
  identity block, Explore links, Elsewhere links; hairline bottom bar with ©.
- **Search overlay** (`.mm-ov`, in site.js): ⌘K or `/`, curated index,
  arrow-key navigation. **Topic overlay** reuses the same panel for chip taps.
- **Body map** (research): 340px figure + driver chips + hover-highlight
  region list; self-contained script in research.html.

## Do's and Don'ts

- **Do** reuse existing `.mm-*` components before inventing new ones; keep new
  classes in the `.mm-` namespace, defined in `site.css`.
- **Do** style through CSS vars so dark mode survives; check both themes.
- **Do** keep chronological lists newest-first, and add a matching `IDX` entry
  in `site.js` when adding a publication, talk, or page section — otherwise
  search won't find it.
- **Do** edit nav/CTA/footer on **all seven pages** — chrome is repeated inline
  (no templating).
- **Don't** introduce new accent colors, gradients, emoji, or a third typeface.
- **Don't** use gold for anything but under-review/planned status.
- **Don't** add shadows beyond the three sanctioned uses, or hover motion
  beyond the standard lift.
- **Don't** hand-draw SVG imagery; use the striped placeholder pattern until a
  real figure exists.
- **Don't** load Iconify on pages that don't already use it (currently home only).

## Content Conventions

Site-specific, not template-generic: awards, fellowships, service, and
memberships live in the CV only. Education entries show no years; mentee
names are never listed (count only). Email appears in the hero, About contact
line, and Teaching "reach out" — not in the footer.

## Implementation Notes

`design-port/` layout: seven pages + `404.html`, one `site.css` (tokens +
all components), one `site.js` (dark-mode persistence + theme-color sync,
⌘K search with curated `IDX`/`NAV` arrays, topic pop-ups, hamburger injection
≤1050px). Hamburger and search are progressive enhancements behind the
`.mm-js` class. Validate this file with `npx @google/design.md lint DESIGN.md`.
