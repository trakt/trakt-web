import { AssetPattern } from '$worker/AssetPattern.ts';
import { Domain } from '$worker/Domain.ts';
import { WorkerMessage } from '$worker/WorkerMessage.ts';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import {
  NavigationRoute,
  registerRoute,
  setCatchHandler,
} from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { readAuthMarker } from './lib/features/auth/authMarker.ts';
import { LOCALE_COOKIE_NAME } from './lib/features/i18n/constants.ts';
import { time } from './lib/utils/timing/time.ts';
import { CacheKey } from './worker/CacheKey.ts';

declare global {
  interface ServiceWorkerGlobalScope {
    __WB_DISABLE_DEV_LOGS: boolean;
    // Cookie Store API: present on Chromium, absent on Safari/Firefox.
    cookieStore?: {
      get(name: string): Promise<{ value: string } | null>;
    };
  }
}

declare let self: ServiceWorkerGlobalScope;

/**
 * Disable workbox logs in development.
 * @see https://developer.chrome.com/docs/workbox/troubleshooting-and-logging#workbox_logging
 */
self.__WB_DISABLE_DEV_LOGS = true;

// Global error and unhandledrejection event listeners for debugging
self.addEventListener('error', (event) => {
  console.error(
    'Service Worker error event:',
    event.message,
    event.filename,
    event.lineno,
    event.colno,
    event.error,
  );
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandledrejection:', event.reason);
});

// Global Workbox catch handler: log the failure and fall back to network
setCatchHandler(async ({ event, request, url }) => {
  console.error('Workbox route handler failed for:', {
    url: request?.url ?? url?.toString(),
    method: request?.method,
    type: request?.destination,
  });

  // Try network as a safe fallback so the page still loads
  try {
    return await fetch(request || event.request);
  } catch (err) {
    console.error('Network fallback also failed:', err);
    // Return a 503 response rather than letting respondWith reject.
    return new Response('Service worker fetch failed', {
      status: 503,
      statusText: 'Service Worker Error',
      headers: { 'Content-Type': 'text/plain' },
    });
  }
});

const toSeconds = (milliseconds: number) => milliseconds / time.seconds(1);

const expiration = (maxAgeMs: number, maxEntries?: number) =>
  new ExpirationPlugin({
    maxAgeSeconds: toSeconds(maxAgeMs),
    ...(maxEntries === undefined ? {} : { maxEntries }),
  });

function removeNavigationCache() {
  return caches.delete(CacheKey.navigation);
}

// Force immediate activation for new service worker
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Claim clients and purge the navigation cache so stale locale-specific HTML
// (e.g. a poisoned ru-RU document) is evicted on update.
self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    removeNavigationCache(),
    self.clients.claim(),
  ]));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === WorkerMessage.CacheBust) {
    event.waitUntil(removeNavigationCache());
  }
});

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// `+layout.server.ts` bakes both locale and `oidcAuth.isAuthorized` into the
// SSR payload, so a cached document must only be replayed to a request it was
// rendered for. Auth has no safe fallback (an unkeyed document is the bug), so
// an unreadable marker keys as signed-out and the viewer misses the cache.
const documentCacheKey = {
  cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
    const url = new URL(request.url);

    const [locale, isAuthorized] = await Promise.all([
      self.cookieStore?.get(LOCALE_COOKIE_NAME).catch(() => null),
      readAuthMarker(),
    ]);

    if (locale?.value) {
      url.searchParams.set('__locale', locale.value);
    }

    url.searchParams.set('__auth', String(isAuthorized));

    return url.href;
  },
};

const skipRedirectedDocuments = {
  cacheWillUpdate: ({ response }: { response: Response }) =>
    Promise.resolve(response.redirected ? null : response),
};

const navigationOptions = {
  cacheName: CacheKey.navigation,
  plugins: [
    documentCacheKey,
    skipRedirectedDocuments,
    expiration(time.hours(12)),
  ],
};

// StaleWhileRevalidate for fast cold loads.
const navigationHandler = new StaleWhileRevalidate(navigationOptions);

const landingHandler = new NetworkFirst({
  ...navigationOptions,
  networkTimeoutSeconds: 3,
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

    if (url.pathname === '/') {
      return await landingHandler.handle(context);
    }

    return await navigationHandler.handle(context);
  }),
);

// Manifest route - always try network first
registerRoute(
  ({ url }) => url.pathname.endsWith('manifest.webmanifest'),
  new NetworkFirst({
    cacheName: CacheKey.manifest,
    plugins: [expiration(time.hours(1))],
  }),
);

// Same-origin static assets, media and documents (CacheFirst)
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
    plugins: [expiration(time.days(30))],
  }),
);

// External resources
const externalRouteHandler = new StaleWhileRevalidate({
  cacheName: CacheKey.external,
  plugins: [expiration(time.days(7), 50)],
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
    plugins: [expiration(time.days(30), 666)],
    fetchOptions: {
      mode: 'no-cors',
    },
  }),
);
