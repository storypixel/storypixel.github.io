const assert = require("assert");
const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(path.join(__dirname, "..", "src", "editor.js"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const notation = fs.readFileSync(path.join(__dirname, "..", "NOTATION.md"), "utf8");
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
assert.match(html, /content="width=device-width, initial-scale=1, viewport-fit=cover"/, "mobile viewport accounts for phone safe areas");
assert.match(html, /\/\* Responsive outer shell\. \*\//, "responsive shell rules are kept after the presentation overrides");
assert.ok(
  html.indexOf("/* Responsive outer shell. */") > html.lastIndexOf(".play-stage { max-width:520px; margin:0; }"),
  "responsive shell wins over the legacy left-aligned stage rule",
);
assert.match(html, /\.play-stage \{ margin-inline:auto; max-width:var\(--play-max-width\); width:min\(100%,var\(--play-max-width\)\); \}/, "playbook page keeps the compact animator centered at every width");
assert.match(html, /--mobile-root-size:112\.5%/, "phone layout uses an 18px root type size");
assert.match(html, /\.brand-title \{ font-size:clamp\(1\.5rem,8vw,1\.75rem\); line-height:1\.05; white-space:nowrap; \}/, "phone title remains readable without wrapping");
assert.match(html, /\.btn, select \{ font-size:1rem; min-height:var\(--touch-target\); \}/, "phone controls are readable touch targets");
assert.doesNotMatch(notation, /[^\x00-\x7F]/, "directly served notation stays ASCII-safe instead of rendering mojibake");

// One master page: the index links to inline anchors, never to per-play pages.
assert.match(html, /id="plays-doc"/, "the master page carries every play inline");
assert.match(source, /function renderPlaysDoc\(/, "editor renders the inline play sections");
assert.match(source, /link\.href = "#" \+ encodeURIComponent/, "play links are same-page anchors");
assert.doesNotMatch(source, /href = "\?play=/, "no link routes to a dedicated play page");
assert.match(source, /history\.replaceState\(null, "", window\.location\.pathname \+ "#"/, "?play= deep links redirect to their anchor");

console.log("  ✓ page presentation uses clean calls and a centered responsive play width");
