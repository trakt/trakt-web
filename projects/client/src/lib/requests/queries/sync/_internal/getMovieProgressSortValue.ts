import type { UpNextSortBy } from '$lib/sections/lists/progress/UpNextSortBy.ts';
import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';

export function getMovieProgressSortValue(
  entry: MovieProgressEntry,
  sortBy: UpNextSortBy | undefined,
): number {
  switch (sortBy) {
    case 'released':
      return entry.effectiveReleaseDate.getTime();
    case 'remaining':
      return 0;
    default:
      return entry.lastWatchedAt?.getTime() ?? 0;
  }
}
