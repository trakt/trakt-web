export function dailyShuffle<T>(entries: T[]): T[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const seed = today.getTime() / 100_000_000;

  return entries
    .map((entry, idx) => ({
      entry,
      sorter: ((idx + seed) % entries.length),
    }))
    .toSorted((a, b) => a.sorter - b.sorter)
    .map(({ entry }) => entry);
}
