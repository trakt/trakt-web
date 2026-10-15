if (typeof Array.prototype.findLast !== 'function') {
  // skipcq: JS-0061
  Object.defineProperty(Array.prototype, 'findLast', {
    value<T>(
      this: ArrayLike<T>,
      predicate: (value: T, index: number, array: ArrayLike<T>) => unknown,
      thisArg?: unknown,
    ): T | undefined {
      const items = Array.from(this);
      const index = items
        .map((_, i) => i)
        .reverse()
        .find((i) => predicate.call(thisArg, items[i] as T, i, this));

      return index === undefined ? undefined : items.at(index);
    },
    writable: true,
    configurable: true,
  });
}
