// board: si apre subito dalla copia salvata e intanto scarica quella nuova.
// Se index.html, board.js o il manifest scaricati sono diversi da quelli salvati, avvisa la pagina:
// la novità si vede con un tocco, senza aspettare l'apertura successiva.
const CACHE = 'board-5';
const FILE = ['./', 'board.js', 'manifest.webmanifest', 'board-180.png', 'board-192.png', 'board-512.png'];
const CONTROLLA = ['./', 'board.js', 'manifest.webmanifest'];
const NOVITA = 'novita';   // segno salvato in cache: la copia salvata è più nuova della pagina aperta
const indirizzo = f => new URL(f, location).href;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILE.map(f => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

// Con un nuovo nome di cache confronta i file appena scaricati con quelli della cache precedente
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => {
    const vecchie = k.filter(n => n !== CACHE);
    return caches.open(CACHE)
      .then(c => Promise.all(CONTROLLA.map(f => Promise.all([
        c.match(f),
        vecchie.reduce((p, n) => p.then(r => r || caches.open(n).then(v => v.match(f))), Promise.resolve())
      ]).then(([nuova, prima]) => diversi(prima, nuova)))).then(d => d.includes(true) && avvisa(c)))
      .then(() => Promise.all(vecchie.map(n => caches.delete(n))));
  }).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const nav = r.mode === 'navigate';
  const chiave = nav ? './' : r;
  const conta = nav || CONTROLLA.map(indirizzo).includes(r.url.split('?')[0]);
  // una pagina appena aperta prende la copia salvata, che è già la più nuova: il segno non serve più
  const pulita = caches.open(CACHE).then(c => nav ? c.delete(NOVITA).then(() => c) : c);
  const rete = fetch(r.url, { cache: 'no-cache' });
  const salva = Promise.all([pulita, rete.then(x => x.ok ? x.clone() : null)]).then(([c, x]) => x &&
    c.match(chiave, { ignoreSearch: true }).then(prima => {
      const confronto = conta && prima ? diversi(prima, x.clone()) : false;
      return c.put(chiave, x).then(() => confronto).then(d => d && avvisa(c));
    }));
  e.respondWith(caches.match(chiave, { ignoreSearch: true })
    .then(salvata => salvata || rete)
    .catch(() => Response.error()));
  e.waitUntil(salva.catch(() => {}));
});

function diversi(prima, nuova) {
  if (!prima || !nuova) return Promise.resolve(false);
  return Promise.all([prima.text(), nuova.text()]).then(([a, b]) => a !== b);
}

function avvisa(c) {
  return c.put(NOVITA, new Response('1'))
    .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
    .then(l => l.forEach(w => w.postMessage('board-novita')));
}
