#!/usr/bin/env node
/* Local authoring server for the Dodgeball Play Animator.
 *
 *   GEMINI_API_KEY=... node server.js        # http://localhost:8778
 *
 * Serves the static app + a POST /generate endpoint that turns a natural-language
 * play description into validated DBN + a copy-paste embed. The API key stays
 * server-side (never shipped to the browser); the generated embed is static and
 * pasteable anywhere with no key.
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const DIR = __dirname;
const PORT = process.env.PORT || 8778;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.md': 'text/markdown' };

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/generate') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      let description = '';
      try { description = JSON.parse(body).description || ''; } catch { }
      if (!description.trim()) { res.writeHead(400).end('{"error":"empty description"}'); return; }
      execFile('node', [path.join(DIR, 'gen-play.js'), description],
        { env: process.env, timeout: 45000 },
        (err, stdout, stderr) => {
          if (err) { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: (stderr || err.message).slice(-500) })); return; }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ embed: stdout.trim(), detail: (stderr || '').trim() }));
        });
    });
    return;
  }
  // static
  let f = req.url.split('?')[0]; if (f === '/') f = '/generate.html';
  const p = path.join(DIR, path.normalize(f).replace(/^(\.\.[/\\])+/, ''));
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404).end('not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    res.end(data);
  });
});
server.listen(PORT, () => console.log(`Play authoring server: http://localhost:${PORT}`));
