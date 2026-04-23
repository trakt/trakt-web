import type { SortBy } from '$lib/sections/lists/user/models/SortBy.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';
import type { UpNextEntry } from '../../../models/UpNextEntry.ts';

type ProgressEntry = UpNextEntry | MovieProgressEntry;

function getSortValue(entry: ProgressEntry, sortBy: SortBy): number {
  const isShow = 'show' in entry;

  switch (sortBy) {
    case 'released':
      return (isShow
        ? entry.show.effectiveReleaseDate
        : entry.effectiveReleaseDate).getTime();
    case 'remaining':
      return entry.minutesLeft;
    default:
      return (entry.lastWatchedAt ?? new Date(0)).getTime();
  }
}

export function sortProgressEntries(
  entries: ReadonlyArray<ProgressEntry>,
  sortBy: SortBy,
  sortHow: SortDirection = 'asc',
): ProgressEntry[] {
  if (!sortBy) return [...entries];
  const direction = sortHow === 'asc' ? 1 : -1;
  return [...entries].sort(
    (a, b) => (getSortValue(a, sortBy) - getSortValue(b, sortBy)) * direction,
  );
}
