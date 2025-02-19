import { WorkerMessage } from '$lib/utils/worker/WorkerMessage.ts';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { time } from './lib/utils/timing/time.ts';

declare global {
  interface ServiceWorkerGlobalScope {
    __WB_DISABLE_DEV_LOGS: boolean;
  }
}

declare let self: ServiceWorkerGlobalScope;

const CACHE_PREFIX = 'trakt-lite';

const ASSET_PATTERNS = {
  static: /\.(css|js|json|map)$/i,
  media: /\.(png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|eot)$/i,
  documents: /\.(html|htm)$/i,
};

/**
 * Disable workbox logs in development.
 * @see https://developer.chrome.com/docs/workbox/troubleshooting-and-logging#workbox_logging
 */
self.__WB_DISABLE_DEV_LOGS = true;

const DOMAINS = {
  fonts: [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
  ],
  styles: [
    'cdn.jsdelivr.net',
  ],
  images: [
    'walter-r2.trakt.tv',
  ],
};

const CACHE_KEYS = {
  static: `${CACHE_PREFIX}-static-assets`,
  navigation: `${CACHE_PREFIX}-navigation`,
  external: `${CACHE_PREFIX}-external-resources`,
  images: `${CACHE_PREFIX}-images`,
};

function removeNavigationCache() {
  caches.delete(CACHE_KEYS.navigation);
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
  cacheName: CACHE_KEYS.navigation,
});

registerRoute(
  new NavigationRoute(async (context) => {
    const url = new URL(context.request.url);
    const hasCacheParam = url.searchParams.has('_cb');

    if (hasCacheParam) {
      // Delete the entire navigation cache
      removeNavigationCache();

      // Remove _cb param and redirect
      url.searchParams.delete('_cb');
      return Response.redirect(url.toString(), 302);
    }

    return navigationHandler.handle(context);
  }),
);

// Manifest route - always try network first
registerRoute(
  ({ url }) => url.pathname.endsWith('manifest.webmanifest'),
  new NetworkFirst({
    cacheName: `${CACHE_PREFIX}-manifest`,
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
    return ASSET_PATTERNS.static.test(url.pathname) ||
      ASSET_PATTERNS.media.test(url.pathname) ||
      ASSET_PATTERNS.documents.test(url.pathname);
  },
  new CacheFirst({
    cacheName: CACHE_KEYS.static,
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: time.days(30) / time.seconds(1),
      }),
    ],
  }),
);

// External resources
const externalRouteHandler = new StaleWhileRevalidate({
  cacheName: CACHE_KEYS.external,
  plugins: [
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: time.days(7) / time.seconds(1),
    }),
  ],
});

// Fonts
registerRoute(
  ({ url }) => DOMAINS.fonts.includes(url.hostname),
  externalRouteHandler,
);

// Styles
registerRoute(
  ({ url }) => DOMAINS.styles.includes(url.hostname),
  externalRouteHandler,
);

// Images
registerRoute(
  ({ url }) => DOMAINS.images.includes(url.hostname),
  new CacheFirst({
    cacheName: CACHE_KEYS.images,
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
