/* DBN headless — drive the notation with no DOM.
 *
 * Pure Node (also works in a browser). Turns a DBN string into:
 *   - the play JSON the animator consumes (via the canonical vendored parser)
 *   - a deterministic static SVG snapshot of the STARTING setup (positions +
 *     loose balls), useful for CI visual-diffing and agent screenshots without
 *     a browser. (Animation is a browser concern; this is the still frame.)
 *
 * The parser itself is canonical and vendored — this module only wraps it. It
 * never reimplements DBN.
 *
 *   const { parse, toJSON, toSetupSVG } = require("./src/dbn-headless.js");
 *   const play = parse(dbnText);          // play object
 *   const svg  = toSetupSVG(play);        // <svg>…</svg> string
 */
(function (root, factory) {
  // load the canonical parser however we can (Node require, or window.DBN)
  let DBN;
  if (typeof module !== "undefined" && module.exports) {
    DBN = require("../vendor/dbn.js") || (typeof global !== "undefined" && global.DBN);
    // vendor/dbn.js attaches to the global object; pick it up if require gave nothing
    if (!DBN && typeof global !== "undefined") DBN = global.DBN;
    module.exports = factory(DBN || (typeof global !== "undefined" ? global.DBN : undefined));
  } else {
    root.DBNHeadless = factory(root.DBN);
  }
})(typeof self !== "undefined" ? self : this, function (DBN) {
  "use strict";

  function getParser() {
    if (DBN && typeof DBN.parse === "function") return DBN;
    if (typeof global !== "undefined" && global.DBN && global.DBN.parse) return global.DBN;
    if (typeof window !== "undefined" && window.DBN && window.DBN.parse) return window.DBN;
    throw new Error("DBN parser not loaded (vendor/dbn.js)");
  }

  function parse(text) {
    return getParser().parse(text);
  }

  function toJSON(text, pretty) {
    return JSON.stringify(parse(text), null, pretty ? 2 : 0);
  }

  // ── deterministic static SVG of the starting setup ──
  // Mirrors the engine's court geometry so the snapshot lines up with the
  // animated view's first frame. Coords are 0..100 → a 1000×660 viewBox.
  const VB_W = 1000, VB_H = 660, PAD = 64;
  const CW = VB_W - PAD * 2, CH = VB_H - PAD * 2;
  const px = (nx) => +(PAD + (nx / 100) * CW).toFixed(2);
  const py = (ny) => +(PAD + (ny / 100) * CH).toFixed(2);
  const COL = { us: "#1f6feb", them: "#e5484d", ball: "#f2b705", court: "#0e1014", line: "#3a4150", center: "#6b7484", text: "#e6e8ec" };

  function esc(s) {
    return String(s).replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
  }

  function playerDots(players, team) {
    if (!players) return "";
    return players.map((p) => {
      const cx = px(p.x), cy = py(p.y);
      const ball = p.ball ? `<circle cx="${cx + 13}" cy="${cy - 13}" r="6" fill="${COL.ball}"/>` : "";
      return `<g><circle cx="${cx}" cy="${cy}" r="16" fill="${COL[team]}"/>` +
        `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="13" font-family="sans-serif" fill="#fff">${p.n}</text>${ball}</g>`;
    }).join("");
  }

  function looseBalls(balls) {
    if (!balls) return "";
    return balls.map((b) => `<circle cx="${px(b.x)}" cy="${py(b.y)}" r="7" fill="${COL.ball}" stroke="#0008"/>`).join("");
  }

  function toSetupSVG(playOrText) {
    const play = typeof playOrText === "string" ? parse(playOrText) : playOrText;
    const s = play.setup || {};
    const yCenter = py(50);
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" role="img" aria-label="${esc(play.name || "play")} setup">`,
      `<rect x="0" y="0" width="${VB_W}" height="${VB_H}" fill="${COL.court}"/>`,
      `<rect x="${PAD}" y="${PAD}" width="${CW}" height="${CH}" fill="none" stroke="${COL.line}" stroke-width="2"/>`,
      `<line x1="${PAD}" y1="${yCenter}" x2="${VB_W - PAD}" y2="${yCenter}" stroke="${COL.center}" stroke-width="2" stroke-dasharray="8 8"/>`,
      `<text x="${PAD + 6}" y="${PAD + 18}" font-size="14" font-family="sans-serif" fill="${COL.them}">THEM</text>`,
      `<text x="${PAD + 6}" y="${VB_H - PAD - 8}" font-size="14" font-family="sans-serif" fill="${COL.us}">US</text>`,
      looseBalls(s.balls),
      playerDots(s.them, "them"),
      playerDots(s.us, "us"),
      `</svg>`,
    ].join("");
  }

  return { parse, toJSON, toSetupSVG };
});
