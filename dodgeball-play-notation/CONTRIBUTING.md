# Contributing

This repo is the **standalone editor** for DBN. DBN itself — the notation spec
and parser — is **canonical and lives elsewhere**. That split drives every rule
here.

## The one hard rule: DBN is canonical, do not fork it

- `vendor/dbn.js` (parser) and `vendor/play-animator.js` (engine) are **vendored
  copies**. Do **not** edit them here. Notation or engine changes go to
  [storypixel/dodgeball-play-animator][engine] **first**, then re-vendor:
  ```bash
  cp ~/…/dodgeball-play-animator/{dbn.js,play-animator.js,NOTATION.md} ./vendor/  # then re-add the vendor header
  ```
- `NOTATION.md` here is a **synced copy** of the canonical spec — edit it
  upstream, not here.
- Found a parser bug or want a new DBN feature? **Route it through the fleet**
  (california-tom / zerocool) so the notation evolves in one place. Don't patch
  around it in the editor.

## What you can change here

The editor and its docs:

- `src/editor.js` — UI + the `window.DBNEditor` automation API
- `src/dbn-headless.js` — pure-Node DBN → JSON / static SVG
- `index.html`, docs (`README`, `GLOSSARY`, `DRIVING`), `examples/*.dbn`

## Conventions

- **No build step, no runtime deps.** Plain JS that runs in the browser and Node.
- **Examples must stay faithful.** Every `examples/*.dbn` must parse and, where a
  golden exists in `tests/fixtures/plays.js`, compile byte-identical to it.
- **Agent-drivability is a feature, not a nicety.** Keep `data-testid` + ARIA on
  every control, the `window.DBNEditor` surface stable, and the deep-link params
  working. If you add a control, give it a testid and document it in
  [`DRIVING.md`](DRIVING.md).

## Running

```bash
python3 -m http.server 8770   # → http://localhost:8770/index.html
node tests/parse.test.js      # parity (vs golden plays.js) + headless smoke
```

## Adding an example play

1. Write `examples/<id>.dbn` (see [`NOTATION.md`](NOTATION.md)). Use `[Id "<id>"]`.
2. Add it to the `example-select` dropdown in `index.html`.
3. `node tests/parse.test.js` — it must parse; if `<id>` has a golden, it must match.

[engine]: https://github.com/storypixel/dodgeball-play-animator
