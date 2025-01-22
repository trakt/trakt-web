import type { RatedEpisodesResponse, RatedMoviesResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import { z } from 'zod';
import { api, type ApiParams } from '../../../requests/_internal/api.ts';

export const RatedMediaSchema = z.object({
  rating: z.number(),
  ratedAt: z.date(),
  id: z.number(),
});
export type RatedEntry = z.infer<typeof RatedMediaSchema>;

function mapRatedMovieResponse(entry: RatedMoviesResponse): RatedEntry {
  return {
    id: entry.movie.ids.trakt,
    rating: entry.rating,
    ratedAt: new Date(entry.rated_at),
  };
}

const currentUserRatedMoviesRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .ratings
    .movies({
      params: { id: 'me' },
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error fetching user rated movies', response);
        throw new Error('Error fetching user rated movies.');
      }
      return response.body;
    });

function mapRatedEpisodeResponse(entry: RatedEpisodesResponse): RatedEntry {
  return {
    id: entry.episode.ids.trakt,
    rating: entry.rating,
    ratedAt: new Date(entry.rated_at),
  };
}

const currentUserRatedEpisodesRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .ratings
    .episodes({
      params: { id: 'me' },
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error fetching user rated episodes', response);
        throw new Error('Error fetching user rated episodes.');
      }
      return response.body;
    });

const UserRatingsSchema = z.object({
  movies: z.map(z.number(), RatedMediaSchema),
  episodes: z.map(z.number(), RatedMediaSchema),
});
export type UserRatings = z.infer<typeof UserRatingsSchema>;

export const currentUserRatingsQuery = await defineQuery({
  key: 'currentUserRatings',
  request: () =>
    Promise.all([
      currentUserRatedMoviesRequest({ fetch }),
      currentUserRatedEpisodesRequest({ fetch }),
    ]),
  invalidations: [
    InvalidateAction.Rated('episode'),
    InvalidateAction.Rated('movie'),
  ],
  dependencies: [],
  mapper: ([movies, episodes]) => ({
    movies: toMap(movies, mapRatedMovieResponse, (entry) => entry.id),
    episodes: toMap(episodes, mapRatedEpisodeResponse, (entry) => entry.id),
  }),
  schema: UserRatingsSchema,
});
