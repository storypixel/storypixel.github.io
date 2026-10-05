# Dodgeball Playbook — DBN Editor

Browse the full dodgeball playbook, open a dedicated page for any call, and
watch its movement animate. Every play page includes the coaching call,
description, step sequence, and an optional **DBN** notation editor.

The root URL is the **All Plays** wiki index. `?play=insides`,
`?play=home`, and the other deep links are the individual play pages.
The system remains agent-drivable with zero human clicking.

### Widget style isolation

The play animator is a self-contained visual component. The playbook mounts it
inside an open Shadow DOM root, and the engine installs its stylesheet inside
that render root. Outer-page CSS must never target `.dbp` or its descendants.
`tests/widget-isolation.test.js` enforces this boundary so redesigning the
playbook shell cannot restyle the court, controls, typography, or animation.

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
editor** and the canonical source of the current DBN parser and notation.

- **DBN is canonical here.** The spec ([`NOTATION.md`](NOTATION.md)) and parser
  ([`vendor/dbn.js`](vendor/dbn.js)) evolve here. The [animator repo][engine]
  carries a synced mirror; the `vendor/` path is retained for compatibility.
- **The editor only drives the parser + engine** — it can never diverge from DBN.

## Guided Play Builder

[Build a play](https://iamnotsam.com/dodgeball-play-notation/builder.html) with
lineup, ball holders, conditions, coaching notes, and an editable step sequence.
The form generates DBN and uses the same parser and isolated animator as the
playbook. The DBN tab accepts advanced notation without rewriting it.

Drafts and named plays stay in this browser's local storage. There is no account
or cloud library. Download/import `.dbn` files for durable copies. Share links
carry the complete notation in a URL fragment; anyone with the link can read it.
Returning from edited DBN to the form restores the last guided draft after a
confirmation; it does not reverse-convert arbitrary DBN into form fields.

The guided form supports 1-8 players per side; imported previews are limited to
20 players per side, 100 steps, and 100 KB. Parser callers can opt into allocation
limits with `DBN.parse(text, { maxPlayers: 20, maxSteps: 100 })`.

Run `node tests/builder.browser.test.cjs` with Playwright available (or set
`PLAYWRIGHT_PATH`) and a local server at port 8774. `BUILDER_URL` overrides the URL.

## Agent-drivable

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

### Play prerequisites

Optional DBN tags make requirements machine-readable without changing the
illustrated lineup:

```dbn
[RequiresPlayers "U:4+ T:1-6"]
[RequiresBalls "U:4 T:0-2"]
[Burden "us"]
[ThrowClock "3+"]
[Blocking "allowed"]
```

`4`, `4+`, and `2-4` mean exact, minimum, and inclusive range counts.
Ruleset, adaptation source, player advantage, and opponent-state tags are also
supported. `DBN.checkConditions(play, state)` (or the headless wrapper) returns
`matches: true`, `false`, or `null` for unknown required facts, with field reasons.
It checks declared prerequisites, not full tournament legality. The existing
eight-player default and all old play JSON are unchanged.
See [the language spec](NOTATION.md#play-conditions) and
[six-player training example](examples/conditions/cover-and-retreat.dbn).

See **[DRIVING.md](DRIVING.md)** for copy-paste browser examples.

Every control also carries a stable `data-testid` + ARIA label for browser
automation: `dbn-input`, `render-button`, `example-select`, `status`,
`error-panel`, `preview-stage`.

Plays animate at **2× by default** (realistic pace). Automation can override it
with `?speed=<n>`; the reader UI intentionally has no speed selector.

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
| `index.html` | playbook wiki shell, All Plays index, and play-page layout |
| `src/editor.js` | wiki navigation, play metadata, editor wiring, and the `window.DBNEditor` automation API |
| `builder.html` | guided authoring, local play library, sharing and DBN import/export |
| `src/builder-model.js` | form-to-DBN generation, draft validation and share links |
| `src/builder.js` | form controls, live preview and device-local storage |
| `src/dbn-headless.js` | pure-Node: DBN → play JSON + static setup SVG |
| `vendor/dbn.js` | **canonical** DBN parser and condition checker |
| `vendor/play-animator.js` | **canonical** render engine (vendored, do not edit) |
| `NOTATION.md` | the canonical DBN spec |
| `GLOSSARY.md` | every DBN token and what it means |
| `DRIVING.md` | driving the editor programmatically |
| `examples/*.dbn` | worked plays — each parses byte-identical to the engine's goldens |
| `tests/` | parity test + golden `plays.js` fixture |

## Notation, in one screen

- **Court**: each player owns a **lane** across the full playable width;
  destinations are `huddle` or named depths — `line` / `mid` / `deep` /
  `back` — from each team's own point of view.
  Escapes: a bare number is an exact depth in your lane (`U5-68`); `(x,y)` is
  a fixed point.
- **Pieces**: `U1`…`Un` (us), `T1`…`Tn` (them). Run digits together to fan an
  action across a group: `T2468-line`, `U45?`.
- **Setup**: implied (close to the back lines). Set offenses normally gather
  only the ball-holders with `U1458-huddle`, then send those same holders to
  their front-line lanes with `U1458-line`; players without balls stay back.
  Defenses and opening rushes normally skip the parley.
  `[Balls "U:45 T:2468"]` says who's loaded;
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
