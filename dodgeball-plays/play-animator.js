/* Dodgeball Play Animator — self-contained, no dependencies.
 *
 * One engine, mounted as many times as you like. Each mount renders an
 * overhead court "inset" that animates a single play.
 *
 *   Embed an inset:   <div data-db-play="kill-left"></div>
 *                     <script src="play-animator.js"></script>
 *                     <script src="plays.js"></script>   (defines window.DB_PLAYS)
 *
 *   Mount by hand:    DodgeballPlay.mount(el, playObject, {autoplay:true})
 *
 * A play is plain data (see plays.js / the PLAY FORMAT notes at the bottom),
 * so new attacks are authored without touching this file.
 */
(function (global) {
  "use strict";

  // ── court geometry (normalized play coords are 0..100 in both axes) ──
  // x = court width  (players spread 1..N left→right)
  // y = court depth  (0 = THEIR back line, 50 = center line, 100 = OUR back line)
  const VB_W = 1000, VB_H = 660, PAD = 64;
  const CW = VB_W - PAD * 2, CH = VB_H - PAD * 2;
  const px = (nx) => PAD + (nx / 100) * CW;
  const py = (ny) => PAD + (ny / 100) * CH;

  const COL = {
    us: "#1f6feb",
    them: "#e5484d",
    ball: "#f2b705",
    court: "#0e1014",
    line: "#3a4150",
    centerline: "#6b7484",
    text: "#e6e8ec",
    out: "#444b57",
  };

  let stylesInjected = false;
  function injectStyles() {
    if (stylesInjected) return;
    stylesInjected = true;
    const css = `
.dbp{font:400 14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;border:1px solid #2a2f3a;border-radius:12px;overflow:hidden;background:#0e1014;color:#e6e8ec;max-width:560px}
.dbp__head{display:flex;align-items:baseline;gap:8px;padding:11px 13px 6px;flex-wrap:wrap}
.dbp__name{font-weight:700;font-size:1rem;letter-spacing:-.01em}
.dbp__badge{font-size:.66rem;text-transform:uppercase;letter-spacing:.05em;color:#aab2c0;border:1px solid #2a2f3a;border-radius:999px;padding:2px 7px}
.dbp__call{color:#7aa2ff;font-size:.85rem}
.dbp__desc{padding:0 13px 9px;color:#aab2c0;font-size:.85rem}
.dbp__stage{display:block;width:100%;height:auto;background:${COL.court};touch-action:none}
.dbp__stepline{padding:9px 13px 0;font-size:.8rem;color:#aab2c0;min-height:1.2em}
.dbp__ctrls{display:flex;align-items:center;gap:10px;padding:7px 13px 11px}
.dbp__btn{appearance:none;border:1px solid #2a2f3a;background:#171b22;color:#e6e8ec;border-radius:8px;width:34px;height:34px;display:grid;place-items:center;cursor:pointer;flex:none}
.dbp__btn:hover{background:#1f242d}
.dbp__btn svg{width:15px;height:15px;fill:currentColor}
.dbp__scrub{flex:1;accent-color:${COL.us};cursor:pointer;height:4px}
.dbp__step{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
.dbp__loopwrap{display:flex;align-items:center;gap:4px;font-size:.72rem;color:#7d8593;cursor:pointer;user-select:none;flex:none}
@media(prefers-color-scheme:light){
.dbp{background:#fff;color:#16181d;border-color:#e6e8ec}
.dbp__badge{color:#5b626e;border-color:#e6e8ec}
.dbp__desc,.dbp__step{color:#5b626e}
.dbp__btn{background:#f6f7f9;border-color:#e6e8ec;color:#16181d}
.dbp__btn:hover{background:#eef0f3}
}`;
    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
  }

  const SVGNS = "http://www.w3.org/2000/svg";
  const svg = (tag, attrs) => {
    const el = document.createElementNS(SVGNS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  // ── compile a play into per-actor keyframe states + timed throw events ──
  function compile(play) {
    const actors = new Map(); // key -> {team,n,x,y,ball,out,fake}
    const keyOf = (team, n) => team + "-" + n;
    const seed = (team, list) =>
      (list || []).forEach((a) =>
        actors.set(keyOf(team, a.n), {
          team, n: a.n, x: a.x, y: a.y,
          ball: !!a.ball, out: false, fake: false,
        })
      );
    seed("us", play.setup.us);
    seed("them", play.setup.them);

    // boundary snapshots: states[i] = positions/flags entering step i
    const snapshot = () => {
      const m = {};
      actors.forEach((v, k) => (m[k] = { x: v.x, y: v.y, ball: v.ball, out: v.out, fake: v.fake }));
      return m;
    };

    const steps = play.steps || [];
    const totalDur = steps.reduce((s, st) => s + (st.dur || 1), 0) || 1;
    const states = [snapshot()];
    const throws = [];
    const labels = [];
    let t0 = 0;

    steps.forEach((st) => {
      const dur = st.dur || 1;
      labels.push({ t0, t1: t0 + dur, text: st.label || "" });
      // fakes are momentary flags for the duration of the step
      (st.fakes || []).forEach((f) => {
        const a = actors.get(keyOf(f.team, f.n));
        if (a) a.fake = true;
      });
      // moves resolve by the END of the step
      (st.moves || []).forEach((mv) => {
        const a = actors.get(keyOf(mv.team, mv.n));
        if (a && mv.to) { a.x = mv.to[0]; a.y = mv.to[1]; }
      });
      // throws fire across the step; thrower drops ball, target goes out at end
      (st.throws || []).forEach((th) => {
        throws.push({
          from: keyOf(th.from.team, th.from.n),
          to: keyOf(th.to.team, th.to.n),
          t0, t1: t0 + dur,
          curve: th.curve == null ? -22 : th.curve,
        });
        const fa = actors.get(keyOf(th.from.team, th.from.n));
        if (fa) fa.ball = false;
        const ta = actors.get(keyOf(th.to.team, th.to.n));
        if (ta) ta.out = true;
      });
      // a pass hands a ball from one teammate to another (no elimination)
      (st.passes || []).forEach((ps) => {
        throws.push({
          from: keyOf(ps.from.team, ps.from.n),
          to: keyOf(ps.to.team, ps.to.n),
          t0, t1: t0 + dur, pass: true,
          curve: ps.curve == null ? -14 : ps.curve,
        });
        const fa = actors.get(keyOf(ps.from.team, ps.from.n));
        if (fa) fa.ball = false;
        const ta = actors.get(keyOf(ps.to.team, ps.to.n));
        if (ta) ta.ball = true;
      });
      // clear momentary fakes after recording the boundary
      states.push(snapshot());
      actors.forEach((a) => (a.fake = false));
      t0 += dur;
    });

    return { keys: [...actors.keys()], states, throws, labels, totalDur };
  }

  // interpolate an actor's pos/flags at absolute time t
  function actorAt(c, key, t) {
    const { states, labels } = c;
    // find step index by time
    let i = 0;
    for (; i < labels.length; i++) if (t < labels[i].t1) break;
    if (i >= labels.length) i = labels.length - 1;
    const a = states[i][key], b = states[i + 1] ? states[i + 1][key] : a;
    const seg = labels[i] || { t0: 0, t1: 1 };
    const local = seg.t1 > seg.t0 ? (t - seg.t0) / (seg.t1 - seg.t0) : 1;
    const e = easeInOut(Math.max(0, Math.min(1, local)));
    return {
      x: lerp(a.x, b.x, e),
      y: lerp(a.y, b.y, e),
      // ball/out flip at the boundary they were set (end of step)
      ball: e >= 0.999 ? b.ball : a.ball,
      out: t >= seg.t1 - 1e-6 ? b.out : a.out,
      fake: a.fake,
      team: key.split("-")[0],
      n: key.split("-")[1],
    };
  }

  function mount(container, play, opts) {
    injectStyles();
    opts = opts || {};
    const c = compile(play);

    const root = document.createElement("div");
    root.className = "dbp";
    root.innerHTML =
      '<div class="dbp__head">' +
      '<span class="dbp__name"></span>' +
      (play.badge ? '<span class="dbp__badge"></span>' : "") +
      (play.call ? '<span class="dbp__call"></span>' : "") +
      "</div>" +
      (play.desc ? '<div class="dbp__desc"></div>' : "");
    root.querySelector(".dbp__name").textContent = play.name || "Play";
    if (play.badge) root.querySelector(".dbp__badge").textContent = play.badge;
    if (play.call) root.querySelector(".dbp__call").textContent = play.call;
    if (play.desc) root.querySelector(".dbp__desc").textContent = play.desc;

    const stage = svg("svg", {
      class: "dbp__stage", viewBox: `0 0 ${VB_W} ${VB_H}`,
      role: "img", "aria-label": (play.name || "Dodgeball play") + " animation",
    });
    root.appendChild(stage);

    // static court
    const court = svg("g", {});
    court.appendChild(svg("rect", { x: PAD, y: PAD, width: CW, height: CH, rx: 10, fill: COL.court, stroke: COL.line, "stroke-width": 2 }));
    court.appendChild(svg("line", { x1: PAD, y1: py(50), x2: PAD + CW, y2: py(50), stroke: COL.centerline, "stroke-width": 2.5, "stroke-dasharray": "10 9" }));
    // side labels
    const lblThem = svg("text", { x: PAD + 10, y: PAD + 24, fill: COL.them, "font-size": 22, "font-weight": 700, opacity: .8 }); lblThem.textContent = "THEM";
    const lblUs = svg("text", { x: PAD + 10, y: PAD + CH - 12, fill: COL.us, "font-size": 22, "font-weight": 700, opacity: .85 }); lblUs.textContent = "US";
    court.appendChild(lblThem); court.appendChild(lblUs);
    stage.appendChild(court);

    const layer = svg("g", {});
    stage.appendChild(layer);

    // controls
    const stepLine = document.createElement("div");
    stepLine.className = "dbp__stepline";
    stepLine.innerHTML = '<span class="dbp__step"></span>';
    root.appendChild(stepLine);

    const ctrls = document.createElement("div");
    ctrls.className = "dbp__ctrls";
    ctrls.innerHTML =
      '<button class="dbp__btn dbp__play" aria-label="Play"></button>' +
      '<input class="dbp__scrub" type="range" min="0" max="1000" value="0" aria-label="Scrub play">' +
      '<label class="dbp__loopwrap"><input type="checkbox" class="dbp__loop">loop</label>';
    root.appendChild(ctrls);

    const playBtn = ctrls.querySelector(".dbp__play");
    const scrub = ctrls.querySelector(".dbp__scrub");
    const stepEl = stepLine.querySelector(".dbp__step");
    const loopEl = ctrls.querySelector(".dbp__loop");
    loopEl.checked = !!opts.loop;

    const ICON_PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    const ICON_PAUSE = '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
    const ICON_REPLAY = '<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/></svg>';

    let playing = false, t = 0, raf = 0, lastTs = 0;
    const SPEED = (opts.speed || 1) * 1.0; // play-units per second

    function render() {
      // clear dynamic layer
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      // active throws as travelling balls
      c.throws.forEach((th) => {
        if (t < th.t0 || t > th.t1) return;
        const local = (t - th.t0) / Math.max(1e-6, th.t1 - th.t0);
        const fa = actorAt(c, th.from, th.t0);
        const ta = actorAt(c, th.to, th.t1);
        const x = lerp(px(fa.x), px(ta.x), local);
        const baseY = lerp(py(fa.y), py(ta.y), local);
        const arc = Math.sin(local * Math.PI) * th.curve; // visual arc
        const ball = svg("circle", { cx: x, cy: baseY + arc, r: 11, fill: COL.ball, stroke: "#7a5c00", "stroke-width": 1.5 });
        layer.appendChild(ball);
      });

      // actors
      c.keys.forEach((key) => {
        const a = actorAt(c, key, t);
        const X = px(a.x), Y = py(a.y);
        const g = svg("g", { opacity: a.out ? 0.32 : 1 });
        const fill = a.out ? COL.out : COL[a.team];
        // pump-fake wiggle
        const wob = a.fake && playing ? Math.sin(t * 40) * 3 : 0;
        const c1 = svg("circle", { cx: X + wob, cy: Y, r: 19, fill, stroke: "#0e1014", "stroke-width": 2 });
        g.appendChild(c1);
        const num = svg("text", { x: X + wob, y: Y + 6, fill: "#fff", "font-size": 18, "font-weight": 700, "text-anchor": "middle" });
        num.textContent = a.n;
        g.appendChild(num);
        if (a.out) {
          g.appendChild(svg("line", { x1: X - 13, y1: Y - 13, x2: X + 13, y2: Y + 13, stroke: "#cdd2db", "stroke-width": 3 }));
          g.appendChild(svg("line", { x1: X + 13, y1: Y - 13, x2: X - 13, y2: Y + 13, stroke: "#cdd2db", "stroke-width": 3 }));
        }
        // held ball — hidden while this actor's ball is mid-flight
        const releasing = c.throws.some((th) => th.from === key && t >= th.t0 && t < th.t1);
        if (a.ball && !a.out && !releasing) {
          g.appendChild(svg("circle", { cx: X + 22, cy: Y - 16, r: 9, fill: COL.ball, stroke: "#7a5c00", "stroke-width": 1.5 }));
        }
        layer.appendChild(g);
      });

      // step label + scrub sync
      const seg = c.labels.find((l) => t < l.t1) || c.labels[c.labels.length - 1];
      stepEl.textContent = seg ? seg.text : "";
      scrub.value = Math.round((t / c.totalDur) * 1000);
    }

    function setT(nt) { t = Math.max(0, Math.min(c.totalDur, nt)); render(); }

    function frame(ts) {
      if (!playing) return;
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      t += dt * SPEED;
      if (t >= c.totalDur) {
        if (loopEl.checked) { t = 0; }
        else { t = c.totalDur; pause(); render(); updateBtn(); return; }
      }
      render();
      raf = requestAnimationFrame(frame);
    }
    function updateBtn() {
      playBtn.innerHTML = playing ? ICON_PAUSE : (t >= c.totalDur ? ICON_REPLAY : ICON_PLAY);
      playBtn.setAttribute("aria-label", playing ? "Pause" : (t >= c.totalDur ? "Replay" : "Play"));
    }
    function play_() {
      if (t >= c.totalDur) t = 0;
      playing = true; lastTs = 0; updateBtn(); raf = requestAnimationFrame(frame);
    }
    function pause() { playing = false; cancelAnimationFrame(raf); updateBtn(); }

    playBtn.addEventListener("click", () => (playing ? pause() : play_()));
    scrub.addEventListener("input", () => { pause(); setT((scrub.value / 1000) * c.totalDur); updateBtn(); });

    container.appendChild(root);
    setT(0); updateBtn();
    if (opts.autoplay) play_();

    return { play: play_, pause, seek: setT, el: root };
  }

  function autoInit() {
    const db = global.DB_PLAYS || {};
    document.querySelectorAll("[data-db-play]").forEach((el) => {
      if (el.__dbpMounted) return;
      el.__dbpMounted = true;
      const id = el.getAttribute("data-db-play");
      const play = db[id];
      if (!play) { el.textContent = "[unknown play: " + id + "]"; return; }
      mount(el, play, {
        autoplay: el.hasAttribute("data-autoplay"),
        loop: el.hasAttribute("data-loop"),
        speed: parseFloat(el.getAttribute("data-speed")) || 1,
      });
    });
  }

  global.DodgeballPlay = { mount, autoInit, compile };
  if (document.readyState !== "loading") autoInit();
  else document.addEventListener("DOMContentLoaded", autoInit);
})(window);

/* ── PLAY FORMAT ────────────────────────────────────────────────────────────
{
  id: "kill-left",
  name: "Kill Left",
  badge: "4-ball offense",
  call: '"Kill left on 3"',
  desc: "Plain-English description of the attack.",
  setup: {
    us:   [{ n:1, x:18, y:84, ball:true }, ...],   // x:0..100 width, y:50..100 our half
    them: [{ n:1, x:18, y:16 }, ...],              // y:0..50 their half
  },
  steps: [
    { label:"Set", dur:1.0,
      fakes:  [{ team:"us", n:3 }],                // pump-fake wiggle this step
      moves:  [{ team:"us", n:2, to:[40,70] }],    // glide to a new spot by step end
      passes: [{ from:{team:"us",n:1}, to:{team:"us",n:3} }], // hand ball to teammate
      throws: [{ from:{team:"us",n:2}, to:{team:"them",n:3} }] // throw → target out
    },
  ],
}
Coordinates: x left→right 0..100, y depth 0 (their back line) .. 50 (center) .. 100 (our back line).
─────────────────────────────────────────────────────────────────────────── */
