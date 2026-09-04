import { createBulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { progressEntryTargets } from '$lib/features/intl-overlay/progressEntryTargets.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import type { ProgressEntry } from '$lib/requests/models/ProgressEntry.ts';
import { progressWatchedQuery } from '$lib/requests/queries/sync/progressWatchedQuery.ts';
import { droppedShowsQuery } from '$lib/requests/queries/users/droppedShowsQuery.ts';
import type { SortBy } from '$lib/sections/lists/user/models/SortBy.ts';
import type {
  SortDirection,
} from '$lib/sections/lists/user/models/SortDirection.ts';
import { hasEnded } from '$lib/utils/media/hasEnded.ts';
import { map } from 'rxjs';
import { DEFAULT_PAGE_SIZE } from '../../../../utils/constants.ts';
import { usePaginatedListQuery } from '../../../lists/stores/usePaginatedListQuery.ts';

export type ProgressListType =
  | 'in-progress'
  | 'completed'
  | 'ended'
  | 'dropped';

type UseProgressListProps = {
  type: ProgressListType;
  limit?: number;
  sortBy?: SortBy;
  sortHow?: SortDirection;
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
        sortBy: props.sortBy,
        sortHow: props.sortHow,
      }) as InfiniteQuery<ProgressEntry>;
    /**
     * Up to date and ended are the two halves of one API bucket. The up next
     * endpoint has no status filter, so both ask for `completed` and split the
     * response on the show status it already returns. Sharing the query also
     * means toggling between the two costs no extra request.
     */
    case 'completed':
    case 'ended':
      return progressWatchedQuery({
        limit,
        intent: 'completed',
        sortBy: props.sortBy,
        sortHow: props.sortHow,
      }) as InfiniteQuery<ProgressEntry>;
    case 'dropped':
      return droppedShowsQuery({
        limit,
      }) as InfiniteQuery<ProgressEntry>;
  }
}

function toStatusPredicate(
  type: ProgressListType,
): (entry: ProgressEntry) => boolean {
  if (type === 'completed') return (entry) => !hasEnded(entry.show.status);
  if (type === 'ended') return (entry) => hasEnded(entry.show.status);

  return () => true;
}

export function useProgressList(props: UseProgressListProps) {
  const { list, isLoading: baseLoading, ...rest } = usePaginatedListQuery(
    typeToQuery(props),
  );

  const overlay = createBulkIntlOverlay<ProgressEntry>({
    getTargets: progressEntryTargets,
  });

  const isInBucket = toStatusPredicate(props.type);

  return {
    list: list.pipe(
      map((entries) => entries.filter(isInBucket)),
      overlay.operator,
    ),
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
    ...rest,
  };
}
