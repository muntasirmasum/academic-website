#!/usr/bin/env python3
"""Drop a plain-language research summary into the website.

Point this at a `research_summary/` folder (the Quarto one-pager output) and it
will copy the PDF, build a thumbnail, record the entry in summaries.json, and
regenerate the "Plain-language summaries" block on the publications page plus
the matching ⌘K search entries.

    # add a new summary (metadata auto-read from the .qmd)
    python3 scripts/add_summary.py "/path/to/research_summary"

    # preview without writing anything
    python3 scripts/add_summary.py "/path/to/research_summary" --dry-run

    # rebuild the site blocks from summaries.json (after editing it by hand)
    python3 scripts/add_summary.py --regen

Newest summaries are listed first. Re-running on the same folder updates that
entry in place rather than duplicating it.
"""

import argparse
import glob
import html
import json
import os
import re
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)                      # the site root (design-port/)
MANIFEST = os.path.join(HERE, "summaries.json")
PUBS = os.path.join(SITE, "publications.html")
SITEJS = os.path.join(SITE, "site.js")
THUMB_WIDTH = 800

HTML_START = "<!-- SUMMARIES:START"
HTML_END = "<!-- SUMMARIES:END -->"
JS_START = "/* SUMMARIES:START"
JS_END = "/* SUMMARIES:END */"


# ---------------------------------------------------------------- qmd parsing

def _delatex(s):
    """Turn a snippet of the summary template's LaTeX into plain text."""
    s = re.sub(r"\{\\fontsize\{[^}]*\}\{[^}]*\}\\selectfont\s*", "", s)
    s = re.sub(r"\\\\\s*\[\d+(\.\d+)?pt\]", " ", s)   # \\[8pt] line-spacing
    s = s.replace("\\\\", " ").replace("\\&", "&").replace("\\%", "%")
    s = s.replace("---", "—").replace("--", "–")
    s = re.sub(r"\\[a-zA-Z]+\s*", "", s)          # stray control sequences
    s = s.replace("{", "").replace("}", "")
    s = re.sub(r"\[\d+(\.\d+)?pt\]", "", s)       # any leftover spacing marks
    return re.sub(r"\s+", " ", s).strip(" .")


def parse_qmd(path):
    """Pull title / subtitle / venue / doi out of a summary .qmd."""
    text = open(path, encoding="utf-8", errors="replace").read()
    out = {}

    m = re.search(r"selectfont\\bfseries\s+([^}]+)\}", text)
    if m:
        raw = _delatex(m.group(1))
        out["title"] = raw if not raw.isupper() else raw.capitalize()

    m = re.search(r"\\itshape\s+([A-Z][^}]*?,\s*20\d{2})\}", text)
    if m:
        out["venue"] = _delatex(m.group(1)).replace(", ", " · ")

    # Subtitle: the fontsize block that follows the title line.
    m = re.search(r"\\\[4pt\]\s*\n\s*(\{\\fontsize.*?)\n", text, re.S)
    if m:
        out["desc"] = _delatex(m.group(1)).rstrip(".") + "."

    # Prefer the *displayed* DOI over the href: hrefs in these templates have
    # been seen to contain email-tracking redirects rather than doi.org.
    m = re.search(r"DOI:.*?\\texttt\{(10\.[^}]+)\}", text, re.S)
    if not m:
        m = re.search(r"doi\.org/(10\.[^}\s]+)", text)
    if m:
        out["doi"] = m.group(1).strip()

    return out


def slugify(title):
    s = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return re.sub(r"^(the|a|an)-", "", s)


# ------------------------------------------------------------------- manifest

def load_manifest():
    if not os.path.exists(MANIFEST):
        return []
    return json.load(open(MANIFEST, encoding="utf-8"))


def save_manifest(entries):
    with open(MANIFEST, "w", encoding="utf-8") as fh:
        json.dump(entries, fh, indent=2, ensure_ascii=False)
        fh.write("\n")


# ------------------------------------------------------------- html rendering

def render_cards(entries):
    out = []
    for e in entries:
        t, v, d = (html.escape(e["title"]), html.escape(e["venue"]),
                   html.escape(e["desc"]))
        out.append(
            f'      <a class="mm-viz-card mm-sumcard" href="summary-{e["slug"]}.pdf" target="_blank" rel="noopener">\n'
            f'        <img class="mm-sumthumb" src="summary-{e["slug"]}-thumb.png" alt="One-page research summary: {t}" loading="lazy">\n'
            f'        <div class="mm-viz-body">\n'
            f'          <div class="mm-viz-metarow"><span class="mm-eyebrow-muted">{v}</span></div>\n'
            f'          <h3>{t}</h3>\n'
            f'          <p>{d}</p>\n'
            f'          <div class="mm-btnrow"><span class="mm-btn-sm">Read the summary (PDF)&#8201;&#8599;</span></div>\n'
            f'        </div>\n'
            f'      </a>'
        )
    return "\n".join(out)


def render_idx(entries):
    out = []
    for e in entries:
        t = e["title"].replace("'", "\\'")
        b = e.get("search_desc", e["desc"]).replace("'", "\\'")
        k = ",".join(f"'{x}'" for x in e.get("keywords", []))
        out.append(
            f"    {{t:'Plain-language summary: {t}',s:'Summary',u:'publications.html',"
            f"b:'{b}',k:[{k}]}},"
        )
    return "\n".join(out)


def splice(path, start_marker, end_marker, body):
    """Replace everything between the markers, keeping the marker lines."""
    text = open(path, encoding="utf-8").read()
    i = text.find(start_marker)
    j = text.find(end_marker)
    if i == -1 or j == -1:
        sys.exit(f"error: markers not found in {os.path.basename(path)}")
    line_end = text.index("\n", i) + 1          # keep the whole start-marker line
    indent = text[text.rfind("\n", 0, j) + 1:j]  # preserve the end marker's indent
    new = text[:line_end] + body + "\n" + indent + text[j:]
    if new != text:
        open(path, "w", encoding="utf-8").write(new)
        return True
    return False


def regen(entries, dry_run=False):
    cards, idx = render_cards(entries), render_idx(entries)
    if dry_run:
        print("--- publications.html ---\n" + cards)
        print("\n--- site.js ---\n" + idx)
        return
    a = splice(PUBS, HTML_START, HTML_END, cards)
    b = splice(SITEJS, JS_START, JS_END, idx)
    print(f"  publications.html {'updated' if a else 'unchanged'}")
    print(f"  site.js           {'updated' if b else 'unchanged'}")


# ----------------------------------------------------------------------- main

def add(folder, args):
    if not os.path.isdir(folder):
        sys.exit(f"error: no such folder: {folder}")

    pdfs = sorted(glob.glob(os.path.join(folder, "*.pdf")))
    pngs = sorted(glob.glob(os.path.join(folder, "research_summary*.png")))
    qmds = sorted(glob.glob(os.path.join(folder, "*.qmd")))
    if not pdfs:
        sys.exit(f"error: no PDF found in {folder}")
    if not pngs:
        sys.exit(f"error: no research_summary*.png found in {folder}")

    meta = parse_qmd(qmds[0]) if qmds else {}
    for key in ("title", "venue", "desc", "doi"):
        if getattr(args, key, None):
            meta[key] = getattr(args, key)
    for key in ("title", "venue", "desc"):
        if not meta.get(key):
            sys.exit(f"error: could not determine {key}; pass --{key}")

    slug = args.slug or slugify(meta["title"])
    manifest = load_manifest()

    # A hand-picked slug can differ from the one derived from the title. Without
    # this check a re-run would silently add a duplicate card instead of
    # updating the existing one (and leave the old PDF deployed).
    if not args.slug and not any(e["slug"] == slug for e in manifest):
        clash = next((e for e in manifest
                      if e["title"].strip().lower() == meta["title"].strip().lower()), None)
        if clash:
            sys.exit(
                f'error: "{meta["title"]}" is already on the site under the slug '
                f'"{clash["slug"]}", but this run would create "{slug}".\n'
                f'       To update it:  --slug {clash["slug"]}\n'
                f'       To add it as a separate entry:  --slug {slug}')

    # Re-running on a folder should refresh the facts (title/venue/doi) from the
    # source but keep any prose and keywords that were curated by hand.
    prior = next((e for e in manifest if e["slug"] == slug), {})
    entry = {
        "slug": slug,
        "title": meta["title"],
        "venue": meta["venue"],
        "desc": args.desc or prior.get("desc") or meta["desc"],
        "doi": meta.get("doi", "") or prior.get("doi", ""),
        "search_desc": args.search_desc or prior.get("search_desc") or
            f'One-page summary of the {meta["venue"].split(" · ")[0]} paper.',
        "keywords": [k.strip() for k in args.keywords.split(",")] if args.keywords
                    else prior.get("keywords", []),
    }
    if prior:
        print("  (updating an existing entry; curated text and keywords kept)")

    pdf_dst = os.path.join(SITE, f"summary-{slug}.pdf")
    thumb_dst = os.path.join(SITE, f"summary-{slug}-thumb.png")

    print(f"summary: {entry['title']}  ({entry['venue']})")
    print(f"  slug   : {slug}")
    print(f"  doi    : {entry['doi'] or '(none)'}")
    print(f"  pdf    : {os.path.basename(pdfs[0])} -> {os.path.basename(pdf_dst)}")
    print(f"  thumb  : {os.path.basename(pngs[0])} -> {os.path.basename(thumb_dst)} ({THUMB_WIDTH}px)")

    if args.dry_run:
        print("\n(dry run — nothing written)\n")
    else:
        shutil.copy2(pdfs[0], pdf_dst)
        shutil.copy2(pngs[0], thumb_dst)
        subprocess.run(["sips", "-Z", str(THUMB_WIDTH), thumb_dst],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)

    entries = [e for e in load_manifest() if e["slug"] != slug]
    entries.insert(0, entry)              # newest first
    if not args.dry_run:
        save_manifest(entries)
    regen(entries, dry_run=args.dry_run)

    if not args.dry_run:
        print("\nNext: review the page, then commit design-port/ and scripts/.")


def main():
    p = argparse.ArgumentParser(description="Add a research summary to the website.")
    p.add_argument("folder", nargs="?", help="path to a research_summary/ folder")
    p.add_argument("--regen", action="store_true", help="rebuild site blocks from summaries.json")
    p.add_argument("--dry-run", action="store_true", help="show what would change")
    p.add_argument("--slug"), p.add_argument("--title"), p.add_argument("--venue")
    p.add_argument("--desc"), p.add_argument("--doi"), p.add_argument("--keywords")
    p.add_argument("--search-desc", dest="search_desc")
    args = p.parse_args()

    if args.regen:
        regen(load_manifest(), dry_run=args.dry_run)
    elif args.folder:
        add(args.folder, args)
    else:
        p.print_help()


if __name__ == "__main__":
    main()
