// Polyfill for Array.prototype.toSorted (ES2023).
// Sentry: TRAKT-WEB-5VC, TRAKT-WEB-6V7 — older Safari/Chrome/Firefox
// builds reach the app and crash on uses like `list.toSorted(...)`.
if (typeof Array.prototype.toSorted !== 'function') {
  Object.defineProperty(Array.prototype, 'toSorted', {
    value<T>(this: ArrayLike<T>, compareFn?: (a: T, b: T) => number): T[] {
      return Array.from(this).sort(compareFn);
    },
    writable: true,
    configurable: true,
  });
}
