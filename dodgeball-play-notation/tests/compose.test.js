/* The describe-a-play page + converter service: English -> LLM -> DBN -> embed.
 * Locks the invariants that keep the flow honest:
 * - the page is a copy-the-prompt surface: the prompt is BUILT FROM the served
 *   NOTATION.md (single source of truth, never a paraphrased copy that can
 *   drift), and the page links the canonical rule docs — it makes NO model
 *   calls of its own and never touches key material
 * - the service keeps its key in the environment, follows the same
 *   spec-as-prompt discipline, validates replies with the real parser (one
 *   repair retry), and offers the free /validate check the agent flow uses
 * - pasted output is previewed by the real engine in an isolated shadow root
 *   and emitted via the public data-db-play-dbn auto-mount
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const page = fs.readFileSync(path.join(root, "compose.html"), "utf8");
const service = fs.readFileSync(
  path.join(root, "server", "convert.mjs"),
  "utf8",
);

// ── page: spec-as-prompt for the copy-a-prompt path ─────────────────────────
assert.match(
  page,
  /fetchText\("NOTATION\.md"\)/,
  "page prompt embeds the served NOTATION.md, not a copy",
);
assert.match(page, /examples\//, "page prompt anchors on real example plays");
assert.match(
  page,
  /cache: "no-cache"/,
  "spec fetch bypasses stale caches like the other live surfaces",
);
assert.match(
  page,
  /Reply with ONLY the DBN play text/,
  "the model is told to return bare notation",
);
assert.match(
  page,
  /buildClipboardPrompt/,
  "copy-prompt path builds a standalone prompt",
);
assert.match(page, /copy-prompt/, "copy-prompt button exists");
assert.match(
  page,
  /The user will describe their play in their next message/,
  "an empty description makes the AI ask in chat — the user never edits the pasted prompt",
);
assert.doesNotMatch(
  page,
  /DESCRIBE YOUR PLAY HERE|\[YOUR /,
  "no fill-in slots that force the user to edit the pasted prompt",
);

// ── page: links the canonical rule docs, makes no model calls of its own ────
assert.match(page, /href="NOTATION\.md"/, "links the notation rules");
assert.match(
  page,
  /href="https:\/\/iamnotsam\.com\/callbook\/agent\.md"/,
  "links the rules for AI agents",
);
assert.match(page, /href="GLOSSARY\.md"/, "links the glossary");
assert.match(page, /href="DRIVING\.md"/, "links the automation guide");
assert.doesNotMatch(
  page,
  /api\.anthropic\.com|x-api-key|anthropic-version|callbook\.klerb\.io\/convert/,
  "the page makes no model or converter calls of its own",
);
assert.doesNotMatch(
  page,
  /sk-ant|Bearer|api-key|localStorage/,
  "the page never touches key material",
);

// ── page: output flows through the real parser and engine ───────────────────
assert.match(
  page,
  /window\.DBN\.parse/,
  "output validates through the canonical parser",
);
assert.match(page, /attachShadow/, "preview mounts in an isolated shadow root");
assert.match(page, /DodgeballPlay\.mount/, "preview uses the real engine");
assert.match(
  page,
  /data-db-play-dbn/,
  "embed snippet uses the public auto-mount attribute",
);
assert.match(
  page,
  /index\.html\?dbn=/,
  "hands off to the editor via the deep link",
);
assert.match(
  page,
  /vendor\/play-animator\.js/,
  "page loads the engine it previews with",
);

// ── service: same spec-as-prompt discipline, key stays in the environment ───
assert.match(
  service,
  /CONVERT_API_KEY/,
  "service reads its key from the environment",
);
assert.doesNotMatch(
  service,
  /sk-[a-zA-Z0-9]/,
  "no literal key material in the service source",
);
assert.match(service, /NOTATION\.md/, "service prompt embeds the spec");
assert.match(
  service,
  /CONVERT_SPEC_BASE/,
  "service fetches the DEPLOYED spec (repo checkout is only the fallback)",
);
assert.match(
  service,
  /Reply with ONLY the DBN play text/,
  "service and page ask the model for bare notation",
);
assert.match(
  service,
  /dbn-headless/,
  "service validates replies with the real parser",
);
assert.match(
  service,
  /Fix it and reply with only the corrected DBN/,
  "service feeds the parse error back for one repair round",
);
assert.match(service, /rateCheck/, "service rate-limits per IP and per day");
assert.match(
  service,
  /access-control-allow-origin/i,
  "service scopes CORS to the allowlist",
);
assert.match(
  service,
  /127\.0\.0\.1/,
  "service binds loopback — the tunnel is the only public door",
);

// ── service: /validate — the free machine check for bring-your-own-agent ────
assert.match(
  service,
  /req\.url === "\/validate"/,
  "agents get a no-LLM validate endpoint",
);
assert.match(
  service,
  /\?dbn=" \+ encodeURIComponent/,
  "validate returns a ready-made animated view link",
);
assert.match(
  service,
  /valid: false, error:/,
  "validate reports parse errors instead of failing silently",
);

console.log(
  "  ✓ describe-a-play converter (compose.html + server/convert.mjs) invariants",
);
