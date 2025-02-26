import { registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { precacheAndRoute } from "workbox-precaching";

// Precache files
precacheAndRoute(self.__WB_MANIFEST);

// Cache static assets (CSS & JS)
registerRoute(
    ({ request }) => request.destination === "style" || request.destination === "script",
    new CacheFirst()
);

// Cache images with a Stale-While-Revalidate strategy
registerRoute(
    ({ request }) => request.destination === "image",
    new StaleWhileRevalidate()
);
