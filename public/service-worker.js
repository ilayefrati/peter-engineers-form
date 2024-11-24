const CACHE_NAME = "docx-cache-v2"; // Incremented version number to force cache update
const ASSETS_TO_CACHE = [
  "https://ilayefrati.github.io/peter-engineers-form/media/instructions.png",
  "https://ilayefrati.github.io/peter-engineers-form/media/FormFooter.png",
  "https://ilayefrati.github.io/peter-engineers-form/media/peter-engineers-logo.png",
];

// Cache the necessary files during installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS_TO_CACHE.map((url) => {
          return fetch(url)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch ${url}`);
              }
              return cache.put(url, response);
            })
            .catch((error) => {
              console.error("Error caching resource:", error);
            });
        })
      );
    })
  );
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  if (event.request.url.endsWith("/generate-docx")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Serve from cache if available
        }

        return fetch(event.request).catch(() => {
          // Fallback logic for offline
          const fallbackDocContent =
            "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==";
          return new Response(fallbackDocContent, {
            headers: {
              "Content-Type":
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
          });
        });
      })
    );
  } else {
    // Default cache-first strategy
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      })
    );
  }
});

// Activate event: clean up old caches when a new service worker is activated
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
