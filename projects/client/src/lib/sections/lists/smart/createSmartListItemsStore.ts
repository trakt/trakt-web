import { smartListItemsQuery } from '$lib/requests/queries/smart-lists/smartListItemsQuery.ts';
import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';

export function createSmartListItemsStore(getList: () => SmartList) {
  return (params: { limit: number }) =>
    usePaginatedListQuery(
      smartListItemsQuery({ slug: getList().slug, limit: params.limit }),
    );
}
