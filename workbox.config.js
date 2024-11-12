module.exports = {
  globDirectory: "build/",
  globPatterns: [
    "**/*.{html,js,css,png,jpg,jpeg,svg,ico,woff,woff2,eot,ttf,otf}",
  ],
  globIgnores: ["static/js/main.*.js"], // Ignore outdated main.js files
  swDest: "service-worker.js",
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /\.(?:js|css)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /\/$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "homepage-cache",
        expiration: {
          maxAgeSeconds: 60 * 60 * 24,
        },
      },
    },
  ],
};
