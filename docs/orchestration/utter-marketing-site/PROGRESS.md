# Utter Marketing Site — Progress

**Lane:** Feature
**Status:** Active
**Updated:** 2026-10-04 17:50 CT
**Current step:** T-006 — Publication, waiting at the explicit push gate

## Outcome status

The complete marketing, support, and privacy site is implemented and locally verified. Three App Store-ready Mac screenshots are also complete. Publication is the only remaining step and requires the user’s explicit instruction to push.

## Work items

| ID | Result | Status | Owner | Evidence/notes |
|---|---|---|---|---|
| T-001 | Current Utter UI assets | Complete | Main | Four assets rendered from current Utter source and visually inspected |
| T-002 | Accurate Apple-facing copy | Complete | Main | Source review + official Apple requirements complete |
| T-003 | Marketing page | Complete | Main | Responsive `/utter/` with real app imagery and current release link |
| T-004 | Privacy and support pages | Complete | Main | `/utter/privacy/` and `/utter/support/` built with direct contact |
| T-005 | Local validation | Complete | Main | Production build passes; routes, assets, desktop/mobile renders, and screenshot dimensions verified |
| T-006 | Publication | Pending | Main | Explicit push gate required |

## Validation evidence

| Check | Result | Evidence |
|---|---|---|
| Apple privacy URL requirement | Pass | Apple states a privacy policy URL is required for all apps |
| Apple support/marketing URL fields | Pass | Support URL is the user-support site; marketing URL is the app information site |
| Public release availability | Pass | `storypixel/utter-releases` exposes Utter 0.1.3 DMG |
| Marketing, support, and privacy routes | Pass | Source and production output contain all three static directory indexes |
| Responsive rendering | Pass | 1440×900 desktop and 390×844 mobile browser captures reviewed |
| App Store screenshot dimensions | Pass | Three images verified at 1440×900 |
| Production integration | Pass | `npm run build` completed with exit code 0 on 2026-10-04 |
| GitHub Pages target | Pass | Pages reports `iamnotsam.com`, HTTPS enforced, source branch `gh-pages`, status `built` |
| Deployment path | Pass | Active workflow deploys pushes to `master`, runs the production build, and publishes `dist` to `gh-pages` |
| Deployment history | Pass | Latest three `Deploy to GitHub Pages` runs completed successfully |
| Pre-publication live check | Expected pending state | All three final URLs currently return HTTP 404, confirming publication still remains |

## Decisions and changed assumptions

- Use the existing iamnotsam.com GitHub Pages project rather than a separate hosting product.
- Use static nested routes so the Apple URLs remain stable and do not depend on client-side routing.
- Use real app-rendered screenshots; do not generate fake UI imagery.

## Risks, blockers, and approval gates

- Publishing remains gated on the repository rule requiring the literal instruction “push.”
- Existing Calcuweight changes are unrelated and preserved.

## Repository state

- **Worktree:** `/Users/swilson/projects/command-center/projects/active/storypixel.github.io`
- **Branch:** `master`
- **Relevant changes:** New `public/utter/**` site and assets plus `docs/orchestration/utter-marketing-site/**`
- **Unrelated user changes preserved:** Yes; Calcuweight files and assets are untouched

## Next action

Receive explicit push authorization, commit only the Utter files after commit-message approval, publish, then verify all three HTTPS routes.
