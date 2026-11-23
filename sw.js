const CACHE_NAME = 'cbt-pro-shell-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Cache only this app's own shell. The CBT content is served by Google Apps Script
  // and needs an internet connection.
  if (url.origin === self.location.origin && event.request.method === 'GET') {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
  }
});
