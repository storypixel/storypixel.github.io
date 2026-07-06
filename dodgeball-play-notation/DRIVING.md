# Driving the DBN Editor programmatically

This editor is built to be run by an agent with **no human clicking**. Three
paths, fastest first. Everything below is copy-paste.

> Live URL: `https://iamnotsam.com/dodgeball-play-notation/`

---

## 30-second version — load the same play two ways

Take one play:

```
[Play "Quick Demo"]
[Players "2"]
[Balls "U:1"]
1. {Throw} U1@T2!
```

### A. Via deep link (`?dbn=`) — renders on page load

URL-encode the notation and open it. The editor parses + renders immediately;
add `?autoplay=1` to start the animation.

```js
const dbn = `[Play "Quick Demo"]
[Players "2"]
[Balls "U:1"]
1. {Throw} U1@T2!`;
const url = "https://iamnotsam.com/dodgeball-play-notation/"
          + "?dbn=" + encodeURIComponent(dbn) + "&autoplay=1";
// open `url` in any browser / headless browser — done.
```

Driving a headless browser (chrome-devtools MCP / agent-browser):

```
new_page(url)                                   // the URL from above
evaluate_script(() => document.documentElement.getAttribute("data-dbn-ready"))  // "1"
evaluate_script(() => window.DBNEditor.getPlay().name)                          // "Quick Demo"
take_screenshot()
```

### B. Via the window API — load into an already-open editor

```
new_page("https://iamnotsam.com/dodgeball-play-notation/")
evaluate_script((dbn) => {
  window.DBNEditor.load(dbn);          // parse + render
  return {
    name:   window.DBNEditor.getPlay()?.name,
    json:   window.DBNEditor.exportJSON(),   // play object the animator eats
    svg:    window.DBNEditor.exportSVG(),     // current rendered <svg> markup
    errors: window.DBNEditor.getErrors(),     // [] when valid
  };
}, /* args: */ ['[Play "Quick Demo"]\n[Players "2"]\n[Balls "U:1"]\n1. {Throw} U1@T2!'])
```

Both produce the identical rendered play.

---

## The window API

`window.DBNEditor` (ready once `<html data-dbn-ready="1">`):

| Method | Returns | Use |
|--------|---------|-----|
| `load(text)` | play object or `null` | set the notation and render it |
| `render()` | play object or `null` | re-render the current text |
| `exportJSON()` | play object or `null` | the animator-ready play data |
| `exportSVG()` | string or `null` | the rendered `<svg>…</svg>` markup |
| `getErrors()` | `[{message, beat?}]` | parse errors (empty array = valid) |
| `getPlay()` | play object or `null` | last successfully parsed play |
| `getText()` | string | current notation in the editor |
| `isReady()` | boolean | API booted |
| `player()` | mount instance or `null` | playback control: `{ play, pause, seek(t), step(±1), replay, el }` |

### Driving playback (step-through)

`window.DBNEditor.player()` returns the live mount. Step beat-to-beat — it snaps
to and holds at each beat boundary:

```js
const p = window.DBNEditor.player();
p.replay();    // restart from the top, playing
p.pause();
p.step(1);     // advance to the next beat boundary and hold
p.step(-1);    // back one beat
p.seek(0);     // jump to a raw time (play-units)
```

### Keyboard (when the player is focused)

Click the preview (or Tab to it) to focus it, then: **space** play/pause,
**←/→** previous/next beat, **R** (or **Home**) replay. Keys are scoped to the
focused player and ignored while any input/textarea is focused, so they never
interfere with typing notation. The scrubber shows a **beat marker** per step.

Errors surface the canonical parser message (e.g. `DBN parse error: DBF
missing T: group`) plus a best-effort `beat` number — we do not invent a new
error format on top of the canonical parser.

## Stable selectors

Every control has a `data-testid` and an ARIA label:

| `data-testid` | Element |
|---------------|---------|
| `dbn-input` | notation textarea |
| `render-button` | render trigger |
| `example-select` | example dropdown |
| `speed-select` | playback speed (1× / 2× / 3×) |
| `status` | status line (`role="status"`) |
| `error-panel` | parse-error panel (`role="alert"`, `hidden` when valid) |
| `preview-stage` | container holding the rendered `<svg>` |

## Deep-link parameters

| Param | Effect |
|-------|--------|
| `?dbn=<url-encoded DBN>` | load this notation and render on page load (wins over `?play`) |
| `?play=<id>` | load `examples/<id>.dbn` (e.g. `kill-left`, `pitch-back`, `insides`) |
| `?autoplay=1` | start the animation immediately |
| `?loop=1` | loop the animation |
| `?speed=<n>` | playback multiplier (default `2`; e.g. `1` for the old pace, `3` faster) |

---

## Pure-Node headless (no browser)

For CI or an agent without a DOM:

```js
const dbn = require("./src/dbn-headless.js");
const text = require("fs").readFileSync("examples/kill-left.dbn", "utf8");

const play = dbn.parse(text);       // play object (canonical parser)
const json = dbn.toJSON(text, true); // pretty JSON string
const svg  = dbn.toSetupSVG(text);   // deterministic static SVG of the starting setup
```

`toSetupSVG` renders the **still starting frame** (player positions + loose
balls) — deterministic, good for visual diffing and snapshots. Animation is a
browser concern; for motion use the live editor or the engine in a browser.

Parse errors throw `Error("DBN parse error: …")` — wrap in try/catch to collect
them headlessly.
