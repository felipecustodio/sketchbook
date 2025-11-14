#!/usr/bin/env python3
"""Generate the sketch gallery landing page."""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SITE_PATH = REPO_ROOT / "site" / "index.html"
SKETCHES_DIR = REPO_ROOT / "sketches"
THUMBNAIL_MANIFEST_PATH = REPO_ROOT / "site" / "data" / "thumbnails.json"

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <title>Creative Coding Sketchbook</title>
    <link rel=\"stylesheet\" href=\"css/tufte.css\" />
    <link rel=\"stylesheet\" href=\"css/site.css\" />
  </head>
  <body>
    <div class=\"page-shell\">
      <header class=\"hero glass\">
        <div class=\"hero-meta\">
          <p class=\"home-link\"><span>sketchbook</span></p>
          <h1>Creative coding sketchbook</h1>
          <p class=\"lead\">A collection of {count} experiments built with Processing and P5.js.</p>
        </div>
        <figure class=\"hero-figure\">
          <img src=\"img/3d_harmonograph.gif\" alt=\"3D Harmonograph animation\" loading=\"lazy\" />
          <figcaption>Rendered with Processing.</figcaption>
        </figure>
      </header>

      <main>
        <section class=\"glass\">
          <h2>Sketch gallery</h2>
          <p>Browse the projects below to explore their source and live demos.</p>
          <div class=\"sketch-grid\">
{cards}
          </div>
        </section>

        <section class=\"glass utility-section\">
          <h2>Starters &amp; utilities</h2>
          <p>
            Use the scripts inside <code>scripts/</code> to bootstrap new sketches from the templates in
            <code>templates/</code>.
          </p>
          <ul class=\"utility-list\">
            <li><code>scripts/new_p5</code> &mdash; copy the P5.js starter.</li>
            <li><code>scripts/new_pde</code> &mdash; copy the Processing starter and rename the main sketch.</li>
          </ul>
        </section>
      </main>
    </div>
  </body>
</html>
"""

CARD_TEMPLATE = """            <a class=\"sketch-card\" href=\"../sketches/{slug}/\" data-slug=\"{slug}\">
              <div class=\"card-media\">
{media}
              </div>
              <div class=\"card-body\">
                <h3>{title}</h3>
                <p>Open sketch</p>
              </div>
            </a>"""

IMG_TEMPLATE = """                <img src=\"{src}\" alt=\"{title} thumbnail\" loading=\"lazy\" />"""
PLACEHOLDER_TEMPLATE = (
    "                <div class=\"card-placeholder\" role=\"img\" "
    "aria-label=\"Placeholder art for {title}\"></div>"
)


def load_thumbnail_manifest() -> dict[str, str]:
    if not THUMBNAIL_MANIFEST_PATH.exists():
        return {}
    try:
        data = json.loads(THUMBNAIL_MANIFEST_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}
    return {str(key): str(value) for key, value in data.items()}


def format_title(slug: str) -> str:
    raw = slug.replace("_", " ").replace("-", " ")
    words: list[str] = []
    for chunk in raw.split():
        tokens = re.findall(r"[A-Za-z]+|[0-9]+", chunk)
        i = 0
        while i < len(tokens):
            token = tokens[i]
            nxt = tokens[i + 1] if i + 1 < len(tokens) else None
            if token.isalpha() and len(token) == 1 and nxt and nxt.isdigit():
                words.append(token.upper() + nxt)
                i += 2
                continue
            if token.isdigit() and nxt and nxt.isalpha() and len(nxt) == 1 and nxt.isupper():
                words.append(token + nxt)
                i += 2
                continue
            if token.isdigit():
                words.append(token)
            elif token.isupper():
                words.append(token)
            else:
                words.append(token.capitalize())
            i += 1
    return " ".join(words)


def build_cards(thumbnails: dict[str, str]) -> str:
    cards = []
    if not SKETCHES_DIR.exists():
        return ""

    for entry in sorted(SKETCHES_DIR.iterdir(), key=lambda p: p.name.lower()):
        if not entry.is_dir():
            continue
        slug = entry.name
        title = format_title(slug)
        thumbnail_src = thumbnails.get(slug)
        if thumbnail_src:
            media = IMG_TEMPLATE.format(
                src=f"data:image/png;base64,{thumbnail_src}",
                title=html.escape(title),
            )
        elif (entry / "thumbnail.png").exists():
            media = IMG_TEMPLATE.format(
                src=f"../sketches/{html.escape(slug)}/thumbnail.png",
                title=html.escape(title),
            )
        else:
            media = PLACEHOLDER_TEMPLATE.format(title=html.escape(title))
        cards.append(
            CARD_TEMPLATE.format(
                slug=html.escape(slug),
                title=html.escape(title),
                media=media,
            )
        )
    return "\n".join(cards)


def main() -> None:
    thumbnails = load_thumbnail_manifest()
    cards_html = build_cards(thumbnails)
    sketch_count = sum(1 for p in SKETCHES_DIR.iterdir() if p.is_dir()) if SKETCHES_DIR.exists() else 0
    SITE_PATH.write_text(
        PAGE_TEMPLATE.format(cards=cards_html, count=sketch_count),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
