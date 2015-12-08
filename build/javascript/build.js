(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $window = $(window);

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

  var scrollPercent = document.body.scrollTop / (document.body.clientHeight - window.innerHeight);

  var scrollScalar = document.body.scrollTop / (document.body.clientHeight - window.innerHeight),
      sheetOffset = sheetWidth * scrollScalar;

  var s;
  var ds = 0;

  var isScrolling = false;

  var diff = 0;
  var diffTolerance = 0;
  var panelNum = 0;

  var lerpRate = 0.1;

  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  $(window).scroll(function () {
    lerpRate = 0.1;
    //lerpTargetX = document.body.scrollTop + window.innerHeight;
    scrollPercent = document.body.scrollTop / (document.body.clientHeight - window.innerHeight);

    lerpTargetX = scrollPercent * widthEl;

    //console.log(lerpTargetX + 'v' + $window.scrollTop());
    //console.log(document.body.clientHeight - window.innerHeight);
    // var scrollTop = $(window).scrollTop();
    // var docHeight = $(document).height();
    // var winHeight = $(window).height();
    //console.log(scrollPercent);
    isScrolling = true;
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function () {
      // do something
      return false; // disable this scroll snap
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
      'wrapper': '#intro',
      'duration': '100%',
      'animations': [{
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
      'wrapper': '#explosion',
      'duration': '150%',
      'animations': [{
        'selector': '.explosion-byline',
        'translateY': '-25%',
        'opacity': [0, 1.75] // hack to accelrate opacity speed
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
                    } else {
                      value[k] = convertPercentToPx(value[k], 'x');
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
        default:
          return null;
      }
    };

    /*  Animation/Scrolling
    -------------------------------------------------- */
    updatePage = function () {
      window.requestAnimationFrame(function () {
        setScrollTops();
        if (scrollTop > 0 && scrollTop <= bodyHeight - windowHeight) {
          animateElements();
          setKeyframe();
        }
      });
    };

    setScrollTops = function () {
      scrollTop = $window.scrollTop();
      relativeScrollTop = scrollTop - prevKeyframesDurations;
    };

    animateElements = function () {
      var animation, translateY, translateX, scale, rotate, opacity;
      for (var i = 0; i < keyframes[currentKeyframe].animations.length; i++) {
        animation = keyframes[currentKeyframe].animations[i];
        translateY = calcPropValue(animation, 'translateY');
        translateX = calcPropValue(animation, 'translateX');
        scale = calcPropValue(animation, 'scale');
        rotate = calcPropValue(animation, 'rotate');
        opacity = calcPropValue(animation, 'opacity');

        // console.log(prevKeyframesDurations);
        // console.log(animation);

        $(animation.selector).css({
          'transform': 'translate3d(' + translateX + 'px, ' + translateY + 'px, 0) scale(' + scale + ') rotate(' + rotate + 'deg)',
          'opacity': opacity
        }).each(function (i, target) {
          (animation.classesToAdd || []).forEach(function (el, i) {
            // if (el[1])
            // console.log('...');
            // console.log(el[1]);

            if (scrollTop >= el[1] + prevKeyframesDurations && $(target).hasClass(el[0]) === false) {
              console.log("we should add " + el[0]);
              $(target).addClass(el[0]);
            } else if (scrollTop < el[1] + prevKeyframesDurations && $(target).hasClass(el[0]) === true) {
              console.log("we should remove " + el[0]);
              $(target).removeClass(el[0]);
            }
          });
        });
      }
    };

    calcPropValue = function (animation, property) {
      var value = animation[property];
      if (value) {
        value = easeInOutQuad(relativeScrollTop, value[0], value[1] - value[0], keyframes[currentKeyframe].duration);
      } else {
        value = getDefaultPropertyValue(property);
      }
      // value = +value.toFixed(2)
      // TEMPORARILY REMOVED CAUSE SCALE DOESN'T WORK WITHA AGRESSIVE ROUNDING LIKE THIS
      return value;
    };

    easeInOutQuad = function (t, b, c, d) {
      //sinusoadial in and out
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };

    setKeyframe = function () {
      if (scrollTop > keyframes[currentKeyframe].duration + prevKeyframesDurations) {
        prevKeyframesDurations += keyframes[currentKeyframe].duration;
        currentKeyframe++;
        showCurrentWrappers();
      } else if (scrollTop < prevKeyframesDurations) {
        currentKeyframe--;
        prevKeyframesDurations -= keyframes[currentKeyframe].duration;
        showCurrentWrappers();
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
        if (axis === 'y') value = parseFloat(value) / 100 * windowHeight;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvamF2YXNjcmlwdC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFeEIsU0FBUyxJQUFJLEdBQUcsQUFDZDtNQUFJLFNBQVM7TUFDWCxZQUFZO01BQ1osU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDO01BQ2pELFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQztNQUNqRCxVQUFVLEdBQUcsU0FBUyxDQUFDLFdBQVc7TUFDbEMsV0FBVztNQUNYLENBQUMsR0FBRyxFQUFFO0FBQUMsQUFDVCxNQUFJLFlBQVksQ0FBQyxBQUNqQjtNQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLEFBQ3BDO01BQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxBQUNoRDtNQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQUFFeEQ7O01BQUksYUFBYSxHQUFHLEVBQUU7QUFBQyxBQUN2QixNQUFJLFdBQVcsR0FBRyxDQUFDO01BQ2pCLGFBQWEsR0FBRyxDQUFDLENBQUMsQUFFcEI7O01BQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUEsQUFBQyxDQUFDLEFBRWhHOztNQUFJLFlBQVksR0FBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFBLEFBQUMsQUFBQztNQUM5RixX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IiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG5mdW5jdGlvbiBkb2l0KCkge1xuICB2YXIgc2Nyb2xsVG9wLFxuICAgIHNjcm9sbFNjYWxhcixcbiAgICBzaGVldEVhc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hlZXQtZWFzdCcpLFxuICAgIHNoZWV0V2VzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaGVldC13ZXN0JyksXG4gICAgc2hlZXRXaWR0aCA9IHNoZWV0RWFzdC5vZmZzZXRXaWR0aCxcbiAgICBzaGVldE9mZnNldCxcbiAgICBzID0gXCJcIjsgLy8gc3R5bGUgc3RyaW5nXG4gIHZhciBzY3JvbGxTY2FsYXI7XG4gIHZhciB3aWR0aEVsID0gc2hlZXRFYXN0Lm9mZnNldFdpZHRoO1xuICB2YXIgcGFuZWxDb3VudCA9ICQoJyNzaGVldC1lYXN0IC5wYW5lbCcpLmxlbmd0aDtcbiAgdmFyIHBhbmVsV2lkdGggPSAkKCcjc2hlZXQtZWFzdCAucGFuZWwnKVswXS5vZmZzZXRXaWR0aDtcblxuICB2YXIgc25hcFRvbGVyYW5jZSA9IC4yOyAvL1xuICB2YXIgbGVycFRhcmdldFggPSAwLFxuICAgIGN1cnJlbnRPZmZzZXQgPSAwO1xuXG4gIHZhciBzY3JvbGxQZXJjZW50ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgLyAoZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXG4gIHZhciBzY3JvbGxTY2FsYXIgPSAoZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgLyAoZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQpKSxcbiAgICBzaGVldE9mZnNldCA9IHNoZWV0V2lkdGggKiBzY3JvbGxTY2FsYXI7XG5cbiAgdmFyIHM7XG4gIHZhciBkcyA9IDA7XG5cbiAgdmFyIGlzU2Nyb2xsaW5nID0gZmFsc2U7XG5cbiAgdmFyIGRpZmYgPSAwO1xuICB2YXIgZGlmZlRvbGVyYW5jZSA9IDA7XG4gIHZhciBwYW5lbE51bSA9IDA7XG5cbiAgdmFyIGxlcnBSYXRlID0gMC4xO1xuXG4gIGZ1bmN0aW9uIGxlcnAoc3RhcnQsIGVuZCwgYW10KSB7XG4gICAgcmV0dXJuICgxIC0gYW10KSAqIHN0YXJ0ICsgYW10ICogZW5kO1xuICB9XG5cbiAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICBsZXJwUmF0ZSA9IDAuMTtcbiAgICAvL2xlcnBUYXJnZXRYID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgc2Nyb2xsUGVyY2VudCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIC8gKGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0KTtcblxuICAgIGxlcnBUYXJnZXRYID0gc2Nyb2xsUGVyY2VudCAqIHdpZHRoRWw7XG5cbiAgICAvL2NvbnNvbGUubG9nKGxlcnBUYXJnZXRYICsgJ3YnICsgJHdpbmRvdy5zY3JvbGxUb3AoKSk7XG4gICAgLy9jb25zb2xlLmxvZyhkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgLy8gdmFyIHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICAvLyB2YXIgZG9jSGVpZ2h0ID0gJChkb2N1bWVudCkuaGVpZ2h0KCk7XG4gICAgLy8gdmFyIHdpbkhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcbiAgICAvL2NvbnNvbGUubG9nKHNjcm9sbFBlcmNlbnQpO1xuICAgIGlzU2Nyb2xsaW5nID0gdHJ1ZTtcbiAgICBjbGVhclRpbWVvdXQoJC5kYXRhKHRoaXMsICdzY3JvbGxUaW1lcicpKTtcbiAgICAkLmRhdGEodGhpcywgJ3Njcm9sbFRpbWVyJywgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIC8vIGRvIHNvbWV0aGluZ1xuICAgICAgcmV0dXJuIGZhbHNlOyAvLyBkaXNhYmxlIHRoaXMgc2Nyb2xsIHNuYXBcbiAgICAgIGNvbnNvbGUubG9nKFwiSGF2ZW4ndCBzY3JvbGxlZCBpbiAyNTBtcyFcIik7XG4gICAgICAvLyAkLnByb3h5KHNuYXBGbHVzaCwgdGhhdClcbiAgICAgIGxlcnBSYXRlID0gMC4wNztcbiAgICAgIGxlcnBUYXJnZXRYID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cbiAgICAgIGRpZmYgPSBsZXJwVGFyZ2V0WCAlIHBhbmVsV2lkdGg7XG4gICAgICBkaWZmVG9sZXJhbmNlID0gZGlmZiAvIHBhbmVsV2lkdGg7XG4gICAgICBwYW5lbE51bSA9IE1hdGguZmxvb3IobGVycFRhcmdldFggLyBwYW5lbFdpZHRoKTtcblxuICAgICAgaWYgKGRpZmZUb2xlcmFuY2UgPCBzbmFwVG9sZXJhbmNlKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gcGFuZWxOdW0gKiBwYW5lbFdpZHRoO1xuICAgICAgfSBlbHNlIGlmIChkaWZmVG9sZXJhbmNlID4gKDEgLSBzbmFwVG9sZXJhbmNlKSkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9ICgxICsgcGFuZWxOdW0pICogcGFuZWxXaWR0aDtcbiAgICAgIH1cblxuICAgIH0sIDI1MCkpO1xuICB9KTtcblxuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICBkcyA9IGxlcnAoZHMsIGxlcnBUYXJnZXRYLCBsZXJwUmF0ZSk7XG5cblxuICAgIHMgPSAndHJhbnNsYXRlM2QoJyArIC1kcyArICdweCwgMCwgMCknO1xuXG4gICAgc2hlZXRFYXN0LnN0eWxlLldlYmtpdFRyYW5zZm9ybSA9IHM7XG4gICAgc2hlZXRFYXN0LnN0eWxlLk1velRyYW5zZm9ybSA9IHM7XG4gICAgc2hlZXRFYXN0LnN0eWxlLk9UcmFuc2Zvcm0gPSBzO1xuICAgIHNoZWV0RWFzdC5zdHlsZS5tc1RyYW5zZm9ybSA9IHM7XG4gICAgc2hlZXRFYXN0LnN0eWxlLnRyYW5zZm9ybSA9IHM7XG5cbiAgICBzID0gJ3RyYW5zbGF0ZTNkKCcgKyBkcyArICdweCwgMCwgMCknO1xuICAgIHNoZWV0V2VzdC5zdHlsZS5XZWJraXRUcmFuc2Zvcm0gPSBzO1xuICAgIHNoZWV0V2VzdC5zdHlsZS5Nb3pUcmFuc2Zvcm0gPSBzO1xuICAgIHNoZWV0V2VzdC5zdHlsZS5PVHJhbnNmb3JtID0gcztcbiAgICBzaGVldFdlc3Quc3R5bGUubXNUcmFuc2Zvcm0gPSBzO1xuICAgIHNoZWV0V2VzdC5zdHlsZS50cmFuc2Zvcm0gPSBzO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gIH1cblxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcblxufVxuXG5kb2l0KCk7XG5cbihmdW5jdGlvbigpIHtcbiAgJChmdW5jdGlvbigpIHtcblxuICAgIC8qICBHbG9iYWxzXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICB2YXIgUFJPUEVSVElFUyA9IFsndHJhbnNsYXRlWCcsICd0cmFuc2xhdGVZJywgJ29wYWNpdHknLCAncm90YXRlJywgJ3NjYWxlJ10sXG4gICAgICAkYm9keSA9ICQoJ2JvZHknKSxcbiAgICAgIHdyYXBwZXJzID0gW10sXG4gICAgICBjdXJyZW50V3JhcHBlciA9IG51bGwsXG4gICAgICBzY3JvbGxUaW1lb3V0SUQgPSAwLFxuICAgICAgYm9keUhlaWdodCA9IDAsXG4gICAgICB3aW5kb3dIZWlnaHQgPSAwLFxuICAgICAgd2luZG93V2lkdGggPSAwLFxuICAgICAgcGFuZWxXaWR0aCA9IDAsXG4gICAgICBwcmV2S2V5ZnJhbWVzRHVyYXRpb25zID0gMCxcbiAgICAgIHNjcm9sbFRvcCA9IDAsXG4gICAgICByZWxhdGl2ZVNjcm9sbFRvcCA9IDAsXG4gICAgICBjdXJyZW50S2V5ZnJhbWUgPSAwLFxuICAgICAga2V5ZnJhbWVzID0gW3tcbiAgICAgICAgJ3dyYXBwZXInOiAnI2ludHJvJyxcbiAgICAgICAgJ2R1cmF0aW9uJzogJzEwMCUnLFxuICAgICAgICAnYW5pbWF0aW9ucyc6IFt7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5uYW1lJyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6IC0xNDAsXG4gICAgICAgICAgJ29wYWNpdHknOiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnLnNhbScsXG4gICAgICAgICAgJ2NsYXNzZXNUb0FkZCc6IFt7XG4gICAgICAgICAgICAndGVzdGluZy0xJzogJzUwJSdcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAndGVzdC0yJzogJzEwMCUnXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0gLy8gaGFjayB0byBhY2NlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5ieWxpbmUnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogLTExMCxcbiAgICAgICAgICAnb3BhY2l0eSc6IDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcudHdpdHRlcicsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF1cbiAgICAgICAgfV1cbiAgICAgIH0sIHtcbiAgICAgICAgJ3dyYXBwZXInOiAnI2V4cGxvc2lvbicsXG4gICAgICAgICdkdXJhdGlvbic6ICcxNTAlJyxcbiAgICAgICAgJ2FuaW1hdGlvbnMnOiBbe1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZXhwbG9zaW9uLWJ5bGluZScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVknOiAnLTI1JScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMCwgMS43NV0gLy8gaGFjayB0byBhY2NlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5zYW0nLFxuICAgICAgICAgICdvcGFjaXR5JzogWzAsIDEuNzVdIC8vIGhhY2sgdG8gYWNjZWxyYXRlIG9wYWNpdHkgc3BlZWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcjZG9tRXhwbG9zaW9uTGlzdCcsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVknOiAnLTcwJScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMCwgMV0gLy8gaGFjayB0byBhY2NlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICB9XVxuICAgICAgfSwge1xuICAgICAgICAnd3JhcHBlcic6ICcjZXhwbG9zaW9uJyxcbiAgICAgICAgJ2R1cmF0aW9uJzogJzE1MCUnLFxuICAgICAgICAnYW5pbWF0aW9ucyc6IFt7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5kZWktMScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVknOiAnLTE1JScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVgnOiAnLTEwJScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0sXG4gICAgICAgICAgJ3NjYWxlJzogMixcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTInLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJy01JScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVgnOiAnLTQlJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IFsxLCAwXSAvLyBoYWNrIHRvIGRlY2VscmF0ZSBvcGFjaXR5IHNwZWVkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnLmRlaS0zJyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6ICctOSUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJzIlJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IFsxLCAwXSwgLy8gaGFjayB0byBhY2NlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICAgICdzY2FsZSc6IDEuMixcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTQnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJy0xNyUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJzglJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IFsxLCAwXSwgLy8gaGFjayB0byBhY2NlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICAgICdzY2FsZSc6IDEuNSxcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTUnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJy0yJScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVgnOiAnLTE1JScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0sXG4gICAgICAgICAgJ3NjYWxlJzogMixcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTYnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJy0xJScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVgnOiAnLTclJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IFsxLCAwXSwgLy8gaGFjayB0byBkZWNlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICAgICdzY2FsZSc6IDEuMixcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTcnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJy00JScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVgnOiAnMiUnLFxuICAgICAgICAgICdvcGFjaXR5JzogWzEsIDBdLCAvLyBoYWNrIHRvIGFjY2VscmF0ZSBvcGFjaXR5IHNwZWVkXG4gICAgICAgICAgJ3NjYWxlJzogMS4xLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5kZWktOCcsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVknOiAnLTMlJyxcbiAgICAgICAgICAndHJhbnNsYXRlWCc6ICcxMiUnLFxuICAgICAgICAgICdjbGFzc2VzVG9BZGQnOiBbe1xuICAgICAgICAgICAgJ3Rlc3RpbmctMSc6ICc1MCUnXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJ3Rlc3QtMic6ICcxMDAlJ1xuICAgICAgICAgIH1dLFxuICAgICAgICAgICdvcGFjaXR5JzogWzEsIDBdLCAvLyBoYWNrIHRvIGFjY2VscmF0ZSBvcGFjaXR5IHNwZWVkXG4gICAgICAgICAgJ3NjYWxlJzogMS44LFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5kZWktOScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVknOiAnMyUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJy0xMiUnLFxuICAgICAgICAgICdvcGFjaXR5JzogWzEsIDBdLFxuICAgICAgICAgICdzY2FsZSc6IDEuNSxcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTEwJyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6ICc1JScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVgnOiAnLTQlJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IFsxLCAwXSAvLyBoYWNrIHRvIGRlY2VscmF0ZSBvcGFjaXR5IHNwZWVkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnc2VsZWN0b3InOiAnLmRlaS0xMScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVknOiAnOCUnLFxuICAgICAgICAgICd0cmFuc2xhdGVYJzogJzYlJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IFsxLCAwXSwgLy8gaGFjayB0byBhY2NlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICAgICdzY2FsZSc6IDEuNCxcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTEyJyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6ICcxJScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVgnOiAnMjAlJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IFsxLCAwXSwgLy8gaGFjayB0byBhY2NlbHJhdGUgb3BhY2l0eSBzcGVlZFxuICAgICAgICAgICdzY2FsZSc6IDEuOSxcbiAgICAgICAgfSwge1xuICAgICAgICAgICdzZWxlY3Rvcic6ICcuZGVpLTEzJyxcbiAgICAgICAgICAndHJhbnNsYXRlWSc6ICc4JScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVgnOiAnLTEyJScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0sXG4gICAgICAgICAgJ3NjYWxlJzogMS44LFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5kZWktMTQnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJzQlJyxcbiAgICAgICAgICAndHJhbnNsYXRlWCc6ICctMyUnLFxuICAgICAgICAgICdvcGFjaXR5JzogWzEsIDBdLCAvLyBoYWNrIHRvIGRlY2VscmF0ZSBvcGFjaXR5IHNwZWVkXG4gICAgICAgICAgJ3NjYWxlJzogMS4zLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5kZWktMTUnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJzE0JScsXG4gICAgICAgICAgJ3RyYW5zbGF0ZVgnOiAnNSUnLFxuICAgICAgICAgICdvcGFjaXR5JzogWzEsIDBdLCAvLyBoYWNrIHRvIGFjY2VscmF0ZSBvcGFjaXR5IHNwZWVkXG4gICAgICAgICAgJ3NjYWxlJzogMS43LFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJ3NlbGVjdG9yJzogJy5kZWktMTYnLFxuICAgICAgICAgICd0cmFuc2xhdGVZJzogJzYlJyxcbiAgICAgICAgICAndHJhbnNsYXRlWCc6ICc5JScsXG4gICAgICAgICAgJ29wYWNpdHknOiBbMSwgMF0sIC8vIGhhY2sgdG8gYWNjZWxyYXRlIG9wYWNpdHkgc3BlZWRcbiAgICAgICAgICAnc2NhbGUnOiAyLFxuICAgICAgICB9XVxuICAgICAgfV1cblxuICAgIC8qICBDb25zdHJ1Y3Rpb25cbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgIGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHNjcm9sbEludGVydmFsSUQgPSBzZXRJbnRlcnZhbCh1cGRhdGVQYWdlLCAxMCk7XG4gICAgICBzZXR1cFZhbHVlcygpO1xuICAgICAgJHdpbmRvdy5yZXNpemUodGhyb3dFcnJvcilcbiAgICAgIGlmIChpc1RvdWNoRGV2aWNlKSB7XG4gICAgICAgICR3aW5kb3cucmVzaXplKHRocm93RXJyb3IpXG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0dXBWYWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCk7XG4gICAgICB3aW5kb3dIZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuICAgICAgd2luZG93V2lkdGggPSAkd2luZG93LndpZHRoKCk7XG4gICAgICBwYW5lbFdpZHRoID0gJCgnI3NoZWV0LWVhc3QgLnBhbmVsJylbMF0ub2Zmc2V0V2lkdGg7XG4gICAgICAvLyB0cmVhdCBhIHBhbmVsJ3Mgd2lkdGggYXMgdGhlIHdpbmRvd0hlaWdodCBmb3Igb3VyIHNpdGUgcHVycG9zZXNcbiAgICAgIHdpbmRvd0hlaWdodCA9IHBhbmVsV2lkdGg7XG4gICAgICBjb252ZXJ0QWxsUHJvcHNUb1B4KCk7XG4gICAgICBidWlsZFBhZ2UoKTtcbiAgICB9XG5cbiAgICBidWlsZFBhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpLCBqLCBrO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGtleWZyYW1lcy5sZW5ndGg7IGkrKykgeyAvLyBsb29wIGtleWZyYW1lc1xuICAgICAgICBib2R5SGVpZ2h0ICs9IGtleWZyYW1lc1tpXS5kdXJhdGlvbjtcbiAgICAgICAgaWYgKCQuaW5BcnJheShrZXlmcmFtZXNbaV0ud3JhcHBlciwgd3JhcHBlcnMpID09IC0xKSB7XG4gICAgICAgICAgd3JhcHBlcnMucHVzaChrZXlmcmFtZXNbaV0ud3JhcHBlcik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGtleWZyYW1lc1tpXS5hbmltYXRpb25zLmxlbmd0aDsgaisrKSB7IC8vIGxvb3AgYW5pbWF0aW9uc1xuICAgICAgICAgIE9iamVjdC5rZXlzKGtleWZyYW1lc1tpXS5hbmltYXRpb25zW2pdKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkgeyAvLyBsb29wIHByb3BlcnRpZXNcbiAgICAgICAgICAgIHZhbHVlID0ga2V5ZnJhbWVzW2ldLmFuaW1hdGlvbnNbal1ba2V5XTtcbiAgICAgICAgICAgIGlmIChrZXkgIT09ICdzZWxlY3RvcicgJiYgdmFsdWUgaW5zdGFuY2VvZiBBcnJheSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgdmFyIHZhbHVlU2V0ID0gW107XG4gICAgICAgICAgICAgIHZhbHVlU2V0LnB1c2goZ2V0RGVmYXVsdFByb3BlcnR5VmFsdWUoa2V5KSwgdmFsdWUpO1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlU2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5ZnJhbWVzW2ldLmFuaW1hdGlvbnNbal1ba2V5XSA9IHZhbHVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyRib2R5LmhlaWdodChib2R5SGVpZ2h0KTtcbiAgICAgICR3aW5kb3cuc2Nyb2xsKDApO1xuICAgICAgY3VycmVudFdyYXBwZXIgPSB3cmFwcGVyc1swXTtcbiAgICAgICQoY3VycmVudFdyYXBwZXIpLnNob3coKTtcbiAgICB9XG5cbiAgICBjb252ZXJ0QWxsUHJvcHNUb1B4ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSwgaiwgaywgdmFsdWUsIHZhbDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlmcmFtZXMubGVuZ3RoOyBpKyspIHsgLy8gbG9vcCBrZXlmcmFtZXNcbiAgICAgICAga2V5ZnJhbWVzW2ldLmR1cmF0aW9uID0gY29udmVydFBlcmNlbnRUb1B4KGtleWZyYW1lc1tpXS5kdXJhdGlvbiwgJ3knKTtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGtleWZyYW1lc1tpXS5hbmltYXRpb25zLmxlbmd0aDsgaisrKSB7IC8vIGxvb3AgYW5pbWF0aW9uc1xuICAgICAgICAgIE9iamVjdC5rZXlzKGtleWZyYW1lc1tpXS5hbmltYXRpb25zW2pdKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkgeyAvLyBsb29wIHByb3BlcnRpZXNcbiAgICAgICAgICAgIHZhbHVlID0ga2V5ZnJhbWVzW2ldLmFuaW1hdGlvbnNbal1ba2V5XTtcbiAgICAgICAgICAgIGlmIChrZXkgIT09ICdzZWxlY3RvcicpIHtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHsgLy8gaWYgaXRzIGFuIGFycmF5XG4gICAgICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IHZhbHVlLmxlbmd0aDsgaysrKSB7IC8vIGlmIHZhbHVlIGluIGFycmF5IGlzICVcbiAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWVba10gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3RyYW5zbGF0ZVknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSBjb252ZXJ0UGVyY2VudFRvUHgodmFsdWVba10sICd5Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSBjb252ZXJ0UGVyY2VudFRvUHgodmFsdWVba10sICd4Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlW2tdID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdjbGFzc2VzVG9BZGQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZXNlXG4gICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXModmFsdWVba10pLmZvckVhY2goZnVuY3Rpb24oeWVrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IHRvIGFycmF5IGZvciBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSBbeWVrLCBjb252ZXJ0UGVyY2VudFRvUHgodmFsdWVba11beWVrXSwgJ3knKV07XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikgeyAvLyBpZiBzaW5nbGUgdmFsdWUgaXMgYSAlXG4gICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAndHJhbnNsYXRlWScpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb252ZXJ0UGVyY2VudFRvUHgodmFsdWUsICd5Jyk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbnZlcnRQZXJjZW50VG9QeCh2YWx1ZSwgJ3gnKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAga2V5ZnJhbWVzW2ldLmFuaW1hdGlvbnNbal1ba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RGVmYXVsdFByb3BlcnR5VmFsdWUgPSBmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgc3dpdGNoIChwcm9wZXJ0eSkge1xuICAgICAgICBjYXNlICd0cmFuc2xhdGVYJzpcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgY2FzZSAndHJhbnNsYXRlWSc6XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIGNhc2UgJ3NjYWxlJzpcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgY2FzZSAncm90YXRlJzpcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogIEFuaW1hdGlvbi9TY3JvbGxpbmdcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgIHVwZGF0ZVBhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHNldFNjcm9sbFRvcHMoKTtcbiAgICAgICAgaWYgKHNjcm9sbFRvcCA+IDAgJiYgc2Nyb2xsVG9wIDw9IChib2R5SGVpZ2h0IC0gd2luZG93SGVpZ2h0KSkge1xuICAgICAgICAgIGFuaW1hdGVFbGVtZW50cygpO1xuICAgICAgICAgIHNldEtleWZyYW1lKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldFNjcm9sbFRvcHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCk7XG4gICAgICByZWxhdGl2ZVNjcm9sbFRvcCA9IHNjcm9sbFRvcCAtIHByZXZLZXlmcmFtZXNEdXJhdGlvbnM7XG4gICAgfVxuXG4gICAgYW5pbWF0ZUVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYW5pbWF0aW9uLCB0cmFuc2xhdGVZLCB0cmFuc2xhdGVYLCBzY2FsZSwgcm90YXRlLCBvcGFjaXR5O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlmcmFtZXNbY3VycmVudEtleWZyYW1lXS5hbmltYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFuaW1hdGlvbiA9IGtleWZyYW1lc1tjdXJyZW50S2V5ZnJhbWVdLmFuaW1hdGlvbnNbaV07XG4gICAgICAgIHRyYW5zbGF0ZVkgPSBjYWxjUHJvcFZhbHVlKGFuaW1hdGlvbiwgJ3RyYW5zbGF0ZVknKTtcbiAgICAgICAgdHJhbnNsYXRlWCA9IGNhbGNQcm9wVmFsdWUoYW5pbWF0aW9uLCAndHJhbnNsYXRlWCcpO1xuICAgICAgICBzY2FsZSA9IGNhbGNQcm9wVmFsdWUoYW5pbWF0aW9uLCAnc2NhbGUnKTtcbiAgICAgICAgcm90YXRlID0gY2FsY1Byb3BWYWx1ZShhbmltYXRpb24sICdyb3RhdGUnKTtcbiAgICAgICAgb3BhY2l0eSA9IGNhbGNQcm9wVmFsdWUoYW5pbWF0aW9uLCAnb3BhY2l0eScpO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHByZXZLZXlmcmFtZXNEdXJhdGlvbnMpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhhbmltYXRpb24pO1xuXG4gICAgICAgICQoYW5pbWF0aW9uLnNlbGVjdG9yKS5jc3Moe1xuICAgICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoJyArIHRyYW5zbGF0ZVggKyAncHgsICcgKyB0cmFuc2xhdGVZICsgJ3B4LCAwKSBzY2FsZSgnICsgc2NhbGUgKyAnKSByb3RhdGUoJyArIHJvdGF0ZSArICdkZWcpJyxcbiAgICAgICAgICAnb3BhY2l0eSc6IG9wYWNpdHlcbiAgICAgICAgfSkuZWFjaChmdW5jdGlvbihpLCB0YXJnZXQpIHtcbiAgICAgICAgICAoYW5pbWF0aW9uLmNsYXNzZXNUb0FkZCB8fCBbXSkuZm9yRWFjaChmdW5jdGlvbihlbCwgaSkge1xuICAgICAgICAgICAgLy8gaWYgKGVsWzFdKVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJy4uLicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxbMV0pO1xuXG4gICAgICAgICAgICBpZiAoc2Nyb2xsVG9wID49IChlbFsxXSArIHByZXZLZXlmcmFtZXNEdXJhdGlvbnMpICYmICQodGFyZ2V0KS5oYXNDbGFzcyhlbFswXSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid2Ugc2hvdWxkIGFkZCBcIiArIGVsWzBdKTtcbiAgICAgICAgICAgICAgJCh0YXJnZXQpLmFkZENsYXNzKGVsWzBdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsVG9wIDwgKGVsWzFdICsgcHJldktleWZyYW1lc0R1cmF0aW9ucykgJiYgJCh0YXJnZXQpLmhhc0NsYXNzKGVsWzBdKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIndlIHNob3VsZCByZW1vdmUgXCIgKyBlbFswXSk7XG4gICAgICAgICAgICAgICQodGFyZ2V0KS5yZW1vdmVDbGFzcyhlbFswXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9KVxuXG5cblxuICAgICAgICB9KTtcblxuICAgICAgfVxuICAgIH1cblxuICAgIGNhbGNQcm9wVmFsdWUgPSBmdW5jdGlvbihhbmltYXRpb24sIHByb3BlcnR5KSB7XG4gICAgICB2YXIgdmFsdWUgPSBhbmltYXRpb25bcHJvcGVydHldO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gZWFzZUluT3V0UXVhZChyZWxhdGl2ZVNjcm9sbFRvcCwgdmFsdWVbMF0sICh2YWx1ZVsxXSAtIHZhbHVlWzBdKSwga2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0uZHVyYXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBnZXREZWZhdWx0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSk7XG4gICAgICB9XG4gICAgICAvLyB2YWx1ZSA9ICt2YWx1ZS50b0ZpeGVkKDIpXG4gICAgICAvLyBURU1QT1JBUklMWSBSRU1PVkVEIENBVVNFIFNDQUxFIERPRVNOJ1QgV09SSyBXSVRIQSBBR1JFU1NJVkUgUk9VTkRJTkcgTElLRSBUSElTXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZWFzZUluT3V0UXVhZCA9IGZ1bmN0aW9uKHQsIGIsIGMsIGQpIHtcbiAgICAgIC8vc2ludXNvYWRpYWwgaW4gYW5kIG91dFxuICAgICAgcmV0dXJuIC1jIC8gMiAqIChNYXRoLmNvcyhNYXRoLlBJICogdCAvIGQpIC0gMSkgKyBiO1xuICAgIH07XG5cbiAgICBzZXRLZXlmcmFtZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHNjcm9sbFRvcCA+IChrZXlmcmFtZXNbY3VycmVudEtleWZyYW1lXS5kdXJhdGlvbiArIHByZXZLZXlmcmFtZXNEdXJhdGlvbnMpKSB7XG4gICAgICAgIHByZXZLZXlmcmFtZXNEdXJhdGlvbnMgKz0ga2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0uZHVyYXRpb247XG4gICAgICAgIGN1cnJlbnRLZXlmcmFtZSsrO1xuICAgICAgICBzaG93Q3VycmVudFdyYXBwZXJzKCk7XG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA8IHByZXZLZXlmcmFtZXNEdXJhdGlvbnMpIHtcbiAgICAgICAgY3VycmVudEtleWZyYW1lLS07XG4gICAgICAgIHByZXZLZXlmcmFtZXNEdXJhdGlvbnMgLT0ga2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0uZHVyYXRpb247XG4gICAgICAgIHNob3dDdXJyZW50V3JhcHBlcnMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93Q3VycmVudFdyYXBwZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGlmIChrZXlmcmFtZXNbY3VycmVudEtleWZyYW1lXS53cmFwcGVyICE9IGN1cnJlbnRXcmFwcGVyKSB7XG4gICAgICAgICQoY3VycmVudFdyYXBwZXIpLmhpZGUoKTtcbiAgICAgICAgJChrZXlmcmFtZXNbY3VycmVudEtleWZyYW1lXS53cmFwcGVyKS5zaG93KCk7XG4gICAgICAgIGN1cnJlbnRXcmFwcGVyID0ga2V5ZnJhbWVzW2N1cnJlbnRLZXlmcmFtZV0ud3JhcHBlcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiAgSGVscGVyc1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgICBjb252ZXJ0UGVyY2VudFRvUHggPSBmdW5jdGlvbih2YWx1ZSwgYXhpcykge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZS5tYXRjaCgvJS9nKSkge1xuICAgICAgICBpZiAoYXhpcyA9PT0gJ3knKSB2YWx1ZSA9IChwYXJzZUZsb2F0KHZhbHVlKSAvIDEwMCkgKiB3aW5kb3dIZWlnaHQ7XG4gICAgICAgIGlmIChheGlzID09PSAneCcpIHZhbHVlID0gKHBhcnNlRmxvYXQodmFsdWUpIC8gMTAwKSAqIHdpbmRvd1dpZHRoO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHRocm93RXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICRib2R5LmFkZENsYXNzKCdwYWdlLWVycm9yJylcbiAgICB9XG5cbiAgICBpc1RvdWNoRGV2aWNlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IC8vIHdvcmtzIG9uIG1vc3QgYnJvd3NlcnNcbiAgICAgICAgfHwgJ29ubXNnZXN0dXJlY2hhbmdlJyBpbiB3aW5kb3c7IC8vIHdvcmtzIG9uIGllMTBcbiAgICB9XG5cbiAgICBpbml0KCk7XG5cbiAgfSlcbn0pLmNhbGwodGhpcyk7XG4iXX0=
