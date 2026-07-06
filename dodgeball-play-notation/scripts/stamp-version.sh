#!/bin/zsh
# Stamp a content-hash ?v= onto the editor's static asset URLs so a browser
# reload never serves a stale engine / parser / play. Run before pushing whenever
# vendor/*.js or examples/*.dbn change. The hash matches the playbook sync
# (playbook-sync/sync.py hashes the same files, so both stay in lockstep).
set -e
cd "$(dirname "$0")/.."
VER=$(cat vendor/play-animator.js vendor/dbn.js examples/*.dbn | md5 | cut -c1-10)
# index.html: the three <script src> tags
perl -0pi -e "s{(vendor/play-animator\.js|vendor/dbn\.js|src/editor\.js)(\?v=[0-9a-f]+)?}{\$1?v=$VER}g" index.html
# src/editor.js: the examples/<id>.dbn fetch
perl -0pi -e "s{\.dbn(\?v=[0-9a-f]+)?\"}{.dbn?v=$VER\"}g" src/editor.js
echo "stamped v=$VER"
