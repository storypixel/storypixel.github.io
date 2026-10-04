# Utter Marketing Site — Execution Plan

**Lane:** Feature
**Target:** Current session
**Authority:** Current request + command-center workflow + existing iamnotsam.com project

## Outcomes and non-goals

- **Outcome:** Complete Apple-facing marketing, support, and privacy pages under iamnotsam.com.
- **Non-goal:** Modify Utter’s application behavior or unrelated portfolio content.

## Validation strategy

| Layer | Evidence | Command/tool | Required? |
|---|---|---|---|
| Focused | HTML semantics, links, assets, metadata | local validation script | Yes |
| Integration | Existing Vite site still builds | `npm run build` | Yes |
| User journey | Desktop and mobile rendered screenshots | browser preview | Yes |
| Release | Public HTTPS routes respond | GitHub Pages + HTTP checks | If push is authorized |

## Workstreams

### W1 — Product evidence and copy

- **Owner/files:** Main agent; Utter read-only source + new screenshot assets
- **Depends on:** None
- **Provides:** Accurate claims, real UI imagery, Apple checklist
- **Tasks:**
  - [x] T-001 — Render and inspect current Utter UI assets.
  - [x] T-002 — Finalize accurate product, support, and privacy copy from code and Apple guidance.
- **Integration check:** Every public claim maps to current app behavior or Apple documentation.

### W2 — Static public routes

- **Owner/files:** Main agent; `public/utter/**`
- **Depends on:** T-001, T-002
- **Provides:** Marketing, privacy, and support pages
- **Tasks:**
  - [x] T-003 — Build the responsive marketing page and shared visual system.
  - [x] T-004 — Build the privacy and support routes with complete metadata and navigation.
- **Integration check:** All routes and assets work from a nested GitHub Pages path.

### W3 — Verification and publication

- **Owner/files:** Main agent; no unrelated files
- **Depends on:** T-003, T-004
- **Provides:** Validated build and live URLs
- **Tasks:**
  - [x] T-005 — Validate links, responsive renders, accessibility basics, and production build.
  - [ ] T-006 — Publish and verify the three HTTPS URLs if the push gate is satisfied.
- **Integration check:** Live pages match the verified local build.

## Dependency graph

```text
T-001 + T-002 -> T-003 -> T-004 -> T-005 -> T-006
```

## Approval gates

| Gate | Trigger | Required authority | Status |
|---|---|---|---|
| G-001 | Push website source to GitHub Pages | User must explicitly say “push” | Pending |

## Risks and rollback

| Risk | Mitigation | Rollback |
|---|---|---|
| Existing dirty site work is overwritten | Add isolated files only; inspect task-scoped diff | Remove only new `public/utter` files |
| Privacy language overpromises | Derive statements from source and name network-only model/update operations | Correct static privacy page |
| Nested route fails on GitHub Pages | Use static directory indexes and root-relative assets | Serve from the existing React router instead |
