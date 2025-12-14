import { useQuery } from '$lib/features/query/useQuery.ts';

import { userListSummaryQuery } from '$lib/requests/queries/users/userListSummaryQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

type UseUserListSummaryProps = {
  userId: string;
  listId: string;
};

export function userListSummary(props: UseUserListSummaryProps) {
  const query = useQuery(userListSummaryQuery(props));

  return {
    list: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
