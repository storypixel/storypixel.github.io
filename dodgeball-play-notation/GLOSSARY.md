# Glossary — DBN (Dodgeball Notation)

Every DBN token and what it maps to. The authoritative spec is
[`NOTATION.md`](NOTATION.md) (synced from the canonical
[animator repo](https://github.com/storypixel/dodgeball-play-animator)); this is
the quick lookup.

## Court & destinations

| Term | Meaning |
|------|---------|
| **lane** | the column a player starts in — `U4`'s lane is the 4th from our left. Lane-relative moves keep it. |
| **`line`** | at the center line (attack/grab position), your side of it. |
| **`mid`** | throwing range, stepped up. |
| **`deep`** | fallen back after an attack. |
| **`back`** | your own back line — where everyone starts. |
| **bare number** | exact depth in your own lane: `U5-68` → (lane-x, 68). |
| **`(x,y)` escape** | a fixed point in the engine's 0–100 space, e.g. `U4-(48,65)`. |
| **`file`+`rank`** | legacy squares (`f6`) still parse. |

## Pieces & groups

| Token | Meaning |
|-------|---------|
| `U1`…`Un` | US players, left → right. `T1`…`Tn` THEM. Team size from setup (default 8; `[Players "10"]`). |
| `T2468` | a **group** — the digits fan one action across players 2, 4, 6, 8. A real roster number (`T10` in 10s) always wins over expansion. |
| `*` (suffix in DBF) | the player is **loaded**, e.g. `U1*`. |
| `bU` / `bT` / `bN` | a loose ball, owner = ours / theirs / neutral. |

## Setup

The default setup is **implied**: both teams on their back lines, one per
lane, nobody loaded. State only the diff:

| Tag | Meaning |
|-----|---------|
| `[Balls "U:45 T:2468"]` | who starts loaded (digits per team; commas for 10+: `U:4,5,10`) |
| `[Setup "rush"]` | opening rush: no one loaded; our 3 balls on the line right, their 3 left |
| `DBF "U:… / T:… / B:…"` | full explicit setup (v0.1) for arbitrary positions; `[Balls]` overrides its flags |

## Tags (metadata)

| Tag | Maps to |
|-----|---------|
| `[Play "…"]` | play name — the only required tag |
| `[Id "…"]` | stable id (else slugified from name) |
| `[Badge "…"]` | category tag |
| `[Call "…"]` | the captain's call — no escaped quotes needed, the renderer adds them |
| `[Desc "…"]` | description |
| `[Players "…"]` | team size for the implied setup (default 8) |

## Movetext — beats

```
<n>. {label} :dur  <action> <action> …
```

| Part | Meaning |
|------|---------|
| `<n>.` | beat number (a step in the animation) |
| `{label}` | optional caption shown under the court |
| `:dur` | optional duration in seconds (default `1.0`) |
| actions | space-separated; **simultaneous** within the beat |

Separate beats by newline or `;`.

## Action verbs

| Verb | Token | Meaning |
|------|-------|---------|
| run / move | `U3-line` / `U3-68` / `U3-(48,65)` | named depth, exact depth in lane, or fixed point |
| grab (nearest) | `U9*` | pick up the nearest loose ball → loaded |
| grab (count) | `U9*2` | pick up the two nearest loose balls |
| grab (specific) | `U9*bU(88,50)` | pick up the named loose ball |
| run + grab | `U8-line*2` | move there and grab (two) in one beat |
| pass | `U8>U5` | hand/toss to a teammate |
| throw | `U1@T3` | throw at an opponent |
| fake | `U3?` | pump-fake, no release |
| block | `T3#` | deflect an incoming throw with a held ball |
| catch | `T3^` | catch an incoming throw |
| dodge | `T3%` | evade an incoming throw |
| out | `T3X` | eliminated (not from a tracked throw) |
| return | `+U4` | a catch brings a teammate back in |

Everything distributes over a group (`T2468-line`, `U45?`, `U78*`) except
`@` throw and `>` pass — one thrower, one passer per token.

## Throw outcomes (suffix on the throw)

| Token | Result |
|-------|--------|
| `U1@T3!` | hit — T3 is out |
| `U1@T3^` | caught — **thrower U1 is out**, THEM returns one |
| `U1@T3%` | dodged — nobody out |
| `U1@T3#` | blocked — nobody out |

Omit the outcome and the throw is treated as unresolved (arc only).

**Curves are automatic**: simultaneous throws at one target fan apart, a
dodged throw bows so the miss reads. Append `~<deg>` (signed) only to
override, e.g. `U6@T2!~-20`.
