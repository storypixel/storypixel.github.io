# Svhapes — Product Requirements

**Status:** Accepted
**Updated:** 2026-07-10
**Source:** User request in the Klerb shape-design task

## Problem and vision

Interesting CSS container shapes are usually trapped in isolated demos, difficult path math, or one-off snippets. Svhapes should turn smooth organic contours into a small public library: easy to browse, easy to copy, easy to include, and unusually easy for coding agents to understand and reuse.

## Users and critical scenarios

### Visual builders

1. Browse many distinct shapes without reading implementation details.
2. Copy the exact HTML and CSS for a chosen shape.
3. Understand desktop support and mobile fallback at a glance.

### Front-end developers

1. Include a ready-made CSS distribution from a repository CDN.
2. Import the generator to build a controlled custom contour.
3. Override color, shadow, fallback radius, and contour custom properties.

### Coding agents

1. Read a concise machine-oriented entrypoint.
2. Query stable shape IDs and semantic tags from JSON.
3. Produce a complete, bounded snippet without inventing paths or class names.
4. Validate generated definitions against a published schema.

## Required capabilities

### Shape library

- Named CSS classes with a shared base class and shadow wrapper.
- Curated rectangular, soft, scalloped, asymmetric, and blob-like silhouettes.
- A safe fallback when advanced clipping is unavailable or disabled responsively.

### JavaScript engine

- Convert normalized closed anchors into cubic Bézier `shape()` syntax.
- Configure tension and output precision.
- Inspect tangent continuity and serialize CSS.

### Catalog experience

- Search and category filters.
- Live visual cards with useful sample content.
- Copy HTML, copy CSS, and copy agent prompt actions.
- Include instructions for CSS-only and ESM use.

### Agent interface

- `llms.txt` orientation.
- `dist/catalog.json` as the canonical generated catalog.
- JSON Schema for source definitions.
- CLI commands for `list`, `show`, `css`, and `prompt`.

## Quality requirements

- No runtime dependencies.
- Valid semantic HTML, keyboard-operable controls, visible focus, and reduced-motion handling.
- Deterministic generated artifacts committed to the repository.
- No horizontal overflow at 390px.
- Shape content remains readable even when clipping is unsupported.

## Scope boundary

### In scope

- Public v0.1 source, distribution, docs, tests, demo, and iamnotsam deployment.

### Explicitly out of scope

- npm publication, hosted API, accounts, persistence, and collaborative editing.

## Existing assets and constraints

- The Klerb golden-ratio shape supplies one flagship catalog entry.
- Chia supplies the design reference: expressive editorial typography, strong color identity, plain CSS, and a no-build consumer story.
- GitHub account `storypixel` is already authenticated locally.

## Success measures

- Eighteen or more valid catalog entries.
- Complete copy output for every entry.
- Automated validation passes.
- Public repo and live demo URLs return successfully.

## Open product questions

- npm publication and an interactive anchor editor are candidates for a later release, not blockers for v0.1.
