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

function removeNavigationCache() {
  caches.delete(CacheKey.navigation);
}

addEventListener('message', (event) => {
  if (event.data?.type === WorkerMessage.CacheBust) {
    removeNavigationCache();
  }
});

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Navigation routes
const navigationHandler = new StaleWhileRevalidate({
  cacheName: CacheKey.navigation,
});

registerRoute(
  new NavigationRoute(async (context) => {
    const url = new URL(context.request.url);
    const hasCacheParam = url.searchParams.has('_cb');

    if (hasCacheParam) {
      // Delete the entire navigation cache
      await removeNavigationCache();

      // Remove _cb param and redirect
      url.searchParams.delete('_cb');
      return Response.redirect(url.toString(), 302);
    }

    return await navigationHandler.handle(context);
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
