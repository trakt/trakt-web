import { AssetPattern } from '$worker/AssetPattern.ts';
import { Domain } from '$worker/Domain.ts';
import { WorkerMessage } from '$worker/WorkerMessage.ts';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { time } from './lib/utils/timing/time.ts';
import { CacheKey } from './worker/CacheKey.ts';

const NAVIGATION_TIMEOUT_MS = time.seconds(4);

declare global {
  interface ServiceWorkerGlobalScope {
    __WB_DISABLE_DEV_LOGS: boolean;
  }
}

declare let self: ServiceWorkerGlobalScope;

/**
 * Disable workbox logs in development.
 * @see https://developer.chrome.com/docs/workbox/troubleshooting-and-logging#workbox_logging
 */
self.__WB_DISABLE_DEV_LOGS = true;

/**
 * Activate new SW immediately without waiting for existing tabs to close.
 * This prevents Safari from getting stuck on a stale/zombied SW that serves
 * assets incompatible with a fresh Cloudflare deployment.
 */
addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

/**
 * Claim all open clients so the new SW takes control without a page reload
 * being required on the old tab.
 */
addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

function removeNavigationCache() {
  return caches.delete(CacheKey.navigation);
}

addEventListener('message', (event) => {
  if (event.data?.type === WorkerMessage.CacheBust) {
    event.waitUntil(removeNavigationCache());
  }
});

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Navigation routes — StaleWhileRevalidate serves from cache immediately,
// eliminating any risk of a navigation fetch stalling the browser (e.g. Safari).
const navigationHandler = new StaleWhileRevalidate({
  cacheName: CacheKey.navigation,
});

registerRoute(
  new NavigationRoute(async (context) => {
    try {
      const url = new URL(context.request.url);
      const hasCacheParam = url.searchParams.has('_cb');

      if (hasCacheParam) {
        await removeNavigationCache();
        url.searchParams.delete('_cb');
        return Response.redirect(url.toString(), 302);
      }

      const navigationPromise = navigationHandler.handle(context);
      const timeoutPromise = new Promise<Response>((_, reject) =>
        setTimeout(
          () => reject(new Error('Navigation timeout')),
          NAVIGATION_TIMEOUT_MS,
        )
      );

      return await Promise.race([navigationPromise, timeoutPromise]);
    } catch {
      // Fallback to a direct network fetch so the browser never hangs.
      return fetch(context.request);
    }
  }),
);

// Manifest route - always try network first
registerRoute(
  ({ url }) => url.pathname.endsWith('manifest.webmanifest'),
  new NetworkFirst({
    cacheName: CacheKey.manifest,
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: time.hours(1) / time.seconds(1),
      }),
    ],
  }),
);

// Static assets with auth-aware cache
registerRoute(
  ({ url }) => {
    // Skip caching for localhost
    if (url.hostname === 'localhost') {
      return false;
    }
    // Only cache same-origin assets to avoid intercepting third-party scripts,
    // tracking pixels, etc. which fail CORS in strict browsers (e.g. Firefox).
    if (url.origin !== self.location.origin) {
      return false;
    }
    return AssetPattern.static.test(url.pathname) ||
      AssetPattern.media.test(url.pathname) ||
      AssetPattern.documents.test(url.pathname);
  },
  new CacheFirst({
    cacheName: CacheKey.static,
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: time.days(30) / time.seconds(1),
      }),
    ],
  }),
);

// External resources
const externalRouteHandler = new StaleWhileRevalidate({
  cacheName: CacheKey.external,
  plugins: [
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: time.days(7) / time.seconds(1),
    }),
  ],
});

// Fonts
registerRoute(
  ({ url }) => Domain.fonts.includes(url.hostname),
  externalRouteHandler,
);

// Styles
registerRoute(
  ({ url }) => Domain.styles.includes(url.hostname),
  externalRouteHandler,
);

// Images
registerRoute(
  ({ url }) => Domain.images.includes(url.hostname),
  new CacheFirst({
    cacheName: CacheKey.images,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 666,
        maxAgeSeconds: time.days(30) / time.seconds(1),
      }),
    ],
    fetchOptions: {
      mode: 'no-cors',
    },
  }),
);
