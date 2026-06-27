/* Dodgeball plays — data only. Authored from the "Dodging All Night, All Summer"
 * team playbook (/dodging-playbook). Add a play here and it shows up everywhere
 * the animator is mounted; no engine changes needed.
 *
 * Orientation: chess-diagram style. THEM on top, US on the bottom, center line
 * across the middle. x = 0..100 left→right, y = 0 (their back line) .. 50
 * (center) .. 100 (our back line). Players numbered 1 = far left.
 *
 * Full teams are 10 a side. On our side the right-hand balls are OURS; the
 * left-hand balls are THEIRS.
 */
(function (global) {
  "use strict";

  // even spread of n players across the court width (margins ~14)
  const row = (n, y, balls) => {
    const out = [];
    const L = 14, R = 86;
    for (let i = 0; i < n; i++) {
      const x = n === 1 ? 50 : L + (i * (R - L)) / (n - 1);
      out.push({ n: i + 1, x: Math.round(x), y, ball: !!(balls && balls.includes(i + 1)) });
    }
    return out;
  };

  const US_BACK = 90, THEM_BACK = 10;

  const PLAYS = {
    // ── Opening rush / pitch back ────────────────────────────────────────
    "pitch-back": {
      id: "pitch-back",
      name: "Pitch Back",
      badge: "opening rush",
      call: '"Pitch back"',
      desc: "Six balls sit on the center line — the right three are OURS, the left three are THEIRS. The two right-side players rush and grab our three (one grabs two, one grabs one). On the pitch back, a rusher tosses a ball straight back to an attacker, who steps up to mid-court and takes a free look — usually at one of the two opponents still backpedaling from their own rush.",
      setup: {
        us: row(10, US_BACK),
        them: row(10, THEM_BACK),
        balls: [
          // our balls — out toward the right sideline
          { id: "uR1", x: 80, y: 50, side: "us" },
          { id: "uR2", x: 88, y: 50, side: "us" },
          { id: "uR3", x: 96, y: 50, side: "us" },
          // their balls — out toward the left sideline
          { id: "tL1", x: 4, y: 50, side: "them" },
          { id: "tL2", x: 12, y: 50, side: "them" },
          { id: "tL3", x: 20, y: 50, side: "them" },
        ],
      },
      steps: [
        {
          label: "Rush — the two on the right grab our three (2 + 1)", dur: 1.3,
          moves: [
            { team: "us", n: 10, to: [92, 54] },
            { team: "us", n: 9, to: [80, 54] },
            { team: "them", n: 1, to: [8, 46] },
            { team: "them", n: 2, to: [20, 46] },
          ],
          grabs: [
            { team: "us", n: 10, balls: ["uR2", "uR3"] },
            { team: "us", n: 9, balls: ["uR1"] },
            { team: "them", n: 1, balls: ["tL1", "tL2"] },
            { team: "them", n: 2, balls: ["tL3"] },
          ],
        },
        {
          label: "Pitch back — attacker steps up", dur: 0.9,
          passes: [{ from: { team: "us", n: 10 }, to: { team: "us", n: 6 } }],
          moves: [
            { team: "us", n: 6, to: [54, 68] },     // attacker comes up about halfway
            { team: "them", n: 1, to: [10, 30] },   // their rushers backpedal
            { team: "them", n: 2, to: [22, 30] },
          ],
        },
        {
          label: "Free look — hit a regressing rusher", dur: 1.0,
          moves: [
            { team: "them", n: 1, to: [12, 20] },
            { team: "them", n: 2, to: [24, 20] },
          ],
          throws: [{ from: { team: "us", n: 6 }, to: { team: "them", n: 2 }, curve: -20 }],
        },
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
        us: row(10, US_BACK, [1, 2]),
        them: row(10, THEM_BACK),
      },
      steps: [
        { label: "Set — fakes", dur: 0.8, fakes: [{ team: "us", n: 5 }, { team: "us", n: 6 }, { team: "us", n: 7 }] },
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
        us: row(10, US_BACK, [5, 6]),
        them: row(10, THEM_BACK),
      },
      steps: [
        { label: "Set — corners fake", dur: 0.8, fakes: [{ team: "us", n: 1 }, { team: "us", n: 10 }] },
        { label: "Insides on 5", dur: 1.1,
          throws: [
            { from: { team: "us", n: 5 }, to: { team: "them", n: 5 }, curve: -22 },
            { from: { team: "us", n: 6 }, to: { team: "them", n: 5 }, curve: -14 },
          ] },
      ],
    },

    // Faithful to Daniel's diagram: two corner throwers converge on #4.
    "double-team-4": {
      id: "double-team-4",
      name: "Double-Team on 4",
      badge: "from Daniel's diagram",
      call: "two corners → 4",
      desc: "Straight from the whiteboard (a mid-game snapshot with players already out): both corner throwers commit to the same interior target — the 4th player — from opposite angles, so there's no single block that covers both balls.",
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
        us: row(10, US_BACK, [3, 6, 9]),
        them: row(10, THEM_BACK),
      },
      steps: [
        { label: "They throw — rush the line", dur: 1.0,
          moves: [
            { team: "us", n: 3, to: [30, 54] },
            { team: "us", n: 6, to: [54, 54] },
            { team: "us", n: 9, to: [78, 54] },
          ] },
        { label: "Counter the thrower", dur: 1.0,
          throws: [{ from: { team: "us", n: 6 }, to: { team: "them", n: 6 }, curve: -16 }] },
      ],
    },

    "crash": {
      id: "crash",
      name: "Crash",
      badge: "2-ball defense",
      call: '"Crash"',
      desc: "Up players with the other team down to one or two: after they throw, both corners rush and gang up on whoever just threw.",
      setup: {
        us: row(10, US_BACK, [1, 10]),
        them: [{ n: 1, x: 50, y: THEM_BACK }],
      },
      steps: [
        { label: "They throw — corners crash", dur: 1.1,
          moves: [
            { team: "us", n: 1, to: [40, 54] },
            { team: "us", n: 10, to: [60, 54] },
          ] },
        { label: "Both attack the thrower", dur: 1.0,
          throws: [
            { from: { team: "us", n: 1 }, to: { team: "them", n: 1 }, curve: -22 },
            { from: { team: "us", n: 10 }, to: { team: "them", n: 1 }, curve: -14 },
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
