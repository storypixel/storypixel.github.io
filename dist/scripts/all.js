"use strict";

// Wait until stuff loads
function init() {
  organizeThoughts();
  initScrollTasks();
} // Set up scrolling action


function initScrollTasks() {
  var last_known_scroll_position = 0;
  var ticking = false;
  var sections = document.querySelectorAll(".thought-wrapper");
  var thoughts = document.querySelectorAll(".thought");
  var activeNodes = [];

  function processActives() {}

  function updateProgress(scroll_pos) {
    var scrolledPast = Array.from(sections).filter(function (el) {
      return el.getBoundingClientRect().top <= 0;
    });
    var activeThoughtWrapper = scrolledPast[scrolledPast.length - 1];

    if (activeThoughtWrapper) {
      var topOfActive = activeThoughtWrapper.getBoundingClientRect().top;
      document.getElementById('progress').style.width = 100 * -topOfActive / activeThoughtWrapper.offsetHeight + 'vw';
    }
  }

  function watchThoughts(scroll_pos) {
    var className = "active";
    var scrolledPast = Array.from(thoughts).forEach(function (el) {
      if (el.getBoundingClientRect().top <= 0) {
        console.log("this el has top less than 0", el.getBoundingClientRect().bottom);
        if (el.classList) el.classList.add(className);else el.className += ' ' + className;
      }
    });
  }

  window.addEventListener('scroll', function (e) {
    last_known_scroll_position = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress(last_known_scroll_position);
        watchThoughts(last_known_scroll_position);
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
