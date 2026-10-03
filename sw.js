// A minimal Service Worker required for PWA installation functionality
const CACHE_NAME = 'webdrop-cache-v1';

self.addEventListener('install', (event) => {
// Skip waiting ensures the new service worker takes over immediately
self.skipWaiting();
});

self.addEventListener('activate', (event) => {
// Claiming clients allows the service worker to control the page immediately
event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
// This allows the app to function if momentarily offline,
// though WebRTC signaling requires an initial connection.
event.respondWith(
fetch(event.request).catch(() => caches.match(event.request))
);
});
