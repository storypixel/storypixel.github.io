# Contributing

This repo is the **standalone editor** and current canonical source for DBN.
The source headers supersede the older upstream-vendoring instructions.

## The one hard rule: DBN is canonical, do not fork it

- `vendor/dbn.js` (parser), `vendor/play-animator.js` (engine), and `NOTATION.md`
  evolve here. The [animator repo][engine] carries a synced mirror, not an
  independent implementation. Do not work around parser behavior in the editor.
- Run `scripts/stamp-version.sh` when preparing changed assets for release.
  Synchronizing mirrors and deploying remain separate, explicitly authorized steps.

## What you can change here

The parser, engine, spec, editor and docs:

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
- **Choreography conventions bind every play.** When their attackers regress
  off the line, our counters pursue only to `deep` (about halfway) — never to
  the line. Conventions like this are enforced by `tests/formations.test.js`;
  if you author a new one, add its test in the same commit.
- **No magic.** Every engine capability ships as notation + spec + test,
  together: a token authors can write, exact semantics in
  [`NOTATION.md`](NOTATION.md), and a regression test. Behavior that can't be
  expressed or escaped in DBN (`(x,y)` is the universal escape) must not be
  added to the engine. See NOTATION.md design rule #2.

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
