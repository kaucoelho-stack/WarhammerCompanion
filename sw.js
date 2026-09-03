const CACHE = 'auspex-v20-official-volkus';
// Caminhos RELATIVOS: funcionam em subpasta (GitHub Pages de projeto) e na raiz.
const ASSETS = [
  './','./index.html','./manifest.json','./killteam_data.js',
  './auspex-test-team/','./auspex-test-team/index.html','./auspex-test-team/auspex-rules.js',
  './auspex-test-team/volkus-3d/volkus-webgl.js',
  './auspex-test-team/vendor/three-r128/three.min.js',
  './auspex-test-team/vendor/three-r128/GLTFLoader.js',
  './auspex-test-team/vendor/three-r128/RGBELoader.js'
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
