// Self-destructing service worker — clears all caches and unregisters
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll()).then(clients => {
        clients.forEach(c => c.postMessage({ type: 'SW_RESET' }))
      })
  )
})
// Pass everything through to network — no caching at all
self.addEventListener('fetch', () => {})
