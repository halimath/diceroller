console.log("Service worker");

const CacheVersion = 8;
const CacheName = `diceroller-cache-v${CacheVersion}`;

self.addEventListener("install", e => {
    console.log("Installing service worker");
    e.waitUntil(caches.open(CacheName)
        .then(cache => {        
            return cache.addAll([
                "/index.html",
                "/manifest.json",
                "/img/icon.png",
                "/img/icon-small.png",
                "/serviceworker.js",
                "/diceroller.js",
                "/messages/default.json",
                "/messages/de.json",
            ]);
        })
    );
  });