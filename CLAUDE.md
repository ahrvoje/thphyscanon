# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Theoretical Physics Canon** — a curated, static catalog of authoritative books and articles in theoretical physics, hosted on GitHub Pages at https://ahrvoje.github.io/thphyscanon/. No build system, no bundler, no package manager. Pure HTML/CSS/JS served directly.

## Architecture

The site is a single-page application with two data sources:

1. **`index.html`** (~1000 lines) — Contains all catalog entries as inline `<div class="entry">` elements organized into `<div class="group">` sections by subject area (General Physics, Classical Mechanics, Electrodynamics, etc.). Entries reference catalog items by `id` attribute.

2. **`catalog/thphyscanon_catalog.json`** (~1200 lines) — Structured metadata for entries that have expanded detail cards (images, ISBN, OCLC, DOI, links, subjects, tags, notes). Keyed by numeric ID matching the `id` attribute on `.entry` divs in the HTML.

### How rendering works

`src/render_catalog.js` is the main JS file. On page load, `renderPage()`:
- Calls `load_elements()` which fetches the JSON catalog, then for each `.entry[id]` in the HTML, creates a detail card (`bookcard` or `articlecard`) and inserts it after the entry
- Adds tier markers (colored left-border indicators) to entries with `tier` attributes
- Adds anchor links to group titles
- Initializes uFuzzy search over all entry text content

### Key conventions

- **Entries without an `id`**: Listed in `index.html` only (no expanded detail card). These are catalog items without detailed metadata yet.
- **Entries with an `id`**: Have a corresponding key in `thphyscanon_catalog.json` and get an expandable detail card rendered.
- **Tier system**: Entries have `tier="1"`, `tier="2"`, or `tier="3"` attributes. Tier 1 = foundational/canonical, Tier 3 = supplementary. Tiers can be toggled via checkboxes in the header.
- **Images**: Stored as WebP in `resources/images/`, named `ID{NNNN}_ED{NNN}_{ShortName}.webp`. Originals kept in `resources/original_images/`.
- **Article types**: `article-discovery`, `article-review-seminal`, `article-review-living` — rendered in Chicago citation style.
- **Search**: Uses uFuzzy (vendored minified in `src/uFuzzy.min.js`) with latinization for diacritics-insensitive fuzzy matching.

## Development

No build step. Open `index.html` in a browser or serve with any static file server:

```
python -m http.server 8000
```

The JSON catalog is fetched via `fetch()`, so a local server is needed (can't open `index.html` as `file://` due to CORS).

## File Layout

- `index.html` — Main page with all entries and UI structure
- `catalog/thphyscanon_catalog.json` — Detailed metadata for cataloged items
- `src/render_catalog.js` — All rendering, filtering, search, and UI logic
- `src/load_catalog.js` — Simple async fetch wrapper for the catalog JSON
- `src/uFuzzy.min.js` — Vendored fuzzy search library
- `src/thphyscanon.css` — All styles; uses Linux Biolinum font family
- `resources/images/` — WebP cover images referenced by catalog entries
- `resources/original_images/` — Source images before WebP conversion

## Adding a New Entry

1. Add a `<div class="entry" tier="N">` in the appropriate `<div class="group">` section of `index.html`, following Chicago-style citation format.
2. If adding detailed metadata: assign a numeric `id` to the entry div, then add a corresponding keyed object in `thphyscanon_catalog.json` with all fields (type, author, title, publisher, isbn, image, etc.).
3. If adding images: place WebP files in `resources/images/` following the `ID{NNNN}_ED{NNN}_{Name}.webp` naming pattern.
