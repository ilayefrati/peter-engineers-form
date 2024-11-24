const CACHE_NAME = "docx-cache-v1";
const ASSETS_TO_CACHE = [
  `${process.env.PUBLIC_URL}/media/instructions.png`,
  `${process.env.PUBLIC_URL}/media/FormFooter.png`,
  `${process.env.PUBLIC_URL}/media/peter-engineers-logo.png`,
];

// Cache the necessary files during installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
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
