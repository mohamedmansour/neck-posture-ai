let CACHE_NAME = 'posture-cache-v1';
let urlsToCache = [
  'index.html',
  'js/app.js',
  'model/group1-shard1of25.bin',
  'model/group1-shard2of25.bin',
  'model/group1-shard3of25.bin',
  'model/group1-shard4of25.bin',
  'model/group1-shard5of25.bin',
  'model/group1-shard6of25.bin',
  'model/group1-shard7of25.bin',
  'model/group1-shard8of25.bin',
  'model/group1-shard9of25.bin',
  'model/group1-shard10of25.bin',
  'model/group1-shard11of25.bin',
  'model/group1-shard12of25.bin',
  'model/group1-shard13of25.bin',
  'model/group1-shard14of25.bin',
  'model/group1-shard15of25.bin',
  'model/group1-shard16of25.bin',
  'model/group1-shard17of25.bin',
  'model/group1-shard18of25.bin',
  'model/group1-shard19of25.bin',
  'model/group1-shard20of25.bin',
  'model/group1-shard21of25.bin',
  'model/group1-shard22of25.bin',
  'model/group1-shard23of25.bin',
  'model/group1-shard24of25.bin',
  'model/group1-shard25of25.bin',
  'model/model.json',
  'model/signature.json',
  'styles/app.css'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {

  var cacheAllowlist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});