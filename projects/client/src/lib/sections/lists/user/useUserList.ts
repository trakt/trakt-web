import { useQuery } from '$lib/features/query/useQuery.ts';

import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';
import { listItemsQuery } from '../../../requests/queries/users/listItemsQuery.ts';

const LIST_LIMIT = 100;

type UseListItemsProps = {
  userId: string;
  listId: string;
  limit?: number;
  page?: number;
  type?: MediaType;
};

export function useUserList(props: UseListItemsProps) {
  const query = useQuery(listItemsQuery({
    ...props,
    limit: props.limit ?? LIST_LIMIT,
  }));

  const list = derived(
    query,
    ($query) => ($query.data?.entries ?? []).map((item) => item.entry),
  );

  const isLoading = derived(
    query,
    toLoadingState,
  );

  return {
    list,
    isLoading,
    page: derived(
      query,
      ($query) => $query.data?.page ?? { page: 0, total: 0 },
    ),
  };
}
