import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { createBulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { profileActivityTargets } from '$lib/features/intl-overlay/profileActivityTargets.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { UserCommentEntry } from '$lib/requests/queries/users/userCommentsQuery.ts';
import { userCommentsQuery } from '$lib/requests/queries/users/userCommentsQuery.ts';
import {
  type UserRatingEntry,
  userRatingsQuery,
} from '$lib/requests/queries/users/userRatingsQuery.ts';
import { map } from 'rxjs';
import { usePaginatedListQuery } from '../../../lists/stores/usePaginatedListQuery.ts';

export type ActivityEntry = UserCommentEntry | UserRatingEntry;

type UseMyActivityListProps = {
  type: 'reviews' | 'ratings';
  mode: DiscoverMode;
  slug?: string;
} & PaginationParams;

function typeToQuery(props: UseMyActivityListProps) {
  const common = {
    slug: props.slug ?? 'me',
    limit: props.limit,
    page: props.page ?? 1,
  };

  switch (props.type) {
    case 'reviews':
      return userCommentsQuery(common) as InfiniteQuery<
        ActivityEntry
      >;
    case 'ratings': {
      return userRatingsQuery(common) as InfiniteQuery<
        ActivityEntry
      >;
    }
  }
}

export function useMyActivityList(props: UseMyActivityListProps) {
  const { list, isLoading: baseLoading, ...rest } = usePaginatedListQuery(
    typeToQuery(props),
  );

  const overlay = createBulkIntlOverlay<ActivityEntry>({
    getTargets: profileActivityTargets,
  });

  const filteredList = list.pipe(
    overlay.operator,
    map(($list) => {
      if (props.mode === 'media') {
        return $list;
      }

      return $list.filter((entry) => {
        if (props.mode === 'show') {
          return entry.type === 'show' || entry.type === 'episode' ||
            entry.type === 'season';
        }

        return entry.type === 'movie';
      });
    }),
  );

  return {
    list: filteredList,
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
    ...rest,
  };
}
