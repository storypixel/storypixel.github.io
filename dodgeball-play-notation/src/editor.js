/* Dodgeball Playbook — wiki UI + DBN editor automation API.
 * Depends on window.DBN and window.DodgeballPlay. Notation and animation logic
 * stay canonical; this file owns browsing, page metadata, and editor wiring.
 */
(function () {
  "use strict";

  var PLAY_CATALOG = [
    { id:"pitch-back", label:"Pitch Back", category:"offense" },
    { id:"three-ball", label:"3 Balls", category:"offense" },
    { id:"insides", label:"Inside", variant:"4 ball", category:"offense" },
    { id:"insides-3", label:"Inside", variant:"3 ball", category:"offense" },
    { id:"outsides", label:"Outsides", variant:"4 ball", category:"offense" },
    { id:"outsides-3", label:"Outsides", variant:"3 ball", category:"offense" },
    { id:"kill-left", label:"Kill Left", variant:"4 ball", category:"offense" },
    { id:"kill-left-3", label:"Kill Left", variant:"3 ball", category:"offense" },
    { id:"kill-right", label:"Kill Right", variant:"4 ball", category:"offense" },
    { id:"kill-right-3", label:"Kill Right", variant:"3 ball", category:"offense" },
    { id:"home", label:"Home", category:"defense" },
    { id:"away", label:"Away", category:"defense" },
    { id:"mirror", label:"Mirror", category:"defense" },
    { id:"middle", label:"Middle", category:"situational" },
  ];
  var CATEGORY_LABELS = { offense:"Offense", defense:"Defense", situational:"Situational" };
  var els = {};
  var state = { play:null, errors:[], mount:null, widgetRoot:null, ready:false, index:[], docMounts:[] };

  function $(id) { return document.getElementById(id); }
  function qparam(name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
  }
  function playMeta(id) { return PLAY_CATALOG.find(function (item) { return item.id === id; }) || null; }
  function exampleUrl(id) { return "examples/" + id + ".dbn?v=19cd5a2bd0"; }

  function smartQuotedCall(value) {
    var text = String(value || "").trim();
    text = text.replace(/^[\s"'“”‘’]+|[\s"'“”‘’]+$/g, "").trim();
    return text ? "“" + text + "”" : "";
  }

  function setStatus(kind, msg) {
    if (!els.status) return;
    els.status.className = "status " + kind;
    els.status.textContent = msg;
    els.status.setAttribute("data-state", kind);
  }

  function currentSpeed() {
    var q = parseFloat(qparam("speed"));
    return q > 0 ? q : 2;
  }

  function stepSummary(step) {
    var parts = [];
    var labels = [
      ["moves", "move"], ["grabs", "grab"], ["passes", "pass"], ["throws", "throw"],
      ["fakes", "pump fake", function (items) {
        return items.reduce(function (count, fake) { return Math.max(count, fake.reps || 1); }, 0);
      }],
      ["blocks", "block"], ["catches", "catch"], ["dodges", "dodge"],
      ["outs", "out"], ["returns", "return"],
    ];
    labels.forEach(function (pair) {
      var items = step[pair[0]] || [];
      var count = pair[2] ? pair[2](items) : items.length;
      if (count) parts.push(count + " " + pair[1] + (count === 1 ? "" : "s"));
    });
    return parts.length ? parts.join(" · ") : "position and timing";
  }

  function renderPlayDetails(play) {
    var id = qparam("play");
    var meta = playMeta(id);
    document.body.setAttribute("data-view", "play");
    document.title = (play.name || "Play") + " — Dodgeball Playbook";
    $("play-title").textContent = play.name || "Untitled play";
    $("breadcrumb-title").textContent = play.name || "Play";
    $("play-badge").textContent = play.badge || (meta ? CATEGORY_LABELS[meta.category] : "Custom play");
    $("play-description").textContent = play.desc || "No coaching description has been added yet.";
    $("play-call").textContent = play.call || play.name || "—";
    var steps = play.steps || [];
    $("step-count").textContent = steps.length + " step" + (steps.length === 1 ? "" : "s");
    var list = $("play-steps");
    list.innerHTML = "";
    steps.forEach(function (step, index) {
      var li = document.createElement("li");
      var title = document.createElement("strong");
      var detail = document.createElement("span");
      title.textContent = step.label || "Step " + (index + 1);
      detail.textContent = (step.dur || 1) + " sec · " + stepSummary(step);
      li.appendChild(title); li.appendChild(detail); list.appendChild(li);
    });
    setActiveNavigation(id);
  }

  function render() {
    var text = els.input ? els.input.value : "";
    state.errors = [];
    var play;
    try {
      play = window.DBN.parse(text);
    } catch (e) {
      state.play = null;
      state.errors = [{ message:(e && e.message) || String(e), beat:beatHint(e) }];
      setStatus("err", "✗ " + state.errors[0].message + (state.errors[0].beat ? " (near beat " + state.errors[0].beat + ")" : ""));
      if (els.errorPanel) { els.errorPanel.textContent = state.errors[0].message; els.errorPanel.removeAttribute("hidden"); }
      return null;
    }
    state.play = play;
    if (els.errorPanel) { els.errorPanel.setAttribute("hidden", ""); els.errorPanel.textContent = ""; }
    renderPlayDetails(play);
    try {
      if (state.mount && state.mount.destroy) state.mount.destroy();
      els.stage.innerHTML = "";
      var island = document.createElement("div");
      island.setAttribute("data-dbp-island", "");
      els.stage.appendChild(island);
      state.widgetRoot = island.attachShadow ? island.attachShadow({ mode:"open" }) : island;
      var host = document.createElement("div");
      state.widgetRoot.appendChild(host);
      state.mount = window.DodgeballPlay.mount(host, play, {
        chrome:"minimal", prose:false, autoplay:qparam("autoplay") === "1",
        loop:qparam("loop") === "1", speed:currentSpeed(),
      });
      var beats = (play.steps || []).length;
      setStatus("ok", "✓ " + (play.name || "play") + " — " + beats + " beat" + (beats === 1 ? "" : "s") + " parsed.");
      return play;
    } catch (e) {
      state.errors = [{ message:"render error: " + ((e && e.message) || e) }];
      setStatus("err", "✗ " + state.errors[0].message);
      return null;
    }
  }

  function beatHint(e) {
    var m = e && e.message && /beat\s+(\d+)/i.exec(e.message);
    return m ? parseInt(m[1], 10) : null;
  }
  function load(text) { if (els.input) els.input.value = text == null ? "" : String(text); return render(); }
  function exportJSON() { if (!state.play) { try { return window.DBN.parse(els.input.value); } catch (e) { return null; } } return state.play; }
  function exportSVG() {
    var svg = state.mount && state.mount.el && state.mount.el.querySelector("svg");
    return svg ? svg.outerHTML : null;
  }
  function getErrors() { return state.errors.slice(); }
  function getPlay() { return state.play; }
  function player() { return state.mount; }
  function getText() { return els.input ? els.input.value : ""; }
  function isReady() { return state.ready; }

  function makeNav() {
    if (!els.playNav || !els.exampleSel) return;
    els.playNav.innerHTML = "";
    ["offense", "defense", "situational"].forEach(function (category) {
      var section = document.createElement("section");
      section.className = "play-nav-group";
      var heading = document.createElement("h3");
      heading.textContent = CATEGORY_LABELS[category];
      section.appendChild(heading);
      PLAY_CATALOG.filter(function (item) { return item.category === category; }).forEach(function (item) {
        var link = document.createElement("a");
        link.href = "#" + encodeURIComponent(item.id);
        link.dataset.playId = item.id;
        var label = document.createElement("span");
        label.textContent = item.label;
        link.appendChild(label);
        if (item.variant) { var variant = document.createElement("span"); variant.className = "variant"; variant.textContent = item.variant; link.appendChild(variant); }
        section.appendChild(link);

        var option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.label + (item.variant ? " — " + item.variant : "");
        els.exampleSel.appendChild(option);
      });
      els.playNav.appendChild(section);
    });
    document.querySelectorAll("[data-play-total]").forEach(function (node) { node.textContent = PLAY_CATALOG.length; });
  }

  function setActiveNavigation(id) {
    document.querySelectorAll("[data-play-id]").forEach(function (link) {
      if (link.dataset.playId === id) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function makeIndexRow(entry) {
    var li = document.createElement("li");
    var row = document.createElement("span");
    row.className = "index-row";
    var link = document.createElement("a");
    link.className = "index-title";
    link.href = "#" + encodeURIComponent(entry.meta.id);
    link.textContent = entry.play.name || entry.meta.label;
    var call = document.createElement("span");
    call.className = "index-call";
    call.textContent = entry.play.call ? smartQuotedCall(entry.play.call) : (entry.play.desc || "");
    var steps = document.createElement("span");
    steps.className = "index-steps";
    steps.textContent = (entry.play.steps || []).length + " steps";
    row.appendChild(link); row.appendChild(call); row.appendChild(steps); li.appendChild(row);
    return li;
  }

  function renderPlayIndex() {
    document.body.setAttribute("data-view", "all");
    document.title = "All Plays — Dodgeball Playbook";
    setActiveNavigation(null);
    return Promise.all(PLAY_CATALOG.map(function (meta) {
      return fetch(exampleUrl(meta.id)).then(function (r) { if (!r.ok) throw new Error("not found"); return r.text(); })
        .then(function (text) { return { meta:meta, text:text, play:window.DBN.parse(text) }; })
        .catch(function () { return { meta:meta, text:"", play:{ name:meta.label, desc:"Play details unavailable.", steps:[] } }; });
    })).then(function (entries) {
      state.index = entries;
      els.playIndex.innerHTML = "";
      ["offense", "defense", "situational"].forEach(function (category) {
        var section = document.createElement("section");
        section.className = "index-group";
        var heading = document.createElement("h2");
        heading.textContent = CATEGORY_LABELS[category];
        var list = document.createElement("ul");
        list.className = "index-list";
        entries.filter(function (entry) { return entry.meta.category === category; })
          .forEach(function (entry) { list.appendChild(makeIndexRow(entry)); });
        section.appendChild(heading); section.appendChild(list); els.playIndex.appendChild(section);
      });
      renderPlaysDoc(entries);
    });
  }

  // Every play rendered inline on the master page: the index above links to
  // these anchors, so a shared URL like #kill-left scrolls straight here.
  function renderPlaysDoc(entries) {
    if (!els.playsDoc) return;
    state.docMounts.forEach(function (m) { if (m && m.destroy) m.destroy(); });
    state.docMounts = [];
    els.playsDoc.innerHTML = "";
    entries.forEach(function (entry) {
      var section = document.createElement("section");
      section.className = "play-entry";
      section.id = entry.meta.id;

      var heading = document.createElement("h2");
      heading.textContent = entry.play.name || entry.meta.label;
      if (entry.meta.variant) {
        var variant = document.createElement("span");
        variant.className = "entry-variant";
        variant.textContent = entry.meta.variant;
        heading.appendChild(variant);
      }
      section.appendChild(heading);

      if (entry.play.call) {
        var call = document.createElement("p");
        call.className = "entry-call";
        call.textContent = smartQuotedCall(entry.play.call);
        section.appendChild(call);
      }
      if (entry.play.desc) {
        var desc = document.createElement("p");
        desc.className = "entry-desc";
        desc.textContent = entry.play.desc;
        section.appendChild(desc);
      }

      var stage = document.createElement("div");
      stage.className = "entry-stage";
      var island = document.createElement("div");
      island.setAttribute("data-dbp-island", "");
      stage.appendChild(island);
      section.appendChild(stage);
      var root = island.attachShadow ? island.attachShadow({ mode:"open" }) : island;
      var host = document.createElement("div");
      root.appendChild(host);
      try {
        state.docMounts.push(window.DodgeballPlay.mount(host, entry.play, {
          chrome:"minimal", prose:false, speed:currentSpeed(),
        }));
      } catch (e) { stage.remove(); }

      var steps = entry.play.steps || [];
      if (steps.length) {
        var list = document.createElement("ol");
        list.className = "entry-steps";
        steps.forEach(function (step, index) {
          var li = document.createElement("li");
          var title = document.createElement("strong");
          title.textContent = step.label || "Step " + (index + 1);
          var detail = document.createElement("span");
          detail.textContent = (step.dur || 1) + " sec · " + stepSummary(step);
          li.appendChild(title); li.appendChild(detail); list.appendChild(li);
        });
        section.appendChild(list);
      }

      if (entry.text) {
        var fig = document.createElement("details");
        fig.className = "notation";
        var summary = document.createElement("summary");
        summary.textContent = "View notation";
        var pre = document.createElement("pre");
        pre.textContent = entry.text.trim();
        fig.appendChild(summary); fig.appendChild(pre); section.appendChild(fig);
      }

      els.playsDoc.appendChild(section);
    });
  }

  function boot() {
    els.input = $("dbn-input"); els.stage = $("stage"); els.status = $("status"); els.errorPanel = $("error-panel");
    els.renderBtn = $("render-btn"); els.exampleSel = $("example-select");
    els.playNav = $("play-nav"); els.playIndex = $("play-index"); els.playsDoc = $("plays-doc");
    makeNav();
    if (els.renderBtn) els.renderBtn.addEventListener("click", render);
    if (els.input) {
      var timer;
      els.input.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(render, 250); });
      els.input.addEventListener("keydown", function (e) { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); render(); } });
    }
    if (els.exampleSel) els.exampleSel.addEventListener("change", function () {
      if (els.exampleSel.value) window.location.hash = els.exampleSel.value;
      else window.scrollTo(0, 0);
    });

    window.DBNEditor = { load:load, render:render, exportSVG:exportSVG, exportJSON:exportJSON, getErrors:getErrors, getPlay:getPlay, getText:getText, isReady:isReady, player:player };
    state.ready = true;
    var dbn = qparam("dbn");
    var play = qparam("play");
    if (dbn != null) load(dbn);
    else {
      renderPlayIndex().then(function () {
        var target = play || decodeURIComponent(window.location.hash.slice(1));
        if (play) {
          try { history.replaceState(null, "", window.location.pathname + "#" + encodeURIComponent(play)); } catch (e) {}
        }
        var el = target && document.getElementById(target);
        if (el) el.scrollIntoView();
      });
    }
    document.documentElement.setAttribute("data-dbn-ready", "1");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
