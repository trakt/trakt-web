// Polyfill for Array.prototype.toReversed (ES2023).
// Sentry: TRAKT-WEB-AW2 — older Firefox/Safari/Chrome builds reach the app and
// crash on uses like `calendar.toReversed()` (e.g. /history calendar ordering).
if (typeof Array.prototype.toReversed !== 'function') {
  // skipcq: JS-0061
  Object.defineProperty(Array.prototype, 'toReversed', {
    value<T>(this: ArrayLike<T>): T[] {
      return Array.from(this).reverse();
    },
    writable: true,
    configurable: true,
  });
}
