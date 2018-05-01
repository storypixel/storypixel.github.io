// Wait until stuff loads

function init() {
  organizeThoughts();
  initScrollTasks();
}

// Set up scrolling action
function initScrollTasks() {
  let last_known_scroll_position = 0;
  let ticking = false;

  let sections = document.querySelectorAll(".thought-wrapper");
  let thoughts = document.querySelectorAll(".thought");

  function processActives() {
    
  }


  function updateProgress(scroll_pos) {
    let scrolledPast = Array.from(sections).filter((el) => {
      return el.getBoundingClientRect().top <= 0;
    });
    let activeThoughtWrapper = scrolledPast[scrolledPast.length - 1]
    if (activeThoughtWrapper) {
      let topOfActive = activeThoughtWrapper.getBoundingClientRect().top
      document.getElementById('progress').style.width = 100 * -topOfActive / activeThoughtWrapper.offsetHeight + 'vw';
    }
  }

  function watchThoughts(scroll_pos) {
    let className = "active"
    let scrolledPast = Array.from(thoughts).forEach((el) => {
      if (el.getBoundingClientRect().top <= 0) {
        console.log("this el has top less than 0", el.getBoundingClientRect().bottom )
        if (el.classList)
          el.classList.add(className);
        else
          el.className += ' ' + className;
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
}

// Put color classes on the .thought items. Color classes gen'd by SCSS
function organizeThoughts() {
  let className = "thought";
  let elements = document.querySelectorAll(".thought");

  elements.forEach(function (el, i) {
    let thisClassName = className + "-" + i;
    if (el.classList) el.classList.add(thisClassName);
    else el.className += " " + thisClassName;
  });
}

window.onload = function () {
    init();
 }