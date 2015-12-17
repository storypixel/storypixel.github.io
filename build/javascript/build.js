(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $window = $(window);

var scrollPercent = 0;

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

var lerpRate = 0.04;

function lerp(start, end, amt) {

  return (1 - amt) * start + amt * end;
}

function doit() {

  $(window).scroll(function () {
    //console.log(widthEl + '.');
    //lerpTargetX = document.body.scrollTop + window.innerHeight;
    // scrollPercent = document.body.scrollTop / (document.body.clientHeight - window.innerHeight);
    //
    // lerpTargetX = scrollPercent * widthEl;

    //console.log('scrollPercent: ' + scrollPercent);
    //console.log(lerpTargetX + 'v' + $window.scrollTop());
    //console.log(document.body.clientHeight - window.innerHeight);
    // var scrollTop = $(window).scrollTop();
    // var docHeight = $(document).height();
    // var winHeight = $(window).height();
    // isScrolling = true;
    // clearTimeout($.data(this, 'scrollTimer'));
    // $.data(this, 'scrollTimer', setTimeout(function() {
    //   // do something
    //   return false; // disable this scroll snap
    //   console.log("Haven't scrolled in 250ms!");
    //   // $.proxy(snapFlush, that)
    //   lerpRate = 0.07;
    //   lerpTargetX = document.body.scrollTop;
    //
    //   diff = lerpTargetX % panelWidth;
    //   diffTolerance = diff / panelWidth;
    //   panelNum = Math.floor(lerpTargetX / panelWidth);
    //
    //   if (diffTolerance < snapTolerance) {
    //     document.body.scrollTop = panelNum * panelWidth;
    //   } else if (diffTolerance > (1 - snapTolerance)) {
    //     document.body.scrollTop = (1 + panelNum) * panelWidth;
    //   }
    //
    // }, 250));
  });

  function update() {}

  //requestAnimationFrame(update);
}

doit();

(function () {
  $(function () {

    /*  Globals
    -------------------------------------------------- */
    var PROPERTIES = ['translateX', 'translateY', 'opacity', 'rotate', 'scale'],
        $body = $('body'),
        wrappers = [],
        currentWrapper = null,
        scrollTimeoutID = 0,
        bodyHeight = 0,
        windowHeight = 0,
        windowWidth = 0,
        panelWidth = 0,
        prevKeyframesDurations = 0,
        scrollTop = 0,
        relativeScrollTop = 0,
        currentKeyframe = 0,
        keyframes = [{
      'wrapper': '.panel-1x',
      'duration': '100%',
      'animations': [{
        'selector': '.tt--left',
        'left': [0, '100%'],
        'classesToAdd': [{
          'state-1': '0%'
        }, {
          'state-2': '100%'
        }]
      }, {
        'selector': '.tt--right',
        'right': [0, '100%'],
        'classesToAdd': [{
          'state-1': '0%'
        }, {
          'state-2': '100%'
        }]
      }]
    }, {
      'wrapper': '.panel-2x',
      'duration': '100%',
      'animations': []
    }, {
      'wrapper': '#explosion',
      'duration': '200%',
      'animations': [{
        'selector': '.tt--left2',
        'left': [0, '200%'],
        'classesToAdd': [{
          'state-1': '0%'
        }, {
          'state-2': '100%'
        }]
      }, {
        'selector': '.tt--right2',
        'right': [0, '200%'],
        'classesToAdd': [{
          'state-1': '0%'
        }, {
          'state-2': '100%'
        }]
      }]
    }];

    /*  Construction
    -------------------------------------------------- */
    init = function () {
      scrollIntervalID = setInterval(updatePage, 10);
      setupValues();
      $window.resize(throwError);
      if (isTouchDevice) {
        $window.resize(throwError);
      }
    };

    setupValues = function () {
      scrollTop = $window.scrollTop();
      windowHeight = $window.height();
      windowWidth = $window.width();
      panelWidth = $('#sheet-east .panel')[0].offsetWidth;
      // treat a panel's width as the windowHeight for our site purposes
      windowHeight = panelWidth;
      convertAllPropsToPx();
      buildPage();
    };

    buildPage = function () {
      var i, j, k;
      for (i = 0; i < keyframes.length; i++) {
        // loop keyframes
        bodyHeight += keyframes[i].duration;
        if ($.inArray(keyframes[i].wrapper, wrappers) == -1) {
          wrappers.push(keyframes[i].wrapper);
        }
        for (j = 0; j < keyframes[i].animations.length; j++) {
          // loop animations
          Object.keys(keyframes[i].animations[j]).forEach(function (key) {
            // loop properties
            value = keyframes[i].animations[j][key];
            if (key !== 'selector' && value instanceof Array === false) {
              var valueSet = [];
              valueSet.push(getDefaultPropertyValue(key), value);
              value = valueSet;
            }
            keyframes[i].animations[j][key] = value;
          });
        }
      }
      //$body.height(bodyHeight);
      //console.log('page built');
      currentWrapper = wrappers[0];
      //$(currentWrapper).show();
    };

    convertAllPropsToPx = function () {
      var i, j, k, value, val;
      for (i = 0; i < keyframes.length; i++) {
        // loop keyframes
        keyframes[i].duration = convertPercentToPx(keyframes[i].duration, 'y');
        for (j = 0; j < keyframes[i].animations.length; j++) {
          // loop animations
          Object.keys(keyframes[i].animations[j]).forEach(function (key) {
            // loop properties
            value = keyframes[i].animations[j][key];
            if (key !== 'selector') {
              if (value instanceof Array) {
                // if its an array
                for (k = 0; k < value.length; k++) {
                  // if value in array is %
                  if (typeof value[k] === "string") {
                    if (key === 'translateY') {
                      value[k] = convertPercentToPx(value[k], 'y');
                    } else if (key === "translateX") {
                      value[k] = convertPercentToPx(value[k], 'x');
                    } else if (key === "left") {
                      value[k] = convertPercentToPx(value[k], 'y');
                    } else if (key === "right") {
                      value[k] = convertPercentToPx(value[k], 'y');
                    }
                  } else if (typeof value[k] === "object") {
                    if (key === 'classesToAdd') {
                      // loop through these
                      Object.keys(value[k]).forEach(function (yek) {
                        // convert to array for performance
                        value[k] = [yek, convertPercentToPx(value[k][yek], 'y')];
                      });
                    }
                  }
                }
              } else {
                if (typeof value === "string") {
                  // if single value is a %
                  if (key === 'translateY') {
                    value = convertPercentToPx(value, 'y');
                  } else {
                    value = convertPercentToPx(value, 'x');
                  }
                }
              }
              keyframes[i].animations[j][key] = value;
            }
          });
        }
      }
    };

    getDefaultPropertyValue = function (property) {
      switch (property) {
        case 'translateX':
          return 0;
        case 'translateY':
          return 0;
        case 'scale':
          return 1;
        case 'rotate':
          return 0;
        case 'opacity':
          return 1;
        case 'left':
          return null;
        case 'right':
          return null;
        default:
          return null;
      }
    };

    /*  Animation/Scrolling
    -------------------------------------------------- */
    updatePage = function () {
      window.requestAnimationFrame(function () {
        setScrollTops();
        if (scrollTop >= 0 && scrollTop <= bodyHeight - windowHeight) {
          animateElements();
          setKeyframe();
        }

        //console.log(windowHeight + ' v ' + window.innerHeight);

        scrollPercent = 1 - document.body.scrollTop / (document.body.clientHeight - window.innerHeight);

        lerpTargetX = scrollPercent * widthEl;

        ds = lerpTargetX; // lerp(ds, lerpTargetX, lerpRate);

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
      });
    };

    setScrollTops = function () {
      scrollTop = $window.scrollTop();
      relativeScrollTop = scrollTop - prevKeyframesDurations;
    };

    animateElements = function () {
      var animation, translateY, translateX, scale, rotate, opacity, left, right, anilength;

      anilength = keyframes[currentKeyframe].animations.length;

      console.log(currentKeyframe);

      for (var i = 0; i < anilength; i++) {
        animation = keyframes[currentKeyframe].animations[i];
        translateY = calcPropValue(animation, 'translateY');
        translateX = calcPropValue(animation, 'translateX');
        scale = calcPropValue(animation, 'scale');
        rotate = calcPropValue(animation, 'rotate');
        opacity = calcPropValue(animation, 'opacity');
        left = calcPropValue(animation, 'left');
        right = calcPropValue(animation, 'right');

        // console.log(prevKeyframesDurations);
        // console.log(animation);
        if (right) {
          // console.log(right);
        }

        $(animation.selector).css({
          'transform': 'translate3d(' + translateX + 'px, ' + translateY + 'px, 0) scale(' + scale + ') rotate(' + rotate + 'deg)',
          'opacity': opacity,
          'left': left,
          'right': right
        }).each(function (i, target) {
          (animation.classesToAdd || []).forEach(function (el, i) {
            if (ds >= el[1] + prevKeyframesDurations && $(target).hasClass(el[0]) === false) {
              // console.log("we should add " + el[0] + ', ' + el[1] + '(' + prevKeyframesDurations + '). scrollTop is ' + scrollTop);
              $(target).addClass(el[0]);
            } else if (ds < el[1] + prevKeyframesDurations && $(target).hasClass(el[0]) === true) {
              // console.log("we should remove " + el[0] + ', ' + el[1] + '(' + prevKeyframesDurations + '). scrollTop is ' + scrollTop);
              $(target).removeClass(el[0]);
            }
          });
        });
      }
    };

    calcPropValue = function (animation, property) {
      var value = animation[property];
      if (value && property !== 'left' && property !== 'right') {
        value = easeInOutQuad(relativeScrollTop, value[0], value[1] - value[0], keyframes[currentKeyframe].duration);
      } else if (!value) {
        value = getDefaultPropertyValue(property);
      } else {

        //value = easeInOutQuad(relativeScrollTop, value[0], (value[1] - value[0]), keyframes[currentKeyframe].duration);
        value = lerp(value[0] || animation[property].lastValue || 0, relativeScrollTop, lerpRate);
        animation[property].lastValue = value;
        //value = relativeScrollTop; // easeLinear(relativeScrollTop, value[0], (value[1] - value[0]), keyframes[currentKeyframe].duration);

        // console.log('min is '+value[0] + ' and max is '+value[1]);
        // value = Math.max(value[0], Math.min(relativeScrollTop, value[1]));
      }
      // value = +value.toFixed(2)
      // TEMPORARILY REMOVED CAUSE SCALE DOESN'T WORK WITHA AGRESSIVE ROUNDING LIKE THIS
      return value;
    };

    easeInOutQuad = function (t, b, c, d) {
      //sinusoadial in and out
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };

    // easeLinear = function (t, b, c, d) {
    //   return c * t / d + b;
    // }

    neatenLastKeyframe = function (d) {
      var animation, translateY, translateX, scale, rotate, opacity, left, right, anilength, index;

      index = d > 0 ? 1 : 0;

      anilength = keyframes[currentKeyframe].animations.length;

      for (var i = 0; i < anilength; i++) {
        animation = keyframes[currentKeyframe].animations[i];
        translateY = animation['translateY'][index] || animation['translateY'];
        translateX = animation['translateX'][index] || animation['translateX'];
        scale = animation['scale'][index] || animation['scale'];
        rotate = animation['rotate'][index] || animation['rotate'];
        opacity = animation['opacity'][index] || animation['opacity'];
        left = animation['left'][index] || animation['left'];
        right = animation['right'][index] || animation['right'];

        // console.log(prevKeyframesDurations);
        // console.log(animation);
        if (right) {
          console.log(right);
        }

        $(animation.selector).css({
          'transform': 'translate3d(' + translateX + 'px, ' + translateY + 'px, 0) scale(' + scale + ') rotate(' + rotate + 'deg)',
          'opacity': opacity,
          'left': left,
          'right': right
        });
      }
    };

    setKeyframe = function () {
      if (scrollTop > keyframes[currentKeyframe].duration + prevKeyframesDurations) {
        //neatenLastKeyframe(1);
        prevKeyframesDurations += keyframes[currentKeyframe].duration;
        currentKeyframe++;
        //showCurrentWrappers();
      } else if (scrollTop < prevKeyframesDurations) {
          //neatenLastKeyframe(-1);
          currentKeyframe--;
          prevKeyframesDurations -= keyframes[currentKeyframe].duration;
          //showCurrentWrappers();
        }
    };

    showCurrentWrappers = function () {
      var i;
      if (keyframes[currentKeyframe].wrapper != currentWrapper) {
        $(currentWrapper).hide();
        $(keyframes[currentKeyframe].wrapper).show();
        currentWrapper = keyframes[currentKeyframe].wrapper;
      }
    };

    /*  Helpers
    -------------------------------------------------- */

    convertPercentToPx = function (value, axis) {
      if (typeof value === "string" && value.match(/%/g)) {
        if (axis === 'y') value = parseFloat(value) / 100 * panelWidth; //windowHeight;
        if (axis === 'x') value = parseFloat(value) / 100 * windowWidth;
      }
      return value;
    };

    throwError = function () {
      $body.addClass('page-error');
    };

    isTouchDevice = function () {
      return 'ontouchstart' in window // works on most browsers
       || 'onmsgesturechange' in window; // works on ie10
    };

    window.location = "#"; // to top
    init();
  });
}).call(this);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvamF2YXNjcmlwdC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFeEIsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDOztBQUV0QixJQUFJLFNBQVM7SUFDWCxZQUFZO0lBQ1osU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDO0lBQ2pELFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQztJQUNqRCxVQUFVLEdBQUcsU0FBUyxDQUFDLFdBQVc7SUFDbEMsV0FBVztJQUNYLENBQUMsR0FBRyxFQUFFO0FBQUMsQUFDVCxJQUFJLFlBQVksQ0FBQztBQUNqQixJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDO0FBQ3BDLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNoRCxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7O0FBRXhELElBQUksYUFBYSxHQUFHLEVBQUU7QUFBQyxBQUN2QixJQUFJLFdBQVcsR0FBRyxDQUFDO0lBQ2pCLGFBQWEsR0FBRyxDQUFDLENBQUM7O0FBRXBCLElBQUksWUFBWSxHQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUEsQUFBQyxBQUFDO0lBQzlGLFdBQVcsR0FBRyxVQUFVLEdBQUcsWUFBWSxDQUFDOztBQUUxQyxJQUFJLENBQUMsQ0FBQztBQUNOLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFWCxJQUFJLFdBQVcsR0FB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QUFDLElBQUksRUFBRSxDQUFDO0FBQzdDLHNCQUFjLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztPQUNyRDtLQUNGOzs7OztBQUFBLEFBS0Qsc0JBQWtCLEdBQUcsVUFBUyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ3pDLFVBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbEQsWUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFLEtBQUssR0FBRyxBQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUksVUFBVSxDQUFDO0FBQUEsQUFDakUsWUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFLEtBQUssR0FBRyxBQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUksV0FBVyxDQUFDO09BQ25FO0FBQ0QsYUFBTyxLQUFLLENBQUM7S0FDZCxDQUFBOztBQUVELGNBQVUsR0FBRyxZQUFXO0FBQ3RCLFdBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUE7S0FDN0IsQ0FBQTs7QUFFRCxpQkFBYSxHQUFHLFlBQVc7QUFDekIsYUFBTyxjQUFjLElBQUksTUFBTTtBQUFBLFVBQzFCLG1CQUFtQixJQUFJLE1BQU07QUFBQyxLQUNwQyxDQUFBOztBQUVELFVBQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRztBQUFDLEFBQ3RCLFFBQUksRUFBRSxDQUFDO0dBRVIsQ0FBQyxDQUFBO0NBQ0gsQ0FBQSxDQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxudmFyIHNjcm9sbFBlcmNlbnQgPSAwO1xuXG52YXIgc2Nyb2xsVG9wLFxuICBzY3JvbGxTY2FsYXIsXG4gIHNoZWV0RWFzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaGVldC1lYXN0JyksXG4gIHNoZWV0V2VzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaGVldC13ZXN0JyksXG4gIHNoZWV0V2lkdGggPSBzaGVldEVhc3Qub2Zmc2V0V2lkdGgsXG4gIHNoZWV0T2Zmc2V0LFxuICBzID0gXCJcIjsgLy8gc3R5bGUgc3RyaW5nXG52YXIgc2Nyb2xsU2NhbGFyO1xudmFyIHdpZHRoRWwgPSBzaGVldEVhc3Qub2Zmc2V0V2lkdGg7XG52YXIgcGFuZWxDb3VudCA9ICQoJyNzaGVldC1lYXN0IC5wYW5lbCcpLmxlbmd0aDtcbnZhciBwYW5lbFdpZHRoID0gJCgnI3NoZWV0LWVhc3QgLnBhbmVsJylbMF0ub2Zmc2V0V2lkdGg7XG5cbnZhciBzbmFwVG9sZXJhbmNlID0gLjI7IC8vXG52YXIgbGVycFRhcmdldFggPSAwLFxuICBjdXJyZW50T2Zmc2V0ID0gMDtcblxudmFyIHNjcm9sbFNjYWxhciA9IChkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCAvIChkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodCkpLFxuICBzaGVldE9mZnNldCA9IHNoZWV0V2lkdGggKiBzY3JvbGxTY2FsYXI7XG5cbnZhciBzO1xudmFyIGRzID0gMDtcblxudmFyIGlzU2Nyb2xsaW5nID0gZmFsc2U7XG5cbnZhciBkaWZmID0gMDtcbnZhciBkaWZmVG9sZXJhbmNlID0gMDtcbnZhciBwYW5lbE51bSA9IDA7XG5cbnZhciBsZXJwUmF0ZSA9IDAuMDQ7XG5cbiAgZnVuY3Rpb24gbGVycChzdGFydCwgZW5kLCBhbXQpIHtcblxuICAgIHJldHVybiAoMSAtIGFtdCkgKiBzdGFydCArIGFtdCAqIGVuZDtcbiAgfVxuXG5mdW5jdGlvbiBkb2l0KCkge1xuXG5cblxuXG4gICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgLy9jb25zb2xlLmxvZyh3aWR0aEVsICsgJy4nKTtcbiAgICAvL2xlcnBUYXJnZXRYID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgLy8gc2Nyb2xsUGVyY2VudCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIC8gKGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAvL1xuICAgIC8vIGxlcnBUYXJnZXRYID0gc2Nyb2xsUGVyY2VudCAqIHdpZHRoRWw7XG5cbiAgICAvL2NvbnNvbGUubG9nKCdzY3JvbGxQZXJjZW50OiAnICsgc2Nyb2xsUGVyY2VudCk7XG4gICAgLy9jb25zb2xlLmxvZyhsZXJwVGFyZ2V0WCArICd2JyArICR3aW5kb3cuc2Nyb2xsVG9wKCkpO1xuICAgIC8vY29uc29sZS5sb2coZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIC8vIHZhciBzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgLy8gdmFyIGRvY0hlaWdodCA9ICQoZG9jdW1lbnQpLmhlaWdodCgpO1xuICAgIC8vIHZhciB3aW5IZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgLy8gaXNTY3JvbGxpbmcgPSB0cnVlO1xuICAgIC8vIGNsZWFyVGltZW91dCgkLmRhdGEodGhpcywgJ3Njcm9sbFRpbWVyJykpO1xuICAgIC8vICQuZGF0YSh0aGlzLCAnc2Nyb2xsVGltZXInLCBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIC8vICAgLy8gZG8gc29tZXRoaW5nXG4gICAgLy8gICByZXR1cm4gZmFsc2U7IC8vIGRpc2FibGUgdGhpcyBzY3JvbGwgc25hcFxuICAgIC8vICAgY29uc29sZS5sb2coXCJIYXZlbid0IHNjcm9sbGVkIGluIDI1MG1zIVwiKTtcbiAgICAvLyAgIC8vICQucHJveHkoc25hcEZsdXNoLCB0aGF0KVxuICAgIC8vICAgbGVycFJhdGUgPSAwLjA3O1xuICAgIC8vICAgbGVycFRhcmdldFggPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcbiAgICAvL1xuICAgIC8vICAgZGlmZiA9IGxlcnBUYXJnZXRYICUgcGFuZWxXaWR0aDtcbiAgICAvLyAgIGRpZmZUb2xlcmFuY2UgPSBkaWZmIC8gcGFuZWxXaWR0aDtcbiAgICAvLyAgIHBhbmVsTnVtID0gTWF0aC5mbG9vcihsZXJwVGFyZ2V0WCAvIHBhbmVsV2lkdGgpO1xuICAgIC8vXG4gICAgLy8gICBpZiAoZGlmZlRvbGVyYW5jZSA8IHNuYXBUb2xlcmFuY2UpIHtcbiAgICAvLyAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBwYW5lbE51bSAqIHBhbmVsV2lkdGg7XG4gICAgLy8gICB9IGVsc2UgaWYgKGRpZmZUb2xlcmFuY2UgPiAoMSAtIHNuYXBUb2xlcmFuY2UpKSB7XG4gICAgLy8gICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gKDEgKyBwYW5lbE51bSkgKiBwYW5lbFdpZHRoO1xuICAgIC8vICAgfVxuICAgIC8vXG4gICAgLy8gfSwgMjUwKSk7XG4gIH0pO1xuXG5cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuXG4gIH1cblxuICAvL3JlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuXG59XG5cbmRvaXQoKTtcblxuKGZ1bmN0aW9uKCkge1xuICAkKGZ1bmN0aW9uKCkge1xuXG4gICAgLyogIEdsb2JhbHNcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgIHZhciBQUk9QRVJUSUVTID0gWyd0cmFuc2xhdGVYJywgJ3RyYW5zbGF0ZVknLCAnb3BhY2l0eScsICdyb3RhdGUnLCAnc2NhbGUnXSxcbiAgICAgICRib2R5ID0gJCgnYm9keScpLFxuICAgICAgd3JhcHBlcnMgPSBbXSxcbiAgICAgIGN1cnJlbnRXcmFwcGVyID0gbnVsbCxcbiAgICAgIHNjcm9sbFRpbWVvdXRJRCA9IDAsXG4gICAgICBib2R5SGVpZ2h0ID0gMCxcbiAgICAgIHdpbmRvd0hlaWdodCA9IDAsXG4gICAgICB3aW5kb3dXaWR0aCA9IDAsXG4gICAgICBwYW5lbFdpZHRoID0gMCxcbiAgICAgIHByZXZLZXlmcmFtZXNEdXJhdGlvbnMgPSAwLFxuICAgICAgc2Nyb2xsVG9wID0gMCxcbiAgICAgIHJlbGF0aXZlU2Nyb2xsVG9wID0gMCxcbiAgICAgIGN1cnJlbnRLZXlmcmFtZSA9IDAsXG4gICAgICBrZXlmcmFtZXMgPSBbe1xuICAgICAgICAnd3JhcHBlcic6ICcucGFuZWwtMXgnLFxuICAgICAgICAnZHVyYXRpb24nOiAnMTAwJScsXG4gICAgICAgICdhbmltYXRpb25zJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdzZWxlY3Rvcic6ICcudHQtLWxlZnQnLFxuICAgICAgICAgICAgJ2xlZnQnOiBbMCwgJzEwMCUnXSxcbiAgICAgICAgICAgICdjbGFzc2VzVG9BZGQnOiBbe1xuICAgICAgICAgICAgICAnc3RhdGUtMSc6ICcwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJ3N0YXRlLTInOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnc2VsZWN0b3InOiAnLnR0LS1yaWdodCcsXG4gICAgICAgICAgICAncmlnaHQnOiBbMCwgJzEwMCUnXSxcbiAgICAgICAgICAgICdjbGFzc2VzVG9BZGQnOiBbe1xuICAgICAgICAgICAgICAnc3RhdGUtMSc6ICcwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJ3N0YXRlLTInOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1dXG4gICAgICB9LCB7XG4gICAgICAgICd3cmFwcGVyJzogJy5wYW5lbC0yeCcsXG4gICAgICAgICdkdXJhdGlvbic6ICcxMDAlJyxcbiAgICAgICAgJ2FuaW1hdGlvbnMnOiBbXVxuICAgICAgfSwge1xuICAgICAgICAnd3JhcHBlcic6ICcjZXhwbG9zaW9uJyxcbiAgICAgICAgJ2R1cmF0aW9uJzogJzIwMCUnLFxuICAgICAgICAnYW5pbWF0aW9ucyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnc2VsZWN0b3InOiAnLnR0LS1sZWZ0MicsXG4gICAgICAgICAgICAnbGVmdCc6IFswLCAnMjAwJSddLFxuICAgICAgICAgICAgJ2NsYXNzZXNUb0FkZCc6IFt7XG4gICAgICAgICAgICAgICdzdGF0ZS0xJzogJzAlJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAnc3RhdGUtMic6ICcxMDAlJ1xuICAgICAgICAgICAgfV1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdzZWxlY3Rvcic6ICcudHQtLXJpZ2h0MicsXG4gICAgICAgICAgICAncmlnaHQnOiBbMCwgJzIwMCUnXSxcbiAgICAgICAgICAgICdjbGFzc2VzVG9BZGQnOiBbe1xuICAgICAgICAgICAgICAnc3RhdGUtMSc6ICcwJSdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJ3N0YXRlLTInOiAnMTAwJSdcbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgfV1cbiAgICAgIH1dXG5cbiAgICAvKiAgQ29uc3RydWN0aW9uXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICBpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBzY3JvbGxJbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwodXBkYXRlUGFnZSwgMTApO1xuICAgICAgc2V0dXBWYWx1ZXMoKTtcbiAgICAgICR3aW5kb3cucmVzaXplKHRocm93RXJyb3IpXG4gICAgICBpZiAoaXNUb3VjaERldmljZSkge1xuICAgICAgICAkd2luZG93LnJlc2l6ZSh0aHJvd0Vycm9yKVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldHVwVmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gICAgICBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgICAgd2luZG93SGVpZ2h0ID0gJHdpbmRvdy5oZWlnaHQoKTtcbiAgICAgIHdpbmRvd1dpZHRoID0gJHdpbmRvdy53aWR0aCgpO1xuICAgICAgcGFuZWxXaWR0aCA9ICQoJyNzaGVldC1lYXN0IC5wYW5lbCcpWzBdLm9mZnNldFdpZHRoO1xuICAgICAgLy8gdHJlYXQgYSBwYW5lbCdzIHdpZHRoIGFzIHRoZSB3aW5kb3dIZWlnaHQgZm9yIG91ciBzaXRlIHB1cnBvc2VzXG4gICAgICB3aW5kb3dIZWlnaHQgPSBwYW5lbFdpZHRoO1xuICAgICAgY29udmVydEFsbFByb3BzVG9QeCgpO1xuICAgICAgYnVpbGRQYWdlKCk7XG4gICAgfVxuXG4gICAgYnVpbGRQYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSwgaiwgaztcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlmcmFtZXMubGVuZ3RoOyBpKyspIHsgLy8gbG9vcCBrZXlmcmFtZXNcbiAgICAgICAgYm9keUhlaWdodCArPSBrZXlmcmFtZXNbaV0uZHVyYXRpb247XG4gICAgICAgIGlmICgkLmluQXJyYXkoa2V5ZnJhbWVzW2ldLndyYXBwZXIsIHdyYXBwZXJzKSA9PSAtMSkge1xuICAgICAgICAgIHdyYXBwZXJzLnB1c2goa2V5ZnJhbWVzW2ldLndyYXBwZXIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBrZXlmcmFtZXNbaV0uYW5pbWF0aW9ucy5sZW5ndGg7IGorKykgeyAvLyBsb29wIGFuaW1hdGlvbnNcbiAgICAgICAgICBPYmplY3Qua2V5cyhrZXlmcmFtZXNbaV0uYW5pbWF0aW9uc1tqXSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHsgLy8gbG9vcCBwcm9wZXJ0aWVzXG4gICAgICAgICAgICB2YWx1ZSA9IGtleWZyYW1lc1tpXS5hbmltYXRpb25zW2pdW2tleV07XG4gICAgICAgICAgICBpZiAoa2V5ICE9PSAnc2VsZWN0b3InICYmIHZhbHVlIGluc3RhbmNlb2YgQXJyYXkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIHZhciB2YWx1ZVNldCA9IFtdO1xuICAgICAgICAgICAgICB2YWx1ZVNldC5wdXNoKGdldERlZmF1bHRQcm9wZXJ0eVZhbHVlKGtleSksIHZhbHVlKTtcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleWZyYW1lc1tpXS5hbmltYXRpb25zW2pdW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8kYm9keS5oZWlnaHQoYm9keUhlaWdodCk7XG4gICAgICAvL2NvbnNvbGUubG9nKCdwYWdlIGJ1aWx0Jyk7XG4gICAgICBjdXJyZW50V3JhcHBlciA9IHdyYXBwZXJzWzBdO1xuICAgICAgLy8kKGN1cnJlbnRXcmFwcGVyKS5zaG93KCk7XG4gICAgfVxuXG4gICAgY29udmVydEFsbFByb3BzVG9QeCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGksIGosIGssIHZhbHVlLCB2YWw7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5ZnJhbWVzLmxlbmd0aDsgaSsrKSB7IC8vIGxvb3Aga2V5ZnJhbWVzXG4gICAgICAgIGtleWZyYW1lc1tpXS5kdXJhdGlvbiA9IGNvbnZlcnRQZXJjZW50VG9QeChrZXlmcmFtZXNbaV0uZHVyYXRpb24sICd5Jyk7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBrZXlmcmFtZXNbaV0uYW5pbWF0aW9ucy5sZW5ndGg7IGorKykgeyAvLyBsb29wIGFuaW1hdGlvbnNcbiAgICAgICAgICBPYmplY3Qua2V5cyhrZXlmcmFtZXNbaV0uYW5pbWF0aW9uc1tqXSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHsgLy8gbG9vcCBwcm9wZXJ0aWVzXG4gICAgICAgICAgICB2YWx1ZSA9IGtleWZyYW1lc1tpXS5hbmltYXRpb25zW2pdW2tleV07XG4gICAgICAgICAgICBpZiAoa2V5ICE9PSAnc2VsZWN0b3InKSB7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7IC8vIGlmIGl0cyBhbiBhcnJheVxuICAgICAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCB2YWx1ZS5sZW5ndGg7IGsrKykgeyAvLyBpZiB2YWx1ZSBpbiBhcnJheSBpcyAlXG4gICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlW2tdID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd0cmFuc2xhdGVZJykge1xuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlW2tdID0gY29udmVydFBlcmNlbnRUb1B4KHZhbHVlW2tdLCAneScpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJ0cmFuc2xhdGVYXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IGNvbnZlcnRQZXJjZW50VG9QeCh2YWx1ZVtrXSwgJ3gnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwibGVmdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSBjb252ZXJ0UGVyY2VudFRvUHgodmFsdWVba10sICd5Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IGNvbnZlcnRQZXJjZW50VG9QeCh2YWx1ZVtrXSwgJ3knKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWVba10gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2NsYXNzZXNUb0FkZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlc2VcbiAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZVtrXSkuZm9yRWFjaChmdW5jdGlvbih5ZWspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgdG8gYXJyYXkgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IFt5ZWssIGNvbnZlcnRQZXJjZW50VG9QeCh2YWx1ZVtrXVt5ZWtdLCAneScpXTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7IC8vIGlmIHNpbmdsZSB2YWx1ZSBpcyBhICVcbiAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd0cmFuc2xhdGVZJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbnZlcnRQZXJjZW50VG9QeCh2YWx1ZSwgJ3knKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29udmVydFBlcmNlbnRUb1B4KHZhbHVlLCAneCcpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBrZXlmcmFtZXNbaV0uYW5pbWF0aW9uc1tqXVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREZWZhdWx0UHJvcGVydHlWYWx1ZSA9IGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgICAgIGNhc2UgJ3RyYW5zbGF0ZVgnOlxuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICBjYXNlICd0cmFuc2xhdGVZJzpcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgY2FzZSAnc2NhbGUnOlxuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICBjYXNlICdyb3RhdGUnOlxuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiAgQW5pbWF0aW9uL1Njcm9sbGluZ1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gICAgdXBkYXRlUGFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgc2V0U2Nyb2xsVG9wcygpO1xuICAgICAgICBpZiAoc2Nyb2xsVG9wID49IDAgJiYgc2Nyb2xsVG9wIDw9IChib2R5SGVpZ2h0IC0gd2luZG93SGVpZ2h0KSkge1xuICAgICAgICAgIGFuaW1hdGVFbGVtZW50cygpO1xuICAgICAgICAgIHNldEtleWZyYW1lKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2NvbnNvbGUubG9nKHdpbmRvd0hlaWdodCArICcgdiAnICsgd2luZG93LmlubmVySGVpZ2h0KTtcblxuICAgICAgICBzY3JvbGxQZXJjZW50ID0gMSAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIC8gKGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0KTtcblxuICAgICAgICBsZXJwVGFyZ2V0WCA9IHNjcm9sbFBlcmNlbnQgKiB3aWR0aEVsO1xuXG4gICAgICAgIGRzID0gbGVycFRhcmdldFg7IC8vIGxlcnAoZHMsIGxlcnBUYXJnZXRYLCBsZXJwUmF0ZSk7XG5cblxuICAgICAgICBzID0gJ3RyYW5zbGF0ZTNkKCcgKyAtZHMgKyAncHgsIDAsIDApJztcblxuICAgICAgICBzaGVldEVhc3Quc3R5bGUuV2Via2l0VHJhbnNmb3JtID0gcztcbiAgICAgICAgc2hlZXRFYXN0LnN0eWxlLk1velRyYW5zZm9ybSA9IHM7XG4gICAgICAgIHNoZWV0RWFzdC5zdHlsZS5PVHJhbnNmb3JtID0gcztcbiAgICAgICAgc2hlZXRFYXN0LnN0eWxlLm1zVHJhbnNmb3JtID0gcztcbiAgICAgICAgc2hlZXRFYXN0LnN0eWxlLnRyYW5zZm9ybSA9IHM7XG5cbiAgICAgICAgcyA9ICd0cmFuc2xhdGUzZCgnICsgZHMgKyAncHgsIDAsIDApJztcbiAgICAgICAgc2hlZXRXZXN0LnN0eWxlLldlYmtpdFRyYW5zZm9ybSA9IHM7XG4gICAgICAgIHNoZWV0V2VzdC5zdHlsZS5Nb3pUcmFuc2Zvcm0gPSBzO1xuICAgICAgICBzaGVldFdlc3Quc3R5bGUuT1RyYW5zZm9ybSA9IHM7XG4gICAgICAgIHNoZWV0V2VzdC5zdHlsZS5tc1RyYW5zZm9ybSA9IHM7XG4gICAgICAgIHNoZWV0V2VzdC5zdHlsZS50cmFuc2Zvcm0gPSBzO1xuXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXRTY3JvbGxUb3BzID0gZnVuY3Rpb24oKSB7XG4gICAgICBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgICAgcmVsYXRpdmVTY3JvbGxUb3AgPSBzY3JvbGxUb3AgLSBwcmV2S2V5ZnJhbWVzRHVyYXRpb25zO1xuICAgIH1cblxuICAgIGFuaW1hdGVFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFuaW1hdGlvbiwgdHJhbnNsYXRlWSwgdHJhbnNsYXRlWCwgc2NhbGUsIHJvdGF0ZSwgb3BhY2l0eSwgbGVmdCwgcmlnaHQsIGFuaWxlbmd0aDtcblxuICAgICAgYW5pbGVuZ3RoID0ga2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0uYW5pbWF0aW9ucy5sZW5ndGg7XG5cbiAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRLZXlmcmFtZSk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5pbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYW5pbWF0aW9uID0ga2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0uYW5pbWF0aW9uc1tpXTtcbiAgICAgICAgdHJhbnNsYXRlWSA9IGNhbGNQcm9wVmFsdWUoYW5pbWF0aW9uLCAndHJhbnNsYXRlWScpO1xuICAgICAgICB0cmFuc2xhdGVYID0gY2FsY1Byb3BWYWx1ZShhbmltYXRpb24sICd0cmFuc2xhdGVYJyk7XG4gICAgICAgIHNjYWxlID0gY2FsY1Byb3BWYWx1ZShhbmltYXRpb24sICdzY2FsZScpO1xuICAgICAgICByb3RhdGUgPSBjYWxjUHJvcFZhbHVlKGFuaW1hdGlvbiwgJ3JvdGF0ZScpO1xuICAgICAgICBvcGFjaXR5ID0gY2FsY1Byb3BWYWx1ZShhbmltYXRpb24sICdvcGFjaXR5Jyk7XG4gICAgICAgIGxlZnQgPSBjYWxjUHJvcFZhbHVlKGFuaW1hdGlvbiwgJ2xlZnQnKTtcbiAgICAgICAgcmlnaHQgPSBjYWxjUHJvcFZhbHVlKGFuaW1hdGlvbiwgJ3JpZ2h0Jyk7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2cocHJldktleWZyYW1lc0R1cmF0aW9ucyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGFuaW1hdGlvbik7XG4gICAgICAgIGlmIChyaWdodCkge1xuICAgICAgICAgLy8gY29uc29sZS5sb2cocmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgJChhbmltYXRpb24uc2VsZWN0b3IpLmNzcyh7XG4gICAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgnICsgdHJhbnNsYXRlWCArICdweCwgJyArIHRyYW5zbGF0ZVkgKyAncHgsIDApIHNjYWxlKCcgKyBzY2FsZSArICcpIHJvdGF0ZSgnICsgcm90YXRlICsgJ2RlZyknLFxuICAgICAgICAgICdvcGFjaXR5Jzogb3BhY2l0eSxcbiAgICAgICAgICAnbGVmdCc6IGxlZnQsXG4gICAgICAgICAgJ3JpZ2h0JzogcmlnaHRcbiAgICAgICAgfSkuZWFjaChmdW5jdGlvbihpLCB0YXJnZXQpIHtcbiAgICAgICAgICAoYW5pbWF0aW9uLmNsYXNzZXNUb0FkZCB8fCBbXSkuZm9yRWFjaChmdW5jdGlvbihlbCwgaSkge1xuICAgICAgICAgICAgaWYgKGRzID49IChlbFsxXSArIHByZXZLZXlmcmFtZXNEdXJhdGlvbnMpICYmICQodGFyZ2V0KS5oYXNDbGFzcyhlbFswXSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwid2Ugc2hvdWxkIGFkZCBcIiArIGVsWzBdICsgJywgJyArIGVsWzFdICsgJygnICsgcHJldktleWZyYW1lc0R1cmF0aW9ucyArICcpLiBzY3JvbGxUb3AgaXMgJyArIHNjcm9sbFRvcCk7XG4gICAgICAgICAgICAgICQodGFyZ2V0KS5hZGRDbGFzcyhlbFswXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRzIDwgKGVsWzFdICsgcHJldktleWZyYW1lc0R1cmF0aW9ucykgJiYgJCh0YXJnZXQpLmhhc0NsYXNzKGVsWzBdKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIndlIHNob3VsZCByZW1vdmUgXCIgKyBlbFswXSArICcsICcgKyBlbFsxXSArICcoJyArIHByZXZLZXlmcmFtZXNEdXJhdGlvbnMgKyAnKS4gc2Nyb2xsVG9wIGlzICcgKyBzY3JvbGxUb3ApO1xuICAgICAgICAgICAgICAkKHRhcmdldCkucmVtb3ZlQ2xhc3MoZWxbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNhbGNQcm9wVmFsdWUgPSBmdW5jdGlvbihhbmltYXRpb24sIHByb3BlcnR5KSB7XG4gICAgICB2YXIgdmFsdWUgPSBhbmltYXRpb25bcHJvcGVydHldO1xuICAgICAgaWYgKHZhbHVlICYmIHByb3BlcnR5ICE9PSAnbGVmdCcgJiYgcHJvcGVydHkgIT09ICdyaWdodCcpIHtcbiAgICAgICAgdmFsdWUgPSBlYXNlSW5PdXRRdWFkKHJlbGF0aXZlU2Nyb2xsVG9wLCB2YWx1ZVswXSwgKHZhbHVlWzFdIC0gdmFsdWVbMF0pLCBrZXlmcmFtZXNbY3VycmVudEtleWZyYW1lXS5kdXJhdGlvbik7XG4gICAgICB9IGVsc2UgaWYgKCF2YWx1ZSkge1xuICAgICAgICB2YWx1ZSA9IGdldERlZmF1bHRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KTtcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy92YWx1ZSA9IGVhc2VJbk91dFF1YWQocmVsYXRpdmVTY3JvbGxUb3AsIHZhbHVlWzBdLCAodmFsdWVbMV0gLSB2YWx1ZVswXSksIGtleWZyYW1lc1tjdXJyZW50S2V5ZnJhbWVdLmR1cmF0aW9uKTtcbiAgICAgICAgdmFsdWUgPSAgbGVycCh2YWx1ZVswXSB8fCBhbmltYXRpb25bcHJvcGVydHldLmxhc3RWYWx1ZSB8fCAwLCByZWxhdGl2ZVNjcm9sbFRvcCwgbGVycFJhdGUpO1xuICAgICAgICBhbmltYXRpb25bcHJvcGVydHldLmxhc3RWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAvL3ZhbHVlID0gcmVsYXRpdmVTY3JvbGxUb3A7IC8vIGVhc2VMaW5lYXIocmVsYXRpdmVTY3JvbGxUb3AsIHZhbHVlWzBdLCAodmFsdWVbMV0gLSB2YWx1ZVswXSksIGtleWZyYW1lc1tjdXJyZW50S2V5ZnJhbWVdLmR1cmF0aW9uKTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbWluIGlzICcrdmFsdWVbMF0gKyAnIGFuZCBtYXggaXMgJyt2YWx1ZVsxXSk7XG4gICAgICAgIC8vIHZhbHVlID0gTWF0aC5tYXgodmFsdWVbMF0sIE1hdGgubWluKHJlbGF0aXZlU2Nyb2xsVG9wLCB2YWx1ZVsxXSkpO1xuICAgICAgfVxuICAgICAgLy8gdmFsdWUgPSArdmFsdWUudG9GaXhlZCgyKVxuICAgICAgLy8gVEVNUE9SQVJJTFkgUkVNT1ZFRCBDQVVTRSBTQ0FMRSBET0VTTidUIFdPUksgV0lUSEEgQUdSRVNTSVZFIFJPVU5ESU5HIExJS0UgVEhJU1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGVhc2VJbk91dFF1YWQgPSBmdW5jdGlvbih0LCBiLCBjLCBkKSB7XG4gICAgICAvL3NpbnVzb2FkaWFsIGluIGFuZCBvdXRcbiAgICAgIHJldHVybiAtYyAvIDIgKiAoTWF0aC5jb3MoTWF0aC5QSSAqIHQgLyBkKSAtIDEpICsgYjtcbiAgICB9O1xuXG4gICAgLy8gZWFzZUxpbmVhciA9IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XG4gICAgLy8gICByZXR1cm4gYyAqIHQgLyBkICsgYjtcbiAgICAvLyB9XG5cbiAgICBuZWF0ZW5MYXN0S2V5ZnJhbWUgPSBmdW5jdGlvbiAoZCkge1xuICAgICAgdmFyIGFuaW1hdGlvbiwgdHJhbnNsYXRlWSwgdHJhbnNsYXRlWCwgc2NhbGUsIHJvdGF0ZSwgb3BhY2l0eSwgbGVmdCwgcmlnaHQsIGFuaWxlbmd0aCwgaW5kZXg7XG5cbiAgICAgIGluZGV4ID0gKGQgPiAwKSA/IDEgOiAwO1xuXG4gICAgICBhbmlsZW5ndGggPSBrZXlmcmFtZXNbY3VycmVudEtleWZyYW1lXS5hbmltYXRpb25zLmxlbmd0aDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbmlsZW5ndGg7IGkrKykge1xuICAgICAgICBhbmltYXRpb24gPSBrZXlmcmFtZXNbY3VycmVudEtleWZyYW1lXS5hbmltYXRpb25zW2ldO1xuICAgICAgICB0cmFuc2xhdGVZID0gYW5pbWF0aW9uWyd0cmFuc2xhdGVZJ11baW5kZXhdIHx8IGFuaW1hdGlvblsndHJhbnNsYXRlWSddO1xuICAgICAgICB0cmFuc2xhdGVYID0gYW5pbWF0aW9uWyd0cmFuc2xhdGVYJ11baW5kZXhdIHx8IGFuaW1hdGlvblsndHJhbnNsYXRlWCddO1xuICAgICAgICBzY2FsZSA9IGFuaW1hdGlvblsnc2NhbGUnXVtpbmRleF0gfHwgYW5pbWF0aW9uWydzY2FsZSddO1xuICAgICAgICByb3RhdGUgPSBhbmltYXRpb25bJ3JvdGF0ZSddW2luZGV4XSB8fCBhbmltYXRpb25bJ3JvdGF0ZSddO1xuICAgICAgICBvcGFjaXR5ID0gYW5pbWF0aW9uWydvcGFjaXR5J11baW5kZXhdIHx8IGFuaW1hdGlvblsnb3BhY2l0eSddO1xuICAgICAgICBsZWZ0ID0gYW5pbWF0aW9uWydsZWZ0J11baW5kZXhdIHx8IGFuaW1hdGlvblsnbGVmdCddO1xuICAgICAgICByaWdodCA9IGFuaW1hdGlvblsncmlnaHQnXVtpbmRleF0gfHwgYW5pbWF0aW9uWydyaWdodCddO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHByZXZLZXlmcmFtZXNEdXJhdGlvbnMpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhhbmltYXRpb24pO1xuICAgICAgICBpZiAocmlnaHQpIHtcbiAgICAgICAgIGNvbnNvbGUubG9nKHJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoYW5pbWF0aW9uLnNlbGVjdG9yKS5jc3Moe1xuICAgICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoJyArIHRyYW5zbGF0ZVggKyAncHgsICcgKyB0cmFuc2xhdGVZICsgJ3B4LCAwKSBzY2FsZSgnICsgc2NhbGUgKyAnKSByb3RhdGUoJyArIHJvdGF0ZSArICdkZWcpJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IG9wYWNpdHksXG4gICAgICAgICAgJ2xlZnQnOiBsZWZ0LFxuICAgICAgICAgICdyaWdodCc6IHJpZ2h0XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldEtleWZyYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoc2Nyb2xsVG9wID4gKGtleWZyYW1lc1tjdXJyZW50S2V5ZnJhbWVdLmR1cmF0aW9uICsgcHJldktleWZyYW1lc0R1cmF0aW9ucykpIHtcbiAgICAgICAgLy9uZWF0ZW5MYXN0S2V5ZnJhbWUoMSk7XG4gICAgICAgIHByZXZLZXlmcmFtZXNEdXJhdGlvbnMgKz0ga2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0uZHVyYXRpb247XG4gICAgICAgIGN1cnJlbnRLZXlmcmFtZSsrO1xuICAgICAgICAvL3Nob3dDdXJyZW50V3JhcHBlcnMoKTtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsVG9wIDwgcHJldktleWZyYW1lc0R1cmF0aW9ucykge1xuICAgICAgICAvL25lYXRlbkxhc3RLZXlmcmFtZSgtMSk7XG4gICAgICAgIGN1cnJlbnRLZXlmcmFtZS0tO1xuICAgICAgICBwcmV2S2V5ZnJhbWVzRHVyYXRpb25zIC09IGtleWZyYW1lc1tjdXJyZW50S2V5ZnJhbWVdLmR1cmF0aW9uO1xuICAgICAgICAvL3Nob3dDdXJyZW50V3JhcHBlcnMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93Q3VycmVudFdyYXBwZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGlmIChrZXlmcmFtZXNbY3VycmVudEtleWZyYW1lXS53cmFwcGVyICE9IGN1cnJlbnRXcmFwcGVyKSB7XG4gICAgICAgICQoY3VycmVudFdyYXBwZXIpLmhpZGUoKTtcbiAgICAgICAgJChrZXlmcmFtZXNbY3VycmVudEtleWZyYW1lXS53cmFwcGVyKS5zaG93KCk7XG4gICAgICAgIGN1cnJlbnRXcmFwcGVyID0ga2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0ud3JhcHBlcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiAgSGVscGVyc1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgICBjb252ZXJ0UGVyY2VudFRvUHggPSBmdW5jdGlvbih2YWx1ZSwgYXhpcykge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZS5tYXRjaCgvJS9nKSkge1xuICAgICAgICBpZiAoYXhpcyA9PT0gJ3knKSB2YWx1ZSA9IChwYXJzZUZsb2F0KHZhbHVlKSAvIDEwMCkgKiBwYW5lbFdpZHRoOyAvL3dpbmRvd0hlaWdodDtcbiAgICAgICAgaWYgKGF4aXMgPT09ICd4JykgdmFsdWUgPSAocGFyc2VGbG9hdCh2YWx1ZSkgLyAxMDApICogd2luZG93V2lkdGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhyb3dFcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGJvZHkuYWRkQ2xhc3MoJ3BhZ2UtZXJyb3InKVxuICAgIH1cblxuICAgIGlzVG91Y2hEZXZpY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgLy8gd29ya3Mgb24gbW9zdCBicm93c2Vyc1xuICAgICAgICB8fCAnb25tc2dlc3R1cmVjaGFuZ2UnIGluIHdpbmRvdzsgLy8gd29ya3Mgb24gaWUxMFxuICAgIH1cblxuICAgIHdpbmRvdy5sb2NhdGlvbiA9IFwiI1wiOyAvLyB0byB0b3BcbiAgICBpbml0KCk7XG5cbiAgfSlcbn0pLmNhbGwodGhpcyk7XG4iXX0=
