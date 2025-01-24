import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { time } from './lib/utils/timing/time';

declare let self: ServiceWorkerGlobalScope;

const CACHE_PREFIX = 'trakt-lite';

const ASSET_PATTERNS = {
  static: /\.(css|js|json|map)$/i,
  media: /\.(png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|eot)$/i,
  documents: /\.(html|htm)$/i,
};

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
      await caches.delete(CACHE_KEYS.navigation);

      // Remove _cb param and redirect
      url.searchParams.delete('_cb');
      return Response.redirect(url.toString(), 302);
    }

    return navigationHandler.handle(context);
  }),
);

// Static assets with auth-aware cache
registerRoute(
  ({ url }) => {
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
