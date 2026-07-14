const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;
const context = { console };
context.window = context;
context.globalThis = context;
vm.createContext(context);

["dbn.js", "plays.js"].forEach((file) => {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  vm.runInContext(source, context, { filename: file });
});

const pitchBackDbn = `
[Id "pitch-back"]
[Play "Pitch Back"]
[Badge "opening rush"]
[Call "\\\"Pitch back\\\""]
[Desc "Six balls sit on the center line \u2014 the right three are OURS, the left three are THEIRS. The two right-side players rush and grab our three (one grabs two, one grabs one). On the pitch back, a rusher tosses a ball straight back to an attacker, who steps up to mid-court and takes a free look \u2014 usually at one of the two opponents still backpedaling from their own rush."]
DBF "U:1(14,90),2(22,90),3(30,90),4(38,90),5(46,90),6(54,90),7(62,90),8(70,90),9(78,90),10(86,90) / T:1(14,10),2(22,10),3(30,10),4(38,10),5(46,10),6(54,10),7(62,10),8(70,10),9(78,10),10(86,10) / B:bU(80,50),bU(88,50),bU(96,50),bT(4,50),bT(12,50),bT(20,50)"

1. {Rush \u2014 the two on the right grab our three (2 + 1)} :1.3
   U10-(92,54) U9-(80,54) T1-(8,46) T2-(20,46)
   U10*bU(88,50) U10*bU(96,50) U9*bU(80,50)
   T1*bT(4,50) T1*bT(12,50) T2*bT(20,50)
2. {Pitch back \u2014 attacker steps up} :0.9
   U10>U6 U6-(54,68) T1-(10,30) T2-(22,30)
3. {Free look \u2014 hit a regressing rusher} :1.0
   T1-(12,20) T2-(24,20) U6@T2!~-20
`;

try {
  const actual = JSON.parse(JSON.stringify(context.DBN.parse(pitchBackDbn)));
  const expected = JSON.parse(JSON.stringify(context.DB_PLAYS["pitch-back"]));
  assert.deepStrictEqual(actual, expected);
  console.log("PASS dbn pitch-back deep-equals plays.js");
} catch (err) {
  console.error("FAIL dbn pitch-back deep-equals plays.js");
  console.error(err && err.stack ? err.stack : err);
  process.exitCode = 1;
}

// ── v0.2: implied setup, [Balls], groups, named depths, auto-curves ──
try {
  const play = JSON.parse(
    JSON.stringify(
      context.DBN.parse(`
[Play "Home"]
[Call "Home"]
[Balls "U:45 T:2468"]
1. {They bring it up} :1  T2468-line T4?
2. {Pre-counter} :1  T4@U5% U5@T4!
`),
    ),
  );
  assert.strictEqual(play.id, "home", "id slugifies from [Play]");
  assert.strictEqual(play.call, '"Home"', "call auto-quotes");
  assert.strictEqual(play.setup.us.length, 8, "implied 8-a-side");
  assert.deepStrictEqual(
    play.setup.them.filter((p) => p.ball).map((p) => p.n),
    [2, 4, 6, 8],
    "[Balls] flags THEM",
  );
  assert.strictEqual(
    play.setup.us[0].y,
    95,
    "US starts close to its back line",
  );
  assert.strictEqual(
    play.setup.them[0].y,
    5,
    "THEM starts close to its back line",
  );
  assert.deepStrictEqual(
    play.steps[0].moves.map((m) => [m.n, m.to[0], m.to[1]]),
    [
      [2, 36.285714285714285, 42],
      [4, 50, 42],
      [6, 63.71428571428571, 42],
      [8, 77.42857142857142, 42],
    ],
    "group fans one lane-unit apart, centered, a margin short of the line",
  );
  assert.strictEqual(
    play.steps[1].throws[0].curve,
    14,
    "dodged throw auto-bows",
  );
  assert.strictEqual(
    play.steps[1].throws[1].curve,
    undefined,
    "single hit stays straight",
  );
  const rush = JSON.parse(
    JSON.stringify(
      context.DBN.parse(`
[Play "Rush Demo"]
[Setup "rush"]
1. {Rush} :1.3  U78-line U8*2 U7* T12-line T1*2 T2*
`),
    ),
  );
  assert.strictEqual(rush.setup.balls.length, 6, "rush seeds 6 line balls");
  assert.deepStrictEqual(
    rush.steps[0].grabs.map((g) => [g.n, g.balls.length]),
    [
      [8, 2],
      [7, 1],
      [1, 2],
      [2, 1],
    ],
    "grab counts distribute 2+1",
  );
  const fan = JSON.parse(
    JSON.stringify(
      context.DBN.parse(`
[Play "Fan"]
[Balls "U:45"]
1. {Fire} U4@T5! U5@T5!
`),
    ),
  );
  assert.deepStrictEqual(
    fan.steps[0].throws.map((t) => t.curve),
    [-12, 12],
    "simultaneous throws fan",
  );
  const huddle = JSON.parse(
    JSON.stringify(
      context.DBN.parse(`
[Play "Set Offense"]
[Balls "U:1458"]
1. {Call it} U1458-huddle
2. {Fan out} U1458-line
`),
    ),
  );
  assert.deepStrictEqual(
    huddle.steps[0].moves.map((m) => m.n),
    [1, 4, 5, 8],
    "only the loaded players huddle",
  );
  assert.ok(
    huddle.steps[0].moves.every((m) => m.to[0] >= 39.5 && m.to[0] <= 60.5),
    "huddle remains tight across the middle",
  );
  assert.deepStrictEqual(
    huddle.steps[1].moves.map((m) => m.n),
    [1, 4, 5, 8],
    "only the loaded players fan out",
  );
  console.log(
    "PASS dbn v0.2 (implied setup, groups, formations, depths, auto-curves)",
  );
} catch (err) {
  console.error("FAIL dbn v0.2");
  console.error(err && err.stack ? err.stack : err);
  process.exitCode = 1;
}
