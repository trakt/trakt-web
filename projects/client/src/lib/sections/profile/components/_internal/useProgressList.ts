import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import type { ProgressEntry } from '$lib/requests/models/ProgressEntry.ts';
import { progressWatchedQuery } from '$lib/requests/queries/sync/progressWatchedQuery.ts';
import { droppedShowsQuery } from '$lib/requests/queries/users/droppedShowsQuery.ts';
import { DEFAULT_PAGE_SIZE } from '../../../../utils/constants.ts';
import { usePaginatedListQuery } from '../../../lists/stores/usePaginatedListQuery.ts';

type UseProgressListProps = {
  type: 'in-progress' | 'completed' | 'dropped';
  limit?: number;
};

function typeToQuery(
  props: UseProgressListProps,
): InfiniteQuery<ProgressEntry> {
  const limit = props.limit ?? DEFAULT_PAGE_SIZE;

  switch (props.type) {
    case 'in-progress':
      return progressWatchedQuery({
        limit,
        intent: 'continue',
      }) as InfiniteQuery<ProgressEntry>;
    case 'completed':
      return progressWatchedQuery({
        limit,
        intent: 'completed',
      }) as InfiniteQuery<ProgressEntry>;
    case 'dropped':
      return droppedShowsQuery({
        limit,
      }) as InfiniteQuery<ProgressEntry>;
  }
}

export function useProgressList(props: UseProgressListProps) {
  return usePaginatedListQuery(typeToQuery(props));
}
