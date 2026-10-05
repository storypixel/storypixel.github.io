"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const headless = require("../src/dbn-headless.js");
const DBN = globalThis.DBN;
const source = `[Play "Cover exit"]
[Players "8"]
[Ruleset "tpsl-foam-2026"]
[AdaptedFrom "wdbf-foam-2026"]
[RequiresPlayers "U:4+ T:1-6"]
[RequiresBalls "U:4 T:0-2"]
[PlayerAdvantage "us"]
[Burden "us"]
[ThrowClock "3.5+"]
[Blocking "allowed"]
[OpponentState "holding"]
[Balls "U:2468 T:37"]
1. {Two throw, two cover} U2@T5% U4@T5% U68?
`;
const play = headless.parse(source);
assert.deepStrictEqual(play.conditions, {
  livePlayers: { us: { min: 4, max: null }, them: { min: 1, max: 6 } },
  balls: { us: { min: 4, max: 4 }, them: { min: 0, max: 2 } },
  playerAdvantage: "us", burden: "us", throwClock: { min: 3.5, max: null },
  blocking: "allowed", opponentState: "holding",
});
assert.equal(play.ruleset, "tpsl-foam-2026");
assert.equal(play.adaptedFrom, "wdbf-foam-2026");
assert.equal(play.setup.us.length, 8, "ruleset never changes illustrated lineup");
assert.deepStrictEqual(JSON.parse(headless.toJSON(source)).conditions, play.conditions);

const parseTags = (tags) => headless.parse('[Play "Test"]\n' + tags);
const legacy = parseTags('');
assert.ok(!Object.hasOwn(legacy, "conditions"), "no new defaults in old JSON");
assert.ok(!Object.hasOwn(legacy, "ruleset"));
assert.deepStrictEqual(parseTags('[RequiresPlayers "t:2 u:3+"]').conditions.livePlayers,
  { them: { min: 2, max: 2 }, us: { min: 3, max: null } });
assert.deepStrictEqual(parseTags('[ThrowClock "0-2.5"]').conditions.throwClock, { min: 0, max: 2.5 });
assert.deepStrictEqual(parseTags('[RequiresBalls "U:0"]').conditions.balls.us, { min: 0, max: 0 });
assert.equal(parseTags('[OpponentState "Retreating"]').conditions.opponentState, "retreating");
assert.equal(parseTags('[PlayerAdvantage "even"]').conditions.playerAdvantage, "even");
assert.equal(parseTags('[Ruleset "USAD-FOAM-2026"]').ruleset, "usad-foam-2026");

for (const tags of [
  '[RequiresPlayers ""]', '[RequiresPlayers "U:0"]', '[RequiresPlayers "U:2.5"]',
  '[RequiresPlayers "U:6-2"]', '[RequiresPlayers "U:-1"]', '[RequiresPlayers "U:4++"]',
  '[RequiresPlayers "U:4junk"]', '[RequiresPlayers "X:4"]', '[RequiresPlayers "U:4 U:5"]',
  '[RequiresPlayers "U:4 T:"]', '[RequiresPlayers "U:4T:2"]', '[RequiresPlayers "U:4, T:2"]',
  '[RequiresBalls "U:1.5"]', '[RequiresBalls "U:2-1"]', '[RequiresBalls "T:NaN"]',
  '[ThrowClock "-1"]', '[ThrowClock "Infinity"]', '[ThrowClock "3 seconds"]',
  '[ThrowClock "5-2"]', '[ThrowClock "9007199254740992"]',
  '[RequiresPlayers "U:9007199254740992"]', '[Ruleset ""]', '[Ruleset "USA Foam"]',
  '[AdaptedFrom ""]', '[Burden "left"]', '[Blocking "yes"]',
  '[OpponentState "whatever"]', '[PlayerAdvantage "more"]',
  '[RequiresPlayers "U:4"] [requiresplayers "U:5"]',
  '[Ruleset "usad-foam-2026"] [Ruleset "wdbf-foam-2026"]',
  '[RequiresPlayers "U:2 T:5"] [PlayerAdvantage "us"]',
  '[RequiresPlayers "U:5+ T:2-4"] [PlayerAdvantage "them"]',
  '[RequiresPlayers "U:1-2 T:3-4"] [PlayerAdvantage "even"]',
]) assert.throws(() => parseTags(tags), /DBN parse error/, tags);

const state = {
  ruleset: "tpsl-foam-2026", livePlayers: { us: 4, them: 3 }, balls: { us: 4, them: 2 },
  burden: "us", throwClock: 3.5, blocking: "allowed", opponentState: "holding",
};
assert.deepStrictEqual(DBN.checkConditions(play, state), { matches: true, unmet: [], unknown: [] });
assert.deepStrictEqual(headless.checkConditions(source, state), DBN.checkConditions(play, state));
assert.deepStrictEqual(headless.checkConditions(play, state), DBN.checkConditions(play, state));
assert.deepStrictEqual(DBN.checkConditions(legacy, {}), { matches: true, unmet: [], unknown: [] });
const missing = DBN.checkConditions(play, {});
assert.equal(missing.matches, null);
assert.deepStrictEqual(missing.unmet, []);
assert.deepStrictEqual(missing.unknown, ["ruleset", "livePlayers.us", "livePlayers.them", "balls.us", "balls.them",
  "playerAdvantage", "burden", "throwClock", "blocking", "opponentState"]);
assert.equal(DBN.checkConditions(play).matches, null);
const failed = DBN.checkConditions(play, { ...state, livePlayers: { us: 3, them: 4 }, throwClock: 3 });
assert.deepStrictEqual(failed, { matches: false, unmet: ["livePlayers.us", "playerAdvantage", "throwClock"], unknown: [] });
assert.equal(DBN.checkConditions(play, { ruleset: "wdbf-foam-2026" }).matches, false,
  "an adaptation source does not count as its target ruleset");
assert.deepStrictEqual(DBN.checkConditions(parseTags('[RequiresPlayers "U:4+"]'), { livePlayers: { us: 4 } }),
  { matches: true, unmet: [], unknown: [] });
assert.equal(DBN.checkConditions(parseTags('[RequiresBalls "T:1-2"]'), { balls: { them: 3 } }).matches, false);
assert.equal(DBN.checkConditions(parseTags('[ThrowClock "0-2.5"]'), { throwClock: 0 }).matches, true);
assert.equal(DBN.checkConditions(parseTags('[PlayerAdvantage "even"]'), { livePlayers: { us: 2, them: 2 } }).matches, true);
assert.equal(DBN.checkConditions(parseTags('[PlayerAdvantage "them"]'), { livePlayers: { us: 1, them: 2 } }).matches, true);
assert.equal(DBN.checkConditions(parseTags('[Blocking "no-blocking"]'), { blocking: "allowed" }).matches, false);
assert.equal(DBN.checkConditions(play, { ...state, burden: null }).matches, null);
assert.equal(DBN.checkConditions(play, { ...state, opponentState: "retreating" }).matches, false);
assert.equal(DBN.checkConditions(play, { ...state, burden: "US" }).matches, true);
for (const patch of [
  { throwClock: "3.5" }, { throwClock: -1 }, { throwClock: NaN }, { throwClock: Infinity },
  { livePlayers: { us: 2.5, them: 3 } }, { balls: { us: -1, them: 2 } },
  { blocking: "yes" }, { opponentState: "unknown" }, { burden: "left" }, { ruleset: "" },
  { ruleset: 2026 }, { livePlayers: "4v3" }, { balls: [4, 2] },
]) assert.throws(() => DBN.checkConditions(play, { ...state, ...patch }), /DBN/, JSON.stringify(patch));
assert.throws(() => DBN.checkConditions(play, []), /DBN/);
assert.deepStrictEqual(DBN.checkConditions(parseTags('[AdaptedFrom "wdbf-foam-2026"]'), {}),
  { matches: true, unmet: [], unknown: [] }, "provenance alone is not a prerequisite");
for (const [tag, value] of Object.entries({
  RequiresBalls: "U:1", PlayerAdvantage: "us", Burden: "us", ThrowClock: "3+",
  Blocking: "allowed", OpponentState: "attacking", AdaptedFrom: "wdbf-foam-2026",
})) assert.throws(() => parseTags(`[${tag} "${value}"] [${tag} "${value}"]`), /duplicate/);

// Boundary sweeps check inclusive ranges and the relational condition together.
const ranged = parseTags('[RequiresPlayers "U:2-4 T:1-3"] [PlayerAdvantage "us"]');
for (let us = 0; us <= 6; us++) {
  for (let them = 0; them <= 6; them++) {
    assert.equal(DBN.checkConditions(ranged, { livePlayers: { us, them } }).matches,
      us >= 2 && us <= 4 && them >= 1 && them <= 3 && us > them);
  }
}

const before = JSON.stringify({ play, state });
DBN.checkConditions(play, state);
assert.equal(JSON.stringify({ play, state }), before, "checking never mutates play/state");
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, "../vendor/dbn.js"), "utf8"), ctx);
assert.deepStrictEqual(JSON.parse(JSON.stringify(ctx.DBN.parse(source))), play, "browser and Node share the grammar");
assert.equal(ctx.DBN.checkConditions(ctx.DBN.parse(source), state).matches, true);
const example = headless.parse(fs.readFileSync(path.join(__dirname, "../examples/conditions/cover-and-retreat.dbn"), "utf8"));
assert.equal(example.setup.us.length, 6);
assert.equal(example.setup.us.filter((p) => p.ball).length, 4);
assert.equal(headless.checkConditions(example, {
  ruleset: "usad-foam-2026", livePlayers: { us: 4, them: 2 }, balls: { us: 4, them: 2 },
  burden: "us", throwClock: 3, blocking: "allowed", opponentState: "holding",
}).matches, true);
console.log("Play conditions: typed tags, validation, matching, headless and browser parity passed.");
