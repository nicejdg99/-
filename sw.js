// fuego service worker — v2
// HTML(페이지): 항상 최신 우선(network-first) → 업데이트 즉시 반영, 오프라인 시 캐시 사용
// 정적 에셋(이미지·아이콘 등): 캐시 우선(빠른 로딩) + 백그라운드 갱신
const CACHE='fuego-v5';
const ASSETS=['./','./index.html','./tools.html','./guides.html','./about.html','./carousel.html','./jpg-to-pdf.html','./pdf-editor.html','./image-convert.html','./pdf-compress.html','./image-compress.html','./guide-conference-slide.html','./privacy.html','./terms.html','./favicon.png','./icon-192.png','./icon-512.png','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()).catch(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const req=e.request;
  const isHTML = req.mode==='navigate' || (req.headers.get('accept')||'').includes('text/html');
  if(isHTML){
    // network-first
    e.respondWith(
      fetch(req).then(resp=>{
        if(resp&&resp.status===200){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});}
        return resp;
      }).catch(()=>caches.match(req).then(c=>c||caches.match('./index.html')))
    );
  } else {
    // cache-first + background update (stale-while-revalidate)
    e.respondWith(
      caches.match(req).then(cached=>{
        const net=fetch(req).then(resp=>{
          if(resp&&resp.status===200){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});}
          return resp;
        }).catch(()=>cached);
        return cached||net;
      })
    );
  }
});
