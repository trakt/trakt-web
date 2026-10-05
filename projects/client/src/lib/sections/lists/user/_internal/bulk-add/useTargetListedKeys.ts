import { useAllPagesInfiniteQuery } from '$lib/features/query/useQuery.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { userListItemsQuery } from '$lib/requests/queries/users/userListItemsQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { map } from 'rxjs';
import { toListedKey } from './toListedKey.ts';

const PAGE_SIZE = 100;

export function useTargetListedKeys(list: MediaListSummary) {
  const query = useAllPagesInfiniteQuery(
    userListItemsQuery({
      userId: assertDefined(
        list.user.slug,
        'Expected user list to have a user slug',
      ),
      listId: list.slug,
      limit: PAGE_SIZE,
    }),
  );

  const isLoading = query.pipe(
    map(($query) =>
      $query.isPending || $query.isFetchingNextPage || $query.hasNextPage
    ),
  );

  const listedKeys = query.pipe(
    map(($query) =>
      new Set(
        ($query.data?.pages ?? [])
          .flatMap((page) => page.entries)
          .flatMap((item) => toListedKey(item) ?? []),
      )
    ),
  );

  return { listedKeys, isLoading };
}
