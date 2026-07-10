# Svhapes v0.2 Geometry Helpers — Brief

**Lane:** Feature
**Status:** Active
**Updated:** 2026-07-10

## Outcome

Developers can generate common `shape()` geometry without hand-calculating corner control points: filleted polygons, repeating edges/radial patterns, and responsive superellipse/squircle containers are available from the JavaScript API, catalog, docs, and demo.

## Critical scenarios

1. A developer rounds an arbitrary normalized polygon with one radius value and keeps it responsive.
2. A developer creates a balanced repeating wave or squircle and copies a working CSS/JS recipe.

## In scope

- Add deterministic, dependency-free builders and tests.
- Add curated catalog presets and generated CSS/JSON output.
- Add copyable demo recipes and agent-facing documentation.
- Publish a minor npm release and refresh the iamnotsam submodule/demo.

## Out of scope

- Implementing browser layout behavior (`shape-inside`, element hit-testing, or new CSS syntax).
- Replacing `path()` or shipping a visual editor.

## Acceptance criteria

- [ ] New builders validate inputs, preserve normalized bounds, and have regression tests.
- [ ] Catalog and generated artifacts include the new presets and are deterministic.
- [ ] Demo exposes copyable examples with reduced-motion-safe existing motion examples.
- [ ] `svhapes@0.2.1` is publicly installable and the live demo serves the same release.

## Constraints and existing assets

- Keep the existing normalized 0–100 coordinate contract and CSS `shape()` fallback behavior.
- Preserve current 18+ catalog IDs, CLI contracts, and public repository history.

## Risks and gates

- New math must not introduce self-intersections or out-of-bounds points; tests and generated validation are the mitigation.
- npm publication and GitHub Pages refresh are authorized by the user’s request to do all recommended features.
