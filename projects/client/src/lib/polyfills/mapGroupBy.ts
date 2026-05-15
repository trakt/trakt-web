// Polyfill for Map.groupBy (ES2024).
// Sentry: TRAKT-WEB-86X, TRAKT-WEB-7TN — older browsers crash when
// streaming providers are grouped by source.

export function groupByPolyfill<K, T>(
  items: Iterable<T>,
  keyFn: (item: T, index: number) => K,
): Map<K, T[]> {
  const result = new Map<K, T[]>();
  let index = 0;

  for (const item of items) {
    const key = keyFn(item, index++);
    const existing = result.get(key);

    if (existing) {
      existing.push(item);
      continue;
    }

    result.set(key, [item]);
  }

  return result;
}

if (typeof Map.groupBy !== 'function') {
  Map.groupBy = groupByPolyfill;
}
