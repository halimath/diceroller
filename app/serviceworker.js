console.log("Service worker");

self.addEventListener("install", e => {
    console.log("Installing service worker");
    e.waitUntil(caches.open("diceroller-cache-v1")
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