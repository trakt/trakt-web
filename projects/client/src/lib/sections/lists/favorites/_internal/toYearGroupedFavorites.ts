import type { FavoritedEntry } from '$lib/requests/models/FavoritedEntry.ts';

const toYear = (entry: FavoritedEntry) => entry.favoritedAt.getFullYear();

export function toYearGroupedFavorites(
  entries: ReadonlyArray<FavoritedEntry>,
): Array<FavoritedEntry & { yearHeader?: number }> {
  return entries.map((entry, index) => {
    const previous = index > 0 ? entries.at(index - 1) : undefined;
    const isYearStart = !previous || toYear(previous) !== toYear(entry);

    return isYearStart ? { ...entry, yearHeader: toYear(entry) } : entry;
  });
}
