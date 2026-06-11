// Attanal Al Arabic — service worker (network-first, auto-update)
const CACHE = "attanal-v2";

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Tarmoqdan-avval: doim yangisini olishga harakat qiladi,
  // internet bo'lmasa keshdan beradi.
  e.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      try { const c = await caches.open(CACHE); c.put(req, fresh.clone()); } catch (_) {}
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);
      return cached || Response.error();
    }
  })());
});
