const CACHE_NAME = "maxiel-web-v2"
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./api.js",
  "./developer.jpg",
  "./icon-192.png",
  "./icon-512.png",
  "./manifest.json"
]

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached

      return fetch(event.request).then(response => {
        const copy = response.clone()

        caches.open(CACHE_NAME).then(cache => {
          if (
            response.ok &&
            new URL(event.request.url).origin === location.origin
          ) {
            cache.put(event.request, copy)
          }
        })

        return response
      }).catch(() => caches.match("./index.html"))
    })
  )
})
