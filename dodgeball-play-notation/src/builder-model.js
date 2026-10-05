(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CallbookBuilder = factory();
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const conditionTags = ["Ruleset", "AdaptedFrom", "RequiresPlayers", "RequiresBalls", "PlayerAdvantage", "Burden", "ThrowClock", "Blocking", "OpponentState"];
  const kinds = ["move", "fake", "throw", "pass", "grab", "dodge", "block", "catch", "out", "return"];
  function fresh() {
    return { name: "Untitled play", call: "", description: "", players: 8, us: [], them: [], conditions: {},
      steps: [{ label: "Step up", duration: 1, actions: [action()] }] };
  }
  function action() { return { team: "U", actors: "1", kind: "move", destination: "line", target: "1", outcome: "%", reps: 1 }; }
  function demo() {
    const draft = fresh();
    draft.name = "Two throw, two cover"; draft.call = "Two throw, two cover";
    draft.description = "Two ball holders attack the same target. The other two stay loaded until the throwers are back.";
    draft.us = [2, 4, 6, 8]; draft.them = [3, 7];
    draft.conditions = { RequiresPlayers: "U:4+ T:1+", RequiresBalls: "U:4", Blocking: "allowed" };
    draft.steps = [
      { label: "Bring the four holders up", duration: 1, actions: [{ ...action(), actors: "2,4,6,8" }] },
      { label: "Two throw, two cover", duration: 1, actions: [
        { ...action(), actors: "2", kind: "throw", target: "5" },
        { ...action(), actors: "4", kind: "throw", target: "5" },
        { ...action(), actors: "6,8", kind: "fake" }] },
      { label: "Throwers fall back", duration: 1, actions: [
        { ...action(), actors: "2,4", destination: "back" }, { ...action(), actors: "6,8", kind: "fake" }] },
      { label: "Cover players fall back", duration: 1, actions: [{ ...action(), actors: "6,8", destination: "back" }] },
    ];
    return draft;
  }
  function integers(raw, max) {
    if (!/^\d+(?:\s*,\s*\d+)*$/.test(String(raw).trim())) throw new Error("Player numbers must be separated by commas.");
    const values = String(raw).split(",").map(Number);
    if (values.some((n) => !Number.isInteger(n) || n < 1 || n > max)) throw new Error("Player numbers must be between 1 and " + max + ".");
    if (new Set(values).size !== values.length) throw new Error("A player appears twice in the same action.");
    return values;
  }
  function generate(draft) {
    const n = Number(draft.players);
    if (!Number.isInteger(n) || n < 1 || n > 8) throw new Error("Choose between 1 and 8 players per side.");
    if (!draft.name.trim()) throw new Error("Give the play a name.");
    const tag = (key, value) => "[" + key + " " + JSON.stringify(String(value)) + "]";
    const lines = [tag("Play", draft.name), tag("Players", n)];
    if (draft.call.trim()) lines.push(tag("Call", draft.call));
    if (draft.description.trim()) lines.push(tag("Desc", draft.description));
    conditionTags.forEach((key) => { if (draft.conditions[key] && draft.conditions[key].trim()) lines.push(tag(key, draft.conditions[key].trim())); });
    const loaded = ["us", "them"].map((team) => {
      if (!draft[team].length) return "";
      const numbers = integers(draft[team].join(","), n);
      return (team === "us" ? "U:" : "T:") + numbers.join("");
    }).filter(Boolean);
    if (loaded.length) lines.push(tag("Balls", loaded.join(" ")));
    if (!draft.steps.length) throw new Error("Add at least one step.");
    lines.push("");
    draft.steps.forEach((step, index) => {
      const duration = Number(step.duration);
      if (!Number.isFinite(duration) || duration < 0.1 || duration > 10) throw new Error("Step " + (index + 1) + ": duration must be 0.1 to 10 seconds.");
      if (!step.actions.length) throw new Error("Step " + (index + 1) + ": add an action.");
      const tokens = step.actions.map((a) => {
        if (!["U", "T"].includes(a.team) || !kinds.includes(a.kind)) throw new Error("Unknown team or action.");
        const actors = integers(a.actors, n);
        const actor = a.team + actors.join("");
        if (a.kind === "move") {
          if (!["huddle", "line", "mid", "deep", "back"].includes(a.destination)) throw new Error("Unknown destination.");
          return actor + "-" + a.destination;
        }
        if (a.kind === "fake" || a.kind === "grab") {
          const reps = Number(a.reps);
          if (!Number.isInteger(reps) || reps < 1 || reps > 6) throw new Error("Action count must be 1 to 6.");
          return actor + (a.kind === "fake" ? "?" : "*") + (reps > 1 ? reps : "");
        }
        if (a.kind === "throw" || a.kind === "pass") {
          if (actors.length !== 1) throw new Error("Give each throw or pass its own action.");
          const target = integers(a.target, n);
          if (target.length !== 1) throw new Error("Choose one target.");
          if (a.kind === "pass") {
            if (target[0] === actors[0]) throw new Error("A player cannot pass to themselves.");
            return actor + ">" + a.team + target[0];
          }
          if (!["!", "%", "#", "^"].includes(a.outcome)) throw new Error("Choose a throw outcome.");
          return actor + "@" + (a.team === "U" ? "T" : "U") + target[0] + a.outcome;
        }
        if (a.kind === "return") return actors.map((v) => "+" + a.team + v).join(" ");
        return actor + ({ dodge: "%", block: "#", catch: "^", out: "X" })[a.kind];
      });
      const label = String(step.label).replace(/[{}\r\n]/g, " ").trim();
      lines.push((index + 1) + ". {" + label + "} :" + duration + " " + tokens.join(" "));
    });
    return lines.join("\n") + "\n";
  }
  function shareURL(base, source) {
    const url = new URL("builder.html", base);
    url.search = ""; url.hash = "dbn=" + encodeURIComponent(source);
    return url.href;
  }
  function readShared(hash) {
    if (!hash.startsWith("#dbn=")) return null;
    return decodeURIComponent(hash.slice(5));
  }
  // Validate storage structure, not play semantics: incomplete inputs must survive reload.
  function isDraft(d) {
    return !!d && ["name", "call", "description"].every((k) => typeof d[k] === "string") &&
      ["string", "number"].includes(typeof d.players) && !!d.conditions &&
      Object.values(d.conditions).every((v) => typeof v === "string") &&
      ["us", "them"].every((k) => Array.isArray(d[k]) && d[k].length <= 8 && d[k].every(Number.isInteger)) &&
      Array.isArray(d.steps) && d.steps.length <= 50 && d.steps.every((s) => s && typeof s.label === "string" &&
        ["string", "number"].includes(typeof s.duration) && Array.isArray(s.actions) && s.actions.length <= 24 &&
        s.actions.every((a) => a && ["team", "actors", "kind", "destination", "target", "outcome"].every((k) => typeof a[k] === "string") && ["string", "number"].includes(typeof a.reps)));
  }
  return { fresh, demo, action, generate, conditionTags, shareURL, readShared, isDraft };
});
