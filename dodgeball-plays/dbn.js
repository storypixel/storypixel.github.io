/* DBN - Dodgeball Notation parser + auto-mount.
 *
 * Produces the same plain play objects consumed by play-animator.js.
 *
 * v0.2 — write plays like chess, not like JSON:
 *   - the default setup is implied (both teams on their back lines in lanes);
 *     a play states only the diff: [Balls "U:45 T:2468"], [Setup "rush"]
 *   - destinations are lane-relative: named depths (line/mid/deep/back) or a
 *     bare y-number keep the player in their own lane; (x,y) stays as the
 *     fine-control escape, file+rank squares still parse (legacy)
 *   - group actions: T2468-line fans one action across players 2,4,6,8
 *   - grab counts: U8*2 takes the two nearest loose balls
 *   - curves are the engine's job: simultaneous throws at one target auto-fan,
 *     dodged throws auto-bow; ~deg remains as a manual override
 * All v0.1 forms (explicit DBF, raw coords, per-player tokens) still parse.
 */
(function (global) {
  "use strict";

  const FILES = "abcdefghij";
  const TEAM = { U: "us", T: "them" };

  // ── v0.2 court vocabulary ──
  // Lanes: player n's home column. Use nearly the full playable width so the
  // two outside players actually read as wings rather than being pinched in.
  function laneX(n, N) {
    return N > 1 ? 2 + (n - 1) * (96 / (N - 1)) : 50;
  }
  // Named depths, symmetric about the center line, from each team's own view:
  // back = own back line, deep = fallen back, mid = throwing range, line = at
  // the center line.
  const DEPTH = { back: 45, deep: 25, mid: 15, line: 8 }; // distance from center
  // line=8 leaves a standard small margin: the player circle (and a fully
  // cocked pump-fake ball) stays visibly behind the center line, never on it.
  function depthY(team, name) {
    const d = DEPTH[name];
    return team === "us" ? 50 + d : 50 - d;
  }
  const AUTO_FAN = 24; // degrees between simultaneous throws at one target
  const AUTO_DODGE = 14; // bow on a dodged throw so the miss reads

  // The grid is PARAMETRIC to team size: N columns where N = players per side
  // (default 8). Files a..(a+N-1) divide the 0..100 width evenly, so a file's
  // x = (fileIndex + 0.5) * (100 / N). Set once per parse() from the DBF. For a
  // 10-a-side play N=10, which reproduces the original fixed 10-wide mapping.
  let GRID_N = 10;

  function fail(msg) {
    throw new Error("DBN parse error: " + msg);
  }

  function unescapeString(s) {
    return s
      .replace(/\\u([0-9a-fA-F]{4})/g, function (_, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      })
      .replace(/\\(.)/g, function (_, ch) {
        if (ch === "n") return "\n";
        if (ch === "r") return "\r";
        if (ch === "t") return "\t";
        return ch;
      });
  }

  function slugify(s) {
    return (
      String(s || "dbn-play")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "dbn-play"
    );
  }

  function readTags(text) {
    const tags = {};
    let rest = text;
    const tagRe = /^\s*\[([A-Za-z][A-Za-z0-9_-]*)\s+"((?:\\.|[^"\\])*)"\]\s*/;
    let m;
    while ((m = tagRe.exec(rest))) {
      tags[m[1].toLowerCase()] = unescapeString(m[2]);
      rest = rest.slice(m[0].length);
    }
    return { tags: tags, rest: rest };
  }

  function readDbf(text) {
    const m = /^\s*DBF\s+"((?:\\.|[^"\\])*)"/.exec(text);
    if (!m) return { dbf: null, rest: text }; // v0.2: setup may be implied
    return {
      dbf: unescapeString(m[1]),
      rest: text.slice(m[0].length),
    };
  }

  // ── v0.2 implied setup: back lines + lanes; [Balls]/[Setup] are the diff ──
  function parseBallsTag(raw) {
    // "U:45 T:2468" or "U:4,5,10 T:2" — digits per team, commas for 10+
    const flags = { us: {}, them: {} };
    const re = /([UT])\s*:\s*([\d,\s]+)/gi;
    let m;
    while ((m = re.exec(raw))) {
      const team = TEAM[m[1].toUpperCase()];
      const body = m[2].trim();
      const nums =
        body.indexOf(",") >= 0
          ? body.split(",").map(function (s) {
              return parseInt(s.trim(), 10);
            })
          : body
              .replace(/\s+/g, "")
              .split("")
              .map(function (d) {
                return parseInt(d, 10);
              });
      nums.forEach(function (n) {
        if (!Number.isFinite(n) || n < 1) fail("bad [Balls] entry: " + raw);
        flags[team][n] = true;
      });
    }
    return flags;
  }

  function impliedSetup(tags) {
    const N = parseInt(tags.players, 10) || 8;
    GRID_N = N;
    const flags = tags.balls ? parseBallsTag(tags.balls) : { us: {}, them: {} };
    function side(team, y) {
      const out = [];
      for (let n = 1; n <= N; n++) {
        out.push({ n: n, x: laneX(n, N), y: y, ball: !!flags[team][n] });
      }
      return out;
    }
    const setup = {
      us: side("us", depthY("us", "back")),
      them: side("them", depthY("them", "back")),
      balls: [],
    };
    const mode = (tags.setup || "").toLowerCase();
    if (mode === "rush") {
      // TPSL opening: nobody holds; three of our balls on the line right, three
      // of theirs on the line left.
      setup.us.forEach(function (p) {
        p.ball = false;
      });
      setup.them.forEach(function (p) {
        p.ball = false;
      });
      const makeId = ballIdFactory();
      [
        [80, "bU"],
        [88, "bU"],
        [96, "bU"],
        [4, "bT"],
        [12, "bT"],
        [20, "bT"],
      ].forEach(function (e) {
        const ball = { id: makeId(e[1], [e[0], 50]), x: e[0], y: 50 };
        ball.side = sideForBallTag(e[1]);
        setup.balls.push(ball);
      });
    } else if (mode && mode !== "default") {
      fail('unknown [Setup "' + tags.setup + '"] (know: rush)');
    }
    return setup;
  }

  function splitList(text, sep) {
    const out = [];
    let depth = 0,
      start = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === "(") depth++;
      else if (ch === ")") depth = Math.max(0, depth - 1);
      else if (ch === sep && depth === 0) {
        const part = text.slice(start, i).trim();
        if (part) out.push(part);
        start = i + 1;
      }
    }
    const last = text.slice(start).trim();
    if (last) out.push(last);
    return out;
  }

  function parseNum(s, label) {
    const n = Number(s);
    if (!Number.isFinite(n)) fail("bad " + label + ": " + s);
    return n;
  }

  function parseSquare(s) {
    s = String(s || "").trim();
    let m = /^\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/.exec(s);
    if (m) return [parseNum(m[1], "x"), parseNum(m[2], "y")];

    m = /^([a-jA-J])([1-9]|10)$/.exec(s);
    if (!m) fail("bad square: " + s);

    const fileIdx = FILES.indexOf(m[1].toLowerCase());
    const rank = parseInt(m[2], 10);
    // parametric column width: evenly divide 0..100 into GRID_N columns
    return [(fileIdx + 0.5) * (100 / GRID_N), (10 - rank + 0.5) * 10];
  }

  function sideForBallTag(tag) {
    const side = tag[1].toUpperCase();
    if (side === "U") return "us";
    if (side === "T") return "them";
    return null;
  }

  function parsePlayerPrefix(text) {
    const m = /^([UT])(\d+)/.exec(text);
    if (!m) fail("bad player action: " + text);
    return {
      player: { team: TEAM[m[1]], n: parseInt(m[2], 10) },
      raw: m[1] + m[2],
      rest: text.slice(m[0].length),
    };
  }

  // v0.2 group tokens: T2468? fans across players 2,4,6,8. A number that names
  // a real roster player (T10) is always that single player; only an unknown
  // multi-digit run whose every digit is on the roster expands to a group.
  function parseActorSet(text, roster) {
    const m = /^([UT])(\d+)/.exec(text);
    if (!m) fail("bad player action: " + text);
    const team = TEAM[m[1]];
    const numStr = m[2];
    const whole = parseInt(numStr, 10);
    const known = roster ? roster[team] : null;
    let players;
    if (!known || known[whole] || numStr.length === 1) {
      players = [{ team: team, n: whole }];
    } else {
      players = numStr.split("").map(function (d) {
        const n = parseInt(d, 10);
        if (!n || !known[n])
          fail(
            "unknown player " +
              m[1] +
              numStr +
              " (no " +
              m[1] +
              whole +
              ", and " +
              m[1] +
              d +
              " is not on the roster)",
          );
        return { team: team, n: n };
      });
    }
    return {
      players: players,
      raw: m[1] + numStr,
      rest: text.slice(m[0].length),
    };
  }

  // A single-row, shoulder-to-shoulder call formation just forward of a
  // team's own back line. A staggered two-row huddle reads as a random
  // clump at animation scale — one tight rank is what a huddle looks like.
  const SHOULDER = 6.5; // ≈ one 28px-radius player diameter in court units + a hair of daylight — shoulder to shoulder, never overlapping
  function huddlePos(player, ctx) {
    // single-player fallback; groups are laid out at the expansion site
    // where the whole moving group is known (see groupFormationX).
    return [50, player.team === "us" ? 87 : 13];
  }

  // Group formation layout: when several players move together their
  // destination x comes from the GROUP, not their old lanes.
  //  - huddle: shoulder-to-shoulder rank centered on midcourt
  //  - named depth (line/mid/deep/back): one standard lane-unit apart,
  //    centered on the group's own lane mean — nobody keeps their starting
  //    column. Left-to-right order is preserved so paths never cross.
  function groupFormationX(actors, dest, ctx) {
    const out = {};
    const byTeam = {};
    actors.forEach(function (p) {
      (byTeam[p.team] = byTeam[p.team] || []).push(p);
    });
    Object.keys(byTeam).forEach(function (team) {
      const ps = byTeam[team].slice().sort(function (a, b) {
        return ctx.lane[keyOf(a)] - ctx.lane[keyOf(b)];
      });
      let spacing, center;
      if (dest === "huddle") {
        // the parley is the ONLY tight formation
        spacing = SHOULDER;
        center = 50;
      } else if (dest === "line") {
        // the ATTACKING formation: medium spread across the middle half of
        // the width — enough for different angles, close enough that
        // teammates can protect the thrower after the release.
        spacing = ps.length > 1 ? 50 / (ps.length - 1) : 0;
        center = 50;
      } else {
        // defensive postures (mid/deep/back) spread WIDE — clearly wider than
        // the attack, so spread-out holders minimize what a counter throw can
        // hit — but not pinned to the sidelines.
        spacing = ps.length > 1 ? 80 / (ps.length - 1) : 0;
        center = 50;
      }
      ps.forEach(function (p, i) {
        const x = center + (i - (ps.length - 1) / 2) * spacing;
        out[keyOf(p)] = Math.min(100, Math.max(0, x));
      });
    });
    return out;
  }

  // v0.2 destinations: named depth | huddle | bare y-number (lane-relative) |
  // (x,y) | file+rank (legacy)
  function parseDest(s, player, ctx) {
    s = String(s || "").trim();
    if (s === "huddle") return huddlePos(player, ctx);
    if (DEPTH.hasOwnProperty(s)) {
      return [ctx.lane[keyOf(player)], depthY(player.team, s)];
    }
    if (/^-?\d+(?:\.\d+)?$/.test(s)) {
      return [ctx.lane[keyOf(player)], parseNum(s, "depth")];
    }
    return parseSquare(s);
  }

  function parsePlayerFull(text) {
    const p = parsePlayerPrefix(text);
    if (p.rest) fail("bad player token: " + text);
    return p.player;
  }

  function samePoint(a, b) {
    return Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;
  }

  function ballIdFactory() {
    const counts = {};
    return function (tag, pos) {
      const side = tag[1].toUpperCase();
      const prefix = side === "U" ? "u" : side === "T" ? "t" : "n";
      const lane = pos[0] < 50 ? "L" : pos[0] > 50 ? "R" : "C";
      const key = prefix + lane;
      counts[key] = (counts[key] || 0) + 1;
      return key + counts[key];
    };
  }

  function parseSetupPlayer(entry, group) {
    let s = entry.trim();
    let loaded = false;
    if (s.endsWith("*")) {
      loaded = true;
      s = s.slice(0, -1).trim();
    }
    if (/^[UT]/i.test(s)) {
      const prefix = s[0].toUpperCase();
      if (prefix !== group)
        fail("player " + s + " in wrong " + group + ": group");
      s = s.slice(1).trim();
    }
    const m = /^(\d+)(.+)$/.exec(s);
    if (!m) fail("bad setup player: " + entry);
    const pos = parseSquare(m[2]);
    const player = {
      n: parseInt(m[1], 10),
      x: pos[0],
      y: pos[1],
      ball: loaded,
    };
    return player;
  }

  function parseSetupBall(entry, makeId) {
    const m = /^(b[UTN])\s*(.+)$/i.exec(entry.trim());
    if (!m) fail("bad setup ball: " + entry);
    const tag = "b" + m[1][1].toUpperCase();
    const pos = parseSquare(m[2]);
    const ball = {
      id: makeId(tag, pos),
      x: pos[0],
      y: pos[1],
    };
    const side = sideForBallTag(tag);
    if (side) ball.side = side;
    return ball;
  }

  function parseDbf(dbf) {
    const groups = {};
    splitList(dbf, "/").forEach(function (part) {
      const m = /^\s*([UTB])\s*:\s*(.*?)\s*$/.exec(part);
      if (!m) fail("bad DBF group: " + part);
      groups[m[1]] = m[2];
    });
    if (!groups.U) fail("DBF missing U: group");
    if (!groups.T) fail("DBF missing T: group");

    const uList = splitList(groups.U, ",");
    const tList = splitList(groups.T, ",");
    // grid columns = team size (the larger side); drives the file -> x mapping
    GRID_N = Math.max(uList.length, tList.length) || 10;
    const setup = {
      us: uList.map(function (e) {
        return parseSetupPlayer(e, "U");
      }),
      them: tList.map(function (e) {
        return parseSetupPlayer(e, "T");
      }),
      balls: [],
    };
    const makeId = ballIdFactory();
    if (groups.B) {
      setup.balls = splitList(groups.B, ",").map(function (e) {
        return parseSetupBall(e, makeId);
      });
    }
    return setup;
  }

  function beatChunks(text) {
    const starts = [];
    const re = /(^|[;\n\r])\s*(\d+)\./g;
    let m;
    while ((m = re.exec(text))) {
      starts.push(m.index + m[1].length);
    }
    return starts
      .map(function (start, i) {
        const end = i + 1 < starts.length ? starts[i + 1] : text.length;
        return text
          .slice(start, end)
          .trim()
          .replace(/[;\s]+$/, "");
      })
      .filter(Boolean);
  }

  function tokenizeActions(text) {
    const tokens = [];
    let i = 0;
    while (i < text.length) {
      while (i < text.length && /[\s;]/.test(text[i])) i++;
      if (i >= text.length) break;
      let depth = 0,
        start = i;
      while (i < text.length) {
        const ch = text[i];
        if (ch === "(") depth++;
        else if (ch === ")") depth = Math.max(0, depth - 1);
        else if (depth === 0 && /[\s;]/.test(ch)) break;
        i++;
      }
      tokens.push(text.slice(start, i));
    }
    return tokens;
  }

  function runtimeFor(setup) {
    const pos = {};
    const lane = {};
    const roster = { us: {}, them: {} };
    function seed(team, players) {
      (players || []).forEach(function (p) {
        pos[team + "-" + p.n] = [p.x, p.y];
        lane[team + "-" + p.n] = p.x; // home column — lane-relative moves keep it
        roster[team][p.n] = true;
      });
    }
    seed("us", setup.us);
    seed("them", setup.them);
    return {
      pos: pos,
      lane: lane,
      roster: roster,
      balls: (setup.balls || []).map(function (b, i) {
        return {
          id: b.id,
          x: b.x,
          y: b.y,
          side: b.side || null,
          index: i,
          taken: false,
        };
      }),
    };
  }

  function keyOf(player) {
    return player.team + "-" + player.n;
  }

  function addGrab(acc, player, ballId) {
    const key = keyOf(player);
    let grab = acc.grabByKey[key];
    if (!grab) {
      grab = { team: player.team, n: player.n, balls: [] };
      acc.grabByKey[key] = grab;
      acc.grabs.push(grab);
    }
    grab.balls.push(ballId);
  }

  function takeSpecificBall(ctx, ref) {
    for (let i = 0; i < ctx.balls.length; i++) {
      const b = ctx.balls[i];
      if (!b.taken && b.side === ref.side && samePoint([b.x, b.y], ref.pos)) {
        b.taken = true;
        return b.id;
      }
    }
    fail("no loose ball at " + ref.text);
  }

  function takeNearestBall(ctx, pos) {
    let best = null,
      bestD = Infinity;
    ctx.balls.forEach(function (b) {
      if (b.taken) return;
      const dx = b.x - pos[0],
        dy = b.y - pos[1];
      const d = dx * dx + dy * dy;
      if (
        d < bestD - 1e-9 ||
        (Math.abs(d - bestD) < 1e-9 && (!best || b.index < best.index))
      ) {
        best = b;
        bestD = d;
      }
    });
    if (!best) fail("no loose ball available to grab");
    best.taken = true;
    return best.id;
  }

  function parseBallRef(text, nextToken) {
    const m = /^(b[UTN])\s*(.*)$/i.exec(text.trim());
    if (!m) fail("bad ball reference: " + text);
    const tag = "b" + m[1][1].toUpperCase();
    let square = m[2].trim();
    let consumed = 0;
    if (!square) {
      if (!nextToken) fail("missing square after " + tag);
      square = nextToken;
      consumed = 1;
    }
    return {
      side: sideForBallTag(tag),
      pos: parseSquare(square),
      text: tag + square,
      consumed: consumed,
    };
  }

  function addSimple(acc, name, player) {
    acc[name].push({ team: player.team, n: player.n });
  }

  function parseThrowSuffix(rest, original) {
    const targetRaw = parsePlayerPrefix(rest);
    const target = targetRaw.player;
    let tail = targetRaw.rest;
    let outcome = null;
    if (/^[!^%#]/.test(tail)) {
      outcome = tail[0];
      tail = tail.slice(1);
    }
    let curve = null;
    if (tail[0] === "~") {
      const m = /^~([+-]?\d+(?:\.\d+)?)/.exec(tail);
      if (!m) fail("bad curve in throw: " + original);
      curve = parseNum(m[1], "curve");
      tail = tail.slice(m[0].length);
    }
    if (tail) fail("bad throw token: " + original);
    return { target: target, outcome: outcome, curve: curve };
  }

  function outcomeName(symbol) {
    if (symbol === "^") return "caught";
    if (symbol === "%") return "dodged";
    if (symbol === "#") return "blocked";
    return null;
  }

  function parseBeat(chunk, ctx) {
    const head = /^\s*(\d+)\.\s*/.exec(chunk);
    if (!head) fail("bad beat: " + chunk);
    let rest = chunk.slice(head[0].length);
    let label = null;
    if (rest.trimStart().startsWith("{")) {
      rest = rest.trimStart();
      const end = rest.indexOf("}");
      if (end < 0) fail("unclosed label in beat " + head[1]);
      label = rest.slice(1, end).trim();
      rest = rest.slice(end + 1);
    }
    let dur = 1.0;
    rest = rest.trimStart();
    if (rest[0] === ":") {
      const m = /^:\s*([+-]?\d+(?:\.\d+)?)/.exec(rest);
      if (!m) fail("bad duration in beat " + head[1]);
      dur = parseNum(m[1], "duration");
      rest = rest.slice(m[0].length);
    }

    const acc = {
      label: label,
      dur: dur,
      moves: [],
      grabs: [],
      grabByKey: {},
      passes: [],
      throws: [],
      fakes: [],
      destNames: [],
      blocks: [],
      catches: [],
      dodges: [],
      outs: [],
      returns: [],
    };
    const beatPos = {};
    Object.keys(ctx.pos).forEach(function (k) {
      beatPos[k] = ctx.pos[k].slice();
    });

    const tokens = tokenizeActions(rest);
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      if (!tok) continue;
      if (tok[0] === "+") {
        acc.returns.push(parsePlayerFull(tok.slice(1)));
        continue;
      }

      const parsed = parseActorSet(tok, ctx.roster);
      const actors = parsed.players;
      const group = actors.length > 1;
      const op = parsed.rest;
      if (!op) fail("missing action for " + parsed.raw);

      if (op[0] === "-") {
        let square = op.slice(1);
        // run + grab: trailing * with an optional count (U8-line*2)
        let grabCount = 0;
        const gm = /\*(\d*)$/.exec(square);
        if (gm) {
          grabCount = gm[1] ? parseInt(gm[1], 10) : 1;
          square = square.slice(0, gm.index);
        }
        if (group && /^\(/.test(square.trim()))
          fail(
            "a group can't share one fixed point — use a lane depth: " + tok,
          );
        // group formations override per-player lanes: shoulder-to-shoulder
        // for a huddle, one lane-unit apart for a shared named depth.
        const destName = square.trim();
        const namedDest =
          destName === "huddle" || DEPTH.hasOwnProperty(destName)
            ? destName
            : null;
        // retreats fall STRAIGHT back: a move to a deeper named depth keeps
        // each player's current x — you back-pedal, you don't re-fan.
        // Formations apply when a group advances (or gathers to the parley).
        const retreatByTeam = {};
        if (namedDest && DEPTH.hasOwnProperty(destName)) {
          const byTeam = {};
          actors.forEach(function (p) {
            (byTeam[p.team] = byTeam[p.team] || []).push(p);
          });
          Object.keys(byTeam).forEach(function (team) {
            const avg =
              byTeam[team].reduce(function (sum, p) {
                return sum + Math.abs(ctx.pos[keyOf(p)][1] - 50);
              }, 0) / byTeam[team].length;
            retreatByTeam[team] = DEPTH[destName] > avg + 0.001;
          });
        }
        const groupX =
          actors.length > 1 && namedDest
            ? groupFormationX(actors, destName, ctx)
            : null;
        actors.forEach(function (player) {
          const pos = parseDest(square, player, ctx);
          if (namedDest && retreatByTeam[player.team])
            pos[0] = ctx.pos[keyOf(player)][0];
          else if (groupX && groupX[keyOf(player)] != null)
            pos[0] = groupX[keyOf(player)];
          acc.moves.push({ team: player.team, n: player.n, to: pos });
          acc.destNames.push(namedDest);
          beatPos[keyOf(player)] = pos.slice();
          for (let g = 0; g < grabCount; g++)
            addGrab(acc, player, takeNearestBall(ctx, pos));
        });
      } else if (op[0] === "*") {
        const refText = op.slice(1).trim();
        if (/^\d+$/.test(refText)) {
          // grab count: U8*2 takes the two nearest loose balls
          actors.forEach(function (player) {
            const pos = beatPos[keyOf(player)] || ctx.pos[keyOf(player)];
            for (let g = 0; g < parseInt(refText, 10); g++)
              addGrab(acc, player, takeNearestBall(ctx, pos));
          });
        } else if (!refText) {
          actors.forEach(function (player) {
            const pos = beatPos[keyOf(player)] || ctx.pos[keyOf(player)];
            addGrab(acc, player, takeNearestBall(ctx, pos));
          });
        } else {
          if (group) fail("a group can't grab one specific ball: " + tok);
          const ref = parseBallRef(refText, tokens[i + 1]);
          i += ref.consumed;
          addGrab(acc, actors[0], takeSpecificBall(ctx, ref));
        }
      } else if (op[0] === ">") {
        if (group) fail("one passer per token: " + tok);
        acc.passes.push({ from: actors[0], to: parsePlayerFull(op.slice(1)) });
      } else if (op[0] === "@") {
        if (group) fail("one thrower per token: " + tok);
        const player = actors[0];
        const th = parseThrowSuffix(op.slice(1), tok);
        const out = { from: player, to: th.target };
        if (th.curve !== null) out.curve = th.curve;
        if (th.outcome && th.outcome !== "!")
          out.outcome = outcomeName(th.outcome);
        acc.throws.push(out);
        if (th.outcome === "^") {
          addSimple(acc, "catches", th.target);
          addSimple(acc, "outs", player);
        } else if (th.outcome === "%") {
          addSimple(acc, "dodges", th.target);
        } else if (th.outcome === "#") {
          addSimple(acc, "blocks", th.target);
        }
      } else if (op[0] === "?") {
        // pump-fake, with an optional rep count: U3?2 = fake twice (part of the
        // call, e.g. "kill left 2, 2" = target 2, two pump-fakes).
        var fm = /^\?(\d*)$/.exec(op);
        if (!fm) fail("bad fake token: " + tok);
        var reps = fm[1] ? parseInt(fm[1], 10) : 1;
        actors.forEach(function (player) {
          acc.fakes.push({ team: player.team, n: player.n, reps: reps });
        });
      } else if (op === "#") {
        actors.forEach(function (player) {
          addSimple(acc, "blocks", player);
        });
      } else if (op === "^") {
        actors.forEach(function (player) {
          addSimple(acc, "catches", player);
        });
      } else if (op === "%") {
        actors.forEach(function (player) {
          addSimple(acc, "dodges", player);
        });
      } else if (op === "X" || op === "x") {
        actors.forEach(function (player) {
          addSimple(acc, "outs", player);
        });
      } else {
        fail("unknown action: " + tok);
      }
    }

    // ── auto-curves: aesthetics belong to the engine, not the author ──
    // simultaneous throws at one target fan apart; a dodged throw bows so the
    // miss reads. Any explicit ~deg wins.
    const byTarget = {};
    acc.throws.forEach(function (th) {
      const k = th.to.team + "-" + th.to.n;
      (byTarget[k] = byTarget[k] || []).push(th);
    });
    Object.keys(byTarget).forEach(function (k) {
      const list = byTarget[k].filter(function (th) {
        return th.curve == null;
      });
      if (byTarget[k].length > 1) {
        list.forEach(function (th, idx) {
          th.curve = Math.round((idx - (list.length - 1) / 2) * AUTO_FAN);
        });
      } else if (list.length === 1 && list[0].outcome === "dodged") {
        list[0].curve = AUTO_DODGE;
      }
    });
    acc.throws.forEach(function (th) {
      if (th.curve === 0) delete th.curve;
    });

    Object.keys(beatPos).forEach(function (k) {
      ctx.pos[k] = beatPos[k];
    });

    // ── beat caption: a terse summary derived strictly from the actions ──
    // ("parley", "1 pump fake", "throw at 5"). It lands in the compiled JSON
    // as step.summary, so raw-JSON authors can write their own.
    const summaryParts = [];
    if (acc.moves.length) {
      const named = acc.destNames.filter(function (d) {
        return d != null;
      });
      const uniq = named.filter(function (d, i) {
        return named.indexOf(d) === i;
      });
      // one phrase per named formation, in the order the beat mentions them;
      // moves to exact depths or (x,y) points stay a plain "move".
      uniq.forEach(function (d) {
        const count = named.filter(function (x) {
          return x === d;
        }).length;
        summaryParts.push(
          d === "huddle"
            ? count === 1
              ? "to the middle"
              : "parley: call play and choose target"
            : d === "line"
              ? "to the line"
              : d === "back"
                ? "fall back"
                : "to " + d,
        );
      });
      if (named.length < acc.moves.length) summaryParts.push("move");
    }
    if (acc.grabs.length) summaryParts.push("grab");
    if (acc.passes.length) summaryParts.push("pass");
    if (acc.fakes.length) {
      let reps = 1;
      acc.fakes.forEach(function (f) {
        if ((f.reps || 1) > reps) reps = f.reps || 1;
      });
      summaryParts.push(reps + " pump fake" + (reps > 1 ? "s" : ""));
    }
    if (acc.throws.length) {
      const targets = [];
      acc.throws.forEach(function (th) {
        if (targets.indexOf(th.to.n) < 0) targets.push(th.to.n);
      });
      summaryParts.push("throw at " + targets.join(" & "));
    }

    const step = {};
    if (acc.label !== null) step.label = acc.label;
    if (summaryParts.length) step.summary = summaryParts.join(" \u00b7 ");
    step.dur = acc.dur;
    [
      "moves",
      "grabs",
      "passes",
      "throws",
      "fakes",
      "blocks",
      "catches",
      "dodges",
      "outs",
      "returns",
    ].forEach(function (name) {
      if (acc[name].length) step[name] = acc[name];
    });
    return step;
  }

  function parseBeats(text, setup) {
    const chunks = beatChunks(text);
    const ctx = runtimeFor(setup);
    return chunks.map(function (chunk) {
      return parseBeat(chunk, ctx);
    });
  }

  function parse(text) {
    if (typeof text !== "string") fail("input must be a string");
    const tagRead = readTags(text.replace(/\r\n?/g, "\n"));
    const dbfRead = readDbf(tagRead.rest);
    const tags = tagRead.tags;
    let setup;
    if (dbfRead.dbf != null) {
      setup = parseDbf(dbfRead.dbf);
      // [Balls] over an explicit DBF is authoritative for who starts loaded
      if (tags.balls) {
        const flags = parseBallsTag(tags.balls);
        setup.us.forEach(function (p) {
          p.ball = !!flags.us[p.n];
        });
        setup.them.forEach(function (p) {
          p.ball = !!flags.them[p.n];
        });
      }
    } else {
      setup = impliedSetup(tags);
    }
    const name = tags.play || tags.name || tags.id || "Untitled Play";
    const play = {
      id: tags.id || slugify(name),
      name: name,
    };
    if (tags.badge != null) play.badge = tags.badge;
    if (tags.call != null) {
      // a call is something you shout — the quotes are presentation, so the
      // author shouldn't have to escape them: [Call "Home"] renders "Home"
      play.call = /^["“]/.test(tags.call) ? tags.call : '"' + tags.call + '"';
    }
    if (tags.desc != null) play.desc = tags.desc;
    if (tags.description != null && play.desc == null)
      play.desc = tags.description;
    play.setup = setup;
    play.steps = parseBeats(dbfRead.rest, setup);
    return play;
  }

  function mountOptions(el) {
    return {
      autoplay: el.hasAttribute("data-autoplay"),
      loop: el.hasAttribute("data-loop"),
      speed: parseFloat(el.getAttribute("data-speed")) || 1,
    };
  }

  function autoInit() {
    if (!global.document || !global.DodgeballPlay) return;
    global.document
      .querySelectorAll("[data-db-play-dbn]")
      .forEach(function (el) {
        if (el.__dbnMounted) return;
        el.__dbnMounted = true;
        const attr = el.getAttribute("data-db-play-dbn");
        const source = attr && attr.trim() ? attr : el.textContent;
        try {
          const play = parse(source || "");
          el.textContent = "";
          global.DodgeballPlay.mount(el, play, mountOptions(el));
        } catch (err) {
          el.textContent = "[" + err.message + "]";
          if (global.console && global.console.error) global.console.error(err);
        }
      });
  }

  global.DBN = { parse: parse, autoInit: autoInit };
  if (global.document) {
    if (global.document.readyState !== "loading") autoInit();
    else global.document.addEventListener("DOMContentLoaded", autoInit);
  }
})(typeof window !== "undefined" ? window : globalThis);
