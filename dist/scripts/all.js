"use strict";

// Wait until stuff loads
function init() {
  organizeThoughts();
  initProgressBar();
} // Set up scrolling action


function initProgressBar() {
  var last_known_scroll_position = 0;
  var ticking = false;
  var className = "thought-wrapper";
  var sections = document.querySelectorAll(".thought-wrapper");

  function updateProgress(scroll_pos) {
    var scrolledPast = Array.from(sections).filter(function (el) {
      el.getBoundingClientRect().top <= 0;
    });
    var activeThoughtWrapper = scrolledPast[scrolledPast.length - 1];

    if (activeThoughtWrapper) {
      var topOfActive = activeThoughtWrapper.getBoundingClientRect().top;
      document.getElementById('progress').style.width = 100 * -topOfActive / activeThoughtWrapper.offsetHeight + 'vw';
    }
  }

  window.addEventListener('scroll', function (e) {
    last_known_scroll_position = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress(last_known_scroll_position);
        ticking = false;
      });
      ticking = true;
    }
  });
} // Put color classes on the .thought items. Color classes gen'd by SCSS


function organizeThoughts() {
  var className = "thought";
  var elements = document.querySelectorAll(".thought");
  elements.forEach(function (el, i) {
    var thisClassName = className + "-" + i;
    if (el.classList) el.classList.add(thisClassName);else el.className += " " + thisClassName;
  });
}

window.onload = function () {
  init();
};
//# sourceMappingURL=all.js.map
