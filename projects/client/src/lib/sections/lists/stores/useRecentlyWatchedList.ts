import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { activityHistoryQuery } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import {
  type EpisodeActivityHistory,
  episodeActivityHistoryQuery,
} from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import {
  type MovieActivityHistory,
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import {
  type ShowActivityHistory,
  showActivityHistoryQuery,
} from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import type { InfiniteQuery } from '../../../features/query/models/InfiniteQuery.ts';

export type RecentlyWatchedType = 'movie' | 'show' | 'episode' | 'all';

type RecentlyWatchedListStoreProps = PaginationParams & {
  type: RecentlyWatchedType;
  slug?: string;
  id?: number;
};

export type HistoryEntry =
  | MovieActivityHistory
  | ShowActivityHistory
  | EpisodeActivityHistory;

function typeToQuery(
  { type, limit, page, id, slug }: RecentlyWatchedListStoreProps,
) {
  const params = {
    limit,
    page,
    id,
    slug: slug ?? 'me',
  };

  switch (type) {
    case 'movie':
      return movieActivityHistoryQuery(params) as InfiniteQuery<
        HistoryEntry
      >;
    case 'episode':
      return episodeActivityHistoryQuery(params) as InfiniteQuery<
        HistoryEntry
      >;
    case 'show':
      return showActivityHistoryQuery(params) as InfiniteQuery<
        HistoryEntry
      >;
    case 'all':
      return activityHistoryQuery(params) as InfiniteQuery<
        HistoryEntry
      >;
  }
}

export function useRecentlyWatchedList(
  params: RecentlyWatchedListStoreProps,
) {
  return usePaginatedListQuery(typeToQuery(params));
}
