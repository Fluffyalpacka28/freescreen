const C='freescreen-v4';
const LIBS=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.allSettled(['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png',...LIBS].map(u=>c.add(u)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const same=e.request.url.startsWith(self.location.origin);
  if(same){ // pages: network first so updates show, cache as offline fallback
    e.respondWith(fetch(e.request).then(r=>{if(r&&r.ok){const x=r.clone();caches.open(C).then(c=>c.put(e.request,x));}return r;}).catch(()=>caches.match(e.request)));
  }else if(LIBS.includes(e.request.url)){ // libraries: cache first
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const x=r.clone();caches.open(C).then(c=>c.put(e.request,x));return r;})));
  }
});
