/* Formation vocabulary and play-choreography regressions. */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = { console };
ctx.window = ctx;
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(root, "vendor", "dbn.js"), "utf8"),
  ctx,
);

const formation = JSON.parse(
  JSON.stringify(
    ctx.DBN.parse(
      [
        '[Play "Formation regression"]',
        '[Balls "U:1458"]',
        "1. {Gather tight} U1458-huddle",
        "2. {Fan to the line} U1458-line",
      ].join("\n"),
    ),
  ),
);

assert.equal(formation.setup.us[0].x, 2, "U1 starts near the left sideline");
assert.equal(formation.setup.us[7].x, 98, "U8 starts near the right sideline");
assert.equal(formation.setup.us[0].y, 95, "US starts close to its back line");
assert.equal(
  formation.setup.them[0].y,
  5,
  "THEM starts close to its back line",
);

const huddle = formation.steps[0].moves;
assert.deepStrictEqual(
  huddle.map((m) => m.n),
  [1, 4, 5, 8],
  "only the loaded players join the offensive parley",
);
// shoulder-to-shoulder single rank: adjacent spacing ≈ one player diameter
const hx = huddle.map((m) => m.to[0]).sort((a, b) => a - b);
for (let i = 1; i < hx.length; i++) {
  const gap = hx[i] - hx[i - 1];
  assert.ok(
    gap >= 6 && gap <= 7,
    "huddle players stand shoulder to shoulder (gap " + gap.toFixed(2) + ")",
  );
}
assert.ok(
  huddle.every((m) => m.to[1] >= 83 && m.to[1] <= 91),
  "the huddle sits in one rank just forward of the US back line",
);
assert.ok(
  new Set(huddle.map((m) => m.to[1])).size === 1,
  "the huddle is a single row, not a staggered clump",
);

const line = formation.steps[1].moves;
assert.deepStrictEqual(
  line.map((m) => m.n),
  [1, 4, 5, 8],
  "only the loaded players fan out after the parley",
);
assert.ok(
  line.every((m) => m.to[1] === 58),
  "the formation stops a standard margin short of the center line",
);
// one standard lane-unit apart, centered — NOT their original lanes
assert.deepStrictEqual(
  line.map((m) => Number(m.to[0].toFixed(6))),
  [29.428571, 43.142857, 56.857143, 70.571429],
  "the loaded players fan out one lane-unit apart, centered on the group",
);

const setOffenses = [
  "three-ball",
  "insides",
  "insides-3",
  "outsides",
  "outsides-3",
  "kill-left",
  "kill-left-3",
  "kill-right",
  "kill-right-3",
];
for (const id of setOffenses) {
  const source = fs.readFileSync(
    path.join(root, "examples", id + ".dbn"),
    "utf8",
  );
  const play = JSON.parse(JSON.stringify(ctx.DBN.parse(source)));
  const holders = play.setup.us.filter((p) => p.ball).map((p) => p.n);
  assert.deepStrictEqual(
    play.steps[0].moves.map((m) => m.n),
    holders,
    id + " sends only ball holders to the parley",
  );
  assert.deepStrictEqual(
    play.steps[1].moves.map((m) => m.n),
    holders,
    id + " sends only those ball holders to the front line",
  );
}

for (const id of ["home", "away", "mirror", "pitch-back"]) {
  const source = fs.readFileSync(
    path.join(root, "examples", id + ".dbn"),
    "utf8",
  );
  assert.doesNotMatch(
    source,
    /-huddle/,
    id + " must not add a set-offense huddle",
  );
}

console.log("✓ formation geometry and offensive/defensive choreography");
