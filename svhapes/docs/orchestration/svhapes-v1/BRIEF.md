# Svhapes v0.1 — Brief

**Lane:** Program
**Status:** Active
**Updated:** 2026-07-10

## Outcome

Anyone can include Svhapes as plain CSS or JavaScript, browse a substantial visual catalog, and copy a complete shape into a project without adopting a framework. Coding agents can discover the same catalog and contracts without scraping the demo UI. The library is public at `storypixel/svhapes` and its demo is available at `iamnotsam.com/svhapes/`.

## Critical scenarios

1. A designer browses shapes, filters the catalog, previews one, and copies working HTML/CSS.
2. A developer includes one CSS file and applies a named `.svhape--*` class.
3. A developer imports the ESM generator to create a custom tangent-continuous contour.
4. An agent reads `llms.txt` or `catalog.json`, selects a shape by tags, and emits correct integration code.
5. Sam maintains one source repository while the iamnotsam site mounts the same demo.

## In scope

- MIT-licensed, dependency-free CSS and ESM distribution.
- At least 18 curated, copyable shapes with responsive fallbacks.
- Deterministic Catmull–Rom-to-cubic-Bézier generation with continuity checks.
- Searchable/filterable responsive demo with per-shape copy actions.
- JSON catalog, JSON Schema, `llms.txt`, `AGENTS.md`, and an agent-oriented CLI.
- Public GitHub repository under `storypixel`.
- Demo integration and deployment at `iamnotsam.com/svhapes/`.

## Out of scope

- npm registry publication in v0.1.
- A drag-and-drop visual shape editor.
- SVG path import/export or bitmap masking.
- Guarantees for browsers that do not support `clip-path: shape()` beyond a safe rounded-rectangle fallback.
- Changes to unrelated iamnotsam or Klerb experiences.

## Acceptance criteria

- [ ] A consumer can use a `<link>` and two classes to render any catalog shape.
- [ ] At least 18 catalog entries render and expose copyable HTML and standalone CSS.
- [ ] JavaScript can generate a closed CSS `shape()` from normalized anchors.
- [ ] Automated tests verify closure, deterministic output, catalog validity, and tangent continuity.
- [ ] Agent-facing files describe stable IDs, tags, output formats, and integration constraints.
- [ ] The demo is usable with keyboard, narrow viewport, and reduced motion.
- [ ] `https://github.com/storypixel/svhapes` is public and contains the release source.
- [ ] `https://iamnotsam.com/svhapes/` serves the demo successfully after deployment.

## Constraints and existing assets

- Preserve the smooth closed-spline technique proven in Klerb.
- The iamnotsam site deploys from `storypixel/storypixel.github.io` through GitHub Pages.
- Consumers should not need React, a bundler, or a build step.
- The name is intentionally spelled **Svhapes**.

## Risks and gates

- `clip-path: shape()` support varies; every class needs a readable fallback and the demo must disclose support.
- Publishing the repository and deploying the site are external mutations explicitly authorized by the current user request.
- Site integration must not disturb the existing dirty command-center root; work stays inside independent repositories.
