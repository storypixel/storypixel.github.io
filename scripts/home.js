// Wait until stuff loads

  function init() {
      organizeThoughts();
      initProgressBar();
  }

  // Set up scrolling action
  function initProgressBar() {
    let last_known_scroll_position = 0;
    let ticking = false;

    let className = "thought-wrapper";
    let sections = document.querySelectorAll(".thought-wrapper");

    function doSomething(scroll_pos) {
      let scrolledPast = Array.from(sections).filter((el) => { el.getBoundingClientRect().top <= 0; });
      let activeThoughtWrapper = scrolledPast[scrolledPast.length - 1]
      let topOfActive = activeThoughtWrapper.getBoundingClientRect().top
      document.getElementById('progress').style.width = 100 * -topOfActive/activeThoughtWrapper.offsetHeight+'vw';
    }
    
    window.addEventListener('scroll', function(e) {
      last_known_scroll_position = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(function() {
          doSomething(last_known_scroll_position);
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

    elements.forEach(function(el, i) {
      let thisClassName = className + "-" + i;
      if (el.classList) el.classList.add(thisClassName);
      else el.className += " " + thisClassName;
    });
  }

window.onload = function() {
      init();
 }