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
  /\.dbp__scrub\{[^}]*height:40px[^}]*padding:0[^}]*background:#111/,
  "timeline is a black band filling its control row",
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
  /PLAYER_LABEL_SIZE = 32/,
  "player labels remain readable when the SVG scales down",
);

console.log("  ✓ widget styles are isolated from the playbook page");
