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
// spread evenly across the FULL width — spread shooters minimize what a
// counter can hit and give different angles on a shared target
assert.deepStrictEqual(
  line.map((m) => Number(m.to[0].toFixed(6))),
  [2, 34, 66, 98],
  "the loaded players spread across the full width of the line",
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
  const fakeStep = play.steps.find((s) => s.fakes && s.fakes.length);
  if (fakeStep) {
    assert.deepStrictEqual(
      fakeStep.fakes.map((f) => f.n).sort((a, b) => a - b),
      holders,
      id + ": in a faking play, everyone who has a ball fakes",
    );
  }
}

// beat captions: every beat compiles a terse summary derived from its actions
const insides = JSON.parse(
  JSON.stringify(
    ctx.DBN.parse(
      fs.readFileSync(path.join(root, "examples", "insides.dbn"), "utf8"),
    ),
  ),
);
assert.deepStrictEqual(
  insides.steps.map((s) => s.summary),
  ["parley: call play and choose target", "to the line", "1 pump fake", "throw at 5"],
  "insides beats caption as parley / to the line / 1 pump fake / throw at 5",
);
// Middle: the lone bait player sits in the parley zone at midcourt — never
// crowding the center line — and his solo huddle move captions "to the middle"
const middle = JSON.parse(
  JSON.stringify(
    ctx.DBN.parse(
      fs.readFileSync(path.join(root, "examples", "middle.dbn"), "utf8"),
    ),
  ),
);
const bait = middle.steps[0].moves.find((m) => m.team === "us");
assert.deepStrictEqual(
  bait.to,
  [50, 87],
  "the middle bait player takes the parley spot, not a forward position",
);
assert.ok(
  middle.steps[0].summary.startsWith("to the middle"),
  "a lone huddle mover captions as taking the middle",
);

const killLeft = JSON.parse(
  JSON.stringify(
    ctx.DBN.parse(
      fs.readFileSync(path.join(root, "examples", "kill-left.dbn"), "utf8"),
    ),
  ),
);
assert.deepStrictEqual(
  killLeft.steps.map((s) => s.summary),
  ["parley: call play and choose target", "to the line", "2 pump fakes", "throw at 2"],
  "kill-left counts its two unison fakes in the caption",
);

// regress-and-pursue: on any beat where their attackers fall back while our
// counters advance, the counters stop at deep (halfway) — never at the line.
for (const id of ["home", "away", "mirror", "middle"]) {
  const play = JSON.parse(
    JSON.stringify(
      ctx.DBN.parse(
        fs.readFileSync(path.join(root, "examples", id + ".dbn"), "utf8"),
      ),
    ),
  );
  play.steps.forEach((step, i) => {
    const moves = step.moves || [];
    const theirRegress = moves.some((m) => m.team === "them" && m.to[1] <= 25);
    const ours = moves.filter((m) => m.team === "us");
    if (theirRegress && ours.length) {
      ours.forEach((m) =>
        assert.ok(
          m.to[1] >= 75,
          id + " beat " + (i + 1) + ": counters pursue to halfway, never past deep (y=" + m.to[1] + ")",
        ),
      );
    }
  });
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

const mirror = JSON.parse(
  JSON.stringify(
    ctx.DBN.parse(
      fs.readFileSync(path.join(root, "examples", "mirror.dbn"), "utf8"),
    ),
  ),
);
assert.deepStrictEqual(
  mirror.setup.us.filter((p) => p.ball).map((p) => p.n),
  [1, 4, 7],
  "mirror spreads our three holders across left, middle, and right roles",
);
assert.deepStrictEqual(
  mirror.steps[0].moves.map((m) => m.n),
  [2, 4, 6],
  "mirror sends only their loaded attackers to the line",
);
assert.deepStrictEqual(
  mirror.steps[2].moves.filter((m) => m.team === "us").map((m) => m.n),
  [1, 4, 7],
  "all three mirror holders step to the line",
);
assert.deepStrictEqual(
  mirror.steps[2].moves.filter((m) => m.team === "them").map((m) => m.n),
  [2, 4, 6],
  "their loaded attackers regress as our defense approaches",
);
assert.ok(
  mirror.steps[2].moves
    .filter((m) => m.team === "them")
    .every((m) => m.to[1] === 25),
  "their offense falls back to deep after the attack",
);
assert.deepStrictEqual(
  [mirror.steps[1].throws[0].from.n, mirror.steps[2].throws[0].from.n],
  [4, 4],
  "the attacking middle holder is answered by our middle holder",
);
assert.deepStrictEqual(
  [mirror.steps[1].throws.length, mirror.steps[2].throws.length],
  [1, 1],
  "mirror shows one attacking throw and one matching defensive throw",
);
assert.match(
  mirror.desc,
  /left answers left, middle answers middle, and right answers right/,
  "mirror explains role-for-role matching instead of nearest-player matching",
);
assert.match(
  mirror.desc,
  /one-ball attack.*first thrower/,
  "mirror defaults to answering the first thrower in a one-ball attack",
);
assert.match(
  mirror.desc,
  /multi-ball volley is a reset/,
  "mirror does not imply that three defensive holders answer a volley",
);

const away = JSON.parse(
  JSON.stringify(
    ctx.DBN.parse(
      fs.readFileSync(path.join(root, "examples", "away.dbn"), "utf8"),
    ),
  ),
);
assert.deepStrictEqual(
  away.steps[0].moves.map((m) => m.n),
  [2, 4, 6],
  "away sends only their loaded attackers to the line",
);
assert.deepStrictEqual(
  away.steps[2].moves.filter((m) => m.team === "us").map((m) => m.n),
  [4, 5, 6],
  "our away holders press the line together",
);
assert.deepStrictEqual(
  away.steps[2].moves.filter((m) => m.team === "them").map((m) => m.n),
  [2, 4, 6],
  "their loaded attackers regress as our away defense presses",
);
assert.ok(
  away.steps[2].moves
    .filter((m) => m.team === "them")
    .every((m) => m.to[1] === 25),
  "their offense falls back to deep during our press",
);

console.log("✓ formation geometry and offensive/defensive choreography");
