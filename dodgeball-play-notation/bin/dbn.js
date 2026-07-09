#!/usr/bin/env node
/**
 * dbn — a friendly CLI for Dodgeball Notation (DBN).
 *
 * Built so an AGENT can drive the playmaking end-to-end from a terminal:
 * write a play as text, validate it, SEE it (text court, no browser), describe
 * it in words, scaffold a new one, and get a live preview link. No DOM needed —
 * everything here runs on the pure parser + a headless beat simulator.
 *
 * Usage:  dbn <command> [play.dbn] [flags]     ·     dbn help
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
require(path.join(ROOT, "vendor", "dbn.js")); // sets globalThis.DBN
const DBN = globalThis.DBN;
const EXAMPLES = path.join(ROOT, "examples");
const LIVE = "https://iamnotsam.com/dodgeball-play-notation/";

// ── tiny arg parsing ──
const argv = process.argv.slice(2);
const cmd = argv[0];
const args = argv.slice(1).filter((a) => !a.startsWith("-"));
const flags = Object.fromEntries(
  argv.filter((a) => a.startsWith("-")).map((a) => {
    const [k, v] = a.replace(/^-+/, "").split("=");
    return [k, v === undefined ? true : v];
  })
);

function readPlay(arg) {
  let text;
  if (!arg || arg === "-") text = fs.readFileSync(0, "utf8"); // stdin
  else {
    // accept a path, or a bare example name ("kill-left")
    const p = fs.existsSync(arg) ? arg : path.join(EXAMPLES, arg.replace(/\.dbn$/, "") + ".dbn");
    if (!fs.existsSync(p)) die(`no such play: ${arg}  (try: dbn examples)`);
    text = fs.readFileSync(p, "utf8");
  }
  return { text, play: DBN.parse(text) };
}
function die(msg, code = 1) { process.stderr.write("✗ " + msg + "\n"); process.exit(code); }

// ── headless beat simulator (mirrors the engine's compile()) ──
// Returns one snapshot per beat: every actor's position/balls/out + this beat's
// actions. This is what powers `show` and `describe` — the same truth the
// animation renders, minus the tweening.
function simulate(play) {
  const actors = new Map(); // "team-n" -> {team,n,x,y,balls,out}
  for (const team of ["us", "them"]) {
    (play.setup?.[team] || []).forEach((p) =>
      actors.set(`${team}-${p.n}`, { team, n: p.n, x: p.x, y: p.y, balls: p.ball ? 1 : 0, out: false })
    );
  }
  const key = (t, n) => `${t}-${n}`;
  const beats = [];
  (play.steps || []).forEach((st, i) => {
    (st.moves || []).forEach((m) => { const a = actors.get(key(m.team, m.n)); if (a && m.to) { a.x = m.to[0]; a.y = m.to[1]; } });
    (st.grabs || []).forEach((g) => { const a = actors.get(key(g.team, g.n)); const ids = g.balls || (g.ball != null ? [g.ball] : [null]); if (a) a.balls += ids.length; });
    (st.passes || []).forEach((p) => { const f = actors.get(key(p.from.team, p.from.n)), t = actors.get(key(p.to.team, p.to.n)); if (f) f.balls = Math.max(0, f.balls - 1); if (t) t.balls += 1; });
    (st.throws || []).forEach((th) => {
      const f = actors.get(key(th.from.team, th.from.n)), t = actors.get(key(th.to.team, th.to.n));
      if (f) f.balls = Math.max(0, f.balls - 1);
      if (th.outcome === "dodged" || th.outcome === "blocked") { /* nobody out */ }
      else if (th.outcome === "caught") { if (f) f.out = true; }
      else if (t) t.out = true;
    });
    beats.push({
      i, label: st.label || `Beat ${i + 1}`,
      actors: [...actors.values()].map((a) => ({ ...a })),
      moves: st.moves || [], throws: st.throws || [], passes: st.passes || [], grabs: st.grabs || [],
      fakes: st.fakes || [],
    });
  });
  return beats;
}

const list = (arr) => arr.map((x) => x.n).join(",");
const gname = (r) => `${r.team === "us" ? "us" : "them"} ${r.n}`;
const outcomeWord = (o) => o === "dodged" ? "dodged" : o === "blocked" ? "blocked" : o === "caught" ? "CAUGHT (thrower out)" : "hit";

// one-line words for a beat's actions (agent-legible semantics)
function beatActions(b) {
  const out = [];
  if (b.moves.length) {
    const byTeam = { us: [], them: [] };
    b.moves.forEach((m) => byTeam[m.team].push(m));
    for (const t of ["us", "them"]) if (byTeam[t].length) out.push(`${t} ${list(byTeam[t])} move to the line`);
  }
  if (b.grabs.length) b.grabs.forEach((g) => out.push(`${g.team} ${g.n} grabs a ball`));
  if (b.fakes.length) {
    const byTeam = {};
    b.fakes.forEach((f) => { const r = f.reps || 1; (byTeam[`${f.team}:${r}`] ||= []).push(f); });
    Object.entries(byTeam).forEach(([k, fs2]) => { const [t, r] = k.split(":"); out.push(`${t} ${list(fs2)} pump-fake ×${r}`); });
  }
  b.passes.forEach((p) => out.push(`${p.from.team} ${p.from.n} → passes to ${p.to.team} ${p.to.n}`));
  b.throws.forEach((th) => out.push(`${th.from.team} ${th.from.n} throws at ${th.to.team} ${th.to.n} — ${outcomeWord(th.outcome)}`));
  return out.length ? out : ["(hold)"];
}

// ── ASCII court: THEM on top, US on bottom, dashed center line ──
function courtGrid(actors) {
  const ROWS = 17, COLS = 48;
  const g = Array.from({ length: ROWS }, () => Array(COLS).fill(" "));
  const rowOf = (y) => Math.max(0, Math.min(ROWS - 1, Math.round((y / 100) * (ROWS - 1))));
  const colOf = (x) => Math.max(0, Math.min(COLS - 1, Math.round((x / 100) * (COLS - 1))));
  const mid = rowOf(50);
  for (let c = 0; c < COLS; c++) g[mid][c] = c % 2 ? "·" : " ";
  for (const a of actors) {
    const r = rowOf(a.y), c = colOf(a.x);
    g[r][c] = a.out ? "x" : String(a.n).slice(-1);
    if (a.balls > 0 && !a.out) { // ball sits toward the far line
      const br = r + (a.team === "us" ? -1 : 1);
      if (g[br] && g[br][c] === " ") g[br][c] = "o";
    }
  }
  return g.map((row) => "  " + row.join("")).join("\n");
}

// ── commands ──
const commands = {
  validate(arg) {
    let play;
    try { play = readPlay(arg).play; } catch (e) { die(e.message); }
    const nSteps = (play.steps || []).length;
    const us = (play.setup?.us || []).length, them = (play.setup?.them || []).length;
    console.log(`✓ valid — "${play.name}" · ${us}v${them} · ${nSteps} beat${nSteps === 1 ? "" : "s"}`);
  },

  show(arg) {
    const { play } = readPlay(arg);
    const beats = simulate(play);
    const only = flags.beat != null ? Number(flags.beat) - 1 : null;
    console.log(`${play.name}${play.call ? `  —  ${play.call}` : ""}\n${"═".repeat(52)}`);
    console.log("  THEM ▲ (top)          [ o = ball · x = out ]          US ▼ (bottom)\n");
    beats.forEach((b) => {
      if (only != null && b.i !== only) return;
      console.log(`Beat ${b.i + 1}/${beats.length} — ${b.label}`);
      console.log(courtGrid(b.actors));
      console.log("   · " + beatActions(b).join("\n   · ") + "\n");
    });
  },

  describe(arg) {
    const { play } = readPlay(arg);
    const beats = simulate(play);
    console.log(`# ${play.name}${play.badge ? ` (${play.badge})` : ""}`);
    if (play.call) console.log(`Call: ${play.call}`);
    if (play.desc) console.log(play.desc);
    console.log("");
    beats.forEach((b) => console.log(`${b.i + 1}. ${b.label}\n   - ${beatActions(b).join("\n   - ")}`));
  },

  json(arg) {
    const { play } = readPlay(arg);
    console.log(JSON.stringify(play, null, flags.pretty ? 2 : 0));
  },

  examples() {
    const files = fs.readdirSync(EXAMPLES).filter((f) => f.endsWith(".dbn")).sort();
    console.log(`Bundled plays (${files.length}) — use the name with any command, e.g. \`dbn show kill-left\`:\n`);
    for (const f of files) {
      const play = DBN.parse(fs.readFileSync(path.join(EXAMPLES, f), "utf8"));
      console.log(`  ${f.replace(".dbn", "").padEnd(14)} ${play.name.padEnd(14)} ${(play.call || "").slice(0, 40)}`);
    }
  },

  link(arg) {
    const { text } = readPlay(arg);
    const url = LIVE + "?dbn=" + encodeURIComponent(text) + (flags.autoplay ? "&autoplay=1" : "");
    console.log(url);
  },

  new(arg) {
    const name = arg || "New Play";
    // clean, valid play → stdout (so `dbn new X > play.dbn` writes a parseable file)
    process.stdout.write(`[Play "${name}"]
[Balls "U:34"]

1. {Step up}      :0.9  U34-line
2. {Pump-fake}    :1.2  U34?2
3. {Throw}        :1.0  U3@T2! U4@T2!
`);
    // grammar cheatsheet → stderr (guidance without polluting the file; DBN has no comments)
    process.stderr.write(`\nscaffolded a valid 3-beat play on stdout — redirect it to a file.
grammar:
  move   U3-line  (step up)  ·  U3-55  (exact depth)  ·  U3-(48,65)  (point)
  fake   U3?  ·  U3?2 (×reps)       group: U34-line = #3 and #4 together
  throw  U3@T2!  hit  ·  @T2^ caught  ·  @T2%  dodged  ·  @T2#  blocked
  grab   U9*      pass  U8>U5        balls: [Balls "U:34"] = our 3 and 4 hold
next:  dbn validate <file> && dbn show <file>   ·   preview: dbn link <file> --autoplay
full grammar: NOTATION.md\n`);
  },

  help() {
    console.log(`dbn — Dodgeball Notation CLI  ·  drive playmaking from the terminal

USAGE
  dbn <command> [play.dbn | example-name | -]  [flags]
  (a bare name like "kill-left" resolves to a bundled example; "-" reads stdin)

COMMANDS
  show <play>         Render each beat as a text court + action summary (no browser)
  describe <play>     Beat-by-beat play summary in plain words
  validate <play>     Parse and report OK / errors  (exit 1 on error)
  json <play>         Parsed play as JSON            [--pretty]
  link <play>         Live preview URL for the play  [--autoplay]
  new [name]          Print a starter .dbn template (with the grammar cheatsheet)
  examples            List the bundled example plays
  help                This

FLAGS
  --beat=N            (show) render only beat N
  --pretty            (json) indented output

EXAMPLES
  dbn examples
  dbn show kill-left
  dbn describe away
  dbn new "Corner Trap" > corner-trap.dbn
  dbn validate corner-trap.dbn && dbn link corner-trap.dbn --autoplay
  cat play.dbn | dbn show -

Grammar reference: NOTATION.md · Glossary: GLOSSARY.md · Browser driving: DRIVING.md`);
  },
};

const run = commands[cmd] || (cmd ? null : commands.help);
if (run === null) die(`unknown command: ${cmd}\n  run \`dbn help\``);
try { run(args[0]); } catch (e) { die(e.message); }
