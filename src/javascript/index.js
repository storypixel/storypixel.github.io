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

var scrollScalar = (document.body.scrollTop / (document.body.clientHeight - window.innerHeight)),
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




  $(window).scroll(function() {
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


  function update() {

  }

  //requestAnimationFrame(update);

}

doit();

(function() {
  $(function() {

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
        'animations': [
          {
            'selector': '.tt--left',
            'left': [0, '100%'],
            'classesToAdd': [{
              'state-1': '0%'
            }, {
              'state-2': '100%'
            }]
          },
          {
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
        'animations': [
          {
            'selector': '.tt--left2',
            'left': [0, '200%'],
            'classesToAdd': [{
              'state-1': '0%'
            }, {
              'state-2': '100%'
            }]
          },
          {
            'selector': '.tt--right2',
            'right': [0, '200%'],
            'classesToAdd': [{
              'state-1': '0%'
            }, {
              'state-2': '100%'
            }]
          }]
      }]

    /*  Construction
    -------------------------------------------------- */
    init = function() {
      scrollIntervalID = setInterval(updatePage, 10);
      setupValues();
      $window.resize(throwError)
      if (isTouchDevice) {
        $window.resize(throwError)
      }
    }

    setupValues = function() {
      scrollTop = $window.scrollTop();
      windowHeight = $window.height();
      windowWidth = $window.width();
      panelWidth = $('#sheet-east .panel')[0].offsetWidth;
      // treat a panel's width as the windowHeight for our site purposes
      windowHeight = panelWidth;
      convertAllPropsToPx();
      buildPage();
    }

    buildPage = function() {
      var i, j, k;
      for (i = 0; i < keyframes.length; i++) { // loop keyframes
        bodyHeight += keyframes[i].duration;
        if ($.inArray(keyframes[i].wrapper, wrappers) == -1) {
          wrappers.push(keyframes[i].wrapper);
        }
        for (j = 0; j < keyframes[i].animations.length; j++) { // loop animations
          Object.keys(keyframes[i].animations[j]).forEach(function(key) { // loop properties
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
    }

    convertAllPropsToPx = function() {
      var i, j, k, value, val;
      for (i = 0; i < keyframes.length; i++) { // loop keyframes
        keyframes[i].duration = convertPercentToPx(keyframes[i].duration, 'y');
        for (j = 0; j < keyframes[i].animations.length; j++) { // loop animations
          Object.keys(keyframes[i].animations[j]).forEach(function(key) { // loop properties
            value = keyframes[i].animations[j][key];
            if (key !== 'selector') {
              if (value instanceof Array) { // if its an array
                for (k = 0; k < value.length; k++) { // if value in array is %
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
                      Object.keys(value[k]).forEach(function(yek) {
                        // convert to array for performance
                        value[k] = [yek, convertPercentToPx(value[k][yek], 'y')];
                      });
                    }
                  }
                }
              } else {
                if (typeof value === "string") { // if single value is a %
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
    }

    getDefaultPropertyValue = function(property) {
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
    }

    /*  Animation/Scrolling
    -------------------------------------------------- */
    updatePage = function() {
      window.requestAnimationFrame(function() {
        setScrollTops();
        if (scrollTop >= 0 && scrollTop <= (bodyHeight - windowHeight)) {
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
    }

    setScrollTops = function() {
      scrollTop = $window.scrollTop();
      relativeScrollTop = scrollTop - prevKeyframesDurations;
    }

    animateElements = function() {
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
        }).each(function(i, target) {
          (animation.classesToAdd || []).forEach(function(el, i) {
            if (ds >= (el[1] + prevKeyframesDurations) && $(target).hasClass(el[0]) === false) {
              // console.log("we should add " + el[0] + ', ' + el[1] + '(' + prevKeyframesDurations + '). scrollTop is ' + scrollTop);
              $(target).addClass(el[0]);
            } else if (ds < (el[1] + prevKeyframesDurations) && $(target).hasClass(el[0]) === true) {
              // console.log("we should remove " + el[0] + ', ' + el[1] + '(' + prevKeyframesDurations + '). scrollTop is ' + scrollTop);
              $(target).removeClass(el[0]);
            }
          })
        });
      }
    }

    calcPropValue = function(animation, property) {
      var value = animation[property];
      if (value && property !== 'left' && property !== 'right') {
        value = easeInOutQuad(relativeScrollTop, value[0], (value[1] - value[0]), keyframes[currentKeyframe].duration);
      } else if (!value) {
        value = getDefaultPropertyValue(property);
      } else {

        //value = easeInOutQuad(relativeScrollTop, value[0], (value[1] - value[0]), keyframes[currentKeyframe].duration);
        value =  lerp(value[0] || animation[property].lastValue || 0, relativeScrollTop, lerpRate);
        animation[property].lastValue = value;
        //value = relativeScrollTop; // easeLinear(relativeScrollTop, value[0], (value[1] - value[0]), keyframes[currentKeyframe].duration);

        // console.log('min is '+value[0] + ' and max is '+value[1]);
        // value = Math.max(value[0], Math.min(relativeScrollTop, value[1]));
      }
      // value = +value.toFixed(2)
      // TEMPORARILY REMOVED CAUSE SCALE DOESN'T WORK WITHA AGRESSIVE ROUNDING LIKE THIS
      return value;
    }

    easeInOutQuad = function(t, b, c, d) {
      //sinusoadial in and out
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };

    // easeLinear = function (t, b, c, d) {
    //   return c * t / d + b;
    // }

    neatenLastKeyframe = function (d) {
      var animation, translateY, translateX, scale, rotate, opacity, left, right, anilength, index;

      index = (d > 0) ? 1 : 0;

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
    }

    setKeyframe = function() {
      if (scrollTop > (keyframes[currentKeyframe].duration + prevKeyframesDurations)) {
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
    }

    showCurrentWrappers = function() {
      var i;
      if (keyframes[currentKeyframe].wrapper != currentWrapper) {
        $(currentWrapper).hide();
        $(keyframes[currentKeyframe].wrapper).show();
        currentWrapper = keyframes[currentKeyframe].wrapper;
      }
    }

    /*  Helpers
    -------------------------------------------------- */

    convertPercentToPx = function(value, axis) {
      if (typeof value === "string" && value.match(/%/g)) {
        if (axis === 'y') value = (parseFloat(value) / 100) * panelWidth; //windowHeight;
        if (axis === 'x') value = (parseFloat(value) / 100) * windowWidth;
      }
      return value;
    }

    throwError = function() {
      $body.addClass('page-error')
    }

    isTouchDevice = function() {
      return 'ontouchstart' in window // works on most browsers
        || 'onmsgesturechange' in window; // works on ie10
    }

    window.location = "#"; // to top
    init();

  })
}).call(this);
