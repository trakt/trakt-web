import {
  currentUserWatchedMoviesQuery,
  type WatchedMovie,
} from '$lib/features/auth/queries/currentUserWatchedMoviesQuery.ts';
import {
  currentUserWatchedShowsQuery,
  type WatchedShow,
} from '$lib/features/auth/queries/currentUserWatchedShowsQuery.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { FreshWatchedState } from './FreshWatchedState.ts';

// Mirrors the page sizes in useCurrentUserHistory - one page covers the full
// history for reconciliation purposes.
const MOVIES_LIMIT = 10000;
const SHOWS_LIMIT = 1000;

type PageFetcher<T> = (context: { pageParam: number }) => Promise<
  Paginatable<T>
>;

function fetchFirstPage<T>(queryFn: unknown): Promise<T[]> {
  const fetchPage = queryFn as PageFetcher<T>;
  return fetchPage({ pageParam: 1 }).then((page) => page.entries);
}

/**
 * Fetches watched state straight from the server (bypasses the query cache)
 * to detect plays recorded from another device while this one was offline.
 */
export async function fetchFreshWatchedState(): Promise<FreshWatchedState> {
  const [movies, shows] = await Promise.all([
    fetchFirstPage<WatchedMovie>(
      currentUserWatchedMoviesQuery({ limit: MOVIES_LIMIT }).queryFn,
    ),
    fetchFirstPage<WatchedShow>(
      currentUserWatchedShowsQuery({ limit: SHOWS_LIMIT }).queryFn,
    ),
  ]);

  return {
    movies: new Map(movies.map((movie) => [movie.id, movie.watchedAt])),
    shows: new Map(shows.map((show) => [show.id, show.watchedAt])),
    episodes: new Map(
      shows.flatMap((show) =>
        show.episodes.map((episode) =>
          [episode.episodeId, episode.watchedAt] as const
        )
      ),
    ),
  };
}
