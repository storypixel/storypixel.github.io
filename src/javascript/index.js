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

// Ease In Function
// Params: Time, Begin, Change (Finish - Begin), Duration
var easeIn;/* = function(t, b, c, d) {

  return -c * (t /= d) * (t - 2) + b;

};*/

function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
}

easeIn = easeOutCubic;
// Red Block
var $currframe = $('#currframe');

// Starting time and duration.
var seconds = 1;
var time = 0;
var duration = 60 * seconds;

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
(function animationLoop() {
  requestAnimationFrame(animationLoop);
  if (time <= duration) {
    onEnterFrame();
  }
})();

// On each mouse move, call moveTarget
$(window).bind('click', function(e) {
  moveTarget(e);
});

// Moves the target params and resets the time.
var moveTarget = function(e) {

  begin.x = target.x;
  begin.y = target.y;

  finish.x = e.pageX;
  finish.y = e.pageY;

  change.x = finish.x - begin.x;
  //change.y = finish.y - begin.y;

  time = 0;

};

var $sausage = $('#sausage');

var snapFlush = function () {

  requestAnimationFrame(snapFlush);
  // Do the horiz scroll
}

$(window).scroll(function() {
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function() {
        // do something
        console.log("Haven't scrolled in 250ms!");
    }, 250));
});

/**
 * Our animation loop - called by rAF
 */

var scrollTop,
scrollScalar,
sheetEast = document.getElementById('sheet-east'),
sheetWest = document.getElementById('sheet-west'),
sheetWidth = sheetEast.offsetWidth,
sheetOffset;

function update() {

    scrollScalar = document.body.scrollTop / (document.body.clientHeight - window.innerHeight);

    sheetOffset = (sheetWidth * scrollScalar).toFixed(3);
    scrolltop = window.pageYOffset; // get number of pixels document has scrolled vertically
    sheetWest.style.right = -sheetOffset + 'px'; // move bubble2 at 50% of scroll rate
    sheetEast.style.opacity = sheetWest.style.opacity = .5; //(scrolltop%1000)/1000; // move bubble1 at 20% of scroll rate
    sheetEast.style.left = -sheetOffset + 'px'; // move bubble1 at 20% of scroll rate

    console.log(scrollScalar.toFixed(2));
  // keep going
    requestAnimationFrame(update);
}

// schedule up the start
window.addEventListener('load', update, false);


