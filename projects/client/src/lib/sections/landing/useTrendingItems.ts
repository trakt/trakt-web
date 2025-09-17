import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import {
  movieTrendingQuery,
} from '$lib/requests/queries/movies/movieTrendingQuery.ts';
import {
  showTrendingQuery,
} from '$lib/requests/queries/shows/showTrendingQuery.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import { dailyShuffle } from '../../utils/array/dailyShuffle.ts';
import type { TrendingMediaList } from '../lists/trending/useTrendingList.ts';

export const RANDOM_ITEM_COUNT = 12;

function typeToQuery(type: MediaType) {
  const params = {
    page: 1,
    limit: RANDOM_ITEM_COUNT * 2,
  };

  switch (type) {
    case 'movie':
      return movieTrendingQuery(params) as CreateQueryOptions<
        TrendingMediaList
      >;
    case 'show':
      return showTrendingQuery(params) as CreateQueryOptions<
        TrendingMediaList
      >;
  }
}

export function useTrendingItems(type: MediaType) {
  const query = useQuery(typeToQuery(type));

  return {
    list: derived(query, ($query) => {
      const entries = $query.data?.entries;
      if (!entries) {
        return [];
      }

      return dailyShuffle(entries).slice(
        0,
        RANDOM_ITEM_COUNT,
      );
    }),
  };
}
