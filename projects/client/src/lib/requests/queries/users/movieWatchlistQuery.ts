import type { SortType, WatchlistedMoviesResponse } from '$lib/api.ts';
import { authHeader } from '$lib/features/auth/stores/authHeader.ts';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ListItem } from '$lib/requests/models/ListItem.ts';
import type { MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type MovieWatchlistParams = {
  sort: SortType;
} & ApiParams;

export type WatchlistMovie = ListItem<MovieSummary>;

export function mapResponseToWatchlist(
  watchlist: WatchlistedMoviesResponse,
): WatchlistMovie[] {
  return watchlist.map((watchlistMovie) => ({
    id: watchlistMovie.id,
    rank: watchlistMovie.rank,
    notes: watchlistMovie.notes,
    type: 'movie',
    listedAt: new Date(watchlistMovie.listed_at),
    mediaItem: mapMovieResponseToMovieSummary(watchlistMovie.movie),
  }));
}

function watchlistRequest(
  { fetch, sort }: MovieWatchlistParams,
): Promise<WatchlistMovie[]> {
  return api({ fetch })
    .users
    .watchlist
    .movies({
      params: {
        id: 'me',
        sort,
      },
      query: {
        extended: 'full,cloud9',
      },
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch movies watchlist');
      }

      return mapResponseToWatchlist(body);
    });
}

const movieWatchlistQueryKey = [
  'movieWatchlist',
  InvalidateAction.Watchlisted('movie'),
] as const;
export const movieWatchlistQuery = (
  params: MovieWatchlistParams,
) => ({
  queryKey: movieWatchlistQueryKey,
  queryFn: () => watchlistRequest(params),
});
