import { useQuery } from '$lib/features/query/useQuery.ts';

import { userListSummaryQuery } from '$lib/requests/queries/users/userListSummaryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, of } from 'rxjs';

type UseUserListSummaryProps = {
  userId: string | undefined;
  listId: string | undefined;
};

export function useUserListSummary(props: UseUserListSummaryProps) {
  if (!props.userId || !props.listId) {
    return {
      isLoading: of(false),
      list: of(undefined),
    };
  }

  const query = useQuery(userListSummaryQuery({
    userId: props.userId,
    listId: props.listId,
  }));

  return {
    list: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
