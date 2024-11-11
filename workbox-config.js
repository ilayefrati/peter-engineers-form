module.exports = {
    globDirectory: 'build/',
    globPatterns: [
      '**/*.{html,js,css,png,jpg,jpeg,svg,ico,woff,woff2,eot,ttf,otf}'
    ],
    swDest: 'build/service-worker.js',
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /\.(?:js|css)$/, // Cache all JS and CSS files
        handler: 'StaleWhileRevalidate', // Serve from cache, update in the background
        options: {
          cacheName: 'static-resources',
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 365, // Cache for a year
          },
        },
      },
      {
        urlPattern: /\/$/, // Cache your homepage
        handler: 'NetworkFirst', // Attempt to fetch from network first, fallback to cache
        options: {
          cacheName: 'homepage-cache',
          expiration: {
            maxAgeSeconds: 60 * 60 * 24, // Cache for 1 day
          },
        },
      },
    ],
  };
  