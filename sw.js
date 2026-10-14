// board: si apre subito dalla copia salvata e intanto scarica quella nuova.
// Una modifica a index.html arriva da sola all'apertura successiva.
const CACHE = 'board-4';
const FILE = ['./', 'board.js', 'manifest.webmanifest', 'board-180.png', 'board-192.png', 'board-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILE.map(f => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const chiave = r.mode === 'navigate' ? './' : r;
  const rete = caches.open(CACHE).then(c =>
    fetch(r.url, { cache: 'no-cache' }).then(x => { if (x.ok) c.put(chiave, x.clone()); return x; }));
  e.respondWith(caches.match(chiave, { ignoreSearch: true })
    .then(salvata => salvata || rete)
    .catch(() => Response.error()));
  e.waitUntil(rete.catch(() => {}));
});
