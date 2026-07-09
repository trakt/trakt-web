import type { UpNextSortBy } from '$lib/sections/lists/progress/UpNextSortBy.ts';
import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';
import { getMovieProgressSortValue } from './getMovieProgressSortValue.ts';

type SortMovieProgressProps = {
  entries: ReadonlyArray<MovieProgressEntry>;
  sortBy?: UpNextSortBy;
  sortHow?: SortDirection;
};

export function sortMovieProgress(
  { entries, sortBy, sortHow = 'desc' }: SortMovieProgressProps,
): MovieProgressEntry[] {
  const direction = sortHow === 'asc' ? 1 : -1;

  return entries.toSorted(
    (a, b) =>
      (getMovieProgressSortValue(a, sortBy) -
        getMovieProgressSortValue(b, sortBy)) * direction,
  );
}
