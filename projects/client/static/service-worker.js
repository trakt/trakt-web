// Based off of https://github.com/pwa-builder/PWABuilder/blob/main/docs/sw.js

/*
  Welcome to our basic Service Worker! This Service Worker offers a basic offline experience
  while also being easily customizeable. You can add in your own code to implement the capabilities
  listed below, or change anything else you would like.


  Need an introduction to Service Workers? Check our docs here: https://docs.pwabuilder.com/#/home/sw-intro
  Want to learn more about how our Service Worker generation works? Check our docs here: https://docs.pwabuilder.com/#/studio/existing-app?id=add-a-service-worker

  Did you know that Service Workers offer many more capabilities than just offline?
    - Background Sync: https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/06
    - Periodic Background Sync: https://web.dev/periodic-background-sync/
    - Push Notifications: https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/07?id=push-notifications-on-the-web
    - Badges: https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/07?id=application-badges
*/
const isLocalhost = self.location.hostname === 'localhost';
const isSelf = (url) => url.origin === self.location.origin;

const ASSET_PATTERNS = {
  static: /\.(css|js|json|map)$/i,
  media: /\.(png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|eot)$/i,
  documents: /\.(html|htm)$/i,
};

function isAssetRequest(url) {
  return Object.values(ASSET_PATTERNS).some((pattern) =>
    pattern.test(url.pathname)
  );
}

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

const HOSTNAME_WHITELIST = [
  ...DOMAINS.fonts,
  ...DOMAINS.styles,
  ...DOMAINS.images,
  self.location.hostname,
];

const isTraktImage = (url) => {
  return DOMAINS.images.includes(url.hostname) && /\.(jpg|jpeg|png|gif|webp)$/i.test(url.pathname);
};

// The Util Function to hack URLs of intercepted requests
const getFixedUrl = (req) => {
  const now = Date.now();
  const url = new URL(req.url);

  // 1. fixed http URL
  // Just keep syncing with location.protocol
  // fetch(httpURL) belongs to active mixed content.
  // And fetch(httpRequest) is not supported yet.
  url.protocol = self.location.protocol;

  // 2. add query for caching-busting.
  // Github Pages served with Cache-Control: max-age=600
  // max-age on mutable content is error-prone, with SW life of bugs can even extend.
  // Until cache mode of Fetch API landed, we have to workaround cache-busting with query string.
  // Cache-Control-Bug: https://bugs.chromium.org/p/chromium/issues/detail?id=453190
  if (url.hostname === self.location.hostname) {
    url.search += `${url.search ? '&' : '?'}cache-bust=${now}`;
  }
  return url.href;
};

/**
 *  @Lifecycle Activate
 *  New one activated when old isnt being used.
 *
 *  waitUntil(): activating ====> activated
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

/**
 * @Functional Install
 * First time installing Service Worker.
 */
self.addEventListener('install', () => {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();
});

/**
 *  @Functional Fetch
 *  All network requests are being intercepted here.
 *
 *  void respondWith(Promise<Response> r)
 */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclude dev server requests
  if (isLocalhost) {
    return;
  }

  // Skip some of cross-origin requests, like those for Google Analytics.
  if (!HOSTNAME_WHITELIST.includes(url.hostname)) {
    return;
  }

  // Allow only asset requests for self.
  if (isSelf(url) && !isAssetRequest(url)) {
    return;
  }

  // Stale-while-revalidate
  // similar to HTTP's stale-while-revalidate: https://www.mnot.net/blog/2007/12/12/stale
  // Upgrade from Jake's to Surma's: https://gist.github.com/surma/eb441223daaedf880801ad80006389f1
  const cached = caches.match(event.request);
  const fixedUrl = getFixedUrl(event.request);
  const fetchOptions = {
    cache: 'no-store',
    ...(isTraktImage(url) ? { mode: 'no-cors' } : {})
  };
  const fetched = fetch(fixedUrl, fetchOptions);
  const fetchedCopy = fetched.then((resp) => resp.clone());

  // Call respondWith() with whatever we get first.
  // If the fetch fails (e.g disconnected), wait for the cache.
  // If there’s nothing in cache, wait for the fetch.
  // If neither yields a response, return offline pages.
  event.respondWith(
    Promise.race([fetched.catch((_) => cached), cached])
      .then((resp) => resp || fetched)
      .catch((_) => {/* eat any errors */}),
  );

  // Update the cache with the version we fetched (only for ok status)
  event.waitUntil(
    Promise.all([fetchedCopy, caches.open('pwa-cache')])
      .then(([response, cache]) =>
        response.ok && cache.put(event.request, response)
      )
      .catch((_) => {/* eat any errors */}),
  );
});
