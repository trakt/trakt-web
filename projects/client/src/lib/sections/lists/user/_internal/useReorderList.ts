import { useAllPagesInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { userListItemsQuery } from '$lib/requests/queries/users/userListItemsQuery.ts';
import { watchlistQuery } from '$lib/requests/queries/users/watchlistQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import { map } from 'rxjs';
import type { ReorderListSource } from '../models/ReorderListSource.ts';
import { mapListItemToReorderableItem } from './reorderListItems.ts';

const reorderPageSize = 100;

export function useReorderList(source: ReorderListSource) {
  const query = useAllPagesInfiniteQuery(
    source.type === 'watchlist'
      ? watchlistQuery({
          limit: reorderPageSize,
          sortBy: 'rank',
          sortHow: 'asc',
        })
      : userListItemsQuery({
          userId: assertDefined(
            source.list.user.slug,
            'Expected user list to have a user slug',
          ),
          listId: source.list.slug,
          limit: reorderPageSize,
        }),
  );

  const isLoading = query.pipe(
    map(
      ($query) =>
        $query.isPending || $query.isFetchingNextPage || $query.hasNextPage,
    ),
  );

  const list = query.pipe(
    map(($query) => {
      if ($query.isPending || $query.isFetchingNextPage || $query.hasNextPage) {
        return [];
      }

      const entries = $query.data?.pages.flatMap((page) => page.entries) ?? [];
      return dedupe((item) => item.key, entries).map(
        mapListItemToReorderableItem,
      );
    }),
  );

  return { isLoading, list };
}
