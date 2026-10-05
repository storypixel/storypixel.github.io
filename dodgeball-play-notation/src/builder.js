(function () {
  "use strict";
  const M = window.CallbookBuilder;
  const $ = (id) => document.getElementById(id);
  const DRAFT_KEY = "callbook.builder.draft.v1", LIBRARY_KEY = "callbook.builder.library.v1";
  let draft = M.demo(), mode = "guided", raw = "", currentId = null, mount = null, valid = null, timer = null, dirty = false;
  const fields = [
    ["Ruleset", "Ruleset", "usad-foam-2026"], ["AdaptedFrom", "Adapted from", "wdbf-cloth-2026"],
    ["RequiresPlayers", "Live players", "U:4+ T:1-6"], ["RequiresBalls", "Held balls", "U:4 T:0-2"],
    ["PlayerAdvantage", "Player advantage", ["", "us", "them", "even"]],
    ["Burden", "Burden to throw", ["", "us", "them"]],
    ["ThrowClock", "Throw clock remaining", "3+"], ["Blocking", "Blocking", ["", "allowed", "no-blocking"]],
    ["OpponentState", "Opponent state", ["", "holding", "attacking", "retreating"]],
  ];
  const words = { "": "Any", U: "Us", T: "Them", us: "Us", them: "Them", even: "Even", "no-blocking": "No blocking",
    "!": "Hit", "%": "Dodge", "#": "Block", "^": "Catch", move: "Move", fake: "Fake", throw: "Throw", pass: "Pass",
    grab: "Grab", dodge: "Dodge", block: "Block", catch: "Catch", out: "Out", return: "Return",
    line: "Line", huddle: "Huddle", mid: "Mid", deep: "Deep", back: "Back", allowed: "Allowed",
    holding: "Holding", attacking: "Attacking", retreating: "Retreating" };
  function node(tag, text, cls) { const el = document.createElement(tag); if (text != null) el.textContent = text; if (cls) el.className = cls; return el; }
  function image(name) { const el = document.createElement("img"); el.src = "assets/builder-icons/" + name + ".svg"; el.alt = ""; return el; }
  function iconButton(icon, title, callback) { const b = node("button", null, "icon-button"); b.type = "button"; b.title = title; b.setAttribute("aria-label", title); b.append(image(icon)); b.addEventListener("click", callback); return b; }
  function inputLabel(title, value, callback, options) {
    const label = node("label", title), input = document.createElement(options && options.values ? "select" : "input");
    if (options && options.values) options.values.forEach((value) => { const o = node("option", words[value] || value); o.value = value; input.append(o); });
    else { input.type = options && options.type || "text"; if (options) ["min", "max", "step", "placeholder"].forEach((k) => { if (options[k] != null) input.setAttribute(k, options[k]); }); }
    input.value = value; input.setAttribute("aria-label", title);
    input.addEventListener(input.tagName === "SELECT" ? "change" : "input", () => callback(input.value));
    label.append(input); return label;
  }
  function message(text, error) { $("output-status").textContent = text; $("output-status").className = "status" + (error ? " error" : ""); }
  function stored(key, fallback) {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
    catch (_) { message("Device storage is unavailable or unreadable. Download a copy of your play.", true); return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (_) { $("draft-status").textContent = "Not saved on this device"; message("Device storage is full or unavailable. Download your play to keep it.", true); return false; }
  }
  let library = stored(LIBRARY_KEY, []);
  if (!Array.isArray(library)) library = [];
  library = library.filter((p) => p && typeof p.id === "string" && typeof p.text === "string" && typeof p.name === "string");
  function source() { return mode === "notation" ? raw : M.generate(draft); }
  function persist() {
    if (write(DRAFT_KEY, { draft, mode, raw, currentId })) $("draft-status").textContent = "Draft saved on this device";
  }
  function invalidate() {
    valid = null;
    ["save-play", "share-play", "download-play"].forEach((id) => $(id).disabled = true);
    $("share-fallback").hidden = true;
  }
  function changed() {
    dirty = true; invalidate(); clearTimeout(timer); $("draft-status").textContent = "Saving draft...";
    timer = setTimeout(() => { renderPreview(); persist(); }, 220);
  }
  function clearPreview() {
    if (mount) mount.destroy(); mount = null; $("preview").replaceChildren(); $("conditions-summary").replaceChildren();
  }
  function renderPreview() {
    clearTimeout(timer); invalidate();
    try {
      const text = source();
      if (!text.trim()) throw new Error("Enter a play to preview it.");
      if (text.length > 100000) throw new Error("This play exceeds the 100 KB limit.");
      const play = window.DBN.parse(text, { maxPlayers: 20, maxSteps: 100 });
      if (!play.steps.length) throw new Error("Add at least one step.");
      if (play.setup.us.length > 20 || play.setup.them.length > 20 || play.steps.length > 100) throw new Error("Preview supports up to 20 players and 100 steps.");
      clearPreview();
      const island = node("div"), root = island.attachShadow({ mode: "open" }), host = node("div");
      root.append(host); $("preview").append(island);
      mount = window.DodgeballPlay.mount(host, play, { chrome: "minimal", prose: false });
      $("preview-title").textContent = play.name; $("beat-count").textContent = play.steps.length + " steps";
      $("validation-status").textContent = "Valid DBN"; $("validation-status").className = "";
      const c = play.conditions || {}, rows = [];
      const range = (r) => r.max == null ? r.min + "+" : r.min === r.max ? String(r.min) : r.min + "-" + r.max;
      const teams = (v) => ["us", "them"].filter((t) => v[t]).map((t) => words[t] + " " + range(v[t])).join(" / ");
      if (play.ruleset) rows.push(["Ruleset", play.ruleset]); if (play.adaptedFrom) rows.push(["Adapted from", play.adaptedFrom]);
      if (c.livePlayers) rows.push(["Live players", teams(c.livePlayers)]); if (c.balls) rows.push(["Held balls", teams(c.balls)]);
      [["playerAdvantage", "Player advantage"], ["burden", "Burden"], ["blocking", "Blocking"], ["opponentState", "Opponent"]].forEach(([k, label]) => { if (c[k]) rows.push([label, words[c[k]]]); });
      if (c.throwClock) rows.push(["Throw clock", range(c.throwClock) + " seconds"]);
      rows.forEach(([key, value]) => $("conditions-summary").append(node("dt", key), node("dd", value)));
      valid = { text, play }; ["save-play", "share-play", "download-play"].forEach((id) => $(id).disabled = false);
    } catch (error) {
      clearPreview(); $("preview-title").textContent = mode === "guided" ? draft.name || "Untitled play" : "Play preview"; $("beat-count").textContent = "";
      $("validation-status").textContent = error.message; $("validation-status").className = "error";
    }
  }
  function renderHolders() {
    ["us", "them"].forEach((team) => {
      const group = $(team === "us" ? "our-holders" : "their-holders"); group.replaceChildren();
      for (let i = 1; i <= Math.min(8, Number(draft.players)); i++) {
        const label = node("label", null, "holder"), box = document.createElement("input"); box.type = "checkbox"; box.checked = draft[team].includes(i);
        box.setAttribute("aria-label", (team === "us" ? "Our" : "Their") + " player " + i + " has a ball");
        box.addEventListener("change", () => { draft[team] = box.checked ? draft[team].concat(i).sort((a,b) => a-b) : draft[team].filter((v) => v !== i); changed(); });
        label.append(box, node("span", String(i))); group.append(label);
      }
    });
  }
  function renderConditions() {
    $("condition-fields").replaceChildren();
    fields.forEach(([key, title, choices]) => {
      $("condition-fields").append(inputLabel(title, draft.conditions[key] || "", (value) => { draft.conditions[key] = value; updateConditionCount(); changed(); },
        Array.isArray(choices) ? { values: choices } : { placeholder: choices }));
    });
    updateConditionCount();
  }
  function updateConditionCount() { const n = Object.values(draft.conditions).filter((v) => v && v.trim()).length; $("condition-count").textContent = n ? "(" + n + ")" : ""; }
  function renderSteps() {
    $("steps").replaceChildren();
    draft.steps.forEach((step, i) => {
      const section = node("section", null, "step"), header = node("div", null, "step-head");
      section.setAttribute("aria-label", "Step " + (i + 1)); header.append(node("h3", "Step " + (i + 1)));
      const move = (delta) => { [draft.steps[i], draft.steps[i + delta]] = [draft.steps[i + delta], draft.steps[i]]; renderSteps(); changed(); };
      const up = iconButton("arrow-up", "Move step " + (i+1) + " up", () => move(-1)); up.disabled = i === 0;
      const down = iconButton("arrow-down", "Move step " + (i+1) + " down", () => move(1)); down.disabled = i === draft.steps.length - 1;
      header.append(up, down, iconButton("trash-2", "Delete step " + (i+1), () => { draft.steps.splice(i, 1); renderSteps(); changed(); }));
      const labels = node("div", null, "step-fields");
      labels.append(inputLabel("Step caption", step.label, (v) => { step.label = v; changed(); }), inputLabel("Seconds", step.duration, (v) => { step.duration = v; changed(); }, { type: "number", min: ".1", max: "10", step: ".1" }));
      section.append(header, labels);
      step.actions.forEach((a, j) => {
        const row = node("div", null, "action-row");
        const update = (key, rebuild) => (v) => { a[key] = v; if (rebuild) renderSteps(); changed(); };
        row.append(inputLabel("Team", a.team, update("team"), { values: ["U", "T"] }), inputLabel("Players", a.actors, update("actors"), { placeholder: "2,4" }),
          inputLabel("Action", a.kind, update("kind", true), { values: ["move", "fake", "throw", "pass", "grab", "dodge", "block", "catch", "out", "return"] }));
        const extra = node("div", null, "action-extra");
        if (a.kind === "move") extra.append(inputLabel("To", a.destination, update("destination"), { values: ["line", "huddle", "mid", "deep", "back"] }));
        if (["fake", "grab"].includes(a.kind)) extra.append(inputLabel(a.kind === "grab" ? "Balls" : "Times", a.reps, update("reps"), { type: "number", min: "1", max: "6", step: "1" }));
        if (["throw", "pass"].includes(a.kind)) extra.append(inputLabel("Target", a.target, update("target"), { type: "number", min: "1", max: draft.players, step: "1" }));
        if (a.kind === "throw") extra.append(inputLabel("Result", a.outcome, update("outcome"), { values: ["%", "!", "#", "^"] }));
        row.append(extra, iconButton("trash-2", "Delete action " + (j+1) + " in step " + (i+1), () => { step.actions.splice(j,1); renderSteps(); changed(); })); section.append(row);
      });
      if (!step.actions.length) section.append(node("p", "No actions", "empty-step"));
      const add = node("button", null, "add-action"); add.type = "button"; add.append(image("plus"), document.createTextNode("Add action"));
      add.addEventListener("click", () => { if (step.actions.length >= 24) return message("A step can contain up to 24 actions.", true); step.actions.push(M.action()); renderSteps(); changed(); });
      section.append(add); $("steps").append(section);
    });
  }
  function setMode(next) {
    if (next === mode) return;
    if (next === "notation") { try { raw = M.generate(draft); } catch (e) { return message(e.message, true); } }
    else {
      let guided = null;
      try { guided = M.generate(draft); } catch (_) { /* An unfinished guided draft is still recoverable. */ }
      if (raw !== guided && !window.confirm("Return to the last guided draft? Download your notation first if you need to keep those edits.")) return;
    }
    mode = next; syncMode(); changed();
  }
  function syncMode() {
    ["guided", "notation"].forEach((v) => { $(v + "-panel").hidden = mode !== v; $(v + "-tab").setAttribute("aria-selected", String(mode === v)); $(v + "-tab").tabIndex = mode === v ? 0 : -1; });
    $("notation-source").value = raw;
  }
  function renderForm() {
    $("play-name").value = draft.name; $("play-call").value = draft.call; $("play-description").value = draft.description; $("player-count").value = draft.players;
    renderHolders(); renderConditions(); renderSteps(); syncMode();
  }
  function renderLibrary() {
    const select = $("saved-plays"); select.replaceChildren(); const empty = node("option", "Choose a saved play"); empty.value = ""; select.append(empty);
    library.forEach((p) => { const option = node("option", p.name); option.value = p.id; select.append(option); });
    select.value = currentId || ""; libraryButtons();
  }
  function libraryButtons() { const empty = !$("saved-plays").value; $("open-saved").disabled = empty; $("delete-saved").disabled = empty; }
  function canReplace() { return !dirty || window.confirm("Replace this draft? Saved plays will stay in My plays."); }
  function replace(next, text, id) { draft = next || M.fresh(); raw = text || ""; mode = next ? "guided" : "notation"; currentId = id || null; dirty = false; renderForm(); renderPreview(); renderLibrary(); persist(); message(""); }
  function loadRaw(text) { if (text.length > 100000) return message("Import must be under 100 KB.", true); if (!canReplace()) return; replace(null, text, null); }
  $("play-form").addEventListener("submit", (e) => e.preventDefault());
  [["play-name", "name"], ["play-call", "call"], ["play-description", "description"]].forEach(([id,key]) => $(id).addEventListener("input", () => { draft[key] = $(id).value; changed(); }));
  $("player-count").addEventListener("input", () => {
    const n = Number($("player-count").value); draft.players = n;
    if (Number.isInteger(n) && n >= 1 && n <= 8) { draft.us = draft.us.filter((v) => v <= n); draft.them = draft.them.filter((v) => v <= n); renderHolders(); }
    changed();
  });
  $("add-step").addEventListener("click", () => { if (draft.steps.length >= 50) return message("A guided play can contain up to 50 steps.", true); draft.steps.push({ label: "", duration: 1, actions: [M.action()] }); renderSteps(); changed(); $("steps").lastElementChild.querySelector("input").focus(); });
  $("guided-tab").addEventListener("click", () => setMode("guided")); $("notation-tab").addEventListener("click", () => setMode("notation"));
  document.querySelector(".tabs").addEventListener("keydown", (e) => { if (["ArrowLeft", "ArrowRight"].includes(e.key)) { e.preventDefault(); setMode(mode === "guided" ? "notation" : "guided"); $(mode + "-tab").focus(); } });
  $("notation-source").addEventListener("input", () => { raw = $("notation-source").value; changed(); });
  $("new-play").addEventListener("click", () => { if (canReplace()) replace(M.fresh()); });
  $("load-example").addEventListener("click", () => { if (canReplace()) replace(M.demo()); });
  $("saved-plays").addEventListener("change", libraryButtons);
  $("open-saved").addEventListener("click", () => { const item = library.find((p) => p.id === $("saved-plays").value); if (item && canReplace()) replace(M.isDraft(item.form) ? structuredClone(item.form) : null, item.text, item.id); });
  $("delete-saved").addEventListener("click", () => {
    const id = $("saved-plays").value, item = library.find((p) => p.id === id);
    if (!item || !window.confirm('Delete "' + item.name + '" from this device?')) return;
    const next = library.filter((p) => p.id !== id); if (!write(LIBRARY_KEY, next)) return; library = next;
    if (currentId === id) currentId = null; renderLibrary(); persist(); message("Saved play deleted. The open draft is unchanged.");
  });
  $("save-play").addEventListener("click", () => {
    renderPreview(); if (!valid) return;
    const id = currentId || crypto.randomUUID(); const entry = { id, name: valid.play.name, text: valid.text, form: mode === "guided" ? structuredClone(draft) : null, updated: new Date().toISOString() };
    const next = library.filter((p) => p.id !== id).concat(entry); if (!write(LIBRARY_KEY, next)) return;
    library = next; currentId = id; dirty = false; renderLibrary(); persist(); message('Saved "' + entry.name + '" on this device.');
  });
  $("download-play").addEventListener("click", () => {
    renderPreview(); if (!valid) return;
    const url = URL.createObjectURL(new Blob([valid.text], { type: "text/plain;charset=utf-8" }));
    const a = node("a"); a.href = url; a.download = (valid.play.id.replace(/[^a-z0-9_-]/gi, "-").slice(0,80) || "play") + ".dbn";
    a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); message("DBN file downloaded.");
  });
  $("share-play").addEventListener("click", async () => {
    renderPreview(); if (!valid) return;
    const url = M.shareURL(location.href, valid.text);
    if (url.length > 12000) return message("This play is too large for a reliable share link. Download the DBN file instead.", true);
    try { await navigator.clipboard.writeText(url); message("Share link copied. It contains the complete play."); }
    catch (_) { $("share-fallback").hidden = false; $("share-url").value = url; $("share-url").focus(); $("share-url").select(); message("Clipboard unavailable. Your share link is ready below."); }
  });
  $("import-play").addEventListener("click", () => $("import-file").click());
  $("import-file").addEventListener("change", async () => { const file = $("import-file").files[0]; if (!file) return; try { if (file.size > 100000) throw new Error("Import must be under 100 KB."); loadRaw(await file.text()); } catch (e) { message(e.message, true); } $("import-file").value = ""; });
  try {
    const shared = M.readShared(location.hash);
    if (shared !== null) { if (shared.length > 100000) throw new Error("Shared play exceeds 100 KB."); raw = shared; mode = "notation"; }
    else {
      const saved = stored(DRAFT_KEY, null);
      if (saved && M.isDraft(saved.draft) && ["guided", "notation"].includes(saved.mode) && typeof saved.raw === "string") {
        draft = saved.draft; raw = saved.raw; mode = saved.mode; currentId = saved.currentId || null;
      }
    }
  } catch (e) { message("Could not restore that play: " + e.message, true); }
  renderForm(); renderLibrary(); renderPreview();
  window.addEventListener("pagehide", () => { if (dirty) persist(); });
  window.CallbookEditor = { getText: source, getPlay: () => valid && valid.play, getMode: () => mode, player: () => mount };
})();
