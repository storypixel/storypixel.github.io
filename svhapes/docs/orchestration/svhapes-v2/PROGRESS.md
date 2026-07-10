# Svhapes v0.2 Geometry Helpers — Progress

**Lane:** Feature
**Status:** Complete
**Updated:** 2026-07-10 15:08 CDT
**Current step:** None — v0.2.1 released and live

## Outcome status

The geometry helpers, five catalog presets, copyable demo recipes, docs, validation, npm package, and mounted site build are complete. `svhapes@0.2.1` is public/latest and the iamnotsam deployment serves the 23-shape catalog.

## Work items

| ID | Result | Status | Owner | Evidence/notes |
|---|---|---|---|---|
| T-001 | Fillet/repeating builders | Complete | Main | `src/builders.js`, bounded delegated outputs |
| T-002 | Superellipse builder | Complete | Main | Ellipse-to-squircle exponent contract |
| T-003 | Focused tests/build | Complete | Main | 12/12 tests, generated check, pack dry-run |
| T-004 | Catalog presets | Complete | Main | 23 deterministic shape IDs |
| T-005 | Demo recipes | Complete | Main | Three live copyable Builder cards |
| T-006 | Docs/agent guidance | Complete | Main | README, llms.txt, AGENTS.md |
| T-007 | npm v0.2.1 release | Complete | Main | Registry metadata, CDN, and clean install pass |
| T-008 | Site refresh/live verification | Complete | Main | Pages run `29119807115` passed; live query serves 23 shapes |

## Validation evidence

| Check | Result | Evidence |
|---|---|---|
| Existing + new regression suite | Pass | 12/12 tests |
| Generated artifacts | Pass | `npm run check` current with 23 shapes |
| Package contents | Pass | `npm run pack:check`, 15 files |
| Desktop browser | Pass | 23 cards, 3 Builders, 3 Motion cards, no overflow |
| 390px browser | Pass | `scrollWidth === clientWidth === 390`, no overflow |
| Browser console | Pass | 0 errors after reload |
| Site build | Pass | `npm run build` in storypixel.github.io |
| npm publication | Pass | `npm view` reports `0.2.1` latest; registry install/import/CLI smoke pass |
| Live iamnotsam demo | Pass | `/svhapes/` and catalog query return 200 with 23-shape v0.2.1 content |

## Decisions and changed assumptions

- Use normalized 0–100 points throughout, matching v0.1.
- Treat fillet radius as a ratio of the shorter adjacent edge (0–0.5), so the same recipe scales responsively.
- Keep repeating helpers deterministic wrappers around the existing edge/radial contracts rather than inventing a second syntax.

## Risks, blockers, and approval gates

- No current blocker.
- v0.2.0 remains an un-published Git tag from the first release attempt; fixes are released as `v0.2.1` per review guidance.

## Repository state

- **Worktree:** `/Users/swilson/projects/command-center/projects/active/svhapes`
- **Branch:** `main`
- **Relevant changes:** `v0.2.1` is tagged and pushed; site master contains the matching submodule and deployment.
- **Unrelated user changes preserved:** Yes.

## Next action

Maintain future shape additions from `src/definitions.js`; regenerate, test, and publish only with an explicit version decision.
