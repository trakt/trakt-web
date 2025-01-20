export function toMap<TIn, TOut, TKey>(
  entries: TIn[],
  mapFn: (entry: TIn) => TOut,
  keyFn: (entry: TOut) => TKey,
): Map<TKey, TOut> {
  return entries
    .reduce((map, entry) => {
      const mapped = mapFn(entry);
      map.set(keyFn(mapped), mapped);
      return map;
    }, new Map<TKey, TOut>());
}
