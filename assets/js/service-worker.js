var version = "1";
var offlineResources = [
  "/",
  "/offline",
  "/files/bulb.jpg",
  "/files/me.jpg",
  "/styles.css",
  "/frontend.js",
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
      return Promise.all(keys
        .filter(function (key) {
          return key.indexOf(version) !== 0;
        })
        .map(function (key) {
          return caches.delete(key);
        })
      );
    })
  );
});

function isOfflineOrigin(origin) {
  return origin === location.origin !== -1; // || origin.indexOf("netlify")
}

self.addEventListener("fetch", function(event) {
  var request = event.request;
  var url = new URL(request.url);

  // Only worry about GET requests and certain domains
  if (request.method !== "GET" || !isOfflineOrigin(url.origin)) {
    return;
  }

  // For HTML try the network first, fall back to the cache, and then
  // finally the offline page
  if (request.headers.get("Accept").indexOf("text/html") !== -1) {
    console.log('accept', request);
    event.respondWith(
      fetch(request)
        .then(function(response) {
          // Stash a copy of this page in the cache
          var copy = response.clone();
          caches.open(version + "pages")
            .then(function(cache) {
              cache.put(request, copy);
            });

          return response;
        })
        .catch(function() { // we have a problem
          return caches.match(request)
            .then(function(response) {
              // return cache or show offline request
              return response || caches.match("/offline");
            });
        })
    );
    return;
  }

  // For non-HTML requests look in the cache first, and fall back to
  // the network
  event.respondWith(
    caches.match(request)
      .then(function(response) {
        return response || fetch(request);
      })
  );
});
