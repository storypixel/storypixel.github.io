const assert = require("assert");
const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(path.join(__dirname, "..", "src", "editor.js"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const match = source.match(/function smartQuotedCall\(value\) \{[\s\S]*?\n  \}/);
const summaryMatch = source.match(/function stepSummary\(step\) \{[\s\S]*?\n  \}/);

assert.ok(match, "smartQuotedCall formatter exists");
const smartQuotedCall = Function(match[0] + "; return smartQuotedCall;")();
assert.ok(summaryMatch, "stepSummary formatter exists");
const stepSummary = Function(summaryMatch[0] + "; return stepSummary;")();

assert.strictEqual(smartQuotedCall('"Inside 5, 1"'), "“Inside 5, 1”");
assert.strictEqual(smartQuotedCall("“Home”"), "“Home”");
assert.strictEqual(smartQuotedCall("'Away'"), "“Away”");
assert.strictEqual(smartQuotedCall("Middle"), "“Middle”");
assert.strictEqual(stepSummary({ fakes:[{ n:1, reps:1 }, { n:8, reps:1 }] }), "1 pump fake");
assert.strictEqual(stepSummary({ fakes:[{ n:3, reps:2 }, { n:4, reps:2 }, { n:5, reps:2 }] }), "2 pump fakes");
assert.strictEqual(stepSummary({ moves:[{}, {}, {}, {}], fakes:[{ n:1, reps:1 }, { n:8, reps:1 }] }), "4 moves · 1 pump fake");
assert.match(html, /class="preview-wrap"><div class="play-stage" id="stage"/, "playbook stage has a low-specificity presentation class");
assert.match(html, /\.play-stage \{ max-width:520px; margin:0; \}/, "playbook page renders the animator at the compact width");

console.log("  ✓ page presentation uses clean calls and a compact play width");
