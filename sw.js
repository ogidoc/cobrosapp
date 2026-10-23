const CACHE = 'cobros-limpio-v3';
const FILES = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES).catch(()=>{})).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', e=>{
  e.waitUntil((async()=>{
    const keys = await caches.keys();
    for(const k of keys){ if(k!==CACHE) await caches.delete(k); }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  const isAppDocument = e.request.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/styles.css');
  if(isAppDocument){
    e.respondWith(fetch(e.request).then(response=>{
      if(response && response.ok){
        const copy = response.clone();
        caches.open(CACHE).then(cache=>cache.put(e.request, copy));
      }
      return response;
    }).catch(()=>caches.match(e.request).then(cached=>cached || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request).catch(()=>caches.match('./index.html'))));
});
