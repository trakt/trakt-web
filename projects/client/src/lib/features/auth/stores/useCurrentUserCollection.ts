import { flattenQueryPages } from '$lib/features/query/flattenQueryPages.ts';
import { settledData } from '$lib/features/query/settledData.ts';
import { useAllPagesInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
} from 'rxjs';
import { currentUserCollectionQuery } from '../queries/currentUserCollectionQuery.ts';

const collectionLimit = 50000;

export type UserCollection = {
  movies: Set<number>;
  episodes: Set<number>;
};

export function useCurrentUserCollection(): Observable<UserCollection | null> {
  const moviesQuery = useAllPagesInfiniteQuery(
    currentUserCollectionQuery({ type: 'movies', limit: collectionLimit }),
  );
  const episodesQuery = useAllPagesInfiniteQuery(
    currentUserCollectionQuery({ type: 'episodes', limit: collectionLimit }),
  );

  return combineLatest([moviesQuery, episodesQuery]).pipe(
    map(
      ([movies, episodes]) =>
        [settledData(movies), settledData(episodes)] as const,
    ),
    distinctUntilChanged(
      ([prevMovies, prevEpisodes], [movies, episodes]) =>
        prevMovies === movies && prevEpisodes === episodes,
    ),
    map(([movies, episodes]) => {
      if (movies === null || episodes === null) {
        return null;
      }

      return {
        movies: new Set(flattenQueryPages({ data: movies })),
        episodes: new Set(flattenQueryPages({ data: episodes })),
      };
    }),
    distinctUntilChanged((prev, curr) => prev === null && curr === null),
    multicast(),
  );
}
