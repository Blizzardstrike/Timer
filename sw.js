

const CACHE_NAME = 'analog-timer-cache-v2';
// Use relative paths for assets and only cache core, local files.
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

// On install, cache the core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache and caching core assets');
      return cache.addAll(CORE_ASSETS).catch(err => {
        console.error("Failed to cache core assets:", err);
      });
    })
  );
  self.skipWaiting();
});

// On activate, clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});


// On fetch, use a cache-first strategy.
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If the request is in the cache, return it.
      if (cachedResponse) {
        return cachedResponse;
      }

      // If it's not in the cache, fetch it from the network.
      return fetch(event.request).then((networkResponse) => {
        // We don't cache responses here to avoid issues with opaque (CORS) responses from CDNs
        return networkResponse;
      }).catch(err => {
        console.error("Fetch failed:", err);
        // Potentially return a fallback offline page here if needed
      });
    })
  );
});