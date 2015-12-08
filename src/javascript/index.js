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

  var scrollScalar = (document.body.scrollTop / (document.body.clientHeight - window.innerHeight)),
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

  $(window).scroll(function() {
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
    $.data(this, 'scrollTimer', setTimeout(function() {
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
          'scale': 2,
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
          'scale': 1.2,
        }, {
          'selector': '.dei-4',
          'translateY': '-17%',
          'translateX': '8%',
          'opacity': [1, 0], // hack to accelrate opacity speed
          'scale': 1.5,
        }, {
          'selector': '.dei-5',
          'translateY': '-2%',
          'translateX': '-15%',
          'opacity': [1, 0],
          'scale': 2,
        }, {
          'selector': '.dei-6',
          'translateY': '-1%',
          'translateX': '-7%',
          'opacity': [1, 0], // hack to decelrate opacity speed
          'scale': 1.2,
        }, {
          'selector': '.dei-7',
          'translateY': '-4%',
          'translateX': '2%',
          'opacity': [1, 0], // hack to accelrate opacity speed
          'scale': 1.1,
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
          'scale': 1.8,
        }, {
          'selector': '.dei-9',
          'translateY': '3%',
          'translateX': '-12%',
          'opacity': [1, 0],
          'scale': 1.5,
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
          'scale': 1.4,
        }, {
          'selector': '.dei-12',
          'translateY': '1%',
          'translateX': '20%',
          'opacity': [1, 0], // hack to accelrate opacity speed
          'scale': 1.9,
        }, {
          'selector': '.dei-13',
          'translateY': '8%',
          'translateX': '-12%',
          'opacity': [1, 0],
          'scale': 1.8,
        }, {
          'selector': '.dei-14',
          'translateY': '4%',
          'translateX': '-3%',
          'opacity': [1, 0], // hack to decelrate opacity speed
          'scale': 1.3,
        }, {
          'selector': '.dei-15',
          'translateY': '14%',
          'translateX': '5%',
          'opacity': [1, 0], // hack to accelrate opacity speed
          'scale': 1.7,
        }, {
          'selector': '.dei-16',
          'translateY': '6%',
          'translateX': '9%',
          'opacity': [1, 0], // hack to accelrate opacity speed
          'scale': 2,
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
      $window.scroll(0);
      currentWrapper = wrappers[0];
      $(currentWrapper).show();
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
                    } else {
                      value[k] = convertPercentToPx(value[k], 'x');
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
        default:
          return null;
      }
    }

    /*  Animation/Scrolling
    -------------------------------------------------- */
    updatePage = function() {
      window.requestAnimationFrame(function() {
        setScrollTops();
        if (scrollTop > 0 && scrollTop <= (bodyHeight - windowHeight)) {
          animateElements();
          setKeyframe();
        }
      });
    }

    setScrollTops = function() {
      scrollTop = $window.scrollTop();
      relativeScrollTop = scrollTop - prevKeyframesDurations;
    }

    animateElements = function() {
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
        }).each(function(i, target) {
          (animation.classesToAdd || []).forEach(function(el, i) {
            // if (el[1])
            // console.log('...');
            // console.log(el[1]);

            if (scrollTop >= (el[1] + prevKeyframesDurations) && $(target).hasClass(el[0]) === false) {
              console.log("we should add " + el[0]);
              $(target).addClass(el[0]);
            } else if (scrollTop < (el[1] + prevKeyframesDurations) && $(target).hasClass(el[0]) === true) {
              console.log("we should remove " + el[0]);
              $(target).removeClass(el[0]);
            }

          })



        });

      }
    }

    calcPropValue = function(animation, property) {
      var value = animation[property];
      if (value) {
        value = easeInOutQuad(relativeScrollTop, value[0], (value[1] - value[0]), keyframes[currentKeyframe].duration);
      } else {
        value = getDefaultPropertyValue(property);
      }
      // value = +value.toFixed(2)
      // TEMPORARILY REMOVED CAUSE SCALE DOESN'T WORK WITHA AGRESSIVE ROUNDING LIKE THIS
      return value;
    }

    easeInOutQuad = function(t, b, c, d) {
      //sinusoadial in and out
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };

    setKeyframe = function() {
      if (scrollTop > (keyframes[currentKeyframe].duration + prevKeyframesDurations)) {
        prevKeyframesDurations += keyframes[currentKeyframe].duration;
        currentKeyframe++;
        showCurrentWrappers();
      } else if (scrollTop < prevKeyframesDurations) {
        currentKeyframe--;
        prevKeyframesDurations -= keyframes[currentKeyframe].duration;
        showCurrentWrappers();
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
        if (axis === 'y') value = (parseFloat(value) / 100) * windowHeight;
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

    init();

  })
}).call(this);
