import * as m from '$lib/features/i18n/messages.ts';
import type { UserList } from '$lib/requests/queries/users/userListsQuery.ts';
import { useAllPersonalLists } from '$lib/stores/useAllPersonalLists.ts';
import { map } from 'rxjs';
import type { BulkAddSource } from './BulkAddSource.ts';

const toListSource = ({ id, name, count }: UserList): BulkAddSource => ({
  key: `list:${id}`,
  name,
  count,
  request: { type: 'list', listId: `${id}` },
});

export function useBulkAddSources(targetListId: number) {
  const { lists, isLoading } = useAllPersonalLists();

  const sources = lists.pipe(
    map(($lists) => [
      {
        key: 'watchlist',
        name: m.list_title_watchlist(),
        request: { type: 'watchlist' },
      } satisfies BulkAddSource,
      ...$lists
        .filter(({ id }) => id !== targetListId)
        .map(toListSource),
    ]),
  );

  return { sources, isLoading };
}
