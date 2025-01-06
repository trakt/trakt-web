import type {
  WatchlistedMoviesResponse,
  WatchlistedShowsResponse,
} from '$lib/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { api, type ApiParams } from '../../../requests/_internal/api.ts';

type WatchlistedMedia = {
  id: number;
  watchlistedAt: Date;
};

type WatchlistedMovie = WatchlistedMedia;

function mapWatchlistedMovieResponse(
  entry: WatchlistedMoviesResponse,
): WatchlistedMovie {
  const { listed_at, movie } = entry;

  return {
    id: movie.ids.trakt,
    watchlistedAt: new Date(listed_at),
  };
}

const watchlistedMoviesRequest = (
  { fetch }: ApiParams,
): Promise<Map<number, WatchlistedMovie>> =>
  api({ fetch })
    .users
    .watchlist
    .movies({
      params: {
        id: 'me',
        sort: 'rank',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error fetching user movie watchlist', response);
        /**
         * TODO: define error handling strategy/system
         */
        throw new Error('Error fetching user movie watchlist.');
      }

      return response.body;
    })
    .then((movies) =>
      movies
        .reduce((map, movie) => {
          const mapped = mapWatchlistedMovieResponse(movie);
          map.set(mapped.id, mapped);
          return map;
        }, new Map<number, WatchlistedMovie>())
    );

export type WatchlistedShow = WatchlistedMovie;

function mapWatchlistedShowResponse(
  entry: WatchlistedShowsResponse,
): WatchlistedShow {
  const { listed_at, show } = entry;

  return {
    id: show.ids.trakt,
    watchlistedAt: new Date(listed_at),
  };
}

const watchlistedShowsRequest = (
  { fetch }: ApiParams,
): Promise<Map<number, WatchlistedShow>> =>
  api({ fetch })
    .users
    .watchlist
    .shows({
      params: {
        id: 'me',
        sort: 'rank',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error fetching user show watchlist', response);
        /**
         * TODO: define error handling strategy/system
         */
        throw new Error('Error fetching user show watchlist.');
      }

      return response.body;
    })
    .then((shows) =>
      shows
        .reduce((map, show) => {
          const mapped = mapWatchlistedShowResponse(show);
          map.set(mapped.id, mapped);
          return map;
        }, new Map<number, WatchlistedShow>())
    );

export const currentUserWatchlistQueryKey = [
  'currentUserWatchlist',
  InvalidateAction.Watchlisted('episode'),
  InvalidateAction.Watchlisted('show'),
  InvalidateAction.Watchlisted('movie'),
] as const;
export const currentUserWatchlistQuery = ({ fetch }: ApiParams = {}) => ({
  queryKey: currentUserWatchlistQueryKey,
  queryFn: () => {
    return Promise.all([
      watchlistedMoviesRequest({ fetch }),
      watchlistedShowsRequest({ fetch }),
    ]).then((
      [movies, shows],
    ) => ({
      movies,
      shows,
    }));
  },
});
