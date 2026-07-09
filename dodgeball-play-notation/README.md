# DBN Editor — Dodgeball Play Notation

Write a dodgeball play in **DBN** (Dodgeball Notation) and watch it animate.
Deep-linkable, and built to be driven by an agent with zero human clicking.

**▶ Live editor: https://iamnotsam.com/dodgeball-play-notation/**

```
[Play "Home"]
[Badge "defense"]
[Call "Home"]
[Balls "U:45 T:2468"]

1. {They bring it up to the line} :1  T2468-line T4?
2. {Home — pre-counter beats their throw} :1  T4@U5% U5@T4!
```

→ the default setup is implied (back lines, one player per lane); the play
states only who's loaded and what happens. Read it aloud and it's a coach
talking.

## What this is

DBN is a compact, chess-style notation for a dodgeball play: a few tags and
numbered **movetext** beats. It compiles to the JSON the
[dodgeball-play-animator][engine] renders. This repo is the **standalone
editor** on top of canonical DBN — it does not define the notation.

- **DBN is canonical.** The spec ([`NOTATION.md`](NOTATION.md)) and parser
  ([`vendor/dbn.js`](vendor/dbn.js)) are **vendored, not forked**, from the
  [animator repo][engine]. Notation changes go there first, then re-vendor here.
- **The editor only drives the parser + engine** — it can never diverge from DBN.

## Agent-drivable (the point)

A play is just text, so an agent can author and verify one end-to-end.

### The `dbn` CLI — fastest path, no browser

```bash
npm link            # or:  npx dbn <cmd>   ·   or:  node bin/dbn.js <cmd>

dbn examples                      # list the bundled plays
dbn show kill-left                # render each beat as a TEXT court (see it, no DOM)
dbn describe away                 # beat-by-beat play summary in plain words
dbn new "Corner Trap" > ct.dbn    # scaffold a valid play (grammar cheatsheet → stderr)
dbn validate ct.dbn               # parse + report OK/errors (exit 1 on error)
dbn link ct.dbn --autoplay        # live preview URL
cat ct.dbn | dbn show -           # everything reads a file, a bundled name, or stdin
```

The agent authoring loop is: **`new` → edit → `validate` → `show`/`describe` → `link`.**
`dbn show` prints a text court (THEM top, US bottom, `o`=ball, `x`=out) plus an action
line per beat — the same truth the animation renders, so an agent can confirm a play
is right without ever opening a browser.

### In a browser (for the visual)

1. **Deep link** — `…/?dbn=<url-encoded-DBN>` or `…/?play=kill-left` (plus `?autoplay=1`). Get one with `dbn link`.
2. **Window API** — `window.DBNEditor.{load, render, exportSVG, exportJSON, getErrors, getPlay, getText, isReady}`, callable via `evaluate_script`.
3. **Pure-Node headless** — `require("./src/dbn-headless.js")` → `parse(text)`, `toJSON(text)`, `toSetupSVG(text)`.

See **[DRIVING.md](DRIVING.md)** for copy-paste browser examples.

Every control also carries a stable `data-testid` + ARIA label for browser
automation: `dbn-input`, `render-button`, `example-select`, `speed-select`,
`status`, `error-panel`, `preview-stage`.

Plays animate at **2× by default** (realistic pace). Change it with the speed
control (1× / 2× / 3×) or `?speed=<n>`.

**Step-through**: the scrubber shows a marker per beat; the ◀ ▶ buttons step
beat-to-beat and hold. **Keyboard** (focus the preview): space play/pause, ←/→
step beats, R replay. Agents can also drive playback via
`window.DBNEditor.player()` (`play`/`pause`/`seek`/`step`/`replay`).

## Try it locally

```bash
npm run serve                # python3 -m http.server 8770 (on demand — no daemon)
open http://localhost:8770/index.html
node tests/parse.test.js     # parity + headless smoke tests
```

## Layout

| Path | What |
|------|------|
| `index.html` | the editor (served at the Pages root URL) |
| `src/editor.js` | UI wiring + the `window.DBNEditor` automation API |
| `src/dbn-headless.js` | pure-Node: DBN → play JSON + static setup SVG |
| `vendor/dbn.js` | **canonical** DBN parser (vendored, do not edit) |
| `vendor/play-animator.js` | **canonical** render engine (vendored, do not edit) |
| `NOTATION.md` | the DBN spec (synced from the animator repo) |
| `GLOSSARY.md` | every DBN token and what it means |
| `DRIVING.md` | driving the editor programmatically |
| `examples/*.dbn` | worked plays — each parses byte-identical to the engine's goldens |
| `tests/` | parity test + golden `plays.js` fixture |

## Notation, in one screen

- **Court**: each player owns a **lane**; destinations are named depths —
  `line` / `mid` / `deep` / `back` — from each team's own point of view.
  Escapes: a bare number is an exact depth in your lane (`U5-68`); `(x,y)` is
  a fixed point.
- **Pieces**: `U1`…`Un` (us), `T1`…`Tn` (them). Run digits together to fan an
  action across a group: `T2468-line`, `U45?`.
- **Setup**: implied (back lines). `[Balls "U:45 T:2468"]` says who's loaded;
  `[Setup "rush"]` is the opening; explicit `DBF "…"` remains for arbitrary
  positions.
- **Beats**: `1. {label} :dur  <actions>` — actions in a beat are simultaneous.
- **Actions**: run `U3-line`, grab `U9*` (or `U9*2` for two), run+grab
  `U8-line*2`, pass `U8>U5`, throw `U1@T3!`, fake `U3?`, plus
  block/catch/dodge/out. Curves are automatic (`~deg` overrides).

Full reference: [`NOTATION.md`](NOTATION.md) · [`GLOSSARY.md`](GLOSSARY.md).

## License

MIT — see [`LICENSE`](LICENSE).

[engine]: https://github.com/storypixel/dodgeball-play-animator
