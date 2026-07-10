# Svhapes v0.2 Geometry Helpers — Execution Plan

**Lane:** Feature
**Target:** Public npm minor release and live demo refresh
**Authority:** Current request + applicable `AGENTS.md` + accepted v0.1 decisions

## Outcomes and non-goals

- **Outcome:** Fillet, repeating-pattern, and superellipse helpers are tested, documented, published, and demonstrated.
- **Non-goal:** Browser-level implementation of open CSSWG layout proposals.

## Validation strategy

| Layer | Evidence | Command/tool | Required? |
|---|---|---|---|
| Focused | Builder validation and geometry invariants | `npm test` | Yes |
| Integration | Generated CSS/catalog/package contents | `npm run check && npm run pack:check` | Yes |
| User journey | Desktop/mobile demo recipes and no overflow | Browser + site build | Yes |
| Release | npm metadata, clean install, Pages deployment | npm/GitHub Actions/HTTP | Yes |

## Workstreams

### W1 — Geometry API

- **Owner/files:** Main; `src/builders.js`, `src/index.js`, `test/`
- **Depends on:** v0.1 generator contract
- **Provides:** Fillet, repeating edge/radial, and superellipse builders
- **Tasks:**
  - [ ] T-001 — Implement validated fillet and repeating helpers.
  - [ ] T-002 — Implement validated superellipse helper and export APIs.
  - [ ] T-003 — Add focused tests and generated-build checks.
- **Integration check:** All outputs remain normalized and deterministic.

### W2 — Catalog and docs

- **Owner/files:** Main; `src/definitions.js`, `README.md`, `llms.txt`, `index.html`, `demo/`
- **Depends on:** W1
- **Provides:** Presets, snippets, and agent guidance
- **Tasks:**
  - [ ] T-004 — Add curated squircle/repeating/fillet presets.
  - [ ] T-005 — Add copyable generator recipes to the demo.
  - [ ] T-006 — Document CSSWG-inspired use cases and compatibility guidance.
- **Integration check:** IDs, snippets, and generated catalog stay in sync.

### W3 — Release and site

- **Owner/files:** Main; package metadata, generated outputs, site submodule
- **Depends on:** W1 and W2
- **Provides:** `0.2.0` npm package and live iamnotsam demo
- **Tasks:**
  - [ ] T-007 — Bump, test, publish, tag, and push v0.2.1.
  - [ ] T-008 — Update site submodule, build, deploy, and verify live output.
- **Integration check:** npm and site reference the same commit/version.

## Dependency graph

```text
T-001 + T-002 -> T-003 -> T-004 -> T-005 + T-006 -> T-007 -> T-008
```

## Approval gates

| Gate | Trigger | Required authority | Status |
|---|---|---|---|
| G-001 | Publish `svhapes@0.2.0` | Current user request | Approved |
| G-002 | Push site refresh and deploy Pages | Current user request | Approved |

## Risks and rollback

| Risk | Mitigation | Rollback |
|---|---|---|
| A helper produces awkward geometry | Bounds, continuity, and deterministic snapshot tests | Remove preset/helper without changing v0.1 IDs |
| CDN/site cache serves mixed versions | Pin submodule commit and verify HTTP responses after deployment | Revert site bump |
