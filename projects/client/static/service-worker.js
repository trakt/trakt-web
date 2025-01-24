importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

const { registerRoute, NavigationRoute } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { precacheAndRoute } = workbox.precaching;

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
  ]
};

// Precache static assets
precacheAndRoute([
  { url: '/', revision: null },
  // other static assets...
]);

// Navigation routes
registerRoute(
  new NavigationRoute(
    new StaleWhileRevalidate({
      cacheName: 'navigations'
    })
  )
);

// Static assets
registerRoute(
  ({ request, url }) => {
    return ASSET_PATTERNS.static.test(url.pathname) ||
      ASSET_PATTERNS.media.test(url.pathname) ||
      ASSET_PATTERNS.documents.test(url.pathname);
  },
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// External resources
const externalRouteHandler = new StaleWhileRevalidate({
  cacheName: 'external-resources',
  plugins: [
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
    }),
  ],
});

// Fonts
registerRoute(
  ({ url }) => DOMAINS.fonts.includes(url.hostname),
  externalRouteHandler
);

// Styles
registerRoute(
  ({ url }) => DOMAINS.styles.includes(url.hostname),
  externalRouteHandler
);

// Images
registerRoute(
  ({ url }) => DOMAINS.images.includes(url.hostname),
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
    fetchOptions: {
      mode: 'no-cors',
    },
  })
);
