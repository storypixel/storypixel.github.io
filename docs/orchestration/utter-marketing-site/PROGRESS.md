# Utter Marketing Site — Progress

**Lane:** Feature
**Status:** Complete
**Updated:** 2026-10-04 18:10 CT
**Current step:** Complete — live deployment verified

## Outcome status

The complete marketing, support, and privacy site is published at iamnotsam.com. Three App Store-ready Mac screenshots are complete, and the live routes and representative production assets match the verified source files byte-for-byte.

## Work items

| ID | Result | Status | Owner | Evidence/notes |
|---|---|---|---|---|
| T-001 | Current Utter UI assets | Complete | Main | Four assets rendered from current Utter source and visually inspected |
| T-002 | Accurate Apple-facing copy | Complete | Main | Source review + official Apple requirements complete |
| T-003 | Marketing page | Complete | Main | Responsive `/utter/` with real app imagery and current release link |
| T-004 | Privacy and support pages | Complete | Main | `/utter/privacy/` and `/utter/support/` built with direct contact |
| T-005 | Local validation | Complete | Main | Production build passes; routes, assets, desktop/mobile renders, and screenshot dimensions verified |
| T-006 | Publication | Complete | Main | Commit `6002d72`; deployment run `37242678088`; all three HTTPS routes return 200 |

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
| Live marketing URL | Pass | `https://iamnotsam.com/utter/` returns 200 with the expected title and canonical URL |
| Live support URL | Pass | `https://iamnotsam.com/utter/support/` returns 200 with direct support contact |
| Live privacy URL | Pass | `https://iamnotsam.com/utter/privacy/` returns 200 with the Data Not Collected disclosure |
| Live artifact integrity | Pass | Published HTML, CSS, and representative screenshot are byte-for-byte matches to source |

## Decisions and changed assumptions

- Use the existing iamnotsam.com GitHub Pages project rather than a separate hosting product.
- Use static nested routes so the Apple URLs remain stable and do not depend on client-side routing.
- Use real app-rendered screenshots; do not generate fake UI imagery.

## Risks, blockers, and approval gates

- The push and commit approval gates were satisfied by the user.
- Existing Calcuweight changes are unrelated and preserved.

## Repository state

- **Worktree:** `/Users/swilson/projects/command-center/projects/active/storypixel.github.io`
- **Branch:** `master`
- **Relevant changes:** Commit `6002d72` added `public/utter/**` and `docs/orchestration/utter-marketing-site/**`
- **Unrelated user changes preserved:** Yes; Calcuweight files and assets are untouched

## Next action

Enter the verified marketing, support, and privacy URLs in App Store Connect and upload the prepared screenshots.
