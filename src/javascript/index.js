/*
   Simplest Possible Way:

   function animatesausage() {
   $("<div />").appendTo("body");
   requestAnimationFrame(animatesausage);
   }
   requestAnimationFrame(animatesausage);
   */

/*
Polyfill: http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
*/

var scrollTop,
  scrollScalar,
  sheetEast = document.getElementById('sheet-east'),
  sheetWest = document.getElementById('sheet-west'),
  sheetWidth = sheetEast.offsetWidth,
  sheetOffset,
  s = ""; // style string

// snap stuff
var scrollSnapWidth = sheetWidth / 16;
// Ease In Function
// Params: Time, Begin, Change (Finish - Begin), Duration
var easeIn;
/* = function(t, b, c, d) {

   return -c * (t /= d) * (t - 2) + b;

   };*/

// function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
//   return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
// }
//
// easeIn = easeOutCubic;
// // Red Block
// var $currframe = $('#currframe');
//
// // Starting time and duration.
// var seconds = 1;
// var time = 0;
// var duration = 60 * seconds;

// Starting Target, Begin, Finish & Change
var target = {
  x: 0,
  y: 0
};

var begin = {
  x: 0,
  y: 0
};

var finish = {
  x: 0,
  y: 0
};

var change = {
  x: finish.x - begin.x,
  y: finish.y - begin.y
};

// Called on each frame.
var onEnterFrame = function() {

  // Easing into the target.
  target.x = easeIn(time, begin.x, change.x, duration);
  target.y = easeIn(time, begin.y, change.y, duration);

  // CSS Transform
  $currframe[0].style.webkitTransform = 'translate(' + target.x + 'px, ' + target.y + 'px)';


  // Increase time.
  time++;

};

// Initial animation loop.
// Checks to see if it's necessary
// (function animationLoop() {
//   requestAnimationFrame(animationLoop);
//   if (time <= duration) {
//     onEnterFrame();
//   }
// })();

// On each mouse move, call moveTarget
$(window).bind('click', function(e) {
  moveTarget(e);
});

// Moves the target params and resets the time.
var moveTarget = function(e) {

  begin.x = target.x;
  //begin.y = target.y;

  finish.x = e.pageX;
  //finish.y = e.pageY;

  change.x = finish.x - begin.x;
  //change.y = finish.y - begin.y;

  time = 0;

};

var that = this;

var $sausage = $('#sausage');

var snapFlush = function() {

  // see where we are
  //
  // move the windows to where they should be
  requestAnimationFrame(snapFlush);
  // Do the horiz scroll
};

/**
 * Our animation loop - called by rAF
 */



// function update() {
//
//     scrollScalar = ( document.body.scrollTop / (document.body.clientHeight - window.innerHeight) );
//
//     sheetOffset = sheetWidth * scrollScalar;
//
//     // TODO: integrate 3d transform here if available
//     //sheetWest.style.right = -sheetOffset + 'px'; // move bubble2 at 50% of scroll rate
//     //sheetEast.style.left = -sheetOffset + 'px'; // move bubble1 at 20% of scroll rate
//
//
//     // if(1) {
//     //    s = 'translate3d(' + sheetOffset  + 'px, 0, 0)';
//     //    sheetWest.style.WebkitTransform = s;
//     //    sheetWest.style.MozTransform = s;
//     //    sheetWest.style.OTransform = s;
//     //    sheetWest.style.msTransform = s;
//     //    sheetWest.style.transform = s;
//     //    s = 'translate3d(' + -sheetOffset  + 'px, 0, 0)';
//     //    sheetEast.style.WebkitTransform = s;
//     //    sheetEast.style.MozTransform = s;
//     //    sheetEast.style.OTransform = s;
//     //    sheetEast.style.msTransform = s;
//     //    sheetEast.style.transform = s;
//     // }
//
//     //console.log(scrollScalar * 100);
//   // keep going
//     requestAnimationFrame(update);
// }

// schedule up the start
// window.addEventListener('load', update, false);


function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}


function doit() {
  var scrollTop,
    scrollScalar,
    sheetEast = document.getElementById('sheet-east'),
    sheetWest = document.getElementById('sheet-west'),
    sheetWidth = sheetEast.offsetWidth,
    sheetOffset,
    s = ""; // style string
  var scrollScalar;
  var widthEl = sheetEast.offsetWidth;
  var panelCount = $('#sheet-east .panel').length;
  var panelWidth = $('#sheet-east .panel')[0].offsetWidth;

  var snapTolerance = .2; //
  var lerpTargetX = 0,
    currentOffset = 0;

  var scrollScalar = (document.body.scrollTop / (document.body.clientHeight - window.innerHeight)),

    sheetOffset = sheetWidth * scrollScalar;

  var s;
  var ds = 0;

  var isScrolling = false;

  var diff = 0;
  var diffTolerance = 0;
  var panelNum = 0;

  var lerpRate = 0.1;

  $(window).scroll(function() {
    lerpRate = 0.1;
    lerpTargetX = document.body.scrollTop;
    isScrolling = true;
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function() {
      // do something
      console.log("Haven't scrolled in 250ms!");
      // $.proxy(snapFlush, that)
      lerpRate = 0.07;
      lerpTargetX = document.body.scrollTop;

      diff = lerpTargetX % panelWidth;
      diffTolerance = diff/panelWidth;
      panelNum = Math.floor(lerpTargetX/panelWidth);

      if (diffTolerance < snapTolerance) {
        document.body.scrollTop = panelNum * panelWidth;
      } else if (diffTolerance > (1 - snapTolerance)) {
        document.body.scrollTop = (1 + panelNum) * panelWidth;
      }

    }, 250));
  });


  function update() {
    ds = lerp(ds, lerpTargetX, lerpRate);
    s = 'translate3d(' + -ds + 'px, 0, 0)';

    sheetEast.style.WebkitTransform = s;
    sheetEast.style.MozTransform = s;
    sheetEast.style.OTransform = s;
    sheetEast.style.msTransform = s;
    sheetEast.style.transform = s;

    s = 'translate3d(' + ds + 'px, 0, 0)';
    sheetWest.style.WebkitTransform = s;
    sheetWest.style.MozTransform = s;
    sheetWest.style.OTransform = s;
    sheetWest.style.msTransform = s;
    sheetWest.style.transform = s;

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);

}

doit();
