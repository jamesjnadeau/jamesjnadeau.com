var animateEnd = require('./animateEnd');

// Google Analytics
/* global ga */
/* eslint-disable */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-44855715-1', 'auto');
ga('send', 'pageview');
/* eslint-enable */
var ga_track_page = function() {
  var hash = location.hash;
  try {
    if (hash) {
      ga('send', '_trackPageview', hash.substr(1));
    } else {
      ga('send', '_trackPageview', location.pathname);
    }
  } catch (err) {
    console.log('unable to track page', err);
  }
};
//hide the header on scroll
var init_headroom = function() {
  // grab an element
  var myElement = document.querySelector("#header");

  // global Headroom
  // construct an instance of Headroom, passing the element
  var headroom = new Headroom(myElement); // eslint-disable-line
  // initialise
  headroom.init();
};
init_headroom();

//this does the page transitions/animations
$(document).ready(function() {
  'use strict';
  var animations = ['rubberBand', 'bounce', 'tada', 'shake', 'flash', 'pulse',
    'shake', 'swing', 'wobble'];
  var animation_delay = 42;
  var get_animation = function() {
    return animations[Math.floor(Math.random() * animations.length)];
  };
  var highlight_headers = function() {
    var headers = $('h1:not(.no-animation)');
    headers.textillate({
      initialDelay: 9000,
      loop: true,
      minDisplayTime: 7000,
      in: {
        effect: get_animation,
        delay: animation_delay,
      },
      out: {
        effect: get_animation,
        reverse: true,
        delay: animation_delay,
      },
    });
    /*headers.hover(function() { //in
      headers.textillate('start');
      }, function() { //out
      });*/
    headers.click(function() {
      headers.textillate('stop');
      headers.off('mouseenter mouseleave');
    });
  };
  highlight_headers();

  var clearAnimation = function(target) {
    target.classList.remove('observe-animated');
    // clear animation
    target.style.animation = 'none';
    // Trigger a reflow causing the animation to kick off
    void target.offsetHeight;
    // set up animation to be ready to run 'again'
    target.style.animation = null;
    // trigger animation
    target.classList.add('animated');
  };

  var $body = $('html, body');
  var $loading = $('#loading');
  var loading_timer;
  var inAnimationClass = 'fadeInRight';
  var outAnimationClass = 'fadeOutLeft';
  var animating = false;
  $('#wrap').smoothState({
    // Runs when a link has been activated
    development: true,
    onStart: function() { // url, $container
      var temp = $('.container.animated.' + inAnimationClass);
      temp.removeClass(inAnimationClass).addClass(outAnimationClass);
      var el = temp.get(0);
      animating = true;
      animateEnd(el, function() {
        animating = false;
        // Scroll user to the top
        $body.animate({ scrollTop: 0 });
        console.log('animation done');
      });
      clearAnimation(el);
    },
    onProgress: function (url, $container) {
      $body.css('cursor', 'wait');
      $body.find('a').css('cursor', 'wait');
      $container.hide();
      loading_timer = setTimeout(function() {
        $loading.fadeIn();
      }, 1000);
    },
    onEnd: function (url, $container, $content) {
      if (loading_timer) {
        clearTimeout(loading_timer);
      }
      $loading.hide();
      $body.css('cursor', 'auto');
      $body.find('a').css('cursor', 'auto');
      $content.removeClass('csspinner helicopter');
      var onAnimationEnd = function() {
        if (animating) {
          setTimeout(onAnimationEnd, 100);
        } else {
          $container.html($content);
          init_headroom();
          highlight_headers();
          ga_track_page();
        }
      };
      onAnimationEnd();
    },
    pageCacheSize: 0,
    prefetch: false,
  }).data('smoothState');
});
