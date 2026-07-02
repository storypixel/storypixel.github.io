# DBN — Dodgeball Notation (v0.1)

A compact, human-writable, machine-feedable notation for dodgeball plays, in the
spirit of chess PGN/algebraic notation. A play written in DBN compiles to the
`window.DB_PLAYS` JSON the animator already consumes, so anything you can write
in DBN, the animator can render — and anyone can embed it.

Two parts, like chess:
- **DBF** (Dodgeball FEN) — a one-line string for the static **setup** (who is
  where, who holds a ball, where the loose balls are).
- **DBN movetext** — the **beats** of the play, numbered, each a set of
  simultaneous actions with an optional label and duration.

---

## 1. The court

Top-down "chess diagram." THEM on top, US on the bottom, center line across the
middle — identical to the animator.

- **Files** are the **columns, one per player** — the grid is **parametric to
  team size**. For an `N`-a-side play there are `N` columns, `a`, `b`, … (the
  first `N` letters). **Default team size is 8** → files `a`–`h`. A 10-a-side
  play uses `a`–`j`. The columns divide the court width evenly.
- **Ranks** `1`–`10` bottom → top: rank `1` = OUR back line, rank `10` = THEIR
  back line, center line sits between `5` and `6`. (Depth is fixed, independent
  of team size.)
- A square is `file`+`rank`, e.g. `f6` (just over center, right-of-middle).

Mapping to the animator's `0..100` space (so the parser is exact). `N` is the
team size, taken from the DBF (the larger of the two sides):
```
x = (fileIndex + 0.5) * (100 / N)   // N=8: a→6.25, h→93.75 · N=10: a→5, j→95
y = (10 - rank + 0.5) * 10          // rank1→95 (us back), rank10→5 (them back)
```
So the same file letter sits at a different x for a different team size — the
grid scales with the roster. Need finer than a grid square (or mid-play motion
off the column lines)? Use an explicit escape: `(x,y)` with raw `0..100`
numbers, e.g. `U6-(54,68)`. Everything else stays on the grid.

## 2. Pieces

- **US players** `U1`…`UN` — `U1` is our far-left, `UN` far-right (default
  8-a-side → `U1`…`U8`; supports up to `U10`).
- **THEM players** `T1`…`TN`.
- **Loaded** (holding a ball) is a `*` suffix: `U1*`.
- **Loose balls** are `b` with an owner tag in setup: `bU` (ours), `bT`
  (theirs), `bN` (neutral / on the line), each with a square.

## 3. DBF — the setup string

One line, three slash-separated groups. Commas separate entries; a `*` marks a
loaded player.

```
U: <player><square>[*] , …  /  T: …  /  B: <ballTag><square> , …
```

Example (opening rush, six balls on the line, right three ours):
```
DBF "U:1a1,2b1,3c1,4d1,5e1,6f1,7g1,8h1,9i1,10j1 / T:1a10,2b10,3c10,4d10,5e10,6f10,7g10,8h10,9i10,10j10 / B:bNh6,bNi6,bNj6,bNb6,bNc6,bNd6"
```

## 4. Actions — the full move vocabulary

One token per action. The verb is a single symbol so it reads fast and parses
unambiguously. `<P>` is a player, `<sq>` a square, `<X>` a target opponent.

| Verb | Token | Meaning |
|------|-------|---------|
| **run / move** | `U3-f6` | player runs to a square |
| **grab** | `U9*` / `U9*bN h6` | pick up nearest loose ball / a specific one → becomes loaded |
| **run + grab** | `U10-g6*` | move there and grab in one beat |
| **pass** (to teammate) | `U10>U6` | hand or toss to a teammate |
| **throw** (at opponent) | `U1@T3` | throw at T3 (outcome symbol optional, below) |
| **fake / pump** | `U3?` | pump-fake, no release |
| **block** (with held ball) | `T3#` | deflect an incoming throw with a ball |
| **catch** | `T3^` | catch an incoming throw |
| **dodge** | `T3%` | evade an incoming throw |
| **out** | `T3X` | eliminated (any reason not from a tracked throw) |
| **return / sub-in** | `+U4` | a catch brings a teammate back in |

### Throw outcomes (suffix on the throw)
A throw can carry its result inline so a single token tells the whole story:

| Suffix | Token | Result |
|--------|-------|--------|
| hit / out | `U1@T3!` | connects — T3 is out |
| caught | `U1@T3^` | T3 catches — **thrower U1 is out**, THEM returns one |
| dodged | `U1@T3%` | T3 dodges — ball is live/dead, nobody out |
| blocked | `U1@T3#` | T3 blocks with a ball — nobody out |
| curve | `U6@T2!~-20` | append `~<deg>` for a curved arc (matches the engine's `curve`) |

If you omit the outcome, the parser treats it as an un-resolved throw (arc only).

## 5. Movetext — the beats

Like PGN's numbered moves, but each number is a **beat** (a step in the
animator) and actions inside a beat are **simultaneous**. Optional `{label}`
(shown under the court) and optional `:dur` in seconds (defaults to 1.0).

```
<n>. {label} :dur  <action> <action> …
```

Multiple beats separate by newline or ` ; `. Example beat:
```
1. {Rush — right two grab 2+1} :1.3  U10-g6* U9-g5* T1-b5* T2-c5*
```

## 6. Worked example — "Pitch Back" in DBN

```
[Play "Pitch Back"]
[Badge "opening rush"]
[Call "Pitch back"]
DBF "U:1a1,2b1,3c1,4d1,5e1,6f1,7g1,8h1,9i1,10j1 / T:1a10,2b10,3c10,4d10,5e10,6f10,7g10,8h10,9i10,10j10 / B:bNh6,bNi6,bNj6,bNb6,bNc6,bNd6"

1. {Rush — right two grab our three (2+1)} :1.3
   U10-(92,54)* U9-(80,54)* T1-(8,46)* T2-(20,46)*
2. {Pitch back — attacker steps up} :0.9
   U10>U6 U6-(54,68) T1-(10,30) T2-(22,30)
3. {Free look — hit a regressing rusher} :1.0
   U6@T2!~-20 T1-(12,20) T2-(24,20)
```

That compiles 1:1 to today's hand-written `pitch-back` play object.

## 7. Compiling DBN → the animator

`DBN.parse(text)` returns the same play object shape the engine already eats:
`{ id, name, badge, call, desc, setup:{us,them,balls}, steps:[…] }`. So:

```js
const play = DBN.parse(dbnString);
DodgeballPlay.mount(el, play, { loop:true });
```

## 8. Embedding (so others can use it)

Drop the notation inline — no JSON authoring, no engine knowledge:

```html
<div data-db-play-dbn="
  [Play &quot;Kill Left&quot;]
  DBF &quot;U:1c1*,2d1,3e1*,…&quot;
  1. {Set — fakes} U3?
  2. {Kill left on 3} U1@T3! U3@T3!
"></div>
<script src="play-animator.js"></script>
<script src="dbn.js"></script>
```

The `dbn.js` auto-mount scans for `data-db-play-dbn`, parses, and mounts the
engine — same ergonomics as the existing `data-db-play`, but the play lives in
readable notation right in the page. A play is now a paste-able string anyone
can share, embed, diff, or version.

## 9. Grammar (EBNF sketch, for the parser)

```
play      := { tag } dbf { beat }
tag       := "[" WORD STRING "]"
dbf       := "DBF" STRING
beat      := INT "." [ label ] [ ":" NUMBER ] { action }
label     := "{" TEXT "}"
action    := player ( run | grab | pass | throw | fake | block | catch | dodge | out )
           | "+" player
run       := "-" square
grab      := "*" [ ball ]
pass      := ">" player
throw     := "@" player [ outcome ] [ "~" SIGNED_INT ]
outcome   := "!" | "^" | "%" | "#"
square    := FILE RANK | "(" NUMBER "," NUMBER ")"
player    := ("U"|"T") INT
ball      := ("bU"|"bT"|"bN") square
```

---

**Status:** v0.1 spec. Reference parser `dbn.js` + `data-db-play-dbn` auto-mount
is the next build; once it lands, every play in `plays.js` can ship as DBN and
the notation is fully feedable and embeddable.
