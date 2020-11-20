console.log("Service worker");

const CacheVersion = 2;
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
                "/pkg/diceroller_app.js",
                "/pkg/diceroller_app_bg.wasm",
                "/serviceworker.js",
            ]);
        })
    );
  });