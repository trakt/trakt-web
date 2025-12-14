import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { SearchParams } from '$lib/requests/models/SearchParams.ts';
import {
  movieTrendingQuery,
  type TrendingMovie,
} from '$lib/requests/queries/movies/movieTrendingQuery.ts';
import {
  showTrendingQuery,
  type TrendingShow,
} from '$lib/requests/queries/shows/showTrendingQuery.ts';
import { map } from 'rxjs';
import type { InfiniteQuery } from '../../../features/query/models/InfiniteQuery.ts';
import { mediaTrendingQuery } from '../../../requests/queries/media/mediaTrendingQuery.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';

export type TrendingEntry = TrendingMovie | TrendingShow;

type TrendingListStoreProps = PaginationParams & FilterParams & SearchParams & {
  type: DiscoverMode;
};

function typeToQuery(
  params: TrendingListStoreProps,
) {
  switch (params.type) {
    case 'movie':
      return movieTrendingQuery(params) as InfiniteQuery<
        TrendingEntry
      >;
    case 'show':
      return showTrendingQuery(params) as InfiniteQuery<
        TrendingEntry
      >;
    case 'media':
      return mediaTrendingQuery(params) as InfiniteQuery<
        TrendingEntry
      >;
  }
}

export function useTrendingList(
  props: TrendingListStoreProps,
) {
  const { list, ...rest } = usePaginatedListQuery(
    typeToQuery(props),
  );

  return {
    list: list.pipe(
      map(($list) => {
        // TODO: remove this filter when the server is fixed
        return $list.filter((entry) => entry.id !== 0 && entry.slug !== null);
      }),
    ),
    ...rest,
  };
}
