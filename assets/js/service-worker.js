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

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches
      .open("static")
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
          // if there's not 'static' in the key, it's something we should delete
          return key.indexOf('static') === -1;
        })
        .map(function (key) {
          return caches.delete(key);
        })
      );
    })
  );
});

function isOfflineOrigin(origin) {
  return origin === location.origin;
}

self.addEventListener("fetch", function(event) {
  console.log('fetching');
  var request = event.request;
  var url = new URL(request.url);

  // throw out anything but get requests and domains we allow.
  if (request.method !== "GET" || !isOfflineOrigin(url.origin)) {
    return;
  }

  // look in the cache first, and fall back to the network
  event.respondWith(
    caches.match(request)
      .then(function(response) {
        console.log('responding with cache', !!response);
        return response || fetch(request).then(function(fetchResponse) {
          // we have a successful request at this point, cache it?
          var copy = fetchResponse.clone();
          console.log('fetchResponse', copy.clone());
          caches.open("swCache")
            .then(function(cache) {
              console.log('caching', request.url);
              cache.put(request, copy);
            });
          return fetchResponse;
        });
      }).catch(function() {
        return caches.match("/offline");
      })
  );
});
