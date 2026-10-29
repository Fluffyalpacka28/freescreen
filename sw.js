const C='freescreen-v1';
const LIBS=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.allSettled(['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png',...LIBS].map(u=>c.add(u)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
    if(r&&r.ok&&(e.request.url.startsWith(self.location.origin)||LIBS.includes(e.request.url)))caches.open(C).then(c=>c.put(e.request,r.clone()));
    return r;})));
});
