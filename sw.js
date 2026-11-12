const V = "kunye-v4";
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then((c) => c.addAll(["./", "./index.html", "./icon.svg", "./manifest.webmanifest"])).catch(() => {}));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== V).map((x) => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin && !u.hostname.endsWith("jsdelivr.net")) return;
  e.respondWith(
    fetch(r).then((res) => {
      if (res && (res.ok || res.type === "opaque")) {
        const kopya = res.clone();
        caches.open(V).then((c) => c.put(r, kopya));
      }
      return res;
    }).catch(() => caches.match(r).then((m) => m || caches.match("./index.html")))
  );
});
