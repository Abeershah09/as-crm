/* AS CRM V2.5 — PWA assets, offline fallback, network-first updates. */
const CACHE = 'as-crm-v2-5-pwa';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './app-icon-192.png',
  './app-icon-512.png',
  './as-tech-agency-logo.png',
  './as-crm-cloud-sync.js',
  './pwa-install.js'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => 
        (key.startsWith('as-crm-') || key.startsWith('as-crm-free-')) && key !== CACHE
      ).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(self.registration.scope.replace(self.location.origin, ''))) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const fresh = await fetch(req);
      if (fresh.ok) event.waitUntil(cache.put(req, fresh.clone()));
      return fresh;
    } catch (err) {
      const cached = await cache.match(req);
      if (cached) return cached;
      if (req.mode === 'navigate') {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
      }
      return Response.error();
    }
  })());
});
