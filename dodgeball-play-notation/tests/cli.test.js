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

console.log(`\n${pass} CLI checks passed.`);
