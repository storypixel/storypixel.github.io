"use strict";
const assert = require("assert");
const M = require("../src/builder-model.js");
const DBN = require("../src/dbn-headless.js");
const demo = M.demo(), text = M.generate(demo), play = DBN.parse(text);
assert.equal(M.isDraft(demo), true);
assert.equal(M.isDraft({ ...demo, name: "", players: 0 }), true, "unfinished drafts survive reload");
assert.equal(M.isDraft({ ...demo, steps: [{}] }), false);
assert.throws(() => DBN.parse('[Players "100000000"] 1. U1-line', { maxPlayers: 20 }), /20 players/);
assert.throws(() => DBN.parse('[Players "\\u0031\\u0030\\u0030"] 1. U1-line', { maxPlayers: 20 }), /20 players/);
assert.throws(() => DBN.parse(text, { maxSteps: 2 }), /2 steps/);
assert.equal(DBN.parse('[Players "20"] 1. U1-line', { maxPlayers: 20, maxSteps: 1 }).setup.us.length, 20);
assert.equal(play.steps.length, 4);
assert.equal(play.setup.us.filter((p) => p.ball).length, 4);
assert.equal(play.conditions.livePlayers.us.min, 4);
assert.equal(play.steps[0].moves.length, 4);
assert.equal(play.steps[1].throws.length, 2);
assert.equal(play.steps[1].fakes.length, 2);
const url = M.shareURL("https://example.com/dodgeball-play-notation/builder.html?private=x#old", text);
assert.equal(new URL(url).search, "");
assert.equal(M.readShared(new URL(url).hash), text);
assert.equal(M.readShared(""), null);
const q = M.fresh(); q.name = 'Say "go"\n[Play "other"]';
assert.equal(DBN.parse(M.generate(q)).name, q.name, "quoted data cannot inject tags");
q.steps[0].label = "{bad} \n 99. U1X";
assert.equal(DBN.parse(M.generate(q)).steps.length, 1);
for (const [edit, pattern] of [
  [(d) => d.name = "", /name/], [(d) => d.players = 20, /players/], [(d) => d.players = 2.5, /players/],
  [(d) => d.steps = [], /step/], [(d) => d.steps[0].actions = [], /action/],
  [(d) => d.steps[0].duration = 0, /duration/], [(d) => d.us = [9], /between/],
  [(d) => d.steps[0].actions[0].actors = "1,1", /twice/],
  [(d) => d.steps[0].actions[0].actors = "1 X", /commas/],
  [(d) => {d.steps[0].actions[0].kind = "throw"; d.steps[0].actions[0].actors = "1,2";}, /each throw/],
]) { const d = M.demo(); edit(d); assert.throws(() => M.generate(d), pattern); }
for (const kind of ["move", "fake", "throw", "pass", "dodge", "block", "catch", "out", "return"]) {
  const d = M.fresh(); d.steps[0].actions[0].kind = kind; d.steps[0].actions[0].target = "2";
  assert.doesNotThrow(() => DBN.parse(M.generate(d)), kind);
}
console.log("Guided builder generation, escaping, invalid inputs and share round trip passed.");
