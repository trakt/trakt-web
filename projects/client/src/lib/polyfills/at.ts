// Polyfill for Array.prototype.at (ES2022).
// Sentry: TRAKT-WEB-AE4, TRAKT-WEB-AEE — older iOS/Safari/Chrome builds reach
// the app and crash on uses like `parts.at(0)`. Because `.at` is used during
// locale resolution at module-eval, the failure cascades and leaves dependent
// singletons (e.g. rxjs Subjects) undefined.
if (typeof Array.prototype.at !== 'function') {
  // skipcq: JS-0061
  Object.defineProperty(Array.prototype, 'at', {
    value<T>(this: ArrayLike<T>, index: number): T | undefined {
      const length = this.length;
      const relativeIndex = Math.trunc(index) || 0;
      const resolvedIndex = relativeIndex < 0
        ? length + relativeIndex
        : relativeIndex;

      return resolvedIndex < 0 || resolvedIndex >= length
        ? undefined
        : this[resolvedIndex];
    },
    writable: true,
    configurable: true,
  });
}
