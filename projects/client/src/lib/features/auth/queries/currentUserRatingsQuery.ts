import type { RatedEpisodesResponse, RatedMoviesResponse } from '$lib/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { api, type ApiParams } from '../../../requests/_internal/api.ts';

export type RatedMedia = {
  rating: number;
  ratedAt: Date;
  id: number;
};

function mapRatedMovieResponse(
  entry: RatedMoviesResponse,
): RatedMedia {
  return {
    id: entry.movie.ids.trakt,
    rating: entry.rating,
    ratedAt: new Date(entry.rated_at),
  };
}

const ratedMoviesRequest = (
  { fetch }: ApiParams,
): Promise<Map<number, RatedMedia>> =>
  api({ fetch })
    .users
    .ratings
    .movies({
      params: {
        id: 'me',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error fetching user rated movies', response);
        /**
         * TODO: define error handling strategy/system
         */
        throw new Error('Error fetching user rated movies.');
      }

      return response.body;
    })
    .then((movies) =>
      movies
        .reduce((map, movie) => {
          const mapped = mapRatedMovieResponse(movie);
          map.set(mapped.id, mapped);
          return map;
        }, new Map<number, RatedMedia>())
    );

function mapRatedEpisodeResponse(
  entry: RatedEpisodesResponse,
): RatedMedia {
  return {
    id: entry.episode.ids.trakt,
    rating: entry.rating,
    ratedAt: new Date(entry.rated_at),
  };
}

const ratedEpisodesRequest = (
  { fetch }: ApiParams,
): Promise<Map<number, RatedMedia>> =>
  api({ fetch })
    .users
    .ratings
    .episodes({
      params: {
        id: 'me',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error fetching user rated episodes', response);
        /**
         * TODO: define error handling strategy/system
         */
        throw new Error('Error fetching user rated episodes.');
      }

      return response.body;
    })
    .then((episodes) =>
      episodes
        .reduce((map, episode) => {
          const mapped = mapRatedEpisodeResponse(episode);
          map.set(mapped.id, mapped);
          return map;
        }, new Map<number, RatedMedia>())
    );

export const currentUserRatingsQueryKey = [
  'currentUserRatings',
  InvalidateAction.Rated('episode'),
  InvalidateAction.Rated('movie'),
] as const;
export const currentUserRatingsQuery = ({ fetch }: ApiParams = {}) => ({
  queryKey: currentUserRatingsQueryKey,
  queryFn: () => {
    return Promise.all([
      ratedMoviesRequest({ fetch }),
      ratedEpisodesRequest({ fetch }),
    ]).then((
      [movies, episodes],
    ) => ({
      movies,
      episodes,
    }));
  },
});
