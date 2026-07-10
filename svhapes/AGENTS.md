# Svhapes contributor guide

Svhapes is a dependency-free CSS and JavaScript shape library. Its public API is small on purpose.

## Source of truth

- Edit curve math in `src/core.js`.
- Edit reusable geometry builders in `src/builders.js`.
- Add or change catalog shapes in `src/definitions.js`.
- Never hand-edit `dist/`; run `npm run build`.
- Keep human documentation, `llms.txt`, CLI output, and `dist/catalog.json` aligned.

## Shape rules

- IDs are stable kebab-case API identifiers.
- Points use percentage coordinates in a 100 × 100 reference box.
- Closed Catmull–Rom conversion must remain tangent-continuous after configured rounding.
- Every definition needs a conventional `fallbackRadius` and a conservative `safeInset`.
- Decorative clipping must not be the only way important information is conveyed.

## Validation

Run before committing:

```bash
npm test
npm run check
npm run pack:check
```

For demo changes, also verify desktop, 390px width, keyboard focus, reduced motion, copy actions, and browser console errors.

## Release boundaries

- Do not publish to npm without explicit authority.
- Do not change the public repo visibility or iamnotsam deployment target implicitly.
- Generated artifacts are committed so CDN and copy/paste consumers receive deterministic files.
