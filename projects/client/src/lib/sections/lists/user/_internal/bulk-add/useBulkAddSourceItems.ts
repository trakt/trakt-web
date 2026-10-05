import { watchlistQuery } from '$lib/requests/queries/users/watchlistQuery.ts';
import { userListItemsQuery } from '$lib/requests/queries/users/userListItemsQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { map } from 'rxjs';
import type { BulkAddSource } from './BulkAddSource.ts';
import { toBulkAddItem } from './toBulkAddItem.ts';

const PAGE_SIZE = 50;

function useSourceQuery({ request }: BulkAddSource) {
  if (request.type === 'watchlist') {
    return usePaginatedListQuery(
      watchlistQuery({ limit: PAGE_SIZE, sortBy: 'rank', sortHow: 'asc' }),
    );
  }

  return usePaginatedListQuery(
    userListItemsQuery({
      userId: 'me',
      listId: request.listId,
      limit: PAGE_SIZE,
    }),
  );
}

export function useBulkAddSourceItems(source: BulkAddSource) {
  const { list, isLoading, hasNextPage, fetchNextPage } = useSourceQuery(
    source,
  );

  return {
    items: list.pipe(map(($list) => $list.flatMap(toBulkAddItem))),
    isLoading,
    hasNextPage,
    fetchNextPage,
  };
}
