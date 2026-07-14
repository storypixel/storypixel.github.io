const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const editor = fs.readFileSync(path.join(root, "src/editor.js"), "utf8");
const engine = fs.readFileSync(
  path.join(root, "vendor/play-animator.js"),
  "utf8",
);
const pageCss = (html.match(/<style>([\s\S]*?)<\/style>/) || ["", ""])[1];

assert.ok(
  !/\.dbp(?:__|\b)/.test(pageCss),
  "outer page CSS must never target the DBP widget",
);
assert.match(
  editor,
  /attachShadow\(\{ mode:"open" \}\)/,
  "editor mounts the widget in Shadow DOM",
);
assert.match(
  engine,
  /container\.getRootNode/,
  "engine resolves the widget render root",
);
assert.match(
  engine,
  /all:initial/,
  "widget root resets inherited page presentation",
);
assert.match(
  engine,
  /styledRoots = new WeakSet/,
  "styles are isolated and installed once per render root",
);

// The transport and court use the same strong, square visual language. These
// checks intentionally lock down the defects that are easiest to reintroduce
// when the embedded player CSS is edited in isolation.
assert.match(
  engine,
  /\.dbp\{[^}]*border:2px solid #34424b/,
  "widget frame matches the center-line weight and color",
);
assert.match(
  engine,
  /\.dbp__stage\{[^}]*border-bottom:2px solid #34424b/,
  "court has a visible bottom edge",
);
assert.match(
  engine,
  /\.dbp__stage\{[^\n]*touch-action:auto/,
  "vertical page scrolling remains available when a gesture starts on the court",
);
assert.match(
  engine,
  /\.dbp__scrub\{[^}]*touch-action:none/,
  "only the draggable timeline claims its pointer gesture",
);
assert.match(
  engine,
  /\.dbp__scrub\{[^}]*height:40px[^}]*padding:0 12px[^}]*background:#111/,
  "black band spans full width; scrub line is inset to the button's width",
);
assert.match(
  engine,
  /\.dbp__track\{[^}]*height:100%[^}]*border:0[^}]*background:#111/,
  "timeline rail runs edge-to-edge without an inset frame",
);
assert.match(
  engine,
  /\.dbp__fill\{[^}]*background:#111/,
  "timeline progress does not split the rail into another color",
);
assert.match(
  engine,
  /\.dbp__node\{[^}]*border:0/,
  "timeline nodes are unboxed ticks",
);
// Flush-ends system: every tick and the playhead use left:p% +
// translateX(-p%), so at 0% and 100% they sit fully inside the rail and the
// scrub line's outer extents match the play button's edges exactly.
assert.match(
  engine,
  /node\.style\.transform = `translateX\(-\$\{nodePct\}%\)`/,
  "ticks travel flush within the rail (left:p% + translateX(-p%))",
);
assert.match(
  engine,
  /thumbEl\.style\.transform = `translateX\(-\$\{pct\}%\)`/,
  "the playhead travels flush within the rail, never past the button edges",
);
assert.doesNotMatch(
  engine,
  /\.dbp__(?:node|thumb)\{[^}]*translateX\(-50%\)/,
  "no static centering transform may fight the flush-ends positioning",
);
assert.doesNotMatch(
  engine,
  /\.dbp__track\{[^}]*overflow:hidden/,
  "the track must not clip the edge ticks to half width",
);
assert.match(
  engine,
  /dbp__node--end/,
  "a terminus tick marks the end of the play",
);
assert.match(
  engine,
  /\.dbp__thumb\{[^}]*top:50%[^}]*width:14px;height:14px[^}]*background:#fff[^}]*box-shadow:none/,
  "playhead is a small white square riding the rail",
);
assert.match(
  engine,
  /\.dbp__track::before\{[^}]*top:50%[^}]*height:2px[^}]*background:#fff/,
  "a thin white rail runs through the center of the band",
);
assert.match(
  engine,
  /\.dbp__ctrls\{[^}]*padding:12px/,
  "play button uses even inset spacing",
);
assert.match(
  engine,
  /\.dbp__caption\{[^}]*border-bottom:2px solid #34424b[^}]*background:#fff[^}]*text-align:left/,
  "beat caption is a plain white left-aligned strip under the frame line",
);
assert.doesNotMatch(
  engine,
  /dbp__capbox/,
  "the caption text carries no box of its own",
);
assert.match(
  engine,
  /1\. starting position/,
  "state 1 is the untouched court, before any beat runs",
);
assert.match(
  engine,
  /\.dbp__btn\{[^}]*border-radius:0/,
  "play button has square corners",
);
assert.match(
  engine,
  /\.dbp__btn\{[^}]*padding:0/,
  "play button does not inherit uneven native padding",
);
assert.match(
  engine,
  /\.dbp__btn\{[^}]*background:\$\{COL\.court\}/,
  "play button shares the court's surface color",
);
// a dodge must read as a miss: the flight record carries the outcome, the
// ball overshoots, and the target sidesteps
assert.match(
  engine,
  /outcome: th\.outcome/,
  "compiled flights carry their outcome",
);
assert.match(
  engine,
  /dodgeShift/,
  "dodged targets sidestep while the ball passes",
);
assert.match(
  engine,
  /\(ta\.x - fa\.x\) \* 0\.3/,
  "a dodged ball overshoots past the target",
);
assert.match(
  engine,
  /PLAYER_LABEL_SIZE = 32/,
  "player labels remain readable when the SVG scales down",
);
assert.match(
  engine,
  /@media\(max-width:480px\)\{\.dbp\{font-size:16px\}\.dbp__caption\{font-size:1rem\}\}/,
  "widget captions use a readable mobile type size inside the isolated styles",
);

console.log("  ✓ widget styles are isolated from the playbook page");
