import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

import { userListItemsQuery } from '$lib/requests/queries/users/listItemsQuery.ts';
import { derived } from 'svelte/store';

const PREVIEW_LIMIT = 8;

type UseListItemsProps = {
  userId: string;
  listId: string;
  type?: MediaType;
};

export function useListItems({
  userId,
  listId,
  type,
}: UseListItemsProps) {
  const items = useQuery(userListItemsQuery({
    userId,
    listId,
    type,
    limit: PREVIEW_LIMIT,
  }));

  return {
    items: derived(items, ($list) => $list.data?.entries ?? []),
  };
}
