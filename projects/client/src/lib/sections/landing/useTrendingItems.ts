import { shuffle } from '$lib/utils/array/shuffle.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import {
  movieTrendingQuery,
} from '../../requests/queries/movies/movieTrendingQuery.ts';
import {
  showTrendingQuery,
} from '../../requests/queries/shows/showTrendingQuery.ts';

const RANDOM_SHOW_COUNT = 2;

export function useTrendingItems() {
  const trendingShows = createQuery(
    showTrendingQuery(),
  );

  const trendingMovies = createQuery(
    movieTrendingQuery(),
  );

  return {
    shows: derived(trendingShows, ($shows) => {
      return $shows.isFetching || !$shows.data
        ? []
        : shuffle($shows.data).slice(0, RANDOM_SHOW_COUNT);
    }),
    //TODO replace with episode
    show: derived(trendingShows, ($shows) => {
      return $shows.isFetching || !$shows.data
        ? undefined
        : shuffle($shows.data).at(0);
    }),
    movie: derived(trendingMovies, ($movies) => {
      return $movies.isFetching || !$movies.data
        ? undefined
        : shuffle($movies.data).at(0);
    }),
  };
}
