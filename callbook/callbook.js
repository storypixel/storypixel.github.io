(function () {
  "use strict";
  const plays = {
    cover: {
      source: '[Play "Two throw, two cover"]\n[Players "8"]\n[Call "Two throw, two cover"]\n[RequiresPlayers "U:4+ T:1+"]\n[RequiresBalls "U:4"]\n[Blocking "allowed"]\n[Balls "U:2468 T:37"]\n\n1. {Bring the four holders up} :1 U2468-line\n2. {Two throw, two cover} :1 U2@T5% U4@T5% U68?\n3. {Throwers fall back} :1 U24-back U68?\n4. {Cover players fall back} :1 U68-back\n',
      facts: [["4+", "Live players"], ["4", "Balls held"], ["2 + 2", "Throw + cover"]],
    },
    counter: {
      source: '[Play "Counter the retreat"]\n[Players "8"]\n[RequiresPlayers "U:1+ T:1+"]\n[RequiresBalls "U:1+"]\n[OpponentState "attacking"]\n[Balls "U:4 T:37"]\n\n1. {Their three comes forward} :1 T3-line\n2. {Their three throws; our four dodges} :1 T3@U4%\n3. {Our four counters the retreat} :1 T3-back U4-deep U4@T3%\n',
      facts: [["1+", "Live players"], ["1+", "Balls held"], ["Attack", "Trigger"]],
    },
  };
  let player = null;
  const $ = (id) => document.getElementById(id);
  function render() {
    try {
      const example = plays[$("demo-select").value], play = window.DBN.parse(example.source);
      if (player) player.destroy();
      const island = document.createElement("div"), root = island.attachShadow({ mode: "open" }), host = document.createElement("div");
      root.append(host); $("demo-court").replaceChildren(island);
      player = window.DodgeballPlay.mount(host, play, { chrome: "minimal", prose: false });
      $("demo-call").textContent = play.name;
      $("demo-sequence").replaceChildren();
      play.steps.forEach((step) => { const li = document.createElement("li"); li.textContent = step.label; $("demo-sequence").append(li); });
      $("demo-facts").replaceChildren();
      example.facts.forEach(([value, label]) => { const item = document.createElement("span"), strong = document.createElement("strong"); strong.textContent = value; item.append(strong, document.createTextNode(label)); $("demo-facts").append(item); });
      $("edit-demo").href = "/dodgeball-play-notation/builder.html#dbn=" + encodeURIComponent(example.source);
      $("demo-error").textContent = "";
    } catch (_) { $("demo-error").textContent = "The preview could not load. You can still open the play builder above."; }
  }
  $("demo-select").addEventListener("change", render); render();
})();
