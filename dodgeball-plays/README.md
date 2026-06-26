# Dodgeball Play Animator

Animated, overhead **chess-diagram** view of dodgeball plays. Built for the
TPSL "Dodging All Night, All Summer" team — each team call is rendered as a
self-contained, looping animation on a top-down court (THEM on top, US on the
bottom, center line across the middle).

One engine, mounted as many times as you like: a full standalone app **and**
embeddable inline "insets" inside any page.

## Run it

It's static — no build step, no dependencies.

```bash
python3 -m http.server 8777
# open http://localhost:8777/
```

`index.html` is the standalone app (play gallery + big player).

## Files

| File | What |
|------|------|
| `play-animator.js` | The engine. `DodgeballPlay.mount(el, play, opts)` + auto-mounts any `<div data-db-play="id">`. Vanilla JS, injects its own CSS. SVG court, requestAnimationFrame tweening, throw arcs. |
| `plays.js` | The plays — **data only** (`window.DB_PLAYS`). Add a play here and it shows up everywhere; no engine changes. |
| `index.html` | Standalone gallery app. |

## Embed an inset

```html
<div data-db-play="kill-left" data-loop></div>
<script src="play-animator.js"></script>
<script src="plays.js"></script>
```

Attributes: `data-autoplay`, `data-loop`, `data-speed="1.5"`.

## Authoring a play

A play is plain JSON. Coordinates: `x` left→right `0..100`, `y` depth
`0` (their back line) .. `50` (center) .. `100` (our back line). Players are
numbered `1` = far left.

```js
"kill-left": {
  id: "kill-left", name: "Kill Left", badge: "4-ball offense",
  call: '"Kill left on 3"',
  desc: "The two left-side throwers commit to the same target.",
  setup: {
    us:   [{ n:1, x:14, y:88, ball:true }, /* ... */],
    them: [{ n:1, x:14, y:12 }, /* ... */],
  },
  steps: [
    { label:"Set — fakes", dur:0.8, fakes:[{team:"us",n:3}] },
    { label:"Kill left on 3", dur:1.1,
      throws:[{ from:{team:"us",n:1}, to:{team:"them",n:3} }] },
  ],
}
```

Step actions: `moves` (glide to `to:[x,y]` by step end), `throws` (ball flies →
target eliminated), `passes` (hand a ball to a teammate), `fakes` (pump-fake
wiggle). Each accepts an optional `curve` for the throw arc.

## Source

Plays mirror the team playbook (`/dodging-playbook` on iamnotsam.com), which
auto-syncs from the shared Google Doc. New/edited calls in the doc become new
entries in `plays.js`.

Served on the site at `iamnotsam.com/dodgeball-plays/` (this repo is embedded
there as a git submodule).
