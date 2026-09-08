// Polyfill for Object.hasOwn (ES2022).
// Sentry: TRAKT-WEB-BXS. marked calls it while lexing reflinks, so older
// browsers crash when comment and trivia markdown is rendered.
if (typeof Object.hasOwn !== 'function') {
  Object.defineProperty(Object, 'hasOwn', {
    value(target: object, key: PropertyKey): boolean {
      return Object.prototype.hasOwnProperty.call(target, key);
    },
    writable: true,
    configurable: true,
  });
}
