import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { listItemsQuery } from '$lib/requests/queries/lists/listItemsQuery.ts';
import { userListItemsQuery } from '$lib/requests/queries/users/userListItemsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

const PREVIEW_LIMIT = 25;

type UseListItemsProps = {
  list: MediaListSummary;
  limit?: number;
  type?: MediaType;
  page?: number;
};

function listToQuery(
  { list, type, limit, page }: UseListItemsProps,
) {
  const commonParams = {
    type,
    page,
    limit: limit ?? PREVIEW_LIMIT,
  };

  if (list.user.slug) {
    return userListItemsQuery({
      ...commonParams,
      userId: list.user.slug,
      listId: list.slug,
    });
  }

  return listItemsQuery({
    ...commonParams,
    listId: `${list.id}`,
  });
}

export function useListItems(props: UseListItemsProps) {
  const query = useQuery(listToQuery(props));

  const isLoading = derived(
    query,
    toLoadingState,
  );

  return {
    isLoading,
    list: derived(query, ($query) => $query.data?.entries ?? []),
    page: derived(
      query,
      ($query) => $query.data?.page ?? { page: 0, total: 0 },
    ),
  };
}
