// Originally from: https://davidwalsh.name/css-animation-callback

/* From Modernizr */
function whichanimationEvent() {
  var t;
  var el = document.createElement('fakeelement');
  var animations = {
    animation: 'animationend',
    Oanimation: 'oanimationEnd',
    Mozanimation: 'animationend',
    Webkitanimation: 'webkitanimationEnd',
  };

  for (t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
}

/* Listen for a animation! */
module.exports = function(e, callback) {
  var animationEvent = whichanimationEvent();
  if (animationEvent) {
    e.addEventListener(animationEvent, callback);
  }
};
