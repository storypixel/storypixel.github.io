#!/usr/bin/env node
/* DBN play generator: natural-language description -> valid DBN -> copy-paste embed.
 *
 *   GEMINI_API_KEY=... node gen-play.js "they bring two to the line, four pump fakes, ..."
 *
 * Feeds NOTATION.md to the model so it "already knows" the notation, gets DBN back,
 * validates it against the real dbn.js compiler (retries once on a parse error with the
 * error fed back), and prints a self-contained embed you can paste on any site.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');

const DIR = __dirname;
const NOTATION = fs.readFileSync(path.join(DIR, 'NOTATION.md'), 'utf8');

// Load the real compiler so validation matches the animator exactly.
(0, eval)(fs.readFileSync(path.join(DIR, 'dbn.js'), 'utf8')); // -> globalThis.DBN
const compile = (dbn) => globalThis.DBN.parse(dbn);

// Where the two runtime scripts are hosted for the embed (Sam's site).
const SCRIPT_BASE = process.env.DBN_SCRIPT_BASE || 'https://storypixel.github.io/dbn';

const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.DBN_GEN_MODEL || 'gemini-3.6-flash';

function gemini(prompt) {
  const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });
  const opts = {
    method: 'POST',
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
    headers: { 'Content-Type': 'application/json' },
  };
  return new Promise((resolve, reject) => {
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.error) return reject(new Error(j.error.message));
          resolve(j.candidates[0].content.parts.map((p) => p.text).join(''));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function stripFences(s) {
  return s.replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/i, '').trim();
}

const SYSTEM = `You are a DBN (Dodgeball Notation) generator. DBN is a compact chess-PGN-style
notation that compiles to a dodgeball-play animation. Below is the COMPLETE spec — obey it exactly.
Given a plain-English play description, output ONLY valid DBN (the [Play]/[Badge]/[Call]/[Balls]
header tags plus the numbered move lines). No prose, no explanation, no code fences. If the
description is vague, make reasonable coach-sensible choices per the spec's defaults.

COMMON PITFALLS the compiler rejects — avoid these:
- A grab (\`*\`) only works when a LOOSE ball is on the center line. Balls listed in [Balls] are
  ALREADY HELD by those players and are NOT loose. In a standard 6-ball open, leave the line balls
  loose (do not pre-assign them all in [Balls]) so rushers have something to grab. Don't have a
  player grab when no loose ball remains.
- A player can't throw/block/pass a ball they don't hold — they must grab or start holding it first.
- Don't put a player already marked out back into the action.

=== DBN SPEC ===
${NOTATION}
=== END SPEC ===`;

async function generate(description) {
  let dbn = stripFences(await gemini(`${SYSTEM}\n\nPlay description: ${description}\n\nDBN:`));
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      compile(dbn);
      return dbn;
    } catch (err) {
      lastErr = err;
      // repair pass with the compiler error fed back
      dbn = stripFences(await gemini(
        `${SYSTEM}\n\nYou produced this DBN:\n${dbn}\n\nThe compiler rejected it with:\n"${err.message}"\n\n` +
        `Fix ONLY what that error points to, keeping the play faithful to: ${description}\n\n` +
        `Output ONLY corrected valid DBN:`));
    }
  }
  compile(dbn); // final check — throw the last error if still broken
  throw lastErr;
}

function embed(dbn) {
  const esc = dbn.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<div data-db-play-dbn data-loop>\n${esc}\n</div>\n` +
    `<script src="${SCRIPT_BASE}/dbn.js"></script>\n` +
    `<script src="${SCRIPT_BASE}/play-animator.js"></script>`;
}

(async () => {
  const description = process.argv.slice(2).join(' ');
  if (!description) { console.error('usage: node gen-play.js "<play description>"'); process.exit(1); }
  if (!KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }
  const dbn = await generate(description);
  const play = compile(dbn);
  console.error(`\n--- DBN ---\n${dbn}\n\n--- compiles to play: "${play.name || play.title || 'ok'}", ${(play.moves||play.frames||[]).length||'?'} moves ---\n\n--- COPY-PASTE EMBED ---`);
  console.log(embed(dbn));
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
