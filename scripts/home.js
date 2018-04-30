// Wait until stuff loads

  function init() {
    // document.addEventListener("DOMContentLoaded", function(event) {
      organizeThoughts();
      initProgressBar();
      // console.log("test");
    // });
  }

  function initProgressBar() {
    console.log("initting progress bar")
    var last_known_scroll_position = 0;
    var ticking = false;

    var className = "thought-wrapper";
    var sections = document.querySelectorAll(".thought-wrapper");

    function doSomething(scroll_pos) {
      var scrolledPast = Array.from(sections).filter((el) => {
        var x = 0;
        return el.getBoundingClientRect().top <= 0;
        // console.log("el pos is ", scroll_pos, "vs", el.getBoundingClientRect().top, " w/ height ", )
      });
      var activeThoughtWrapper = scrolledPast[scrolledPast.length - 1]
      var topOfActive = activeThoughtWrapper.getBoundingClientRect().top
      console.log(scroll_pos, "vs", topOfActive, "vs", activeThoughtWrapper.offsetHeight)
      document.getElementById('progress').style.width = 100 * -topOfActive/activeThoughtWrapper.offsetHeight+'vw';

      // document.getElementById('progress').style.background = "hsl("+(scroll_pos/10 % 360)+", 50%, 70%)";
      // var scrolledPast = sections.forEach(function(el, i) {
      //   let topOfSection = el.getBoundingClientRect().top;
      //   console.log("el pos is ", scroll_pos, "vs", el.getBoundingClientRect().top, " w/ height ", el.offsetHeight)
      // });
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

  function organizeThoughts() {
    var className = "thought";
    var elements = document.querySelectorAll(".thought");
    elements.forEach(function(el, i) {
      var thisClassName = className + "-" + i;
      if (el.classList) el.classList.add(thisClassName);
      else el.className += " " + thisClassName;
    });
  }

  window.addEventListener("scroll", function() {
    console.log("boom")
    }, false);

document.addEventListener("DOMContentLoaded", init);