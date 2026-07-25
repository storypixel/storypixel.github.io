#!/usr/bin/env node
/* Callbook convert service: plain-English play description -> DBN.
 *
 * A minimal proxy so visitors never need their own LLM key: the page posts a
 * description, this service builds the spec-as-prompt (the live NOTATION.md
 * plus example plays, so the converter can never drift from the spec), calls
 * an OpenAI-compatible chat endpoint, VALIDATES the reply with the real DBN
 * parser, and retries once with the parse error before giving up.
 *
 * Zero dependencies (node >= 18). Configuration by environment:
 *   CONVERT_API_KEY   upstream key                       (required)
 *   CONVERT_BASE      OpenAI-compatible base URL         (default: https://opencode.ai/zen/v1)
 *   CONVERT_MODEL     model id                           (default: big-pickle)
 *   CONVERT_SPEC_BASE where NOTATION.md + examples live  (default: https://iamnotsam.com/dodgeball-play-notation/)
 *   PORT              listen port                        (default: 3199)
 *   ALLOWED_ORIGINS   comma-separated CORS allowlist     (default: https://iamnotsam.com,http://localhost:8770)
 *   RATE_PER_IP_HOUR  conversions per IP per hour        (default: 12)
 *   RATE_GLOBAL_DAY   conversions per day, all IPs       (default: 300)
 */
import http from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const dbn = require(join(here, "..", "src", "dbn-headless.js"));

const PORT = Number(process.env.PORT || 3199);
const API_KEY = process.env.CONVERT_API_KEY || "";
const BASE = (process.env.CONVERT_BASE || "https://opencode.ai/zen/v1").replace(/\/$/, "");
const MODEL = process.env.CONVERT_MODEL || "big-pickle";
const SPEC_BASE = (process.env.CONVERT_SPEC_BASE || "https://iamnotsam.com/dodgeball-play-notation/").replace(/\/?$/, "/");
const ORIGINS = (process.env.ALLOWED_ORIGINS || "https://iamnotsam.com,http://localhost:8770")
  .split(",").map((s) => s.trim()).filter(Boolean);
const RATE_PER_IP_HOUR = Number(process.env.RATE_PER_IP_HOUR || 12);
const RATE_GLOBAL_DAY = Number(process.env.RATE_GLOBAL_DAY || 300);
const EXAMPLES = ["home.dbn", "insides.dbn", "pitch-back.dbn"];
const SPEC_TTL_MS = 5 * 60 * 1000;

if (!API_KEY) {
  console.error("CONVERT_API_KEY is required");
  process.exit(1);
}

// ── spec-as-prompt, fetched from the deployed site so the prompt matches what
// visitors read; the repo checkout is the offline fallback ──────────────────
let specCache = { at: 0, system: null };
async function fetchSpecPart(name) {
  try {
    const r = await fetch(SPEC_BASE + name, { cache: "no-store" });
    if (r.ok) return await r.text();
  } catch (e) {}
  return readFileSync(join(here, "..", name), "utf8");
}
async function systemPrompt() {
  if (specCache.system && Date.now() - specCache.at < SPEC_TTL_MS) return specCache.system;
  const parts = await Promise.all(
    ["NOTATION.md", ...EXAMPLES.map((f) => "examples/" + f)].map(fetchSpecPart),
  );
  specCache = {
    at: Date.now(),
    system: [
      "You convert plain-English dodgeball play descriptions into DBN (Dodgeball Notation).",
      "",
      "The full spec is included below. Canonical source: " + SPEC_BASE + "NOTATION.md",
      "",
      "Rules:",
      "- Reply with ONLY the DBN play text. No code fences, no commentary, no explanation.",
      '- Start with [Play "..."], add [Balls "..."] when anyone starts loaded, then numbered beats.',
      "- Prefer named formations (huddle, line, mid, deep, back) over coordinates.",
      "- Every beat gets a short {label} written the way a coach talks.",
      "- Keep it minimal: only the players the description mentions act.",
      "- If the description is ambiguous, pick the most conventional reading — do not ask questions.",
      "",
      "The full DBN specification:",
      "",
      parts[0],
      "",
      "Example plays in DBN:",
      "",
      parts.slice(1).join("\n\n---\n\n"),
    ].join("\n"),
  };
  return specCache.system;
}

// ── rate limiting: per-IP hourly + global daily, in memory ──────────────────
const ipHits = new Map();
let globalDay = { day: "", count: 0 };
function rateCheck(ip) {
  const now = Date.now();
  const day = new Date().toISOString().slice(0, 10);
  if (globalDay.day !== day) globalDay = { day, count: 0 };
  if (globalDay.count >= RATE_GLOBAL_DAY) return "The converter hit its daily budget — try again tomorrow, or use the copy-prompt path with your own AI.";
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < 3600_000);
  if (hits.length >= RATE_PER_IP_HOUR) return "Rate limit: give it a few minutes, or use the copy-prompt path with your own AI.";
  hits.push(now);
  ipHits.set(ip, hits);
  globalDay.count++;
  return null;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, hits] of ipHits) {
    const live = hits.filter((t) => now - t < 3600_000);
    if (live.length) ipHits.set(ip, live); else ipHits.delete(ip);
  }
}, 600_000).unref();

// ── upstream call + validate + one repair round ─────────────────────────────
function stripFences(text) {
  const t = String(text || "").trim();
  const m = /^```[a-z]*\n([\s\S]*?)\n?```$/.exec(t);
  return m ? m[1].trim() : t;
}
async function chat(messages) {
  const r = await fetch(BASE + "/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + API_KEY,
      "user-agent": "callbook-convert/1.0",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 8000, messages }),
  });
  const data = await r.json().catch(() => null);
  if (!r.ok) {
    const msg = data && data.error && (data.error.message || data.error.type);
    throw new Error("upstream " + r.status + (msg ? ": " + msg : ""));
  }
  const choice = data && data.choices && data.choices[0];
  return stripFences(choice && choice.message && choice.message.content);
}
async function convert(description) {
  const system = await systemPrompt();
  const ask = "Convert this play description to DBN (reply with only the notation):\n\n" + description;
  const messages = [
    { role: "system", content: system },
    { role: "user", content: ask },
  ];
  let text = await chat(messages);
  for (let attempt = 0; ; attempt++) {
    try {
      const play = dbn.parse(text);
      return { dbn: text, name: play.name || null, beats: (play.steps || []).length };
    } catch (e) {
      if (attempt >= 1) throw new Error("model produced invalid DBN: " + (e && e.message));
      messages.push({ role: "assistant", content: text });
      messages.push({
        role: "user",
        content: "That notation failed to parse: " + (e && e.message) +
          "\nFix it and reply with only the corrected DBN.",
      });
      text = await chat(messages);
    }
  }
}

// ── http ─────────────────────────────────────────────────────────────────────
function clientIp(req) {
  return req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "?";
}
function corsHeaders(req) {
  const origin = req.headers.origin;
  const h = { "content-type": "application/json" };
  // /validate is free (no LLM) and useful to any agent surface — open CORS.
  if (req.url === "/validate") {
    h["access-control-allow-origin"] = "*";
    h["access-control-allow-methods"] = "POST, OPTIONS";
    h["access-control-allow-headers"] = "content-type";
    h["access-control-max-age"] = "86400";
    return h;
  }
  if (origin && ORIGINS.includes(origin)) {
    h["access-control-allow-origin"] = origin;
    h["access-control-allow-methods"] = "POST, OPTIONS";
    h["access-control-allow-headers"] = "content-type";
    h["access-control-max-age"] = "86400";
  }
  return h;
}
function send(res, code, headers, body) {
  res.writeHead(code, headers);
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  const headers = corsHeaders(req);
  if (req.method === "OPTIONS") { res.writeHead(204, headers); return res.end(); }
  if (req.method === "GET" && req.url === "/healthz") {
    return send(res, 200, headers, { ok: true, model: MODEL });
  }
  // POST /validate {dbn} -> parse with the real engine, no LLM involved.
  // This is the machine-check agents run before handing a human a link.
  if (req.method === "POST" && req.url === "/validate") {
    let vbody = "";
    req.on("data", (c) => {
      vbody += c;
      if (vbody.length > 65536) { send(res, 413, headers, { error: "play too long" }); req.destroy(); }
    });
    req.on("end", () => {
      if (res.writableEnded) return;
      let text;
      try { text = String(JSON.parse(vbody).dbn || ""); } catch (e) {}
      if (!text || !text.trim()) return send(res, 400, headers, { error: "post JSON: {\"dbn\": \"[Play ...]\"}" });
      try {
        const play = dbn.parse(text);
        send(res, 200, headers, {
          valid: true,
          name: play.name || null,
          beats: (play.steps || []).length,
          view: "https://iamnotsam.com/dodgeball-play-notation/?dbn=" + encodeURIComponent(text),
        });
      } catch (e) {
        send(res, 200, headers, { valid: false, error: (e && e.message) || String(e) });
      }
    });
    return;
  }
  if (req.method !== "POST" || req.url !== "/convert") {
    return send(res, 404, headers, { error: "not found" });
  }
  let body = "";
  req.on("data", (c) => {
    body += c;
    if (body.length > 8192) { send(res, 413, headers, { error: "description too long" }); req.destroy(); }
  });
  req.on("end", async () => {
    if (res.writableEnded) return;
    let description;
    try { description = String(JSON.parse(body).description || "").trim(); } catch (e) {}
    if (!description) return send(res, 400, headers, { error: "post JSON: {\"description\": \"...\"}" });
    if (description.length > 4000) return send(res, 413, headers, { error: "description too long (4000 chars max)" });
    const limited = rateCheck(clientIp(req));
    if (limited) return send(res, 429, headers, { error: limited });
    try {
      const out = await convert(description);
      send(res, 200, headers, out);
    } catch (e) {
      console.error(new Date().toISOString(), "convert failed:", e && e.message);
      send(res, 502, headers, { error: (e && e.message) || "conversion failed" });
    }
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("callbook-convert listening on 127.0.0.1:" + PORT + " model=" + MODEL + " base=" + BASE);
});
