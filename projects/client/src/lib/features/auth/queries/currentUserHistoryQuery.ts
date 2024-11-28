import type { WatchedMoviesResponse, WatchedShowsResponse } from '$lib/api.ts';
import { api, type ApiParams } from '../../../requests/_internal/api.ts';
import { authHeader } from '../stores/authHeader.ts';

export type MediaPlayHistory = {
  watchedAt: Date;
  plays: number;
};

type WatchedMedia = {
  id: number;
} & MediaPlayHistory;

export type WatchedMovie = WatchedMedia;

function mapWatchedMovieResponse(
  entry: WatchedMoviesResponse[0],
): WatchedMovie {
  const { last_watched_at, plays, movie } = entry;

  return {
    id: movie.ids.trakt,
    watchedAt: new Date(last_watched_at),
    plays,
  };
}

const currentUserWatchedMoviesRequest = (
  { fetch }: ApiParams,
): Promise<Map<number, WatchedMovie>> =>
  api({ fetch })
    .users
    .watched
    .movies({
      params: {
        id: 'me',
      },
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error fetching user movie history', response);
        /**
         * TODO: define error handling strategy/system
         */
        throw new Error('Error fetching user movie history.');
      }

      return response.body;
    })
    .then((movies) =>
      movies
        .reduce((map, movie) => {
          const mapped = mapWatchedMovieResponse(movie);
          map.set(mapped.id, mapped);
          return map;
        }, new Map<number, WatchedMovie>())
    );

export type WatchedEpisode = MediaPlayHistory & {
  season: number;
  episode: number;
};

export type WatchedShow = WatchedMedia & {
  episodes: WatchedEpisode[];
};

function mapWatchedShowResponse(
  entry: WatchedShowsResponse[0],
): WatchedShow {
  const { show, last_watched_at, plays, seasons = [] } = entry;
  const episodes = seasons
    .flatMap((season) =>
      season
        .episodes
        .map((episode) => ({
          season: season.number,
          episode: episode.number,
          watchedAt: new Date(episode.last_watched_at),
          plays: episode.plays,
        }))
    );

  return {
    id: show.ids.trakt,
    watchedAt: new Date(last_watched_at),
    plays,
    episodes,
  };
}

const currentUserWatchedShowsRequest = (
  { fetch }: ApiParams,
): Promise<Map<number, WatchedShow>> =>
  api({ fetch })
    .users
    .watched
    .shows({
      params: {
        id: 'me',
      },
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error fetching user show history', response);
        /**
         * TODO: define error handling strategy/system
         */
        throw new Error('Error fetching user show history.');
      }

      return response.body;
    })
    .then((shows) =>
      shows
        .reduce((map, show) => {
          const mapped = mapWatchedShowResponse(show);
          map.set(mapped.id, mapped);
          return map;
        }, new Map<number, WatchedShow>())
    );

export const currentUserHistoryQueryKey = ['currentUserHistory'] as const;
export const currentUserHistoryQuery = ({ fetch }: ApiParams = {}) => ({
  queryKey: currentUserHistoryQueryKey,
  queryFn: () => {
    return Promise.all([
      currentUserWatchedMoviesRequest({ fetch }),
      currentUserWatchedShowsRequest({ fetch }),
    ]).then((
      [movies, shows],
    ) => ({
      movies,
      shows,
    }));
  },
});
