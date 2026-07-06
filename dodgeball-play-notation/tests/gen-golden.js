/* Regenerate the parity golden from the example plays.
 * Run: node tests/gen-golden.js
 *
 * The golden (tests/fixtures/plays.js) is a snapshot of the canonical parser's
 * output for every examples/*.dbn. parse.test.js compares fresh parser output
 * to this snapshot, so a behavioral regression in the vendored parser is caught.
 * Regenerate intentionally (and review the diff) whenever the plays or the
 * parser legitimately change.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = { console };
ctx.window = ctx;
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "vendor", "dbn.js"), "utf8"), ctx, { filename: "dbn.js" });

const exDir = path.join(root, "examples");
const ids = fs.readdirSync(exDir).filter((f) => f.endsWith(".dbn")).map((f) => path.basename(f, ".dbn")).sort();

const golden = {};
for (const id of ids) {
  golden[id] = JSON.parse(JSON.stringify(ctx.DBN.parse(fs.readFileSync(path.join(exDir, id + ".dbn"), "utf8"))));
}

const header =
  "/* GOLDEN FIXTURE (8-a-side) — snapshot of the parser output for the example\n" +
  " * plays. Regenerated intentionally; the parity test compares parser output to\n" +
  " * this so behavioral regressions are caught. Regenerate with tests/gen-golden.js. */\n";
const body = "(function(g){ g.DB_PLAYS = " + JSON.stringify(golden, null, 2) + "; })(typeof window!==\"undefined\"?window:globalThis);\n";
fs.writeFileSync(path.join(root, "tests", "fixtures", "plays.js"), header + body);
console.log("golden regenerated: " + ids.length + " plays (" + ids.join(", ") + ")");
