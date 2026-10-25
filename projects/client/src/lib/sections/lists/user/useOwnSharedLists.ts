import { personalListsQuery } from '$lib/requests/queries/users/personalListsQuery.ts';
import { combineLatest, map } from 'rxjs';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';

const sharedListsPageSize = 100;

export function useOwnSharedLists(slug: string) {
  const { list, isLoading, hasNextPage } = usePaginatedListQuery(
    personalListsQuery({
      slug,
      collaborative: true,
      limit: sharedListsPageSize,
    }),
    { allPages: true },
  );

  return {
    list,
    isLoading: combineLatest([isLoading, hasNextPage]).pipe(
      map((states) => states.some(Boolean)),
    ),
  };
}
