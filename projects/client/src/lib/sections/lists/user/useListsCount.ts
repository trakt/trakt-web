import type { UserListsSortBy } from '$lib/requests/models/UserListsSortBy.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import type { PersonalListType } from './models/PersonalListType.ts';
import type { SortDirection } from './models/SortDirection.ts';
import { usePersonalListsSummary } from './usePersonalListsSummary.ts';

type UseListsCountProps = {
  type: PersonalListType;
  slug: string;
  sortBy?: UserListsSortBy | Nil;
  sortHow?: SortDirection | Nil;
  limit?: number;
};

/*
 * Emits the total number of lists in a personal lists group. Prefers the
 * pagination header total; queries without pagination headers (e.g.
 * collaborations) fall back to the loaded list length once all entries are
 * in. Params must mirror the rendered lists so both share one query
 * observer instead of firing a second request.
 */
export function useListsCount(
  props: UseListsCountProps,
): { count: Observable<number | undefined> } {
  const { itemCount, hasNextPage, list } = usePersonalListsSummary(props);

  return {
    count: combineLatest([itemCount, hasNextPage, list]).pipe(
      map(([headerCount, $hasNextPage, entries]) =>
        headerCount ?? ($hasNextPage ? undefined : entries.length)
      ),
    ),
  };
}
