const CACHE = 'cobros-limpio-v1';
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
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request).catch(()=>caches.match('./index.html'))));
});
