const CACHE = 'scales-v15';
const ASSETS = ['./', './index.html', './manifest.webmanifest',
                './apple-touch-icon.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const isPage = e.request.mode === 'navigate' ||
    new URL(e.request.url).pathname.endsWith('/index.html');
  if (isPage){
    // network-first: always show the newest app when online, cache only as offline fallback
    e.respondWith(
      fetch(e.request).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put('./index.html', copy));
        return r;
      }).catch(() => caches.match('./index.html'))
    );
  } else {
    e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request)));
  }
});
