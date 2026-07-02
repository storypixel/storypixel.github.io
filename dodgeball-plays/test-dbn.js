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
