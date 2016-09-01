var version = env.version;

// resources required for offline access.
var offlineResources = [
  "/", // home page
  "/offline",
  "/files/bulb.jpg",
  "/files/tree_line.jpg",
  "/assets/styles/brickwall.png",
  "/files/me.jpg",
  "/styles.css?v=" + env.version,
  "/frontend.js?v=" + env.version,
  "/service-worker.js",
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches
      .open(version + "static")
      .then(function(cache) {
        cache.addAll(offlineResources);
      })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      console.log('killing all cache upon activation');
      return Promise.all(keys
        .filter(function (key) {
          return key.indexOf('static') === -1;
        })
        // kill all the cache that's not static activating a new service worker
        .map(function (key) {
          return caches.delete(key);
        })
      );
    })
  );
});

function isOfflineOrigin(origin) {
  return origin === location.origin
    || origin === 'netdna.bootstrapcdn.com'
    || origin === 'fonts.googleapis.com';
}

self.addEventListener("fetch", function(event) {
  var request = event.request;
  var url = new URL(request.url);

  // Only worry about GET requests and certain domains
  if (request.method !== "GET" || !isOfflineOrigin(url.origin)) {
    return;
  }

  // look in the cache first, and fall back to the network
  event.respondWith(
    caches.match(request)
      .then(function(response) {
        return response || fetch(request).then(function(response) {
          var copy = response.clone();
          caches.open("swCache")
            .then(function(cache) {
              console.log('caching', request.url);
              cache.put(request, copy);
            });
        });
      }).catch(function() {
        return caches.match("/offline");
      })
  );
});
