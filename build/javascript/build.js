(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
var onEnterFrame = function () {

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
$(window).bind('click', function (e) {
  moveTarget(e);
});

// Moves the target params and resets the time.
var moveTarget = function (e) {

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

var snapFlush = function () {

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

  var scrollScalar = document.body.scrollTop / (document.body.clientHeight - window.innerHeight),
      sheetOffset = sheetWidth * scrollScalar;

  var s;
  var ds = 0;

  var isScrolling = false;

  var diff = 0;
  var diffTolerance = 0;
  var panelNum = 0;

  var lerpRate = 0.1;

  $(window).scroll(function () {
    lerpRate = 0.1;
    lerpTargetX = document.body.scrollTop;
    isScrolling = true;
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function () {
      // do something
      console.log("Haven't scrolled in 250ms!");
      // $.proxy(snapFlush, that)
      lerpRate = 0.07;
      lerpTargetX = document.body.scrollTop;

      diff = lerpTargetX % panelWidth;
      diffTolerance = diff / panelWidth;
      panelNum = Math.floor(lerpTargetX / panelWidth);

      if (diffTolerance < snapTolerance) {
        document.body.scrollTop = panelNum * panelWidth;
      } else if (diffTolerance > 1 - snapTolerance) {
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvamF2YXNjcmlwdC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FDY0EsSUFBSSxTQUFTO0lBQ1gsWUFBWTtJQUNaLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQztJQUNqRCxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUM7SUFDakQsVUFBVSxHQUFHLFNBQVMsQ0FBQyxXQUFXO0lBQ2xDLFdBQVc7SUFDWCxDQUFDLEdBQUcsRUFBRTs7O0FBQUMsQUFHVCxJQUFJLGVBQWUsR0FBRyxVQUFVLEdBQUcsRUFBRTs7O0FBQUMsQUFHdEMsSUFBSSxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQyxBQXFCWCxJQUFJLE1BQU0sR0FBRyxBQUNYO0dBQUMsRUFBRSxDQUFDLEFBQ0o7R0FBQyxFQUFFLENBQUM7Q0FDTCxDQUFDOztBQUVGLElBQUksS0FBSyxHQUFHLEFBQ1Y7R0FBQyxFQUFFLENBQUMsQUFDSjtHQUFDLEVBQUUsQ0FBQztDQUNMLENBQUM7O0FBRUYsSUFBSSxNQUFNLEdBQUcsQUFDWDtHQUFDLEVBQUUsQ0FBQyxBQUNKO0dBQUMsRUFBRSxDQUFDO0NBQ0wsQ0FBQzs7QUFFRixJQUFJLE1BQU0sR0FBRyxBQUNYO0dBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEFBQ3JCO0dBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0NBQ3RCOzs7QUFBQyxBQUdGLElBQUksWUFBWSxHQUFHLFlBQVcsQUFHNUI7OztRQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFD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QVMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxBQUNwQzthQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQUFDakM7YUFBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEFBQy9CO2FBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxBQUNoQzthQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQUFFOUI7O0tBQUMsR0FBRyxjQUFjLEdBQUcsRUFBRSxHQUFHLFdBQVcsQ0FBQyxBQUN0QzthQUFTLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQUFDcEM7YUFBUyxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEFBQ2pDO2FBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxBQUMvQjthQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQUFDaEM7YUFBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEFBRTlCOzt5QkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUMvQixBQUVEOzt1QkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUUvQjs7QUFFRCxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICAgU2ltcGxlc3QgUG9zc2libGUgV2F5OlxuXG4gICBmdW5jdGlvbiBhbmltYXRlc2F1c2FnZSgpIHtcbiAgICQoXCI8ZGl2IC8+XCIpLmFwcGVuZFRvKFwiYm9keVwiKTtcbiAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlc2F1c2FnZSk7XG4gICB9XG4gICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZXNhdXNhZ2UpO1xuICAgKi9cblxuLypcblBvbHlmaWxsOiBodHRwOi8vd3d3LnBhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbiovXG5cbnZhciBzY3JvbGxUb3AsXG4gIHNjcm9sbFNjYWxhcixcbiAgc2hlZXRFYXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NoZWV0LWVhc3QnKSxcbiAgc2hlZXRXZXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NoZWV0LXdlc3QnKSxcbiAgc2hlZXRXaWR0aCA9IHNoZWV0RWFzdC5vZmZzZXRXaWR0aCxcbiAgc2hlZXRPZmZzZXQsXG4gIHMgPSBcIlwiOyAvLyBzdHlsZSBzdHJpbmdcblxuLy8gc25hcCBzdHVmZlxudmFyIHNjcm9sbFNuYXBXaWR0aCA9IHNoZWV0V2lkdGggLyAxNjtcbi8vIEVhc2UgSW4gRnVuY3Rpb25cbi8vIFBhcmFtczogVGltZSwgQmVnaW4sIENoYW5nZSAoRmluaXNoIC0gQmVnaW4pLCBEdXJhdGlvblxudmFyIGVhc2VJbjtcbi8qID0gZnVuY3Rpb24odCwgYiwgYywgZCkge1xuXG4gICByZXR1cm4gLWMgKiAodCAvPSBkKSAqICh0IC0gMikgKyBiO1xuXG4gICB9OyovXG5cbi8vIGZ1bmN0aW9uIGVhc2VPdXRDdWJpYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcbi8vICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDMpICsgMSkgKyBzdGFydFZhbHVlO1xuLy8gfVxuLy9cbi8vIGVhc2VJbiA9IGVhc2VPdXRDdWJpYztcbi8vIC8vIFJlZCBCbG9ja1xuLy8gdmFyICRjdXJyZnJhbWUgPSAkKCcjY3VycmZyYW1lJyk7XG4vL1xuLy8gLy8gU3RhcnRpbmcgdGltZSBhbmQgZHVyYXRpb24uXG4vLyB2YXIgc2Vjb25kcyA9IDE7XG4vLyB2YXIgdGltZSA9IDA7XG4vLyB2YXIgZHVyYXRpb24gPSA2MCAqIHNlY29uZHM7XG5cbi8vIFN0YXJ0aW5nIFRhcmdldCwgQmVnaW4sIEZpbmlzaCAmIENoYW5nZVxudmFyIHRhcmdldCA9IHtcbiAgeDogMCxcbiAgeTogMFxufTtcblxudmFyIGJlZ2luID0ge1xuICB4OiAwLFxuICB5OiAwXG59O1xuXG52YXIgZmluaXNoID0ge1xuICB4OiAwLFxuICB5OiAwXG59O1xuXG52YXIgY2hhbmdlID0ge1xuICB4OiBmaW5pc2gueCAtIGJlZ2luLngsXG4gIHk6IGZpbmlzaC55IC0gYmVnaW4ueVxufTtcblxuLy8gQ2FsbGVkIG9uIGVhY2ggZnJhbWUuXG52YXIgb25FbnRlckZyYW1lID0gZnVuY3Rpb24oKSB7XG5cbiAgLy8gRWFzaW5nIGludG8gdGhlIHRhcmdldC5cbiAgdGFyZ2V0LnggPSBlYXNlSW4odGltZSwgYmVnaW4ueCwgY2hhbmdlLngsIGR1cmF0aW9uKTtcbiAgdGFyZ2V0LnkgPSBlYXNlSW4odGltZSwgYmVnaW4ueSwgY2hhbmdlLnksIGR1cmF0aW9uKTtcblxuICAvLyBDU1MgVHJhbnNmb3JtXG4gICRjdXJyZnJhbWVbMF0uc3R5bGUud2Via2l0VHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgnICsgdGFyZ2V0LnggKyAncHgsICcgKyB0YXJnZXQueSArICdweCknO1xuXG5cbiAgLy8gSW5jcmVhc2UgdGltZS5cbiAgdGltZSsrO1xuXG59O1xuXG4vLyBJbml0aWFsIGFuaW1hdGlvbiBsb29wLlxuLy8gQ2hlY2tzIHRvIHNlZSBpZiBpdCdzIG5lY2Vzc2FyeVxuLy8gKGZ1bmN0aW9uIGFuaW1hdGlvbkxvb3AoKSB7XG4vLyAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRpb25Mb29wKTtcbi8vICAgaWYgKHRpbWUgPD0gZHVyYXRpb24pIHtcbi8vICAgICBvbkVudGVyRnJhbWUoKTtcbi8vICAgfVxuLy8gfSkoKTtcblxuLy8gT24gZWFjaCBtb3VzZSBtb3ZlLCBjYWxsIG1vdmVUYXJnZXRcbiQod2luZG93KS5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgbW92ZVRhcmdldChlKTtcbn0pO1xuXG4vLyBNb3ZlcyB0aGUgdGFyZ2V0IHBhcmFtcyBhbmQgcmVzZXRzIHRoZSB0aW1lLlxudmFyIG1vdmVUYXJnZXQgPSBmdW5jdGlvbihlKSB7XG5cbiAgYmVnaW4ueCA9IHRhcmdldC54O1xuICAvL2JlZ2luLnkgPSB0YXJnZXQueTtcblxuICBmaW5pc2gueCA9IGUucGFnZVg7XG4gIC8vZmluaXNoLnkgPSBlLnBhZ2VZO1xuXG4gIGNoYW5nZS54ID0gZmluaXNoLnggLSBiZWdpbi54O1xuICAvL2NoYW5nZS55ID0gZmluaXNoLnkgLSBiZWdpbi55O1xuXG4gIHRpbWUgPSAwO1xuXG59O1xuXG52YXIgdGhhdCA9IHRoaXM7XG5cbnZhciAkc2F1c2FnZSA9ICQoJyNzYXVzYWdlJyk7XG5cbnZhciBzbmFwRmx1c2ggPSBmdW5jdGlvbigpIHtcblxuICAvLyBzZWUgd2hlcmUgd2UgYXJlXG4gIC8vXG4gIC8vIG1vdmUgdGhlIHdpbmRvd3MgdG8gd2hlcmUgdGhleSBzaG91bGQgYmVcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHNuYXBGbHVzaCk7XG4gIC8vIERvIHRoZSBob3JpeiBzY3JvbGxcbn07XG5cbi8qKlxuICogT3VyIGFuaW1hdGlvbiBsb29wIC0gY2FsbGVkIGJ5IHJBRlxuICovXG5cblxuXG4vLyBmdW5jdGlvbiB1cGRhdGUoKSB7XG4vL1xuLy8gICAgIHNjcm9sbFNjYWxhciA9ICggZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgLyAoZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQpICk7XG4vL1xuLy8gICAgIHNoZWV0T2Zmc2V0ID0gc2hlZXRXaWR0aCAqIHNjcm9sbFNjYWxhcjtcbi8vXG4vLyAgICAgLy8gVE9ETzogaW50ZWdyYXRlIDNkIHRyYW5zZm9ybSBoZXJlIGlmIGF2YWlsYWJsZVxuLy8gICAgIC8vc2hlZXRXZXN0LnN0eWxlLnJpZ2h0ID0gLXNoZWV0T2Zmc2V0ICsgJ3B4JzsgLy8gbW92ZSBidWJibGUyIGF0IDUwJSBvZiBzY3JvbGwgcmF0ZVxuLy8gICAgIC8vc2hlZXRFYXN0LnN0eWxlLmxlZnQgPSAtc2hlZXRPZmZzZXQgKyAncHgnOyAvLyBtb3ZlIGJ1YmJsZTEgYXQgMjAlIG9mIHNjcm9sbCByYXRlXG4vL1xuLy9cbi8vICAgICAvLyBpZigxKSB7XG4vLyAgICAgLy8gICAgcyA9ICd0cmFuc2xhdGUzZCgnICsgc2hlZXRPZmZzZXQgICsgJ3B4LCAwLCAwKSc7XG4vLyAgICAgLy8gICAgc2hlZXRXZXN0LnN0eWxlLldlYmtpdFRyYW5zZm9ybSA9IHM7XG4vLyAgICAgLy8gICAgc2hlZXRXZXN0LnN0eWxlLk1velRyYW5zZm9ybSA9IHM7XG4vLyAgICAgLy8gICAgc2hlZXRXZXN0LnN0eWxlLk9UcmFuc2Zvcm0gPSBzO1xuLy8gICAgIC8vICAgIHNoZWV0V2VzdC5zdHlsZS5tc1RyYW5zZm9ybSA9IHM7XG4vLyAgICAgLy8gICAgc2hlZXRXZXN0LnN0eWxlLnRyYW5zZm9ybSA9IHM7XG4vLyAgICAgLy8gICAgcyA9ICd0cmFuc2xhdGUzZCgnICsgLXNoZWV0T2Zmc2V0ICArICdweCwgMCwgMCknO1xuLy8gICAgIC8vICAgIHNoZWV0RWFzdC5zdHlsZS5XZWJraXRUcmFuc2Zvcm0gPSBzO1xuLy8gICAgIC8vICAgIHNoZWV0RWFzdC5zdHlsZS5Nb3pUcmFuc2Zvcm0gPSBzO1xuLy8gICAgIC8vICAgIHNoZWV0RWFzdC5zdHlsZS5PVHJhbnNmb3JtID0gcztcbi8vICAgICAvLyAgICBzaGVldEVhc3Quc3R5bGUubXNUcmFuc2Zvcm0gPSBzO1xuLy8gICAgIC8vICAgIHNoZWV0RWFzdC5zdHlsZS50cmFuc2Zvcm0gPSBzO1xuLy8gICAgIC8vIH1cbi8vXG4vLyAgICAgLy9jb25zb2xlLmxvZyhzY3JvbGxTY2FsYXIgKiAxMDApO1xuLy8gICAvLyBrZWVwIGdvaW5nXG4vLyAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4vLyB9XG5cbi8vIHNjaGVkdWxlIHVwIHRoZSBzdGFydFxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB1cGRhdGUsIGZhbHNlKTtcblxuXG5mdW5jdGlvbiBsZXJwKHN0YXJ0LCBlbmQsIGFtdCkge1xuICByZXR1cm4gKDEgLSBhbXQpICogc3RhcnQgKyBhbXQgKiBlbmQ7XG59XG5cblxuZnVuY3Rpb24gZG9pdCgpIHtcbiAgdmFyIHNjcm9sbFRvcCxcbiAgICBzY3JvbGxTY2FsYXIsXG4gICAgc2hlZXRFYXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NoZWV0LWVhc3QnKSxcbiAgICBzaGVldFdlc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hlZXQtd2VzdCcpLFxuICAgIHNoZWV0V2lkdGggPSBzaGVldEVhc3Qub2Zmc2V0V2lkdGgsXG4gICAgc2hlZXRPZmZzZXQsXG4gICAgcyA9IFwiXCI7IC8vIHN0eWxlIHN0cmluZ1xuICB2YXIgc2Nyb2xsU2NhbGFyO1xuICB2YXIgd2lkdGhFbCA9IHNoZWV0RWFzdC5vZmZzZXRXaWR0aDtcbiAgdmFyIHBhbmVsQ291bnQgPSAkKCcjc2hlZXQtZWFzdCAucGFuZWwnKS5sZW5ndGg7XG4gIHZhciBwYW5lbFdpZHRoID0gJCgnI3NoZWV0LWVhc3QgLnBhbmVsJylbMF0ub2Zmc2V0V2lkdGg7XG5cbiAgdmFyIHNuYXBUb2xlcmFuY2UgPSAuMjsgLy9cbiAgdmFyIGxlcnBUYXJnZXRYID0gMCxcbiAgICBjdXJyZW50T2Zmc2V0ID0gMDtcblxuICB2YXIgc2Nyb2xsU2NhbGFyID0gKGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIC8gKGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0KSksXG5cbiAgICBzaGVldE9mZnNldCA9IHNoZWV0V2lkdGggKiBzY3JvbGxTY2FsYXI7XG5cbiAgdmFyIHM7XG4gIHZhciBkcyA9IDA7XG5cbiAgdmFyIGlzU2Nyb2xsaW5nID0gZmFsc2U7XG5cbiAgdmFyIGRpZmYgPSAwO1xuICB2YXIgZGlmZlRvbGVyYW5jZSA9IDA7XG4gIHZhciBwYW5lbE51bSA9IDA7XG5cbiAgdmFyIGxlcnBSYXRlID0gMC4xO1xuXG4gICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgbGVycFJhdGUgPSAwLjE7XG4gICAgbGVycFRhcmdldFggPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcbiAgICBpc1Njcm9sbGluZyA9IHRydWU7XG4gICAgY2xlYXJUaW1lb3V0KCQuZGF0YSh0aGlzLCAnc2Nyb2xsVGltZXInKSk7XG4gICAgJC5kYXRhKHRoaXMsICdzY3JvbGxUaW1lcicsIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAvLyBkbyBzb21ldGhpbmdcbiAgICAgIGNvbnNvbGUubG9nKFwiSGF2ZW4ndCBzY3JvbGxlZCBpbiAyNTBtcyFcIik7XG4gICAgICAvLyAkLnByb3h5KHNuYXBGbHVzaCwgdGhhdClcbiAgICAgIGxlcnBSYXRlID0gMC4wNztcbiAgICAgIGxlcnBUYXJnZXRYID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cbiAgICAgIGRpZmYgPSBsZXJwVGFyZ2V0WCAlIHBhbmVsV2lkdGg7XG4gICAgICBkaWZmVG9sZXJhbmNlID0gZGlmZi9wYW5lbFdpZHRoO1xuICAgICAgcGFuZWxOdW0gPSBNYXRoLmZsb29yKGxlcnBUYXJnZXRYL3BhbmVsV2lkdGgpO1xuXG4gICAgICBpZiAoZGlmZlRvbGVyYW5jZSA8IHNuYXBUb2xlcmFuY2UpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBwYW5lbE51bSAqIHBhbmVsV2lkdGg7XG4gICAgICB9IGVsc2UgaWYgKGRpZmZUb2xlcmFuY2UgPiAoMSAtIHNuYXBUb2xlcmFuY2UpKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gKDEgKyBwYW5lbE51bSkgKiBwYW5lbFdpZHRoO1xuICAgICAgfVxuXG4gICAgfSwgMjUwKSk7XG4gIH0pO1xuXG5cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIGRzID0gbGVycChkcywgbGVycFRhcmdldFgsIGxlcnBSYXRlKTtcbiAgICBzID0gJ3RyYW5zbGF0ZTNkKCcgKyAtZHMgKyAncHgsIDAsIDApJztcblxuICAgIHNoZWV0RWFzdC5zdHlsZS5XZWJraXRUcmFuc2Zvcm0gPSBzO1xuICAgIHNoZWV0RWFzdC5zdHlsZS5Nb3pUcmFuc2Zvcm0gPSBzO1xuICAgIHNoZWV0RWFzdC5zdHlsZS5PVHJhbnNmb3JtID0gcztcbiAgICBzaGVldEVhc3Quc3R5bGUubXNUcmFuc2Zvcm0gPSBzO1xuICAgIHNoZWV0RWFzdC5zdHlsZS50cmFuc2Zvcm0gPSBzO1xuXG4gICAgcyA9ICd0cmFuc2xhdGUzZCgnICsgZHMgKyAncHgsIDAsIDApJztcbiAgICBzaGVldFdlc3Quc3R5bGUuV2Via2l0VHJhbnNmb3JtID0gcztcbiAgICBzaGVldFdlc3Quc3R5bGUuTW96VHJhbnNmb3JtID0gcztcbiAgICBzaGVldFdlc3Quc3R5bGUuT1RyYW5zZm9ybSA9IHM7XG4gICAgc2hlZXRXZXN0LnN0eWxlLm1zVHJhbnNmb3JtID0gcztcbiAgICBzaGVldFdlc3Quc3R5bGUudHJhbnNmb3JtID0gcztcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICB9XG5cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG5cbn1cblxuZG9pdCgpO1xuIl19
