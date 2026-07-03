// Polyfill for crypto.randomUUID (added Chrome 92 / Safari 15.4 / Firefox 95).
// Sentry: TRAKT-WEB-9J7, TRAKT-WEB-9J8, TRAKT-WEB-AH1, TRAKT-WEB-AGV,
// TRAKT-WEB-AGT — older mobile browsers (e.g. Chrome Mobile 90 / Android 10)
// reach the app and crash on `crypto.randomUUID()`, used in SVG icon `<defs>`
// ids, form element ids and the cookie-consent id. `crypto.getRandomValues` is
// universally supported, so build an RFC4122 v4 UUID from it.

type UUID = `${string}-${string}-${string}-${string}-${string}`;

export function randomUUIDPolyfill(): UUID {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Per RFC4122 v4: set the version (4) and variant (10xx) bits.
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${
    hex.slice(6, 8).join('')
  }-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}` as UUID;
}

if (typeof crypto !== 'undefined' && typeof crypto.randomUUID !== 'function') {
  // Defined non-enumerable to mirror the native method, matching the `at` polyfill.
  Object.defineProperty(crypto, 'randomUUID', {
    value: randomUUIDPolyfill,
    writable: true,
    configurable: true,
  });
}
