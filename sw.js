/* Offline support for the Dry Season Route Planner.
   Pages: network first (so updates arrive), falling back to the saved copy when offline.
   Everything else: saved copy first. A new deploy changes VERSION, which refreshes the saved copy. */
const VERSION = "aeefabb078";
const CACHE = "dsrp-" + VERSION;
const ASSETS = [
  "./",
  "index.html",
  "geo.js?v=8c798eafef",
  "app.js?v=1f6196b8a0",
  "vendor/d3.min.js",
  "fonts.css",
  "fonts/Archivo-400-900-latin-ext.woff2",
  "fonts/Archivo-400-900-latin.woff2",
  "fonts/AtkinsonHyperlegibleMono-400-latin-ext.woff2",
  "fonts/AtkinsonHyperlegibleMono-400-latin.woff2",
  "fonts/AtkinsonHyperlegibleNext-400-latin-ext.woff2",
  "fonts/AtkinsonHyperlegibleNext-400-latin.woff2",
  "hero.webp",
  "manifest.webmanifest",
  "icons/favicon-48.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("dsrp-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
const timeout = (ms, p) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const res = await timeout(4000, fetch(req));
        if (res.ok) { const c = await caches.open(CACHE); c.put("./", res.clone()); }
        return res;
      } catch (err) {
        return (await caches.match("./")) || (await caches.match("index.html")) || Response.error();
      }
    })());
    return;
  }
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok) { const c = await caches.open(CACHE); c.put(req, res.clone()); }
    return res;
  })());
});
