// Import Workbox from CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.0/workbox-sw.js');

// Listen for 'SKIP_WAITING' messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Precache assets and handle routing
workbox.precaching.precacheAndRoute([
  { url: 'build/favicon.ico', revision: 'c92b85a5b907c70211f4ec25e29a8c4a' },
  { url: 'build/index.html', revision: '32c23cd05bf73054227864bd40870891' },
  { url: 'build/logo192.png', revision: '33dbdd0177549353eeeb785d02c294af' },
  { url: 'build/logo512.png', revision: '917515db74ea8d1aee6a246cfbcc0b45' },
  { url: 'build/manifest.json', revision: 'd9d975cebe2ec20b6c652e1e4c12ccf0' },
  { url: 'build/media/instructions.png', revision: 'b9020ec9fad0495aa8c43f29172ed51f' },
  { url: 'build/media/peter-engineers-logo.png', revision: '0b8ce5c8c929b4c90f6b0aee3505083e' },
  { url: 'build/static/css/main.eb119de5.css', revision: '35d92e831b3597ffe79f10b92f4c8686' },
  { url: 'build/static/js/main.2244ed91.js', revision: '2fa211c62ffc92e70ac5a6c68d5d3741' },
]);

// Ignore URL parameters like `utm_` and `fbclid`
workbox.routing.registerRoute(
  ({ url }) => url.origin === self.location.origin,
  new workbox.strategies.NetworkFirst({
    cacheName: 'dynamic-resources',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
      }),
    ],
  })
);
