export function toMap<TIn, TOut, TKey>(
  entries: TIn[],
  mapFn: (entry: TIn) => TOut,
  keyFn: (entry: TOut, input: TIn) => TKey,
): Map<TKey, TOut> {
  return entries
    .reduce((map, entry) => {
      const mapped = mapFn(entry);
      map.set(keyFn(mapped, entry), mapped);
      return map;
    }, new Map<TKey, TOut>());
}
