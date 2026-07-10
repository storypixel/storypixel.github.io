# Svhapes v0.1 — Decisions

**Updated:** 2026-07-10

## Active decisions

### D-001 — Ship as plain CSS plus dependency-free ESM

- **Status:** Accepted
- **Decision:** Provide generated `dist/svhapes.css`, ESM exports, and a small CLI without framework dependencies.
- **Rationale:** The core value is inclusion and copyability, matching the Chia reference's no-build philosophy.
- **Source:** User request and local Chia evidence.
- **Consequences:** React wrappers and npm publication are optional follow-ups rather than release dependencies.
- **Revisit when:** Consumers demonstrate demand for framework packages.

### D-002 — Use generated closed splines as the source of truth

- **Status:** Accepted
- **Decision:** Store normalized anchors and generate cubic Bézier CSS using a closed Catmull–Rom conversion.
- **Rationale:** Authors can adjust meaningful points while the generator preserves smooth joins and deterministic output.
- **Source:** Klerb implementation and user feedback about curve cusps.
- **Consequences:** Generated CSS and JSON are build artifacts; source definitions remain reviewable.
- **Revisit when:** A future editor requires a different curve model.

### D-003 — Make agent support a product surface

- **Status:** Accepted
- **Decision:** Publish stable IDs, semantic tags, exact snippets, a schema, `llms.txt`, and CLI-readable output.
- **Rationale:** Agents should not scrape the visual demo or reverse-engineer CSS.
- **Source:** User request.
- **Consequences:** Catalog changes require schema and generated-output validation.
- **Revisit when:** A standardized package manifest supersedes these interfaces.

### D-004 — Mount the repository into iamnotsam as a submodule

- **Status:** Accepted
- **Decision:** Add the public Svhapes repository at `public/svhapes` in `storypixel.github.io`.
- **Rationale:** The same static demo can serve the repo and the personal-site route without duplicated source.
- **Source:** Existing iamnotsam build and submodule pattern.
- **Consequences:** The site commit records an exact Svhapes version; updates require advancing the submodule pointer.
- **Revisit when:** The personal site adopts a monorepo or remote artifact sync.

### D-005 — Treat the current request as the release authorization

- **Status:** Accepted
- **Decision:** Create and push the public GitHub repository and deploy the iamnotsam demo after local validation.
- **Rationale:** The user explicitly requested both external outcomes.
- **Source:** Current user request.
- **Consequences:** No additional approval prompt is required for these exact targets; unrelated releases remain unauthorized.
- **Revisit when:** Repository owner, visibility, or deployment target changes.

### D-006 — Keep the demo subpath-safe and use one deployment owner

- **Status:** Accepted
- **Decision:** Serve the demo from repository-root `index.html` with only relative asset/fetch URLs, mount it under iamnotsam, and do not separately enable GitHub Pages for the Svhapes repository in v0.1.
- **Rationale:** Relative references make the same files work at `/svhapes/`; a single deployment owner prevents divergent public demos.
- **Source:** T-R01 repository research.
- **Consequences:** The public repository remains CDN/package source while iamnotsam owns the human demo URL.
- **Revisit when:** Svhapes needs an independent docs domain.

## Open questions

| ID | Question | Why it matters | Owner | Blocking? |
|---|---|---|---|---|
| Q-001 | Publish to npm in a later release? | Would provide a versioned package CDN and `npx` installation path. | User | No |
| Q-002 | Add a visual anchor editor? | Would expand Svhapes from catalog to authoring tool. | User | No |
