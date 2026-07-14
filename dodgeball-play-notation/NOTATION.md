# DBN -- Dodgeball Notation (v0.2)

A compact, human-writable, machine-feedable notation for dodgeball plays, in
the spirit of chess algebraic notation. A play written in DBN compiles to the
play JSON the animator consumes, so anything you can write, the animator can
render -- and anyone can embed.

Two design rules, and they bind every future capability:

1. Borrowed from chess: **you write intent; the engine owns aesthetics.** The
   default setup is implied, positions are lane-relative words, and
   ball-flight curves are computed.
2. **No magic -- notation for literally everything.** Anything the animator can
   draw must be writable in DBN, and every named word's behavior must be
   specified in this document with exact semantics (a `huddle` is not "roughly
   a huddle"; it is the layout defined below). New engine abilities ship in
   three parts or not at all: the notation token, the spec entry here, and a
   test. If a behavior can't be written, overridden, or escaped by hand
   (`(x,y)` always works), it doesn't belong in the engine.

A full play is a handful of speakable lines:

```
[Play "Home"]
[Badge "defense"]
[Call "Home"]
[Balls "U:45 T:2468"]

1. {They bring it up to the line} :1  T2468-line T4?
2. {Home -- pre-counter beats their throw} :1  T4@U5% U5@T4!
```

Read it aloud and it's a coach talking: *"They bring two-four-six-eight to the
line, four pump-fakes. Four throws at our five -- dodged; five pre-counters
four. Out."*

---

## 1. The court

Top-down "chess diagram." THEM on top, US on the bottom, center line across
the middle.

- **Lanes.** Each player owns the column they start in: `U4`'s lane is the 4th
  from the left on our side. Lanes use the full playable width, with the first
  and last players close to their respective sidelines. They are parametric to
  team size (default 8 a side; set `[Players "10"]` for 10s).
- **Depths.** Four named depths, symmetric for both teams, each measured from
  that team's own point of view:

  | word | meaning | distance from center line |
  |------|---------|--------------------------|
  | `line` | up at the center line with a standard small margin -- the player circle (and a fully cocked pump-fake ball) always stays visibly behind the line | 8 |
  | `mid`  | throwing range, stepped up | 15 |
  | `deep` | fallen back after an attack | 25 |
  | `back` | own back line (the default start) | 45 |

- **Huddle.** `huddle` is a single shoulder-to-shoulder rank in the horizontal
  middle of a team's side, just forward of its own back line: the movers stand
  touching (one player diameter apart, a hair of daylight), in left-to-right
  order, centered on midcourt. A set offense gathers only its ball-holders
  there (`U1458-huddle`). Players without balls stay back. Defensive calls and
  the opening rush skip the parley. A LONE huddle
  mover (`U4-huddle`) simply takes the parley spot at midcourt -- the "player
  in the middle" position -- and its beat caption reads `to the middle`.

- **Group formations.** When several players move together to a named depth
  (`U1458-line`), they do NOT keep their starting lanes: the group fans out
  **one standard lane-unit apart, centered on the group's own lane mean**, in
  left-to-right order (paths never cross). A lone mover (`U3-line`) goes
  straight down its own lane. Need bespoke spacing? Use the escapes below --
  every formation the engine can draw is writable by hand.

- **Escapes**, rarely needed: a bare number is an exact depth in your own lane
  (`U5-68`), and `(x,y)` is a fixed point in the animator's 0..100 space
  (`U4-(48,65)`), x left to right, y 0 = their back line, 100 = ours.

## 2. Pieces

- **US players** `U1`...`Un` left to right; **THEM players** `T1`...`Tn`.
- **Groups**: run player digits together to fan one action across them --
  `T2468-line`, `U45?`, `U78-line`. (A number that names a real roster player,
  like `T10` in a 10-a-side play, is always that single player.)

## 3. Setup -- usually one tag, sometimes zero

The default needs no writing at all: both teams on their back lines, one per
lane, no balls held.

- `[Balls "U:45 T:2468"]` -- who starts loaded. Digits per team; use commas for
  double-digit rosters (`U:4,5,10`).
- `[Setup "rush"]` -- the opening-rush position: nobody holds; three of our
  balls sit on the center line right, three of theirs left.
- `DBF "U:... / T:... / B:..."` -- the full explicit setup string (v0.1) still
  parses, for arbitrary mid-game positions. `[Balls]` overrides its held-ball
  flags if both are present.

## 4. Actions -- the move vocabulary

One token per action; the verb is a single symbol.

| verb | token | meaning |
|------|-------|---------|
| run | `U3-line` / `U1458-huddle` / `U3-68` / `U3-(48,65)` | move (named formation/depth, exact depth in lane, fixed point) |
| grab | `U9*` / `U9*2` | pick up the nearest loose ball / the two nearest |
| run + grab | `U8-line*2` | move there and grab in one beat |
| pass | `U8>U5` | toss to a teammate |
| throw | `U1@T3` | throw at T3 (outcome suffix below) |
| fake | `U3?` | pump-fake, no release |
| block | `T3#` | deflect an incoming throw with a held ball |
| catch | `T3^` | catch an incoming throw |
| dodge | `T3%` | evade an incoming throw |
| out | `T3X` | eliminated (any reason not from a tracked throw) |
| return | `+U4` | a catch brings a teammate back in |

All of these distribute over groups except `@` and `>` (one thrower, one
passer per token). `U9*bU(88,50)` still grabs one specific ball when nearest
isn't what you mean.

### Throw outcomes (suffix on the throw)

| suffix | token | result |
|--------|-------|--------|
| hit | `U1@T3!` | connects -- T3 is out |
| caught | `U1@T3^` | T3 catches -- thrower U1 is out, THEM returns one |
| dodged | `U1@T3%` | T3 evades -- nobody out |
| blocked | `U1@T3#` | T3 blocks with a ball -- nobody out |

**Curves are automatic.** Simultaneous throws at one target fan apart so both
balls read; a dodged throw bows so the miss reads. Append `~<deg>` only to
override the engine's choice (`U6@T2!~-20`).

## 5. Movetext -- the beats

Numbered like chess moves; each number is a **beat** and actions inside a beat
are **simultaneous**. Optional `{label}` (shown under the court) and `:dur`
seconds (default 1).

```
<n>. {label} :dur  <action> <action> ...
```

**Beat captions.** Each beat also compiles a terse `summary` string derived
strictly from its actions -- `to the line`, `1 pump fake`, `throw at 5` --
joined with a centered-dot separator (Unicode U+00B7) when a beat mixes kinds.
For example, `to the line [dot] grab` represents the displayed mixed summary.
Named-formation moves use the formation word (`huddle` maps to
`parley: call play and choose target`, `back` maps to `fall back`); moves to exact
depths or `(x,y)` points summarize as `move`. The widget shows these as
numbered STATES in a plain text strip above the court: `1. starting position`
before anything runs, then `2. parley: call play and choose target`,
`3. to the line`, ... as each beat plays or lands. The `{label}` stays the long,
human-authored form; hand-written play JSON can set `summary` on any step
directly.

## 6. Worked example -- the opening rush

```
[Play "Pitch Back"]
[Badge "opening rush"]
[Call "Pitch back"]
[Setup "rush"]

1. {Rush -- the two on the right grab our three (2 + 1)} :1.3  U78-line U8*2 U7* T12-line T1*2 T2*
2. {Pitch back -- attacker steps up} :0.9  U8>U5 U5-68 T12-deep
3. {Free look -- hit a regressing rusher} :1  U5@T2! T12-back
```

## 7. Tags

`[Play "..."]` is the only required tag. `[Id]` is derived from the name
(slugified) unless you set it. `[Call "Home"]` needs no escaped quotes -- a
call is something you shout, so the renderer adds them. `[Badge]`, `[Desc]`,
`[Players]`, `[Balls]`, `[Setup]` as above.

## 8. Compiling and embedding

`DBN.parse(text)` returns the play object the engine eats:

```js
const play = DBN.parse(dbnString);
DodgeballPlay.mount(el, play, { autoplay: true });
```

Or drop notation straight into a page -- `dbn.js` auto-mounts any
`data-db-play-dbn` element:

```html
<div data-db-play-dbn='
  [Play "Home"] [Balls "U:45 T:2468"]
  1. {They bring it up} T2468-line T4?
  2. {Pre-counter} T4@U5% U5@T4!
'></div>
<script src="play-animator.js"></script>
<script src="dbn.js"></script>
```

## 9. Grammar (EBNF sketch)

```
play      := { tag } [ dbf ] { beat }
tag       := "[" WORD STRING "]"
dbf       := "DBF" STRING
beat      := INT "." [ label ] [ ":" NUMBER ] { action }
label     := "{" TEXT "}"
action    := actors ( run | grab | pass | throw | fake | block | catch | dodge | out )
           | "+" player
actors    := ("U"|"T") DIGITS          (digits fan to a group when not a roster number)
run       := "-" dest [ "*" [COUNT] ]
dest      := "huddle" | "line" | "mid" | "deep" | "back" | NUMBER | "(" NUMBER "," NUMBER ")" | FILE RANK
grab      := "*" [ COUNT | ball ]
pass      := ">" player
throw     := "@" player [ outcome ] [ "~" SIGNED_INT ]
outcome   := "!" | "^" | "%" | "#"
player    := ("U"|"T") INT
ball      := ("bU"|"bT"|"bN") square
```

---

**Status:** v0.2. Everything v0.1 accepted -- explicit `DBF` setups, raw
`(x,y)` moves, `file+rank` squares, per-player tokens, manual `~deg` curves --
still parses. v0.2 is a strict superset that makes the elegant form the short
form.
