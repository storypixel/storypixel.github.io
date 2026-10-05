// CLI smoke tests — the agent authoring loop must keep working.
"use strict";
const { execFileSync } = require("child_process");
const path = require("path");
const assert = require("assert");

const CLI = path.join(__dirname, "..", "bin", "dbn.js");
const run = (args, input) =>
  execFileSync("node", [CLI, ...args], { input, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
const runFail = (args, input) => {
  try { execFileSync("node", [CLI, ...args], { input, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }); return null; }
  catch (e) { return e; }
};

let pass = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); console.log("  ✓ " + msg); pass++; };

ok(run(["examples"]).includes("kill-left"), "examples lists bundled plays");
ok(run(["validate", "kill-left"]).includes("valid"), "validate accepts a good play");
ok(runFail(["validate", "-"], '[Play "X"]\n1. {b} U9@Z9!\n') !== null, "validate exits non-zero on a bad play");

const show = run(["show", "kill-left"]);
ok(/Beat 1\/4/.test(show) && show.includes("pump-fake"), "show renders beats + actions");
ok(/\bx\b/.test(show.split("Beat 4")[1] || ""), "show marks an out player (x) after the throw");

ok(run(["describe", "away"]).includes("throws at us 2"), "describe summarizes throws in words");

// the authoring loop: scaffold on stdout must itself be a valid play
const scaffold = run(["new", "Loop Test"]);
ok(scaffold.trim().startsWith("[Play"), "new writes a clean play to stdout");
ok(run(["validate", "-"], scaffold).includes("valid"), "the scaffold round-trips through validate");
ok(run(["describe", "-"], scaffold).includes("pump-fake"), "the scaffold describes cleanly");

ok(run(["link", "kill-left"]).startsWith("https://iamnotsam.com/"), "link emits a live preview URL");

const conditions = `[Play "Condition test"]
[Ruleset "usad-foam-2026"] [AdaptedFrom "wdbf-cloth-2026"]
[RequiresPlayers "U:4+ T:1-6"] [RequiresBalls "U:4 T:0-2"]
[PlayerAdvantage "us"] [Burden "us"] [ThrowClock "3+"]
[Blocking "allowed"] [OpponentState "holding"]
1. U1?
`;
const description = run(["describe", "-"], conditions);
ok(description.includes("Requires live players: us 4+, them 1-6") &&
  description.includes("Requires held balls: us 4, them 0-2"), "describe shows typed player and ball requirements");
ok(description.includes("Ruleset: usad-foam-2026") && description.includes("Adapted from: wdbf-cloth-2026") &&
  description.includes("Player advantage: us") && description.includes("Burden: us") &&
  description.includes("Throw clock: 3+ seconds remaining") && description.includes("Blocking: allowed") &&
  description.includes("Opponent state: holding"), "describe shows ruleset and situation conditions");
ok(run(["validate", "-"], conditions).includes("tournament legality not checked"), "validate distinguishes syntax from live eligibility");
ok(run(["show", "-"], conditions).includes("Requires live players:"), "show retains conditions beside the diagram");
ok(JSON.parse(run(["json", "-"], conditions)).conditions.livePlayers.us.min === 4, "json exports machine-readable conditions");
ok(runFail(["validate", "-"], '[Play "X"] [RequiresPlayers "U:3-1"]') !== null, "validate rejects malformed condition ranges");

console.log(`\n${pass} CLI checks passed.`);
