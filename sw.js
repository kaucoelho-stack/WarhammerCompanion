const CACHE = 'auspex-v40-kommandos-ux-parapets';
// Caminhos RELATIVOS: funcionam em subpasta (GitHub Pages de projeto) e na raiz.
const ASSETS = [
  './','./index.html','./manifest.json','./killteam_data.js',
  './auspex-test-team/','./auspex-test-team/index.html','./auspex-test-team/auspex-rules.js',
  './auspex-test-team/killteam_data.js',
  './auspex-test-team/battlefield.js',
  './auspex-test-team/terrain-painter.js',
  './auspex-test-team/movement-visual.js',
  './auspex-test-team/modular-floor.png',
  './auspex-test-team/pixel-tactics.js',
  './auspex-test-team/pixel-tactics.js?v=kommandos-2',
  './auspex-test-team/assets/pixel/kommando-sheets.js?v=kommandos-2',
  './auspex-test-team/assets/pixel/eliminator-sheet.js',
  './auspex-test-team/assets/pixel/captain-sheet.js',
  './auspex-test-team/assets/pixel/aod-sheets.js',
  './auspex-test-team/assets/pixel/terminal-sheet.js',
  './auspex-test-team/assets/pixel/industrial-materials-v1.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll falha tudo se um arquivo faltar; assim cada um é independente
      .then(c => Promise.all(ASSETS.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // Só interceptamos GET do próprio site
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  const large3D = /\.glb(?:$|\?)/i.test(req.url);
  e.respondWith(
    fetch(req, { cache: large3D ? 'default' : 'no-store' })
      .then(r => {
        // Evita duplicar o GLB grande na memória durante o primeiro acesso móvel.
        // O próprio cache HTTP do navegador continua disponível para esse arquivo.
        if (r && r.ok && !large3D) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return r;
      })
      .catch(() =>
        caches.match(req).then(hit => {
          if (hit) return hit;
          // Offline abrindo o app: cai no index.html em cache
          if (req.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        })
      )
  );
});
