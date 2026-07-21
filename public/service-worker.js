// Bump this alongside APP_VERSION on every release — it's what forces
// browsers to notice service-worker.js changed and actually run
// install/activate again. Without a byte-level change here, a cache-first
// fetch handler (see below) would keep serving whatever JS was cached on
// a user's first visit indefinitely, even after new code is deployed.
const CACHE_NAME = 'fieldpro-v1.4.4';
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './app1.js',
  './app2.js',
  './app3.js',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // Skip API calls — never cache those
  if (url.hostname.includes('openai') || url.hostname.includes('workers.dev') || url.hostname.includes('cloudflare')) return;

  // Stale-while-revalidate: serve the cached copy immediately if we have
  // one (fast, works offline), but always refresh it in the background so
  // the *next* load gets fresh content — a pure cache-first strategy here
  // would mean a deployed fix never reaches a user who already has this
  // exact file cached, since nothing would ever re-check the network.
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request).then((response) => {
          if (response && response.status === 200 && response.type !== 'opaque') {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => null);

        if (cached) {
          event.waitUntil(networkFetch);
          return cached;
        }
        return networkFetch.then((response) => response || caches.match('./index.html'));
      })
    )
  );
});
