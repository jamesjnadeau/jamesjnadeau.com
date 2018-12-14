var toolbox = require('sw-toolbox');

var version = env.version;


// resources required for offline access.
var offlineResources = [
  "/", // home page
  "/offline",
  "/files/bulb.jpg",
  "/files/tree_line.jpg",
  "/assets/styles/brickwall.png",
  "/files/me.jpg",
  "/styles.css?v=" + version,
  "/frontend.js?v=" + version,
];

// Turn on debug logging, visible in the Developer Tools' console.
toolbox.options.debug = true;

// cache during the service worker install step
toolbox.precache(offlineResources);

// offline block - from https://github.com/GoogleChromeLabs/sw-toolbox/issues/80#issuecomment-171772793
toolbox.router.get('/(.*)', function(request, values, options) {
  // networkFirst will attempt to return a response from the network,
  // then attempt to return a response from the cache.
  return toolbox.networkFirst(request, values, options).catch(function(error) {
    // If both the network and the cache fail, then `.catch()` will be triggered,
    // and we get a chance to respond with our cached fallback page.
    // This would ideally check event.request.mode === 'navigate', but that isn't supported in
    // Chrome as of M48. See https://fetch.spec.whatwg.org/#concept-request-mode
    if (request.method === 'GET' && request.headers.get('accept').includes('text/html')) {
      return toolbox.cacheOnly(new Request('/offline'), values, options);
    }
    throw error;
  });
});

// By default, all requests that don't match our custom handler will use the
// toolbox.networkFirst cache strategy, and their responses will be stored in
// the default cache.
toolbox.router.default = toolbox.networkFirst;

// Boilerplate to ensure our service worker takes control of the page as soon
// as possible.
self.addEventListener('install', function(event) {
  return event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function(event) {
  return event.waitUntil(self.clients.claim());
});
