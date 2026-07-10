# Svhapes delivery — Research

**Decision informed:** Distribution format, browser fallback, demo architecture, and iamnotsam integration
**Date:** 2026-07-10
**Scope boundary:** v0.1 technical and product choices only; npm publication and a visual editor are excluded.

## Conclusion

Use a static, dependency-free library and demo with generated artifacts. Mount the same public repository under the personal site's `public/svhapes` path. Treat `clip-path: shape()` as a progressive enhancement and always preserve a conventional rounded-rectangle fallback.

## Evidence

| Finding | Type | Source | Freshness |
|---|---|---|---|
| Chia's visible identity emphasizes real CSS, no build step, and no dependencies. | Repository fact | Local Chia screenshot and `storypixel/chia` metadata | 2026-07-10 |
| iamnotsam builds with Vite and deploys `dist/` from pushes to `master`. | Repository fact | `package.json`, `.github/workflows/deploy.yml` | 2026-07-10 |
| The iamnotsam build already initializes recursive git submodules. | Repository fact | `package.json` build script | 2026-07-10 |
| The `storypixel/svhapes` repository name is currently unused. | Repository fact | `gh repo view storypixel/svhapes` | 2026-07-10 |
| The W3C CSS Shapes specification defines `shape()` as responsive CSS path commands whose percentage coordinates resolve against the reference box. | Sourced fact | https://www.w3.org/TR/css-shapes/#shape-function | 2026-07-10 |
| MDN marks `shape()` as newly Baseline 2026 and explicitly warns that older devices/browsers may not support it. | Sourced fact | https://developer.mozilla.org/docs/Web/CSS/basic-shape/shape | 2026-07-10 |
| jsDelivr supports GitHub-hosted files and gives immutable version/tag URLs long-lived caching, favoring a release tag over a branch URL. | Sourced fact | https://github.com/jsdelivr/jsdelivr#usage-documentation | 2026-07-10 |
| Chia's durable reference qualities are its immediate thesis, editorial scale, modular examples, and adjacent usage—not its palette, which differs between the checked-in screenshot and current site CSS. | Repository fact | T-R01 handoff | 2026-07-10 |
| The existing iamnotsam submodule precedent is `public/dodgeball-plays`; Chia itself is linked rather than mounted. | Repository fact | `.gitmodules`, `App.jsx`, T-R01 handoff | 2026-07-10 |

## Options

| Option | Benefits | Costs/risks | Fit |
|---|---|---|---|
| Static CSS + ESM + generated catalog | Copyable, CDN-friendly, inspectable, framework-neutral | Generated outputs must stay synchronized | Recommended |
| React documentation application | Rich component ecosystem | Larger toolchain and weaker copy/paste story | Reject for v0.1 |
| CSS-only with hand-authored paths | Minimal runtime surface | Difficult maintenance and easy continuity errors | Reject |
| Publish demo files separately into iamnotsam | Simple deploy | Duplicated source and drift | Viable but inferior |
| Mount public repo as site submodule | One source, pinned version, existing site pattern | Requires submodule maintenance | Recommended |

## Recommendation

Build an 18-shape generated catalog around a tiny curve engine, serve a subpath-safe static editorial demo, and expose the same data to humans, JavaScript consumers, and agents. Use stable selection metadata—family, use, aspect range, content capacity, safe inset, symmetry, balance, and edge activity—rather than vague “AI-ready” claims.

## Implementation and validation implications

- Build must generate CSS, ESM-accessible catalog data, and `catalog.json` from the same definitions.
- Tests must reject open contours, duplicate IDs, malformed points, and tangent discontinuity beyond rounding tolerance.
- Demo must show a support notice when `CSS.supports('clip-path', 'shape(...)')` is false.
- The site integration should be a submodule pointer plus optional project metadata, not copied library files.
- Repository-root demo assets and catalog fetches must use relative URLs.
- CDN examples must reference immutable `v0.1.0`, never a branch.

## Open questions

- None blocking v0.1.
