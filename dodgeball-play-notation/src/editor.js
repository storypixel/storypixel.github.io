/* DBN Editor — UI wiring + the window.DBNEditor automation API.
 *
 * Depends on the canonical vendored globals: window.DBN (parser) and
 * window.DodgeballPlay (render engine). This file owns NO notation logic — it
 * only drives the parser and the engine, so the editor can never diverge from
 * canonical DBN.
 *
 * Designed to be driven with zero human clicking:
 *   - Deep links:  ?dbn=<url-encoded notation>   ?play=<example id>   ?autoplay=1
 *   - JS API:      window.DBNEditor = { load, render, exportSVG, exportJSON,
 *                                       getErrors, getPlay, getText, isReady }
 *   - Stable hooks: data-testid + aria-label on every control.
 */
(function () {
  "use strict";

  var els = {};
  var state = { play: null, errors: [], mount: null, ready: false };

  function $(id) { return document.getElementById(id); }

  function setStatus(kind, msg) {
    if (!els.status) return;
    els.status.className = "status " + kind;
    els.status.textContent = msg;
    els.status.setAttribute("data-state", kind);
  }

  // ── core: parse current text + (re)mount the animator ──
  function render() {
    var text = els.input ? els.input.value : "";
    state.errors = [];
    var play;
    try {
      play = window.DBN.parse(text);
    } catch (e) {
      state.play = null;
      state.errors = [{ message: (e && e.message) || String(e), beat: beatHint(e) }];
      setStatus("err", "✗ " + state.errors[0].message + (state.errors[0].beat ? " (near beat " + state.errors[0].beat + ")" : ""));
      els.errorPanel && (els.errorPanel.textContent = state.errors[0].message);
      els.errorPanel && els.errorPanel.removeAttribute("hidden");
      return null;
    }
    state.play = play;
    els.errorPanel && els.errorPanel.setAttribute("hidden", "");
    els.errorPanel && (els.errorPanel.textContent = "");
    try {
      // stop the previous instance before remounting — otherwise its animation
      // loop and document-level listeners outlive the DOM we're about to wipe
      if (state.mount && state.mount.destroy) state.mount.destroy();
      els.stage.innerHTML = "";
      var host = document.createElement("div");
      els.stage.appendChild(host);
      var autoplay = qparam("autoplay") === "1";
      state.mount = window.DodgeballPlay.mount(host, play, { chrome: "full", autoplay: autoplay, loop: qparam("loop") === "1", speed: currentSpeed() });
      var beats = (play.steps || []).length;
      setStatus("ok", "✓ " + (play.name || "play") + " — " + beats + " beat" + (beats === 1 ? "" : "s") + " parsed.");
      return play;
    } catch (e) {
      state.errors = [{ message: "render error: " + ((e && e.message) || e) }];
      setStatus("err", "✗ " + state.errors[0].message);
      return null;
    }
  }

  // best-effort: which beat number is the parser message likely about
  function beatHint(e) {
    var m = e && e.message && /beat\s+(\d+)/i.exec(e.message);
    return m ? parseInt(m[1], 10) : null;
  }

  // playback speed: the speed dropdown, else ?speed=, else engine default (2x)
  function currentSpeed() {
    if (els.speedSel && els.speedSel.value) return parseFloat(els.speedSel.value) || 2;
    var q = parseFloat(qparam("speed"));
    return q > 0 ? q : 2;
  }

  function load(text) {
    if (els.input) els.input.value = text == null ? "" : String(text);
    return render();
  }

  function exportJSON() {
    if (!state.play) { try { return window.DBN.parse(els.input.value); } catch (e) { return null; } }
    return state.play;
  }

  function exportSVG() {
    var svg = els.stage && els.stage.querySelector("svg");
    return svg ? svg.outerHTML : null;
  }

  function getErrors() { return state.errors.slice(); }
  function getPlay() { return state.play; }
  // the live mount instance: { play, pause, seek, step, replay, el } — lets an
  // agent drive playback (step beat-to-beat, replay) programmatically.
  function player() { return state.mount; }
  function getText() { return els.input ? els.input.value : ""; }
  function isReady() { return state.ready; }

  // ── deep-link + example loading ──
  function qparam(name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
  }

  function loadExample(id) {
    return fetch("examples/" + id + ".dbn?v=0767abf54a")
      .then(function (r) { if (!r.ok) throw new Error("not found"); return r.text(); })
      .then(function (txt) {
        load(txt);
        // reflect the loaded play in the URL so it's shareable / linkable
        try { history.replaceState(null, "", "?play=" + encodeURIComponent(id)); } catch (e) {}
        return txt;
      })
      .catch(function () { setStatus("err", "could not load example '" + id + "' (serve over http)"); });
  }

  // ── boot ──
  function boot() {
    els.input = $("dbn-input");
    els.stage = $("stage");
    els.status = $("status");
    els.errorPanel = $("error-panel");
    els.renderBtn = $("render-btn");
    els.exampleSel = $("example-select");
    els.speedSel = $("speed-select");

    // ?speed= deep-link presets the dropdown
    var qs = parseFloat(qparam("speed"));
    if (els.speedSel && qs > 0) {
      var opt = Array.prototype.find.call(els.speedSel.options, function (o) { return parseFloat(o.value) === qs; });
      if (opt) els.speedSel.value = String(qs);
    }
    if (els.speedSel) els.speedSel.addEventListener("change", render);

    if (els.renderBtn) els.renderBtn.addEventListener("click", render);
    if (els.input) {
      var t;
      els.input.addEventListener("input", function () { clearTimeout(t); t = setTimeout(render, 250); });
      els.input.addEventListener("keydown", function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); render(); }
      });
    }
    if (els.exampleSel) {
      els.exampleSel.addEventListener("change", function () {
        if (els.exampleSel.value) loadExample(els.exampleSel.value);
      });
    }

    window.DBNEditor = {
      load: load, render: render, exportSVG: exportSVG, exportJSON: exportJSON,
      getErrors: getErrors, getPlay: getPlay, getText: getText, isReady: isReady,
      player: player,
    };
    state.ready = true;

    // deep-link precedence: ?dbn= wins, else ?play=, else default example
    var dbn = qparam("dbn");
    var play = qparam("play");
    if (dbn != null) {
      load(dbn);
    } else if (play) {
      if (els.exampleSel) els.exampleSel.value = play;
      loadExample(play);
    } else {
      if (els.exampleSel) els.exampleSel.value = "insides";
      loadExample("insides");
    }
    document.documentElement.setAttribute("data-dbn-ready", "1");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
