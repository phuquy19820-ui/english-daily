const CACHE = 'english-daily-v39';
const FILES = ['./', 'index.html', 'style.css', 'data.js', 'data2.js', 'data3.js', 'data4.js', 'data5.js', 'data6.js', 'data7.js', 'data8.js', 'data9.js', 'data10.js', 'data11.js', 'data12.js', 'data13.js', 'data14.js', 'data15.js', 'data16.js', 'data17.js', 'data18.js', 'data19.js', 'data20.js', 'data21.js', 'data22.js', 'data23.js', 'data24.js', 'data25.js', 'data26.js', 'data27.js', 'data28.js', 'app.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// network-first cho file của app (luôn nhận bản mới khi online), rơi về cache khi offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('index.html'))));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type: 'window', includeUncontrolled: true}).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    return clients.openWindow('./');
  }));
});
