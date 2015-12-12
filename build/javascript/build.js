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

var lerpRate = 0.0;

function doit() {

  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  $(window).scroll(function () {
    lerpRate = 0.1;
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
      }, {
        'selector': '.name',
        'translateY': -140,
        'opacity': 0
      }, {
        'selector': '.sam',
        'classesToAdd': [{
          'testing-1': '50%'
        }, {
          'test-2': '100%'
        }],
        'opacity': [1, 0] // hack to accelrate opacity speed
      }, {
        'selector': '.byline',
        'translateY': -110,
        'opacity': 0
      }, {
        'selector': '.twitter',
        'opacity': [1, 0]
      }]
    }, {
      'wrapper': '.panel-2x',
      'duration': '100%',
      'animations': [{
        'selector': '.xtt--right',
        'right': [0, '100%'],
        'classesToAdd': [{
          'state-1': '0%'
        }, {
          'state-2': '100%'
        }]
      }, {
        'selector': '.xtt--left',
        'right': [0, '100%'],
        'classesToAdd': [{
          'state-1': '0%'
        }, {
          'state-2': '100%'
        }]
      }, {
        'selector': '.sam',
        'opacity': [0, 1.75] // hack to accelrate opacity speed
      }, {
        'selector': '#domExplosionList',
        'translateY': '-70%',
        'opacity': [0, 1] // hack to accelrate opacity speed
      }]
    }, {
      'wrapper': '#explosion',
      'duration': '150%',
      'animations': [{
        'selector': '.dei-1',
        'translateY': '-15%',
        'translateX': '-10%',
        'opacity': [1, 0],
        'scale': 2
      }, {
        'selector': '.dei-2',
        'translateY': '-5%',
        'translateX': '-4%',
        'opacity': [1, 0] // hack to decelrate opacity speed
      }, {
        'selector': '.dei-3',
        'translateY': '-9%',
        'translateX': '2%',
        'opacity': [1, 0], // hack to accelrate opacity speed
        'scale': 1.2
      }, {
        'selector': '.dei-4',
        'translateY': '-17%',
        'translateX': '8%',
        'opacity': [1, 0], // hack to accelrate opacity speed
        'scale': 1.5
      }, {
        'selector': '.dei-5',
        'translateY': '-2%',
        'translateX': '-15%',
        'opacity': [1, 0],
        'scale': 2
      }, {
        'selector': '.dei-6',
        'translateY': '-1%',
        'translateX': '-7%',
        'opacity': [1, 0], // hack to decelrate opacity speed
        'scale': 1.2
      }, {
        'selector': '.dei-7',
        'translateY': '-4%',
        'translateX': '2%',
        'opacity': [1, 0], // hack to accelrate opacity speed
        'scale': 1.1
      }, {
        'selector': '.dei-8',
        'translateY': '-3%',
        'translateX': '12%',
        'classesToAdd': [{
          'testing-1': '50%'
        }, {
          'test-2': '100%'
        }],
        'opacity': [1, 0], // hack to accelrate opacity speed
        'scale': 1.8
      }, {
        'selector': '.dei-9',
        'translateY': '3%',
        'translateX': '-12%',
        'opacity': [1, 0],
        'scale': 1.5
      }, {
        'selector': '.dei-10',
        'translateY': '5%',
        'translateX': '-4%',
        'opacity': [1, 0] // hack to decelrate opacity speed
      }, {
        'selector': '.dei-11',
        'translateY': '8%',
        'translateX': '6%',
        'opacity': [1, 0], // hack to accelrate opacity speed
        'scale': 1.4
      }, {
        'selector': '.dei-12',
        'translateY': '1%',
        'translateX': '20%',
        'opacity': [1, 0], // hack to accelrate opacity speed
        'scale': 1.9
      }, {
        'selector': '.dei-13',
        'translateY': '8%',
        'translateX': '-12%',
        'opacity': [1, 0],
        'scale': 1.8
      }, {
        'selector': '.dei-14',
        'translateY': '4%',
        'translateX': '-3%',
        'opacity': [1, 0], // hack to decelrate opacity speed
        'scale': 1.3
      }, {
        'selector': '.dei-15',
        'translateY': '14%',
        'translateX': '5%',
        'opacity': [1, 0], // hack to accelrate opacity speed
        'scale': 1.7
      }, {
        'selector': '.dei-16',
        'translateY': '6%',
        'translateX': '9%',
        'opacity': [1, 0], // hack to accelrate opacity speed
        'scale': 2
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
      $window.scroll(0);
      currentWrapper = wrappers[0];
      $(currentWrapper).show();
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

        value = relativeScrollTop; // easeLinear(relativeScrollTop, value[0], (value[1] - value[0]), keyframes[currentKeyframe].duration);

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

    init();
  });
}).call(this);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvamF2YXNjcmlwdC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFeEIsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDOztBQUV0QixJQUFJLFNBQVM7SUFDWCxZQUFZO0lBQ1osU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDO0lBQ2pELFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQztJQUNqRCxVQUFVLEdBQUcsU0FBUyxDQUFDLFdBQVc7SUFDbEMsV0FBVztJQUNYLENBQUMsR0FBRyxFQUFFO0FBQUMsQUFDVCxJQUFJLFlBQVksQ0FBQztBQUNqQixJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDO0FBQ3BDLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNoRCxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7O0FBRXhELElBQUksYUFBYSxHQUFHLEVBQUU7QUFBQyxBQUN2QixJQUFJLFdBQVcsR0FBRyxDQUFDO0lBQ2pCLGFBQWEsR0FBRyxDQUFDLENBQUM7O0FBRXBCLElBQUksWUFBWSxHQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUEsQUFBQyxBQUFDO0lBQzlGLFdBQVcsR0FBRyxVQUFVLEdBQUcsWUFBWSxDQUFDOztBQUUxQyxJQUFJLENBQUMsQ0FBQztBQUNOLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFWCxJQUFJLFdBQVcsR0FB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Q0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxBQUM3QztzQkFBYyxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUM7T0FDckQ7S0FDRjs7Ozs7QUFBQSxBQUtELHNCQUFrQixHQUFHLFVBQVMsS0FBSyxFQUFFLElBQUksRUFBRSxBQUN6QztVQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEFBQ2xEO1lBQUksSUFBSSxLQUFLLEdBQUcsRUFBRSxLQUFLLEdBQUcsQUFBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFJLFVBQVU7QUFBQyxBQUNqRSxZQUFJLElBQUksS0FBSyxHQUFHLEVBQUUsS0FBSyxHQUFHLEFBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBSSxXQUFXLENBQUM7T0FDbkUsQUFDRDthQUFPLEtBQUssQ0FBQztLQUNkLENBQUEsQUFFRDs7Y0FBVSxHQUFHLFlBQVcsQUFDdEI7V0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQTtLQUM3QixDQUFBLEFBRUQ7O2lCQUFhLEdBQUcsWUFBVyxBQUN6QjthQUFPLGNBQWMsSUFBSTtBQUFNLFVBQzFCLG1CQUFtQixJQUFJLE1BQU07QUFBQyxLQUNwQyxDQUFBLEFBRUQ7O1FBQUksRUFBRSxDQUFDO0dBRVIsQ0FBQyxDQUFBO0NBQ0gsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbnZhciBzY3JvbGxQZXJjZW50ID0gMDtcblxudmFyIHNjcm9sbFRvcCxcbiAgc2Nyb2xsU2NhbGFyLFxuICBzaGVldEVhc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hlZXQtZWFzdCcpLFxuICBzaGVldFdlc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hlZXQtd2VzdCcpLFxuICBzaGVldFdpZHRoID0gc2hlZXRFYXN0Lm9mZnNldFdpZHRoLFxuICBzaGVldE9mZnNldCxcbiAgcyA9IFwiXCI7IC8vIHN0eWxlIHN0cmluZ1xudmFyIHNjcm9sbFNjYWxhcjtcbnZhciB3aWR0aEVsID0gc2hlZXRFYXN0Lm9mZnNldFdpZHRoO1xudmFyIHBhbmVsQ291bnQgPSAkKCcjc2hlZXQtZWFzdCAucGFuZWwnKS5sZW5ndGg7XG52YXIgcGFuZWxXaWR0aCA9ICQoJyNzaGVldC1lYXN0IC5wYW5lbCcpWzBdLm9mZnNldFdpZHRoO1xuXG52YXIgc25hcFRvbGVyYW5jZSA9IC4yOyAvL1xudmFyIGxlcnBUYXJnZXRYID0gMCxcbiAgY3VycmVudE9mZnNldCA9IDA7XG5cbnZhciBzY3JvbGxTY2FsYXIgPSAoZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgLyAoZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQpKSxcbiAgc2hlZXRPZmZzZXQgPSBzaGVldFdpZHRoICogc2Nyb2xsU2NhbGFyO1xuXG52YXIgcztcbnZhciBkcyA9IDA7XG5cbnZhciBpc1Njcm9sbGluZyA9IGZhbHNlO1xuXG52YXIgZGlmZiA9IDA7XG52YXIgZGlmZlRvbGVyYW5jZSA9IDA7XG52YXIgcGFuZWxOdW0gPSAwO1xuXG52YXIgbGVycFJhdGUgPSAwLjA7XG5cbmZ1bmN0aW9uIGRvaXQoKSB7XG5cblxuXG4gIGZ1bmN0aW9uIGxlcnAoc3RhcnQsIGVuZCwgYW10KSB7XG4gICAgcmV0dXJuICgxIC0gYW10KSAqIHN0YXJ0ICsgYW10ICogZW5kO1xuICB9XG5cbiAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICBsZXJwUmF0ZSA9IDAuMTtcbiAgICAvL2NvbnNvbGUubG9nKHdpZHRoRWwgKyAnLicpO1xuICAgIC8vbGVycFRhcmdldFggPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCArIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAvLyBzY3JvbGxQZXJjZW50ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgLyAoZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIC8vXG4gICAgLy8gbGVycFRhcmdldFggPSBzY3JvbGxQZXJjZW50ICogd2lkdGhFbDtcblxuICAgIC8vY29uc29sZS5sb2coJ3Njcm9sbFBlcmNlbnQ6ICcgKyBzY3JvbGxQZXJjZW50KTtcbiAgICAvL2NvbnNvbGUubG9nKGxlcnBUYXJnZXRYICsgJ3YnICsgJHdpbmRvdy5zY3JvbGxUb3AoKSk7XG4gICAgLy9jb25zb2xlLmxvZyhkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgLy8gdmFyIHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICAvLyB2YXIgZG9jSGVpZ2h0ID0gJChkb2N1bWVudCkuaGVpZ2h0KCk7XG4gICAgLy8gdmFyIHdpbkhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcbiAgICAvLyBpc1Njcm9sbGluZyA9IHRydWU7XG4gICAgLy8gY2xlYXJUaW1lb3V0KCQuZGF0YSh0aGlzLCAnc2Nyb2xsVGltZXInKSk7XG4gICAgLy8gJC5kYXRhKHRoaXMsICdzY3JvbGxUaW1lcicsIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgLy8gICAvLyBkbyBzb21ldGhpbmdcbiAgICAvLyAgIHJldHVybiBmYWxzZTsgLy8gZGlzYWJsZSB0aGlzIHNjcm9sbCBzbmFwXG4gICAgLy8gICBjb25zb2xlLmxvZyhcIkhhdmVuJ3Qgc2Nyb2xsZWQgaW4gMjUwbXMhXCIpO1xuICAgIC8vICAgLy8gJC5wcm94eShzbmFwRmx1c2gsIHRoYXQpXG4gICAgLy8gICBsZXJwUmF0ZSA9IDAuMDc7XG4gICAgLy8gICBsZXJwVGFyZ2V0WCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuICAgIC8vXG4gICAgLy8gICBkaWZmID0gbGVycFRhcmdldFggJSBwYW5lbFdpZHRoO1xuICAgIC8vICAgZGlmZlRvbGVyYW5jZSA9IGRpZmYgLyBwYW5lbFdpZHRoO1xuICAgIC8vICAgcGFuZWxOdW0gPSBNYXRoLmZsb29yKGxlcnBUYXJnZXRYIC8gcGFuZWxXaWR0aCk7XG4gICAgLy9cbiAgICAvLyAgIGlmIChkaWZmVG9sZXJhbmNlIDwgc25hcFRvbGVyYW5jZSkge1xuICAgIC8vICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IHBhbmVsTnVtICogcGFuZWxXaWR0aDtcbiAgICAvLyAgIH0gZWxzZSBpZiAoZGlmZlRvbGVyYW5jZSA+ICgxIC0gc25hcFRvbGVyYW5jZSkpIHtcbiAgICAvLyAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSAoMSArIHBhbmVsTnVtKSAqIHBhbmVsV2lkdGg7XG4gICAgLy8gICB9XG4gICAgLy9cbiAgICAvLyB9LCAyNTApKTtcbiAgfSk7XG5cblxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XG5cbiAgfVxuXG4gIC8vcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG5cbn1cblxuZG9pdCgpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICQoZnVuY3Rpb24oKSB7XG5cbiAgICAvKiAgR2xvYmFsc1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gICAgdmFyIFBST1BFUlRJRVMgPSBbJ3RyYW5zbGF0ZVgnLCAndHJhbnNsYXRlWScsICdvcGFjaXR5JywgJ3JvdGF0ZScsICdzY2FsZSddLFxuICAgICAgJGJvZHkgPSAkKCdib2R5JyksXG4gICAgICB3cmFwcGVycyA9IFtdLFxuICAgICAgY3VycmVudFdyYXBwZXIgPSBudWxsLFxuICAgICAgc2Nyb2xsVGltZW91dElEID0gMCxcbiAgICAgIGJvZHlIZWlnaHQgPSAwLFxuICAgICAgd2luZG93SGVpZ2h0ID0gMCxcbiAgICAgIHdpbmRvd1dpZHRoID0gMCxcbiAgICAgIHBhbmVsV2lkdGggPSAwLFxuICAgICAgcHJldktleWZyYW1lc0R1cmF0aW9ucyA9IDAsXG4gICAgICBzY3JvbGxUb3AgPSAwLFxuICAgICAgcmVsYXRpdmVTY3JvbGxUb3AgPSAwLFxuICAgICAgY3VycmVudEtleWZyYW1lID0gMCxcbiAgICAgIGtleWZyYW1lcyA9IFt7XG4gICAgICAgICd3cmFwcGVyJzogJy5wYW5lbC0xeCcsXG4gICAgICAgICdkdXJhdGlvbic6ICcxMDAlJyxcbiAgICAgICAgJ2FuaW1hdGlvbnMnOiBbXG5cbiAgICAgICAgICB7XG4gICAgICAgICAgICAnc2VsZWN0b3InOiAnLnR0LS1sZWZ0JyxcbiAgICAgICAgICAgICdsZWZ0JzogWzAsICcxMDAlJ10sXG4gICAgICAgICAgICAnY2xhc3Nlc1RvQWRkJzogW3tcbiAgICAgICAgICAgICAgJ3N0YXRlLTEnOiAnMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICdzdGF0ZS0yJzogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ3NlbGVjdG9yJzogJy50dC0tcmlnaHQnLFxuICAgICAgICAgICAgJ3JpZ2h0JzogWzAsICcxMDAlJ10sXG4gICAgICAgICAgICAnY2xhc3Nlc1RvQWRkJzogW3tcbiAgICAgICAgICAgICAgJ3N0YXRlLTEnOiAnMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICdzdGF0ZS0yJzogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICB7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5uYW1lJyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6IC0xNDAsXG4gICAgICAgICAgJ29wYWNpdHknOiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnLnNhbScsXG4gICAgICAgICAgJ2NsYXNzZXNUb0FkZCc6IFt7XG4gICAgICAgICAgICAndGVzdGluZy0xJzogJzUwJSdcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAndGVzdC0yJzogJzEwMCUnXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0gLy8gaGFjayB0byBhY2NlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5ieWxpbmUnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogLTExMCxcbiAgICAgICAgICAnb3BhY2l0eSc6IDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcudHdpdHRlcicsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF1cbiAgICAgICAgfV1cbiAgICAgIH0sIHtcbiAgICAgICAgJ3dyYXBwZXInOiAnLnBhbmVsLTJ4JyxcbiAgICAgICAgJ2R1cmF0aW9uJzogJzEwMCUnLFxuICAgICAgICAnYW5pbWF0aW9ucyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnc2VsZWN0b3InOiAnLnh0dC0tcmlnaHQnLFxuICAgICAgICAgICAgJ3JpZ2h0JzogWzAsICcxMDAlJ10sXG4gICAgICAgICAgICAnY2xhc3Nlc1RvQWRkJzogW3tcbiAgICAgICAgICAgICAgJ3N0YXRlLTEnOiAnMCUnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICdzdGF0ZS0yJzogJzEwMCUnXG4gICAgICAgICAgICB9XVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcueHR0LS1sZWZ0JyxcbiAgICAgICAgICAncmlnaHQnOiBbMCwgJzEwMCUnXSxcbiAgICAgICAgICAnY2xhc3Nlc1RvQWRkJzogW3tcbiAgICAgICAgICAgICdzdGF0ZS0xJzogJzAlJ1xuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICdzdGF0ZS0yJzogJzEwMCUnXG4gICAgICAgICAgfV1cbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuc2FtJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IFswLCAxLjc1XSAvLyBoYWNrIHRvIGFjY2VscmF0ZSBvcGFjaXR5IHNwZWVkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnI2RvbUV4cGxvc2lvbkxpc3QnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJy03MCUnLFxuICAgICAgICAgICdvcGFjaXR5JzogWzAsIDFdIC8vIGhhY2sgdG8gYWNjZWxyYXRlIG9wYWNpdHkgc3BlZWRcbiAgICAgICAgfV1cbiAgICAgIH0sIHtcbiAgICAgICAgJ3dyYXBwZXInOiAnI2V4cGxvc2lvbicsXG4gICAgICAgICdkdXJhdGlvbic6ICcxNTAlJyxcbiAgICAgICAgJ2FuaW1hdGlvbnMnOiBbe1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTEnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJy0xNSUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJy0xMCUnLFxuICAgICAgICAgICdvcGFjaXR5JzogWzEsIDBdLFxuICAgICAgICAgICdzY2FsZSc6IDIsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnLmRlaS0yJyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6ICctNSUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJy00JScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0gLy8gaGFjayB0byBkZWNlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5kZWktMycsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVknOiAnLTklJyxcbiAgICAgICAgICAndHJhbnNsYXRlWCc6ICcyJScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0sIC8vIGhhY2sgdG8gYWNjZWxyYXRlIG9wYWNpdHkgc3BlZWRcbiAgICAgICAgICAnc2NhbGUnOiAxLjIsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnLmRlaS00JyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6ICctMTclJyxcbiAgICAgICAgICAndHJhbnNsYXRlWCc6ICc4JScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0sIC8vIGhhY2sgdG8gYWNjZWxyYXRlIG9wYWNpdHkgc3BlZWRcbiAgICAgICAgICAnc2NhbGUnOiAxLjUsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnLmRlaS01JyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6ICctMiUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJy0xNSUnLFxuICAgICAgICAgICdvcGFjaXR5JzogWzEsIDBdLFxuICAgICAgICAgICdzY2FsZSc6IDIsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnLmRlaS02JyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6ICctMSUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJy03JScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0sIC8vIGhhY2sgdG8gZGVjZWxyYXRlIG9wYWNpdHkgc3BlZWRcbiAgICAgICAgICAnc2NhbGUnOiAxLjIsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnLmRlaS03JyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6ICctNCUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJzIlJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IFsxLCAwXSwgLy8gaGFjayB0byBhY2NlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICAgICdzY2FsZSc6IDEuMSxcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTgnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJy0zJScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVgnOiAnMTIlJyxcbiAgICAgICAgICAnY2xhc3Nlc1RvQWRkJzogW3tcbiAgICAgICAgICAgICd0ZXN0aW5nLTEnOiAnNTAlJ1xuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICd0ZXN0LTInOiAnMTAwJSdcbiAgICAgICAgICB9XSxcbiAgICAgICAgICAnb3BhY2l0eSc6IFsxLCAwXSwgLy8gaGFjayB0byBhY2NlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICAgICdzY2FsZSc6IDEuOCxcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTknLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJzMlJyxcbiAgICAgICAgICAndHJhbnNsYXRlWCc6ICctMTIlJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IFsxLCAwXSxcbiAgICAgICAgICAnc2NhbGUnOiAxLjUsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnLmRlaS0xMCcsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVknOiAnNSUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJy00JScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0gLy8gaGFjayB0byBkZWNlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5kZWktMTEnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJzglJyxcbiAgICAgICAgICAndHJhbnNsYXRlWCc6ICc2JScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0sIC8vIGhhY2sgdG8gYWNjZWxyYXRlIG9wYWNpdHkgc3BlZWRcbiAgICAgICAgICAnc2NhbGUnOiAxLjQsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnLmRlaS0xMicsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVknOiAnMSUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJzIwJScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0sIC8vIGhhY2sgdG8gYWNjZWxyYXRlIG9wYWNpdHkgc3BlZWRcbiAgICAgICAgICAnc2NhbGUnOiAxLjksXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnLmRlaS0xMycsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVknOiAnOCUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJy0xMiUnLFxuICAgICAgICAgICdvcGFjaXR5JzogWzEsIDBdLFxuICAgICAgICAgICdzY2FsZSc6IDEuOCxcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTE0JyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6ICc0JScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVgnOiAnLTMlJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IFsxLCAwXSwgLy8gaGFjayB0byBkZWNlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICAgICdzY2FsZSc6IDEuMyxcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTE1JyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6ICcxNCUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJzUlJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IFsxLCAwXSwgLy8gaGFjayB0byBhY2NlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICAgICdzY2FsZSc6IDEuNyxcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTE2JyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6ICc2JScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVgnOiAnOSUnLFxuICAgICAgICAgICdvcGFjaXR5JzogWzEsIDBdLCAvLyBoYWNrIHRvIGFjY2VscmF0ZSBvcGFjaXR5IHNwZWVkXG4gICAgICAgICAgJ3NjYWxlJzogMixcbiAgICAgICAgfV1cbiAgICAgIH1dXG5cbiAgICAvKiAgQ29uc3RydWN0aW9uXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICBpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBzY3JvbGxJbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwodXBkYXRlUGFnZSwgMTApO1xuICAgICAgc2V0dXBWYWx1ZXMoKTtcbiAgICAgICR3aW5kb3cucmVzaXplKHRocm93RXJyb3IpXG4gICAgICBpZiAoaXNUb3VjaERldmljZSkge1xuICAgICAgICAkd2luZG93LnJlc2l6ZSh0aHJvd0Vycm9yKVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldHVwVmFsdWVzID0gZnVuY3Rpb24oKSB7XG4gICAgICBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgICAgd2luZG93SGVpZ2h0ID0gJHdpbmRvdy5oZWlnaHQoKTtcbiAgICAgIHdpbmRvd1dpZHRoID0gJHdpbmRvdy53aWR0aCgpO1xuICAgICAgcGFuZWxXaWR0aCA9ICQoJyNzaGVldC1lYXN0IC5wYW5lbCcpWzBdLm9mZnNldFdpZHRoO1xuICAgICAgLy8gdHJlYXQgYSBwYW5lbCdzIHdpZHRoIGFzIHRoZSB3aW5kb3dIZWlnaHQgZm9yIG91ciBzaXRlIHB1cnBvc2VzXG4gICAgICB3aW5kb3dIZWlnaHQgPSBwYW5lbFdpZHRoO1xuICAgICAgY29udmVydEFsbFByb3BzVG9QeCgpO1xuICAgICAgYnVpbGRQYWdlKCk7XG4gICAgfVxuXG4gICAgYnVpbGRQYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSwgaiwgaztcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlmcmFtZXMubGVuZ3RoOyBpKyspIHsgLy8gbG9vcCBrZXlmcmFtZXNcbiAgICAgICAgYm9keUhlaWdodCArPSBrZXlmcmFtZXNbaV0uZHVyYXRpb247XG4gICAgICAgIGlmICgkLmluQXJyYXkoa2V5ZnJhbWVzW2ldLndyYXBwZXIsIHdyYXBwZXJzKSA9PSAtMSkge1xuICAgICAgICAgIHdyYXBwZXJzLnB1c2goa2V5ZnJhbWVzW2ldLndyYXBwZXIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBrZXlmcmFtZXNbaV0uYW5pbWF0aW9ucy5sZW5ndGg7IGorKykgeyAvLyBsb29wIGFuaW1hdGlvbnNcbiAgICAgICAgICBPYmplY3Qua2V5cyhrZXlmcmFtZXNbaV0uYW5pbWF0aW9uc1tqXSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHsgLy8gbG9vcCBwcm9wZXJ0aWVzXG4gICAgICAgICAgICB2YWx1ZSA9IGtleWZyYW1lc1tpXS5hbmltYXRpb25zW2pdW2tleV07XG4gICAgICAgICAgICBpZiAoa2V5ICE9PSAnc2VsZWN0b3InICYmIHZhbHVlIGluc3RhbmNlb2YgQXJyYXkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIHZhciB2YWx1ZVNldCA9IFtdO1xuICAgICAgICAgICAgICB2YWx1ZVNldC5wdXNoKGdldERlZmF1bHRQcm9wZXJ0eVZhbHVlKGtleSksIHZhbHVlKTtcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleWZyYW1lc1tpXS5hbmltYXRpb25zW2pdW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8kYm9keS5oZWlnaHQoYm9keUhlaWdodCk7XG4gICAgICAkd2luZG93LnNjcm9sbCgwKTtcbiAgICAgIGN1cnJlbnRXcmFwcGVyID0gd3JhcHBlcnNbMF07XG4gICAgICAkKGN1cnJlbnRXcmFwcGVyKS5zaG93KCk7XG4gICAgfVxuXG4gICAgY29udmVydEFsbFByb3BzVG9QeCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGksIGosIGssIHZhbHVlLCB2YWw7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5ZnJhbWVzLmxlbmd0aDsgaSsrKSB7IC8vIGxvb3Aga2V5ZnJhbWVzXG4gICAgICAgIGtleWZyYW1lc1tpXS5kdXJhdGlvbiA9IGNvbnZlcnRQZXJjZW50VG9QeChrZXlmcmFtZXNbaV0uZHVyYXRpb24sICd5Jyk7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBrZXlmcmFtZXNbaV0uYW5pbWF0aW9ucy5sZW5ndGg7IGorKykgeyAvLyBsb29wIGFuaW1hdGlvbnNcbiAgICAgICAgICBPYmplY3Qua2V5cyhrZXlmcmFtZXNbaV0uYW5pbWF0aW9uc1tqXSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHsgLy8gbG9vcCBwcm9wZXJ0aWVzXG4gICAgICAgICAgICB2YWx1ZSA9IGtleWZyYW1lc1tpXS5hbmltYXRpb25zW2pdW2tleV07XG4gICAgICAgICAgICBpZiAoa2V5ICE9PSAnc2VsZWN0b3InKSB7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7IC8vIGlmIGl0cyBhbiBhcnJheVxuICAgICAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCB2YWx1ZS5sZW5ndGg7IGsrKykgeyAvLyBpZiB2YWx1ZSBpbiBhcnJheSBpcyAlXG4gICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlW2tdID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd0cmFuc2xhdGVZJykge1xuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlW2tdID0gY29udmVydFBlcmNlbnRUb1B4KHZhbHVlW2tdLCAneScpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJ0cmFuc2xhdGVYXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IGNvbnZlcnRQZXJjZW50VG9QeCh2YWx1ZVtrXSwgJ3gnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwibGVmdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSBjb252ZXJ0UGVyY2VudFRvUHgodmFsdWVba10sICd5Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IGNvbnZlcnRQZXJjZW50VG9QeCh2YWx1ZVtrXSwgJ3knKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWVba10gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2NsYXNzZXNUb0FkZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlc2VcbiAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZVtrXSkuZm9yRWFjaChmdW5jdGlvbih5ZWspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgdG8gYXJyYXkgZm9yIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IFt5ZWssIGNvbnZlcnRQZXJjZW50VG9QeCh2YWx1ZVtrXVt5ZWtdLCAneScpXTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7IC8vIGlmIHNpbmdsZSB2YWx1ZSBpcyBhICVcbiAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd0cmFuc2xhdGVZJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbnZlcnRQZXJjZW50VG9QeCh2YWx1ZSwgJ3knKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29udmVydFBlcmNlbnRUb1B4KHZhbHVlLCAneCcpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBrZXlmcmFtZXNbaV0uYW5pbWF0aW9uc1tqXVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREZWZhdWx0UHJvcGVydHlWYWx1ZSA9IGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgICAgIGNhc2UgJ3RyYW5zbGF0ZVgnOlxuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICBjYXNlICd0cmFuc2xhdGVZJzpcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgY2FzZSAnc2NhbGUnOlxuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICBjYXNlICdyb3RhdGUnOlxuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiAgQW5pbWF0aW9uL1Njcm9sbGluZ1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gICAgdXBkYXRlUGFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgc2V0U2Nyb2xsVG9wcygpO1xuICAgICAgICBpZiAoc2Nyb2xsVG9wID49IDAgJiYgc2Nyb2xsVG9wIDw9IChib2R5SGVpZ2h0IC0gd2luZG93SGVpZ2h0KSkge1xuICAgICAgICAgIGFuaW1hdGVFbGVtZW50cygpO1xuICAgICAgICAgIHNldEtleWZyYW1lKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2NvbnNvbGUubG9nKHdpbmRvd0hlaWdodCArICcgdiAnICsgd2luZG93LmlubmVySGVpZ2h0KTtcblxuICAgICAgICBzY3JvbGxQZXJjZW50ID0gMSAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIC8gKGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0KTtcblxuICAgICAgICBsZXJwVGFyZ2V0WCA9IHNjcm9sbFBlcmNlbnQgKiB3aWR0aEVsO1xuXG4gICAgICAgIGRzID0gbGVycFRhcmdldFg7IC8vIGxlcnAoZHMsIGxlcnBUYXJnZXRYLCBsZXJwUmF0ZSk7XG5cblxuICAgICAgICBzID0gJ3RyYW5zbGF0ZTNkKCcgKyAtZHMgKyAncHgsIDAsIDApJztcblxuICAgICAgICBzaGVldEVhc3Quc3R5bGUuV2Via2l0VHJhbnNmb3JtID0gcztcbiAgICAgICAgc2hlZXRFYXN0LnN0eWxlLk1velRyYW5zZm9ybSA9IHM7XG4gICAgICAgIHNoZWV0RWFzdC5zdHlsZS5PVHJhbnNmb3JtID0gcztcbiAgICAgICAgc2hlZXRFYXN0LnN0eWxlLm1zVHJhbnNmb3JtID0gcztcbiAgICAgICAgc2hlZXRFYXN0LnN0eWxlLnRyYW5zZm9ybSA9IHM7XG5cbiAgICAgICAgcyA9ICd0cmFuc2xhdGUzZCgnICsgZHMgKyAncHgsIDAsIDApJztcbiAgICAgICAgc2hlZXRXZXN0LnN0eWxlLldlYmtpdFRyYW5zZm9ybSA9IHM7XG4gICAgICAgIHNoZWV0V2VzdC5zdHlsZS5Nb3pUcmFuc2Zvcm0gPSBzO1xuICAgICAgICBzaGVldFdlc3Quc3R5bGUuT1RyYW5zZm9ybSA9IHM7XG4gICAgICAgIHNoZWV0V2VzdC5zdHlsZS5tc1RyYW5zZm9ybSA9IHM7XG4gICAgICAgIHNoZWV0V2VzdC5zdHlsZS50cmFuc2Zvcm0gPSBzO1xuXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXRTY3JvbGxUb3BzID0gZnVuY3Rpb24oKSB7XG4gICAgICBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgICAgcmVsYXRpdmVTY3JvbGxUb3AgPSBzY3JvbGxUb3AgLSBwcmV2S2V5ZnJhbWVzRHVyYXRpb25zO1xuICAgIH1cblxuICAgIGFuaW1hdGVFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFuaW1hdGlvbiwgdHJhbnNsYXRlWSwgdHJhbnNsYXRlWCwgc2NhbGUsIHJvdGF0ZSwgb3BhY2l0eSwgbGVmdCwgcmlnaHQsIGFuaWxlbmd0aDtcblxuICAgICAgYW5pbGVuZ3RoID0ga2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0uYW5pbWF0aW9ucy5sZW5ndGg7XG5cbiAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRLZXlmcmFtZSk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5pbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYW5pbWF0aW9uID0ga2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0uYW5pbWF0aW9uc1tpXTtcbiAgICAgICAgdHJhbnNsYXRlWSA9IGNhbGNQcm9wVmFsdWUoYW5pbWF0aW9uLCAndHJhbnNsYXRlWScpO1xuICAgICAgICB0cmFuc2xhdGVYID0gY2FsY1Byb3BWYWx1ZShhbmltYXRpb24sICd0cmFuc2xhdGVYJyk7XG4gICAgICAgIHNjYWxlID0gY2FsY1Byb3BWYWx1ZShhbmltYXRpb24sICdzY2FsZScpO1xuICAgICAgICByb3RhdGUgPSBjYWxjUHJvcFZhbHVlKGFuaW1hdGlvbiwgJ3JvdGF0ZScpO1xuICAgICAgICBvcGFjaXR5ID0gY2FsY1Byb3BWYWx1ZShhbmltYXRpb24sICdvcGFjaXR5Jyk7XG4gICAgICAgIGxlZnQgPSBjYWxjUHJvcFZhbHVlKGFuaW1hdGlvbiwgJ2xlZnQnKTtcbiAgICAgICAgcmlnaHQgPSBjYWxjUHJvcFZhbHVlKGFuaW1hdGlvbiwgJ3JpZ2h0Jyk7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2cocHJldktleWZyYW1lc0R1cmF0aW9ucyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGFuaW1hdGlvbik7XG4gICAgICAgIGlmIChyaWdodCkge1xuICAgICAgICAgLy8gY29uc29sZS5sb2cocmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgJChhbmltYXRpb24uc2VsZWN0b3IpLmNzcyh7XG4gICAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgnICsgdHJhbnNsYXRlWCArICdweCwgJyArIHRyYW5zbGF0ZVkgKyAncHgsIDApIHNjYWxlKCcgKyBzY2FsZSArICcpIHJvdGF0ZSgnICsgcm90YXRlICsgJ2RlZyknLFxuICAgICAgICAgICdvcGFjaXR5Jzogb3BhY2l0eSxcbiAgICAgICAgICAnbGVmdCc6IGxlZnQsXG4gICAgICAgICAgJ3JpZ2h0JzogcmlnaHRcbiAgICAgICAgfSkuZWFjaChmdW5jdGlvbihpLCB0YXJnZXQpIHtcbiAgICAgICAgICAoYW5pbWF0aW9uLmNsYXNzZXNUb0FkZCB8fCBbXSkuZm9yRWFjaChmdW5jdGlvbihlbCwgaSkge1xuICAgICAgICAgICAgaWYgKGRzID49IChlbFsxXSArIHByZXZLZXlmcmFtZXNEdXJhdGlvbnMpICYmICQodGFyZ2V0KS5oYXNDbGFzcyhlbFswXSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwid2Ugc2hvdWxkIGFkZCBcIiArIGVsWzBdICsgJywgJyArIGVsWzFdICsgJygnICsgcHJldktleWZyYW1lc0R1cmF0aW9ucyArICcpLiBzY3JvbGxUb3AgaXMgJyArIHNjcm9sbFRvcCk7XG4gICAgICAgICAgICAgICQodGFyZ2V0KS5hZGRDbGFzcyhlbFswXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRzIDwgKGVsWzFdICsgcHJldktleWZyYW1lc0R1cmF0aW9ucykgJiYgJCh0YXJnZXQpLmhhc0NsYXNzKGVsWzBdKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIndlIHNob3VsZCByZW1vdmUgXCIgKyBlbFswXSArICcsICcgKyBlbFsxXSArICcoJyArIHByZXZLZXlmcmFtZXNEdXJhdGlvbnMgKyAnKS4gc2Nyb2xsVG9wIGlzICcgKyBzY3JvbGxUb3ApO1xuICAgICAgICAgICAgICAkKHRhcmdldCkucmVtb3ZlQ2xhc3MoZWxbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNhbGNQcm9wVmFsdWUgPSBmdW5jdGlvbihhbmltYXRpb24sIHByb3BlcnR5KSB7XG4gICAgICB2YXIgdmFsdWUgPSBhbmltYXRpb25bcHJvcGVydHldO1xuICAgICAgaWYgKHZhbHVlICYmIHByb3BlcnR5ICE9PSAnbGVmdCcgJiYgcHJvcGVydHkgIT09ICdyaWdodCcpIHtcbiAgICAgICAgdmFsdWUgPSBlYXNlSW5PdXRRdWFkKHJlbGF0aXZlU2Nyb2xsVG9wLCB2YWx1ZVswXSwgKHZhbHVlWzFdIC0gdmFsdWVbMF0pLCBrZXlmcmFtZXNbY3VycmVudEtleWZyYW1lXS5kdXJhdGlvbik7XG4gICAgICB9IGVsc2UgaWYgKCF2YWx1ZSkge1xuICAgICAgICB2YWx1ZSA9IGdldERlZmF1bHRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KTtcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdmFsdWUgPSByZWxhdGl2ZVNjcm9sbFRvcDsgLy8gZWFzZUxpbmVhcihyZWxhdGl2ZVNjcm9sbFRvcCwgdmFsdWVbMF0sICh2YWx1ZVsxXSAtIHZhbHVlWzBdKSwga2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0uZHVyYXRpb24pO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtaW4gaXMgJyt2YWx1ZVswXSArICcgYW5kIG1heCBpcyAnK3ZhbHVlWzFdKTtcbiAgICAgICAgLy8gdmFsdWUgPSBNYXRoLm1heCh2YWx1ZVswXSwgTWF0aC5taW4ocmVsYXRpdmVTY3JvbGxUb3AsIHZhbHVlWzFdKSk7XG4gICAgICB9XG4gICAgICAvLyB2YWx1ZSA9ICt2YWx1ZS50b0ZpeGVkKDIpXG4gICAgICAvLyBURU1QT1JBUklMWSBSRU1PVkVEIENBVVNFIFNDQUxFIERPRVNOJ1QgV09SSyBXSVRIQSBBR1JFU1NJVkUgUk9VTkRJTkcgTElLRSBUSElTXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZWFzZUluT3V0UXVhZCA9IGZ1bmN0aW9uKHQsIGIsIGMsIGQpIHtcbiAgICAgIC8vc2ludXNvYWRpYWwgaW4gYW5kIG91dFxuICAgICAgcmV0dXJuIC1jIC8gMiAqIChNYXRoLmNvcyhNYXRoLlBJICogdCAvIGQpIC0gMSkgKyBiO1xuICAgIH07XG5cbiAgICAvLyBlYXNlTGluZWFyID0gZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcbiAgICAvLyAgIHJldHVybiBjICogdCAvIGQgKyBiO1xuICAgIC8vIH1cblxuICAgIG5lYXRlbkxhc3RLZXlmcmFtZSA9IGZ1bmN0aW9uIChkKSB7XG4gICAgICB2YXIgYW5pbWF0aW9uLCB0cmFuc2xhdGVZLCB0cmFuc2xhdGVYLCBzY2FsZSwgcm90YXRlLCBvcGFjaXR5LCBsZWZ0LCByaWdodCwgYW5pbGVuZ3RoLCBpbmRleDtcblxuICAgICAgaW5kZXggPSAoZCA+IDApID8gMSA6IDA7XG5cbiAgICAgIGFuaWxlbmd0aCA9IGtleWZyYW1lc1tjdXJyZW50S2V5ZnJhbWVdLmFuaW1hdGlvbnMubGVuZ3RoO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuaWxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFuaW1hdGlvbiA9IGtleWZyYW1lc1tjdXJyZW50S2V5ZnJhbWVdLmFuaW1hdGlvbnNbaV07XG4gICAgICAgIHRyYW5zbGF0ZVkgPSBhbmltYXRpb25bJ3RyYW5zbGF0ZVknXVtpbmRleF0gfHwgYW5pbWF0aW9uWyd0cmFuc2xhdGVZJ107XG4gICAgICAgIHRyYW5zbGF0ZVggPSBhbmltYXRpb25bJ3RyYW5zbGF0ZVgnXVtpbmRleF0gfHwgYW5pbWF0aW9uWyd0cmFuc2xhdGVYJ107XG4gICAgICAgIHNjYWxlID0gYW5pbWF0aW9uWydzY2FsZSddW2luZGV4XSB8fCBhbmltYXRpb25bJ3NjYWxlJ107XG4gICAgICAgIHJvdGF0ZSA9IGFuaW1hdGlvblsncm90YXRlJ11baW5kZXhdIHx8IGFuaW1hdGlvblsncm90YXRlJ107XG4gICAgICAgIG9wYWNpdHkgPSBhbmltYXRpb25bJ29wYWNpdHknXVtpbmRleF0gfHwgYW5pbWF0aW9uWydvcGFjaXR5J107XG4gICAgICAgIGxlZnQgPSBhbmltYXRpb25bJ2xlZnQnXVtpbmRleF0gfHwgYW5pbWF0aW9uWydsZWZ0J107XG4gICAgICAgIHJpZ2h0ID0gYW5pbWF0aW9uWydyaWdodCddW2luZGV4XSB8fCBhbmltYXRpb25bJ3JpZ2h0J107XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2cocHJldktleWZyYW1lc0R1cmF0aW9ucyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGFuaW1hdGlvbik7XG4gICAgICAgIGlmIChyaWdodCkge1xuICAgICAgICAgY29uc29sZS5sb2cocmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgJChhbmltYXRpb24uc2VsZWN0b3IpLmNzcyh7XG4gICAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgnICsgdHJhbnNsYXRlWCArICdweCwgJyArIHRyYW5zbGF0ZVkgKyAncHgsIDApIHNjYWxlKCcgKyBzY2FsZSArICcpIHJvdGF0ZSgnICsgcm90YXRlICsgJ2RlZyknLFxuICAgICAgICAgICdvcGFjaXR5Jzogb3BhY2l0eSxcbiAgICAgICAgICAnbGVmdCc6IGxlZnQsXG4gICAgICAgICAgJ3JpZ2h0JzogcmlnaHRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0S2V5ZnJhbWUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChzY3JvbGxUb3AgPiAoa2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0uZHVyYXRpb24gKyBwcmV2S2V5ZnJhbWVzRHVyYXRpb25zKSkge1xuICAgICAgICAvL25lYXRlbkxhc3RLZXlmcmFtZSgxKTtcbiAgICAgICAgcHJldktleWZyYW1lc0R1cmF0aW9ucyArPSBrZXlmcmFtZXNbY3VycmVudEtleWZyYW1lXS5kdXJhdGlvbjtcbiAgICAgICAgY3VycmVudEtleWZyYW1lKys7XG4gICAgICAgIC8vc2hvd0N1cnJlbnRXcmFwcGVycygpO1xuICAgICAgfSBlbHNlIGlmIChzY3JvbGxUb3AgPCBwcmV2S2V5ZnJhbWVzRHVyYXRpb25zKSB7XG4gICAgICAgIC8vbmVhdGVuTGFzdEtleWZyYW1lKC0xKTtcbiAgICAgICAgY3VycmVudEtleWZyYW1lLS07XG4gICAgICAgIHByZXZLZXlmcmFtZXNEdXJhdGlvbnMgLT0ga2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0uZHVyYXRpb247XG4gICAgICAgIC8vc2hvd0N1cnJlbnRXcmFwcGVycygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNob3dDdXJyZW50V3JhcHBlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpO1xuICAgICAgaWYgKGtleWZyYW1lc1tjdXJyZW50S2V5ZnJhbWVdLndyYXBwZXIgIT0gY3VycmVudFdyYXBwZXIpIHtcbiAgICAgICAgJChjdXJyZW50V3JhcHBlcikuaGlkZSgpO1xuICAgICAgICAkKGtleWZyYW1lc1tjdXJyZW50S2V5ZnJhbWVdLndyYXBwZXIpLnNob3coKTtcbiAgICAgICAgY3VycmVudFdyYXBwZXIgPSBrZXlmcmFtZXNbY3VycmVudEtleWZyYW1lXS53cmFwcGVyO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qICBIZWxwZXJzXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgIGNvbnZlcnRQZXJjZW50VG9QeCA9IGZ1bmN0aW9uKHZhbHVlLCBheGlzKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmIHZhbHVlLm1hdGNoKC8lL2cpKSB7XG4gICAgICAgIGlmIChheGlzID09PSAneScpIHZhbHVlID0gKHBhcnNlRmxvYXQodmFsdWUpIC8gMTAwKSAqIHBhbmVsV2lkdGg7IC8vd2luZG93SGVpZ2h0O1xuICAgICAgICBpZiAoYXhpcyA9PT0gJ3gnKSB2YWx1ZSA9IChwYXJzZUZsb2F0KHZhbHVlKSAvIDEwMCkgKiB3aW5kb3dXaWR0aDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aHJvd0Vycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAkYm9keS5hZGRDbGFzcygncGFnZS1lcnJvcicpXG4gICAgfVxuXG4gICAgaXNUb3VjaERldmljZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyAvLyB3b3JrcyBvbiBtb3N0IGJyb3dzZXJzXG4gICAgICAgIHx8ICdvbm1zZ2VzdHVyZWNoYW5nZScgaW4gd2luZG93OyAvLyB3b3JrcyBvbiBpZTEwXG4gICAgfVxuXG4gICAgaW5pdCgpO1xuXG4gIH0pXG59KS5jYWxsKHRoaXMpO1xuIl19
