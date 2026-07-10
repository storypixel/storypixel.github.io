# Svhapes v0.1 — Execution Plan

**Lane:** Program
**Target:** Public v0.1 and live iamnotsam demo
**Authority:** Current request + command-center and project instructions + accepted decisions

## Outcomes and non-goals

- **Outcome:** A public, tested shape library and copy/paste catalog available from GitHub and iamnotsam.
- **Non-goal:** npm publication or a graphical shape editor.

## Validation strategy

| Layer | Evidence | Command/tool | Required? |
|---|---|---|---|
| Focused | Curve math, schema, and CLI output | `npm test` | Yes |
| Integration | Generated files and package contents | `npm run build`, `npm pack --dry-run` | Yes |
| User journey | Search, filters, copy actions, responsive fallback | Local browser | Yes |
| Site | iamnotsam build with mounted submodule | `npm run build` in site repo | Yes |
| Release | Public repo and live URLs | GitHub + HTTP/browser verification | Yes, authorized |

## Workstreams

### W1 — Product and integration evidence

- **Owner/files:** Main + read-only delegated research; orchestration artifacts only
- **Depends on:** None
- **Provides:** Accepted architecture, catalog scope, and release contracts
- **Tasks:**
  - [x] T-001 — Verify Chia reference, standards support, and iamnotsam integration.
  - [x] T-002 — Define catalog taxonomy and agent-facing contracts.
- **Integration check:** No material implementation choice remains implicit.

### W2 — Shape engine and distribution

- **Owner/files:** Main; `src/`, `scripts/`, `test/`, `package.json`, generated `dist/`
- **Depends on:** T-001, T-002
- **Provides:** Deterministic generator, 18 definitions, CSS/JSON/CLI distributions, tests
- **Tasks:**
  - [x] T-003 — Implement normalized-anchor validation and Catmull–Rom conversion.
  - [x] T-004 — Author and validate at least 18 curated definitions.
  - [x] T-005 — Generate CSS and machine-readable catalog artifacts.
  - [x] T-006 — Implement and test CLI commands.
- **Integration check:** Build is deterministic, tests pass, and packed contents are complete.

### W3 — Demo and documentation

- **Owner/files:** Main; `index.html`, `demo/`, `README.md`, `llms.txt`, `schema/`, `AGENTS.md`
- **Depends on:** T-004, T-005
- **Provides:** Editorial catalog, copy actions, direct inclusion instructions, agent instructions
- **Tasks:**
  - [x] T-007 — Build accessible responsive catalog and filters.
  - [x] T-008 — Implement HTML, CSS, and agent-prompt copy modes.
  - [x] T-009 — Document CSS, ESM, CLI, schema, fallbacks, and contribution flow.
- **Integration check:** Human and agent interfaces reference the same generated IDs and snippets.

### W4 — iamnotsam integration and release

- **Owner/files:** Main; public Svhapes repo plus `storypixel.github.io` submodule metadata/project data
- **Depends on:** W2, W3
- **Provides:** Public source and live demo
- **Tasks:**
  - [ ] T-010 — Create, commit, and push public `storypixel/svhapes` v0.1.
  - [ ] T-011 — Mount repository at `public/svhapes` and validate the site build.
  - [ ] T-012 — Commit/push the site integration and verify live URLs.
- **Integration check:** GitHub and iamnotsam serve the same tested release.

### W5 — Independent integration review

- **Owner/files:** Review agent, read-only
- **Depends on:** W2, W3, local W4 integration
- **Provides:** Evidence-ranked findings and release recommendation
- **Tasks:**
  - [x] T-013 — Review API contracts, catalog drift, accessibility, and release packaging.
- **Integration check:** High-impact findings are resolved or explicitly recorded.

## Dependency graph

```text
T-001 + T-002 -> T-003 -> T-004 -> T-005 -> T-007 -> T-010 -> T-011 -> T-012
                          \-> T-006    \-> T-008
                                      \-> T-009
                          T-005 + T-007 + T-011 -> T-013 -> T-012
```

## Approval gates

| Gate | Trigger | Required authority | Status |
|---|---|---|---|
| G-001 | Create and push public `storypixel/svhapes` | Current user request | Approved |
| G-002 | Push iamnotsam integration and deploy GitHub Pages | Current user request | Approved |
| G-003 | Publish npm package | New explicit request | Out of scope |

## Risks and rollback

| Risk | Mitigation | Rollback |
|---|---|---|
| Advanced shape unsupported | Rounded fallback and support disclosure | Consumers retain readable rectangles |
| Catalog source/output drift | Deterministic build and clean-tree test | Regenerate from definitions |
| Demo breaks personal site build | Validate submodule and full site build before push | Revert site integration commit |
| Public API is overcommitted too early | Label release v0.1 and keep API surface small | Deprecate before v1.0 |
