import type { MediaType } from '$lib/requests/models/MediaType.ts';
import {
  movieTrendingQuery,
} from '$lib/requests/queries/movies/movieTrendingQuery.ts';
import {
  showTrendingQuery,
} from '$lib/requests/queries/shows/showTrendingQuery.ts';
import { map } from 'rxjs';
import type { InfiniteQuery } from '../../features/query/models/InfiniteQuery.ts';
import { dailyShuffle } from '../../utils/array/dailyShuffle.ts';
import { usePaginatedListQuery } from '../lists/stores/usePaginatedListQuery.ts';
import type { TrendingEntry } from '../lists/trending/useTrendingList.ts';

export const RANDOM_ITEM_COUNT = 12;

function typeToQuery(type: MediaType) {
  const params = {
    limit: RANDOM_ITEM_COUNT * 2,
  };

  switch (type) {
    case 'movie':
      return movieTrendingQuery(params) as InfiniteQuery<
        TrendingEntry
      >;
    case 'show':
      return showTrendingQuery(params) as InfiniteQuery<
        TrendingEntry
      >;
  }
}

export function useTrendingItems(type: MediaType) {
  const { list } = usePaginatedListQuery(typeToQuery(type));

  return {
    list: list.pipe(map(($list) => {
      return dailyShuffle($list).slice(
        0,
        RANDOM_ITEM_COUNT,
      );
    })),
  };
}
