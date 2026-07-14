/* ============================================================================
 * CANONICAL SOURCE — this file evolves HERE (dodgeball-play-notation).
 * The storypixel/dodgeball-play-animator repo carries a synced MIRROR of this
 * engine (see its "Sync engine from dodgeball-play-notation (canonical)"
 * commits). After editing here: run scripts/stamp-version.sh, then copy this
 * file (without this header) over play-animator.js in the animator repo.
 * History note: the sync direction was animator→notation before 2026-06;
 * older headers claiming the animator repo is canonical are obsolete.
 * ========================================================================== */
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
  const VB_W = 1000,
    VB_H = 660;
  // The court fills the whole frame. Players are inset by PR so an end-line
  // player (and a ball held at their side) never clips the edge — that inset is
  // the only "margin", and it's exactly the player radius, nothing wasted.
  const PR = 32;
  const PLAYER_R = 28;
  const PLAYER_LABEL_SIZE = 32;
  const px = (nx) => PR + (nx / 100) * (VB_W - 2 * PR);
  const py = (ny) => PR + (ny / 100) * (VB_H - 2 * PR);

  const COL = {
    us: "#111111", // our team — solid black piece
    them: "#ffffff", // their team — white piece, told apart by the dark outline
    ball: "#e23150", // ball — red dot
    court: "#eef1f4", // board surface — solid light
    frame: "#34424b", // board frame — dark slate
    line: "#34424b", // court boundary / center line
    centerline: "#34424b", // halfway line, dashed
    text: "#111111", // ink
    out: "#c4ccd2", // eliminated player — grey ghost
  };

  // Styles are installed per render root. This lets the player live inside a
  // ShadowRoot, where page CSS cannot reach it, while preserving normal embeds.
  const styledRoots = new WeakSet();
  function injectStyles(container) {
    const renderRoot =
      container && container.getRootNode ? container.getRootNode() : document;
    if (styledRoots.has(renderRoot)) return;
    const css = `
.dbp{all:initial;display:block;box-sizing:border-box;font:400 14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;border:2px solid #34424b;overflow:hidden;background:#fff;color:#111;max-width:560px;text-align:left;letter-spacing:normal;text-transform:none}
.dbp,.dbp *,.dbp *::before,.dbp *::after{box-sizing:border-box}
.dbp__head{display:flex;align-items:baseline;gap:8px;padding:11px 13px 6px;flex-wrap:wrap}
.dbp__name{font-weight:700;font-size:1rem;letter-spacing:-.01em}
.dbp__badge{font-size:.66rem;text-transform:uppercase;letter-spacing:.05em;color:#666;border:1px solid #d4d4d4;border-radius:999px;padding:2px 7px}
.dbp__call{color:#555;font-size:.85rem}
.dbp__desc{padding:0 13px 9px;color:#555;font-size:.85rem}
.dbp__stage{display:block;width:100%;height:auto;border-bottom:2px solid #34424b;background:${COL.court};touch-action:auto}
.dbp__court{position:relative;line-height:0}
/* The black band spans the widget's full width; the rail, ticks, and playhead
   inside it are inset by 12px each side — equal to the .dbp__ctrls inset — so
   the scrub line's ends align with the play button's edges. */
.dbp__scrub{position:relative;height:40px;display:flex;align-items:center;cursor:pointer;padding:0 12px;border-bottom:2px solid #34424b;background:#111;touch-action:none}
/* No overflow clipping: the ticks at 0% and 100% are centered on the rail's
   ends and must render at full width, same as the interior ticks. */
.dbp__track{position:relative;width:100%;height:100%;border:0;background:#111}
.dbp__track::before{content:"";position:absolute;z-index:1;left:0;right:0;top:50%;height:2px;margin-top:-1px;background:#fff}
.dbp__fill{position:absolute;left:0;top:0;height:100%;width:0;background:#111}
.dbp__node{position:absolute;z-index:2;top:50%;width:2px;height:14px;margin:-7px 0 0 0;border:0;background:#fff;pointer-events:none}
.dbp__node--on{background:#fff}
.dbp__thumb{position:absolute;z-index:3;top:50%;left:0;width:14px;height:14px;margin:-7px 0 0 0;background:#fff;box-shadow:none;pointer-events:none}
.dbp__caption{display:block;padding:8px 12px;border-bottom:2px solid #34424b;background:#fff;font-size:.85rem;color:#111;text-align:left}
.dbp__ctrls{display:block;padding:12px}
.dbp__btn{appearance:none;width:100%;height:46px;padding:0;border:2px solid #34424b;border-radius:0;background:${COL.court};color:#111;display:grid;place-items:center;cursor:pointer;user-select:none;touch-action:manipulation}
.dbp__btn:hover{background:#e2e8ee}
.dbp__icon{width:20px;height:20px;fill:currentColor;pointer-events:none}
.dbp__play{width:100%}
.dbp__stepline{padding:4px 13px 0;font-size:.8rem;color:#555;min-height:1.2em}
.dbp__fig{padding:5px 13px 2px;font-size:.78rem;color:#777;text-align:center;font-style:italic}
.dbp-prose{margin:0 0 8px;font:inherit;color:inherit}
.dbp-prose__call{font-weight:600;font-size:.95em}
.dbp-prose__desc{margin:3px 0 0;font-size:.9em;color:#555;line-height:1.5}
.dbp__step{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
.dbp:focus{outline:none}
.dbp:focus-visible{outline:2px solid #111;outline-offset:2px}
.dbp__hint{padding:0 13px 9px;font-size:.68rem;color:#888}
@media(max-width:480px){.dbp{font-size:16px}.dbp__caption{font-size:1rem}}`;
    const s = document.createElement("style");
    s.setAttribute("data-dbp-styles", "");
    s.textContent = css;
    (renderRoot === document ? document.head : renderRoot).appendChild(s);
    styledRoots.add(renderRoot);
  }

  const SVGNS = "http://www.w3.org/2000/svg";
  const svg = (tag, attrs) => {
    const el = document.createElementNS(SVGNS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const pumpShake = (u, reps) => {
    const progress = Math.max(0, Math.min(1, u));
    const cycles = Math.max(1, Math.round(reps || 1));
    // Keep the oscillator at a constant frequency so every alternating peak is
    // equal. A short symmetric amplitude ramp removes only the endpoint snap.
    const edgeProgress = Math.min(1, progress / 0.1, (1 - progress) / 0.1);
    const edgeEase = edgeProgress * edgeProgress * (3 - 2 * edgeProgress);
    return Math.sin(2 * Math.PI * cycles * progress) * edgeEase;
  };

  // ── compile a play into per-actor keyframe states + timed throw events ──
  function compile(play) {
    const actors = new Map(); // key -> {team,n,x,y,ball,out,fake}
    const keyOf = (team, n) => team + "-" + n;
    const seed = (team, list) =>
      (list || []).forEach((a) =>
        actors.set(keyOf(team, a.n), {
          team,
          n: a.n,
          x: a.x,
          y: a.y,
          balls: a.balls != null ? a.balls : a.ball ? 1 : 0,
          out: false,
          fake: 0,
        }),
      );
    seed("us", play.setup.us);
    seed("them", play.setup.them);

    // boundary snapshots: states[i] = positions/flags entering step i
    const snapshot = () => {
      const m = {};
      actors.forEach(
        (v, k) =>
          (m[k] = { x: v.x, y: v.y, balls: v.balls, out: v.out, fake: v.fake }),
      );
      return m;
    };

    // loose balls sitting on the court (e.g. on the center line at the rush)
    const freeBalls = (play.setup.balls || []).map((b) => ({
      id: b.id,
      x: b.x,
      y: b.y,
      side: b.side || null,
      gone: Infinity,
    }));
    const freeById = {};
    freeBalls.forEach((b) => (freeById[b.id] = b));

    const steps = play.steps || [];
    const totalDur = steps.reduce((s, st) => s + (st.dur || 1), 0) || 1;
    const states = [snapshot()];
    const throws = [];
    const grabEvents = [];
    const labels = [];
    let t0 = 0;

    steps.forEach((st) => {
      const dur = st.dur || 1;
      const lbl = {
        t0,
        t1: t0 + dur,
        text: st.label || "",
        summary: st.summary || "",
        fakes: [],
        maxReps: 0,
      };
      labels.push(lbl);
      // Pump-fakes belong to this beat's live motion. Keep their metadata on the
      // label for inspection, and carry the rep count into the step snapshot so
      // actorAt() can animate them throughout the segment.
      (st.fakes || []).forEach((f) => {
        const a = actors.get(keyOf(f.team, f.n));
        const reps = f.reps || 1;
        if (a) a.fake = reps;
        lbl.fakes.push({ key: keyOf(f.team, f.n), reps: reps });
        if (reps > lbl.maxReps) lbl.maxReps = reps;
      });
      // moves resolve by the END of the step
      (st.moves || []).forEach((mv) => {
        const a = actors.get(keyOf(mv.team, mv.n));
        if (a && mv.to) {
          a.x = mv.to[0];
          a.y = mv.to[1];
        }
      });
      // grabs: a rusher collects one or more loose balls. The ball leaves the
      // floor at the START of the grab (gone = t0) and eases into the grabber's
      // hand over the step (a grab tween), so across loose -> in-grab -> held it
      // is drawn exactly once, never on the floor and in-hand at the same frame.
      (st.grabs || []).forEach((gr) => {
        const a = actors.get(keyOf(gr.team, gr.n));
        const ids = gr.balls || (gr.ball != null ? [gr.ball] : []);
        ids.forEach((id) => {
          const fb = freeById[id];
          if (fb) {
            fb.gone = t0;
            grabEvents.push({
              to: keyOf(gr.team, gr.n),
              t0: t0,
              t1: t0 + dur,
              fromX: fb.x,
              fromY: fb.y,
            });
          }
        });
        if (a) a.balls += ids.length;
      });
      // throws fire across the step; thrower drops a ball, target goes out at end
      (st.throws || []).forEach((th) => {
        throws.push({
          from: keyOf(th.from.team, th.from.n),
          to: keyOf(th.to.team, th.to.n),
          t0,
          t1: t0 + dur,
          curve: th.curve == null ? -22 : th.curve,
          outcome: th.outcome,
        });
        const fa = actors.get(keyOf(th.from.team, th.from.n));
        if (fa) fa.balls = Math.max(0, fa.balls - 1);
        const ta = actors.get(keyOf(th.to.team, th.to.n));
        // outcome: dodged/blocked → nobody out; caught → the thrower is out;
        // hit (!) or unresolved → the target is out
        if (th.outcome === "dodged" || th.outcome === "blocked") {
          /* live ball, nobody eliminated */
        } else if (th.outcome === "caught") {
          if (fa) fa.out = true;
        } else if (ta) {
          ta.out = true;
        }
      });
      // a pass hands a ball from one teammate to another (no elimination)
      (st.passes || []).forEach((ps) => {
        throws.push({
          from: keyOf(ps.from.team, ps.from.n),
          to: keyOf(ps.to.team, ps.to.n),
          t0,
          t1: t0 + dur,
          pass: true,
          curve: ps.curve == null ? -14 : ps.curve,
        });
        const fa = actors.get(keyOf(ps.from.team, ps.from.n));
        if (fa) fa.balls = Math.max(0, fa.balls - 1);
        const ta = actors.get(keyOf(ps.to.team, ps.to.n));
        if (ta) ta.balls += 1;
      });
      // clear momentary fakes after recording the boundary
      states.push(snapshot());
      actors.forEach((a) => (a.fake = 0));
      t0 += dur;
    });

    return {
      keys: [...actors.keys()],
      states,
      throws,
      grabs: grabEvents,
      labels,
      totalDur,
      freeBalls,
    };
  }

  // interpolate an actor's pos/flags at absolute time t
  function actorAt(c, key, t) {
    const { states, labels } = c;
    // find step index by time
    let i = 0;
    for (; i < labels.length; i++) if (t < labels[i].t1) break;
    if (i >= labels.length) i = labels.length - 1;
    const a = states[i][key],
      b = states[i + 1] ? states[i + 1][key] : a;
    const seg = labels[i] || { t0: 0, t1: 1 };
    const local = seg.t1 > seg.t0 ? (t - seg.t0) / (seg.t1 - seg.t0) : 1;
    const e = easeInOut(Math.max(0, Math.min(1, local)));
    return {
      x: lerp(a.x, b.x, e),
      y: lerp(a.y, b.y, e),
      // ball count holds the entering-step value, but flips to the resolved
      // (post-throw) value at the beat boundary — same as `out` below. Without
      // this, at the final beat's end (where the slideshow stops) the count is
      // stuck pre-throw and the thrown ball "replenishes" in the hand.
      balls: t >= seg.t1 - 1e-6 ? b.balls : a.balls,
      out: t >= seg.t1 - 1e-6 ? b.out : a.out,
      // Momentary actions resolve into the destination snapshot for this step.
      // Reading b.fake makes the pump happen during its authored beat instead
      // of leaking into the following beat or appearing at the end boundary.
      fake: b.fake,
      fakePhase: Math.max(0, Math.min(1, local)), // raw beat progress, for pump timing
      team: key.split("-")[0],
      n: key.split("-")[1],
    };
  }

  function mount(container, play, opts) {
    injectStyles(container);
    opts = opts || {};
    const c = compile(play);

    // Chess-notation default: the widget is just the court and its transport.
    // Name/badge/call/desc/step-text belong to the surrounding page. Pass
    // {chrome:"full"} (the editor does) to get the labelled authoring view.
    const full = opts.chrome === "full";

    const root = document.createElement("div");
    root.className = "dbp";
    if (full) {
      root.innerHTML =
        '<div class="dbp__head">' +
        '<span class="dbp__name"></span>' +
        (play.badge ? '<span class="dbp__badge"></span>' : "") +
        (play.call ? '<span class="dbp__call"></span>' : "") +
        "</div>" +
        (play.desc ? '<div class="dbp__desc"></div>' : "");
      root.querySelector(".dbp__name").textContent = play.name || "Play";
      if (play.badge)
        root.querySelector(".dbp__badge").textContent = play.badge;
      if (play.call) root.querySelector(".dbp__call").textContent = play.call;
      if (play.desc) root.querySelector(".dbp__desc").textContent = play.desc;
    }

    const stage = svg("svg", {
      class: "dbp__stage",
      viewBox: `0 0 ${VB_W} ${VB_H}`,
      role: "img",
      "aria-label": (play.name || "Dodgeball play") + " animation",
    });
    // beat caption — a plain left-aligned text strip above the court naming
    // the numbered state the court is in: "1. starting position" before
    // anything happens, then "2. parley", "3. to the line", … as beats land.
    // Only present when the play's steps carry summaries.
    let capEl = null;
    if (c.labels.some((l) => l.summary)) {
      capEl = document.createElement("div");
      capEl.className = "dbp__caption";
      root.appendChild(capEl);
    }

    const courtWrap = document.createElement("div");
    courtWrap.className = "dbp__court";
    courtWrap.appendChild(stage);
    root.appendChild(courtWrap);

    // static court — a clean, full-bleed light board (no frame, no margin),
    // dashed center line spanning the full width. No coordinate labels: plays
    // are authored in raw (x,y) and the fixed a–j/1–10 grid no longer matches
    // the parametric team-size files, so drawn labels would mislead.
    const court = svg("g", {});
    court.appendChild(
      svg("rect", { x: 0, y: 0, width: VB_W, height: VB_H, fill: COL.court }),
    );
    court.appendChild(
      svg("line", {
        x1: 0,
        y1: py(50),
        x2: VB_W,
        y2: py(50),
        stroke: COL.centerline,
        "stroke-width": 2,
        "stroke-dasharray": "11 9",
        "vector-effect": "non-scaling-stroke",
      }),
    );
    stage.appendChild(court);

    const layer = svg("g", {});
    stage.appendChild(layer);

    // controls — stacked under the court: [scrubber bar] then [play | next] bank.
    // A play is a SLIDESHOW of beats, not a video: play-through dwells at each node
    // and STOPS at the end (no loop); the scrubber drags to any point manually.
    // scrubber bar sits directly under the court (square nodes, one per beat)
    const scrubEl = document.createElement("div");
    scrubEl.className = "dbp__scrub";
    scrubEl.setAttribute("aria-label", "Scrub through the play");
    scrubEl.innerHTML =
      '<div class="dbp__track"><div class="dbp__fill"></div><div class="dbp__thumb"></div></div>';
    root.appendChild(scrubEl);

    // single full-width play button: each press advances one beat and stops
    const ctrls = document.createElement("div");
    ctrls.className = "dbp__ctrls";
    ctrls.innerHTML =
      '<button class="dbp__btn dbp__play" aria-label="Play beat"></button>';
    root.appendChild(ctrls);

    let stepEl = null;
    if (full) {
      const stepLine = document.createElement("div");
      stepLine.className = "dbp__stepline";
      stepLine.innerHTML = '<span class="dbp__step"></span>';
      root.appendChild(stepLine);

      const hint = document.createElement("div");
      hint.className = "dbp__hint";
      hint.textContent = "Keys: space play · ← → beat · R restart";
      root.appendChild(hint);
      stepEl = stepLine.querySelector(".dbp__step");
    }

    // optional figure caption ("Fig. 1") — the one piece of text a minimal
    // widget may carry, chess-diagram style. Set via opts.caption or the
    // host element's data-caption attribute.
    const captionText =
      opts.caption ||
      (container.getAttribute && container.getAttribute("data-caption")) ||
      "";
    if (captionText) {
      const fig = document.createElement("div");
      fig.className = "dbp__fig";
      fig.textContent = captionText;
      root.appendChild(fig);
    }

    const playBtn = ctrls.querySelector(".dbp__play");
    const trackEl = scrubEl.querySelector(".dbp__track");
    const fillEl = scrubEl.querySelector(".dbp__fill");
    const thumbEl = scrubEl.querySelector(".dbp__thumb");

    // beat boundaries: [0, end-of-beat-1, …, totalDur]. One node per beat (slide),
    // placed on the track at the beat's start so nodes + thumb always align,
    // plus a terminus tick at 100% marking the end of the play.
    const bounds = [0].concat(c.labels.map((l) => l.t1));
    const beatNodes = c.labels.map((l, i) => {
      const node = document.createElement("div");
      node.className = "dbp__node";
      const nodePct = c.totalDur > 0 ? (100 * l.t0) / c.totalDur : 0;
      node.style.left = nodePct + "%";
      node.style.transform = `translateX(-${nodePct}%)`;
      trackEl.appendChild(node);
      return node;
    });
    const endNode = document.createElement("div");
    endNode.className = "dbp__node dbp__node--end";
    endNode.style.left = "100%";
    endNode.style.transform = "translateX(-100%)";
    trackEl.appendChild(endNode);

    const ICON_PLAY =
      '<svg class="dbp__icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    const ICON_PAUSE =
      '<svg class="dbp__icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
    const ICON_REPLAY =
      '<svg class="dbp__icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/></svg>';

    let playing = false,
      t = 0,
      raf = 0,
      lastTs = 0,
      dwellUntil = 0,
      stopAt = null,
      loopMode = false;
    const DWELL_MS = 750; // hold this long at each beat node during playback
    const SPEED = (opts.speed || 2) * 1.0; // play-units per second; default 2x for realistic pace. Pass speed:1 for the old pace.

    function render() {
      // clear dynamic layer
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      // ── balls: a single per-frame handoff so each ball draws exactly once ──
      // loose -> in-grab -> held (dots, with the actors) -> in-flight -> resolved.
      // Every moving interval is half-open [t0, t1) so no two passes (or a pass
      // and a held dot) ever cover the same frame — no ball is drawn twice.
      const drawBall = (cx, cy, r) =>
        layer.appendChild(
          svg("circle", {
            cx: cx,
            cy: cy,
            r: r || 10,
            fill: COL.ball,
            stroke: "#8c1024",
            "stroke-width": 1.5,
          }),
        );
      const HX = 22,
        HY = -16; // hand slot — matches the first held-dot slot below

      // 1) loose balls still on the floor (a grabbed ball leaves at its grab start)
      c.freeBalls.forEach((b) => {
        if (t < b.gone) drawBall(px(b.x), py(b.y), 10);
      });

      // 2) grab tweens: the ball eases from the floor into the grabber's hand
      c.grabs.forEach((g) => {
        if (t < g.t0 || t >= g.t1) return;
        const e = easeInOut((t - g.t0) / Math.max(1e-6, g.t1 - g.t0));
        const ga = actorAt(c, g.to, t);
        drawBall(
          lerp(px(g.fromX), px(ga.x) + HX, e),
          lerp(py(g.fromY), py(ga.y) + HY, e),
          10,
        );
      });

      // 3) in-flight throws / passes: a fast snap over a short window at the END
      // of the beat. The ball is quick (a throw is a snap); the players keep their
      // own, slower pace over the full beat. FLIGHT is in play-seconds, so it stays
      // fast regardless of how long the beat is.
      const FLIGHT = 0.7;
      // a dodge must READ: the target sidesteps a player-width while the ball
      // overshoots straight through where they stood, then they settle back.
      const DODGE_STEP = 6; // ≈ one player diameter, in court units
      const DODGE_BACK = 0.35; // seconds to settle back after the miss
      const dodgeShift = {};
      c.throws.forEach((th) => {
        if (th.outcome !== "dodged") return;
        const flight = Math.min(FLIGHT, th.t1 - th.t0);
        const rel = th.t1 - flight;
        const stepStart = rel + 0.35 * flight;
        if (t <= stepStart || t >= th.t1 + DODGE_BACK) return;
        const stepOut = Math.min(1, (t - stepStart) / (flight * 0.65));
        const settle = Math.max(0, Math.min(1, (t - th.t1) / DODGE_BACK));
        const k = easeInOut(stepOut) * (1 - easeInOut(settle));
        const ta = actorAt(c, th.to, th.t1);
        const dir = ta.x <= 50 ? 1 : -1;
        dodgeShift[th.to] = (dodgeShift[th.to] || 0) + dir * DODGE_STEP * k;
      });
      c.throws.forEach((th) => {
        const flight = Math.min(FLIGHT, th.t1 - th.t0);
        const rel = th.t1 - flight; // release moment — ball leaves the hand here
        if (t < rel || t >= th.t1) return;
        const e = (t - rel) / flight; // linear & fast
        const fa = actorAt(c, th.from, rel);
        const ta = actorAt(c, th.to, th.t1);
        const miss = th.outcome === "dodged";
        // the miss flies through the target's ORIGINAL spot and keeps going
        const ex = miss ? Math.min(102, Math.max(-2, ta.x + (ta.x - fa.x) * 0.3)) : ta.x;
        const ey = miss ? Math.min(102, Math.max(-2, ta.y + (ta.y - fa.y) * 0.3)) : ta.y;
        const arc = Math.sin(e * Math.PI) * th.curve;
        drawBall(
          lerp(px(fa.x), px(ex), e),
          lerp(py(fa.y), py(ey), e) + arc,
          11,
        );
      });

      // actors
      c.keys.forEach((key) => {
        const a = actorAt(c, key, t);
        const shifted = dodgeShift[key]
          ? Math.min(100, Math.max(0, a.x + dodgeShift[key]))
          : a.x;
        const X = px(shifted),
          Y = py(a.y);
        // out players fade to a grey ghost, but the red X stays full-strength on top
        const g = svg("g", {});
        const fill = a.out ? COL.out : COL[a.team];
        const ghost = a.out ? 0.4 : 1;
        // the player stands still — a pump-fake shakes the BALL, not the body (below)
        const c1 = svg("circle", {
          cx: X,
          cy: Y,
          r: PLAYER_R,
          fill,
          stroke: "#111111",
          "stroke-width": 2,
          "vector-effect": "non-scaling-stroke",
          opacity: ghost,
        });
        g.appendChild(c1);
        const numFill = a.team === "us" && !a.out ? "#fff" : "#111";
        const num = svg("text", {
          x: X,
          y: Y + 10,
          fill: numFill,
          "font-size": PLAYER_LABEL_SIZE,
          "font-weight": 800,
          "text-anchor": "middle",
          opacity: ghost,
        });
        num.textContent = a.n;
        g.appendChild(num);
        if (a.out) {
          g.appendChild(
            svg("line", {
              class: "dbp__outx",
              x1: X - 15,
              y1: Y - 15,
              x2: X + 15,
              y2: Y + 15,
              stroke: "#111111",
              "stroke-width": 4.5,
              "stroke-linecap": "round",
            }),
          );
          g.appendChild(
            svg("line", {
              class: "dbp__outx",
              x1: X + 15,
              y1: Y - 15,
              x2: X - 15,
              y2: Y + 15,
              stroke: "#111111",
              "stroke-width": 4.5,
              "stroke-linecap": "round",
            }),
          );
        }
        // held balls — one dot per ball; a ball mid-flight is already off the hand
        const inFlight = c.throws.filter((th) => {
          const fl = Math.min(0.7, th.t1 - th.t0);
          return th.from === key && t >= th.t1 - fl && t < th.t1;
        }).length;
        const held = Math.max(0, a.balls - inFlight);
        if (!a.out && held > 0) {
          // A pump-fake moves the held ball out and back on a 45° diagonal while
          // the authored beat is playing. The player and the surrounding court
          // stay still; each rep returns the ball to the hand before the next.
          let fx = 0,
            fy = 0;
          if (a.fake > 0) {
            const s = pumpShake(a.fakePhase, a.fake); // equal travel through both diagonals
            const toward = a.team === "us" ? -1 : 1; // us fake up-court, them down
            fx = s * 18;
            fy = toward * s * 18; // equal axes = a true 45° path
          }
          const slots = [
            [22, -16],
            [22, 6],
          ];
          for (let h = 0; h < Math.min(held, slots.length); h++) {
            g.appendChild(
              svg("circle", {
                cx: X + slots[h][0] + fx,
                cy: Y + slots[h][1] + fy,
                r: 9,
                fill: COL.ball,
                stroke: "#8c1024",
                "stroke-width": 1.5,
              }),
            );
          }
        }
        layer.appendChild(g);
      });

      // step label + current-beat dot
      let cur = c.labels.findIndex((l) => t < l.t1);
      if (cur < 0) cur = c.labels.length - 1;
      if (stepEl)
        stepEl.textContent = c.labels[cur]
          ? cur +
            1 +
            "/" +
            c.labels.length +
            (c.labels[cur].text ? " · " + c.labels[cur].text : "")
          : "";
      beatNodes.forEach((d, i) =>
        d.classList.toggle("dbp__node--on", i === cur),
      );
      if (capEl) {
        // states, not beats: state 1 = the untouched court; entering beat k
        // (playing or landed) is state k+1, described by that beat's summary.
        const done = t <= 0 ? 0 : c.labels.filter((l) => l.t0 < t).length;
        const lbl = c.labels[done - 1] || {};
        capEl.textContent =
          done === 0
            ? "1. starting position"
            : done + 1 + ". " + (lbl.summary || lbl.text || "");
      }
      const pct = c.totalDur > 0 ? (100 * t) / c.totalDur : 0;
      fillEl.style.width = pct + "%";
      // left:p% + translateX(-p%) keeps the square flush inside the rail at
      // both ends, so nothing ever extends past the play button's edges.
      thumbEl.style.left = pct + "%";
      thumbEl.style.transform = `translateX(-${pct}%)`;
    }

    function setT(nt) {
      t = Math.max(0, Math.min(c.totalDur, nt));
      render();
    }

    function frame(ts) {
      if (!playing) return;
      if (!lastTs) lastTs = ts;
      // hold at a beat node (the animation pauses briefly at each stopping point).
      if (dwellUntil) {
        if (ts < dwellUntil) {
          lastTs = ts;
          raf = requestAnimationFrame(frame);
          return;
        }
        dwellUntil = 0;
        lastTs = ts;
      }
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      let nt = t + dt * SPEED;
      // single-beat advance: play to the target boundary and STOP there.
      if (stopAt != null && nt >= stopAt - 1e-6) {
        t = stopAt;
        stopAt = null;
        render();
        pause();
        updateBtn();
        return;
      }
      // playing through: snap to each beat node, dwell, then continue
      const node = bounds.find(
        (b) => b > t + 1e-6 && b <= nt + 1e-6 && b < c.totalDur - 1e-6,
      );
      if (node != null) {
        nt = node;
        dwellUntil = ts + DWELL_MS;
      }
      t = nt;
      // slideshow default: stop at the end. loop() mode (used by the quiz) runs
      // through continuously, dwelling at the end, then restarts from the top.
      if (t >= c.totalDur) {
        if (loopMode) {
          t = c.totalDur;
          render();
          dwellUntil = ts + DWELL_MS * 1.5;
          t = 0;
          lastTs = ts;
          raf = requestAnimationFrame(frame);
          return;
        }
        t = c.totalDur;
        render();
        pause();
        updateBtn();
        return;
      }
      render();
      raf = requestAnimationFrame(frame);
    }
    function updateBtn() {
      const atEnd = t >= c.totalDur;
      playBtn.innerHTML = playing
        ? ICON_PAUSE
        : atEnd
          ? ICON_REPLAY
          : ICON_PLAY;
      playBtn.setAttribute(
        "aria-label",
        playing ? "Pause" : atEnd ? "Restart" : "Play beat",
      );
    }
    function play_() {
      playing = true;
      lastTs = 0;
      dwellUntil = 0;
      updateBtn();
      raf = requestAnimationFrame(frame);
    }
    function pause() {
      playing = false;
      loopMode = false;
      cancelAnimationFrame(raf);
      updateBtn();
    }

    // play through ALL beats continuously and loop from the top — for the quiz,
    // where you study a play on repeat. pause()/any other control cancels it.
    function loop() {
      stopAt = null;
      loopMode = true;
      setT(0);
      play_();
    }

    // play the current beat's motion and STOP at the next node. A play is a
    // slideshow: each press advances one beat and stops; it does not run through.
    function playAll() {
      const eps = 1e-4;
      if (t >= c.totalDur - eps) t = 0; // at the end → restart from the top
      let nxt = c.totalDur;
      for (const b of bounds) {
        if (b > t + eps) {
          nxt = b;
          break;
        }
      }
      stopAt = nxt;
      play_();
    }
    // advance one slide: play the next beat's motion and stop at its end
    function nextBeat() {
      const eps = 1e-4;
      if (t >= c.totalDur - eps) return;
      let nxt = c.totalDur;
      for (const b of bounds) {
        if (b > t + eps) {
          nxt = b;
          break;
        }
      }
      stopAt = nxt;
      play_();
    }
    // go back one slide (instant)
    function prevBeat() {
      const eps = 1e-4;
      stopAt = null;
      pause();
      let prev = 0;
      for (const b of bounds) {
        if (b < t - eps) prev = b;
        else break;
      }
      setT(prev);
      updateBtn();
    }
    function replay() {
      stopAt = null;
      setT(0);
      playAll();
    }

    playBtn.addEventListener("click", () => (playing ? pause() : playAll()));

    // scrubber: drag anywhere on the track to seek to that point
    function seekFromEvent(e) {
      const r = trackEl.getBoundingClientRect();
      const frac = r.width > 0 ? (e.clientX - r.left) / r.width : 0;
      stopAt = null;
      setT(Math.max(0, Math.min(1, frac)) * c.totalDur);
      updateBtn();
    }
    let scrubbing = false;
    scrubEl.addEventListener("pointerdown", (e) => {
      scrubbing = true;
      pause();
      try {
        scrubEl.setPointerCapture(e.pointerId);
      } catch (_) {}
      seekFromEvent(e);
      e.preventDefault();
    });
    scrubEl.addEventListener("pointermove", (e) => {
      if (scrubbing) seekFromEvent(e);
    });
    const endScrub = (e) => {
      scrubbing = false;
      try {
        scrubEl.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };
    scrubEl.addEventListener("pointerup", endScrub);
    scrubEl.addEventListener("pointercancel", endScrub);

    // keyboard controls — scoped to THIS player (the listener is on root), so
    // typing in any input/textarea elsewhere on the page is never hijacked.
    // Click anywhere on the player to focus it; Tab also reaches it.
    root.tabIndex = 0;
    root.setAttribute(
      "aria-label",
      "Dodgeball play animation. Keys: space play/pause, left and right arrows step beat, R replay.",
    );
    root.addEventListener("mousedown", () => {
      if (!root.contains(document.activeElement))
        root.focus({ preventScroll: true });
    });
    root.addEventListener("keydown", (e) => {
      const ae = document.activeElement;
      // let native control keys work when a form control inside the player is focused
      if (
        ae &&
        (ae.tagName === "INPUT" ||
          ae.tagName === "TEXTAREA" ||
          ae.tagName === "SELECT" ||
          ae.isContentEditable)
      )
        return;
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        playing ? pause() : playAll();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextBeat();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevBeat();
      } else if (e.key === "r" || e.key === "R" || e.key === "Home") {
        e.preventDefault();
        replay();
      }
    });

    // minimal mode: the play's own prose (call + description) still renders,
    // but OUTSIDE the widget frame — plain page text above the diagram, so the
    // frame itself stays chess-clean. Suppress entirely with {prose:false}.
    let proseEl = null;
    if (!full && opts.prose !== false && (play.call || play.desc)) {
      proseEl = document.createElement("div");
      proseEl.className = "dbp-prose";
      if (play.call) {
        const callEl = document.createElement("div");
        callEl.className = "dbp-prose__call";
        callEl.textContent = play.call;
        proseEl.appendChild(callEl);
      }
      if (play.desc) {
        const descEl = document.createElement("p");
        descEl.className = "dbp-prose__desc";
        descEl.textContent = play.desc;
        proseEl.appendChild(descEl);
      }
      container.appendChild(proseEl);
    }

    container.appendChild(root);
    setT(0);
    updateBtn();
    if (opts.autoplay) playAll();

    // a hidden tab must not keep an animation loop alive
    const onVis = () => {
      if (document.hidden && playing) pause();
    };
    document.addEventListener("visibilitychange", onVis);

    // hosts that remount (the DBN editor re-renders on every edit) must call
    // destroy() first, or the old instance's rAF keeps drawing into detached DOM
    // and the document-level listener pins the whole closure in memory
    function destroy() {
      pause();
      document.removeEventListener("visibilitychange", onVis);
      if (proseEl && proseEl.parentNode)
        proseEl.parentNode.removeChild(proseEl);
      if (root.parentNode) root.parentNode.removeChild(root);
    }

    return {
      play: playAll,
      pause,
      seek: setT,
      next: nextBeat,
      prev: prevBeat,
      replay,
      loop,
      destroy,
      el: root,
    };
  }

  function autoInit() {
    const db = global.DB_PLAYS || {};
    document.querySelectorAll("[data-db-play]").forEach((el) => {
      if (el.__dbpMounted) return;
      el.__dbpMounted = true;
      const id = el.getAttribute("data-db-play");
      const play = db[id];
      if (!play) {
        el.textContent = "[unknown play: " + id + "]";
        return;
      }
      mount(el, play, {
        autoplay: el.hasAttribute("data-autoplay"),
        loop: el.hasAttribute("data-loop"),
        speed: parseFloat(el.getAttribute("data-speed")) || 2,
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
