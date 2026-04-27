import type { UpNextSortBy } from '$lib/sections/lists/progress/UpNextSortBy.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';

type SortMovieProgressProps = {
  entries: ReadonlyArray<MovieProgressEntry>;
  sortBy?: UpNextSortBy;
  sortHow?: SortDirection;
};

function getSortValue(
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

export function sortMovieProgress(
  { entries, sortBy, sortHow = 'desc' }: SortMovieProgressProps,
): MovieProgressEntry[] {
  const direction = sortHow === 'asc' ? 1 : -1;

  return entries.toSorted(
    (a, b) => (getSortValue(a, sortBy) - getSortValue(b, sortBy)) * direction,
  );
}
