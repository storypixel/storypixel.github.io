/* Dodgeball plays — data only. Authored from the "Dodging All Night, All Summer"
 * team playbook (/dodging-playbook). Add a play here and it shows up everywhere
 * the animator is mounted; no engine changes needed.
 *
 * Orientation: chess-diagram style. THEM on top, US on the bottom, center line
 * across the middle. x = 0..100 left→right, y = 0 (their back line) .. 50
 * (center) .. 100 (our back line). Players numbered 1 = far left.
 */
(function (global) {
  "use strict";

  // even spread of n players across the court width (margins ~12)
  const row = (n, y, balls) => {
    const out = [];
    const L = 14, R = 86;
    for (let i = 0; i < n; i++) {
      const x = n === 1 ? 50 : L + (i * (R - L)) / (n - 1);
      out.push({ n: i + 1, x: Math.round(x), y, ball: !!(balls && balls.includes(i + 1)) });
    }
    return out;
  };

  const US_BACK = 88, THEM_BACK = 12, CENTER_US = 54;

  const PLAYS = {
    // ── Opening ──────────────────────────────────────────────────────────
    "pitch-back": {
      id: "pitch-back",
      name: "Pitch Back",
      badge: "opening rush",
      call: '"Pitch back"',
      desc: "On the opening rush a rusher quickly tosses a ball back to a designated player, who then has a free look at any target on the other team. (Double pitch-back tosses both balls to two designated throwers.)",
      setup: {
        us: row(5, US_BACK, [3]),
        them: row(5, THEM_BACK),
      },
      steps: [
        { label: "Rush the center balls", dur: 1.2,
          moves: [
            { team: "us", n: 2, to: [32, CENTER_US] },
            { team: "us", n: 3, to: [50, CENTER_US] },
            { team: "us", n: 4, to: [68, CENTER_US] },
          ] },
        { label: "Pitch back to 5", dur: 0.8,
          passes: [{ from: { team: "us", n: 3 }, to: { team: "us", n: 5 } }] },
        { label: "Free look — strike", dur: 1.0,
          throws: [{ from: { team: "us", n: 5 }, to: { team: "them", n: 2 } }] },
      ],
    },

    // ── Offense ──────────────────────────────────────────────────────────
    "kill-left": {
      id: "kill-left",
      name: "Kill Left",
      badge: "4-ball offense",
      call: '"Kill left on 3"',
      desc: "The two left-side throwers commit to the same target — the 3rd player from the left on the other team. Non-throwers pump-fake to freeze the rest.",
      setup: {
        us: row(5, US_BACK, [1, 2]),
        them: row(5, THEM_BACK),
      },
      steps: [
        { label: "Set — fakes", dur: 0.8, fakes: [{ team: "us", n: 3 }, { team: "us", n: 4 }, { team: "us", n: 5 }] },
        { label: "Kill left on 3", dur: 1.1,
          throws: [
            { from: { team: "us", n: 1 }, to: { team: "them", n: 3 }, curve: -26 },
            { from: { team: "us", n: 2 }, to: { team: "them", n: 3 }, curve: -18 },
          ] },
      ],
    },

    "insides": {
      id: "insides",
      name: "Insides",
      badge: "4-ball offense",
      call: '"Insides on 5"',
      desc: "The two middle players pick one target — here the 5th from the left. Hits from the center are hard to read until the ball is already gone.",
      setup: {
        us: row(6, US_BACK, [3, 4]),
        them: row(6, THEM_BACK),
      },
      steps: [
        { label: "Set — corners fake", dur: 0.8, fakes: [{ team: "us", n: 1 }, { team: "us", n: 6 }] },
        { label: "Insides on 5", dur: 1.1,
          throws: [
            { from: { team: "us", n: 3 }, to: { team: "them", n: 5 }, curve: -22 },
            { from: { team: "us", n: 4 }, to: { team: "them", n: 5 }, curve: -14 },
          ] },
      ],
    },

    // Faithful to Daniel's diagram: two corner throwers converge on #4.
    "double-team-4": {
      id: "double-team-4",
      name: "Double-Team on 4",
      badge: "from Daniel's diagram",
      call: "two corners → 4",
      desc: "Straight from the whiteboard: both corner throwers commit to the same interior target (the 4th player) from opposite angles, so there's no single block that covers both balls.",
      setup: {
        us: row(4, US_BACK, [1, 2, 3, 4]),
        them: row(6, THEM_BACK),
      },
      steps: [
        { label: "Set — insides fake", dur: 0.8, fakes: [{ team: "us", n: 2 }, { team: "us", n: 3 }] },
        { label: "Converge on 4", dur: 1.1,
          throws: [
            { from: { team: "us", n: 1 }, to: { team: "them", n: 4 }, curve: -28 },
            { from: { team: "us", n: 4 }, to: { team: "them", n: 4 }, curve: -16 },
          ] },
      ],
    },

    // ── Defense / counters ───────────────────────────────────────────────
    "away": {
      id: "away",
      name: "Away",
      badge: "3-ball defense",
      call: '"Away"',
      desc: "Triggered when they throw: all ball-holders rush the center line, and the player opposite the thrower counters from at or near the line while they're still recovering.",
      setup: {
        us: row(5, US_BACK, [1, 3, 5]),
        them: row(5, THEM_BACK),
      },
      steps: [
        { label: "They throw — rush the line", dur: 1.0,
          moves: [
            { team: "us", n: 1, to: [14, CENTER_US] },
            { team: "us", n: 3, to: [50, CENTER_US] },
            { team: "us", n: 5, to: [86, CENTER_US] },
          ] },
        { label: "Counter the thrower", dur: 1.0,
          throws: [{ from: { team: "us", n: 3 }, to: { team: "them", n: 3 }, curve: -16 }] },
      ],
    },

    "crash": {
      id: "crash",
      name: "Crash",
      badge: "2-ball defense",
      call: '"Crash"',
      desc: "Up players with the other team down to one or two: after they throw, both corners rush and gang up on whoever just threw.",
      setup: {
        us: row(5, US_BACK, [1, 5]),
        them: [{ n: 1, x: 40, y: THEM_BACK }, { n: 2, x: 60, y: THEM_BACK }],
      },
      steps: [
        { label: "They throw — corners crash", dur: 1.1,
          moves: [
            { team: "us", n: 1, to: [34, CENTER_US] },
            { team: "us", n: 5, to: [66, CENTER_US] },
          ] },
        { label: "Both attack the thrower", dur: 1.0,
          throws: [
            { from: { team: "us", n: 1 }, to: { team: "them", n: 1 }, curve: -22 },
            { from: { team: "us", n: 5 }, to: { team: "them", n: 1 }, curve: -14 },
          ] },
      ],
    },
  };

  // ordered groups for the standalone gallery
  const GROUPS = [
    { title: "Opening", ids: ["pitch-back"] },
    { title: "Offense", ids: ["kill-left", "insides", "double-team-4"] },
    { title: "Defense & counters", ids: ["away", "crash"] },
  ];

  global.DB_PLAYS = PLAYS;
  global.DB_PLAY_GROUPS = GROUPS;
})(window);
