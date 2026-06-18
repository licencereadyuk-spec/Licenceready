// LicenceReady Service Worker
const CACHE_NAME = 'licenceready-v1';

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function(event) {
  // Network first, fall back to cache if offline
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
