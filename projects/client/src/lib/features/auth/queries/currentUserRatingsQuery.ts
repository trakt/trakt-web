import type { RatedItemResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import { error } from '$lib/utils/console/print.ts';
import { z } from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';

export const RatedMediaSchema = z.object({
  rating: z.number(),
  ratedAt: z.date(),
  id: z.number(),
});
export type RatedEntry = z.infer<typeof RatedMediaSchema>;

function mapRatedItemResponse(response: RatedItemResponse): RatedEntry {
  const common = {
    rating: response.rating,
    ratedAt: new Date(response.rated_at),
  };

  switch (response.type) {
    case 'movie':
      return {
        ...common,
        id: response.movie.ids.trakt,
      };
    case 'show':
      return {
        ...common,
        id: response.show.ids.trakt,
      };
    case 'episode':
      return {
        ...common,
        id: response.episode.ids.trakt,
      };
  }
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
        error('Error fetching user rated movies', response);
        throw new Error('Error fetching user rated movies.');
      }
      return response.body;
    });

const currentUserRatedShowsRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .ratings
    .shows({
      params: { id: 'me' },
    })
    .then((response) => {
      if (response.status !== 200) {
        error('Error fetching user rated shows', response);
        throw new Error('Error fetching user rated shows.');
      }
      return response.body;
    });

const currentUserRatedEpisodesRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .ratings
    .episodes({
      params: { id: 'me' },
    })
    .then((response) => {
      if (response.status !== 200) {
        error('Error fetching user rated episodes', response);
        throw new Error('Error fetching user rated episodes.');
      }
      return response.body;
    });

const UserRatingsSchema = z.object({
  movies: z.map(z.number(), RatedMediaSchema),
  shows: z.map(z.number(), RatedMediaSchema),
  episodes: z.map(z.number(), RatedMediaSchema),
});
export type UserRatings = z.infer<typeof UserRatingsSchema>;

export const currentUserRatingsQuery = defineQuery({
  key: 'currentUserRatings',
  request: () =>
    Promise.all([
      currentUserRatedMoviesRequest({ fetch }),
      currentUserRatedShowsRequest({ fetch }),
      currentUserRatedEpisodesRequest({ fetch }),
    ]),
  invalidations: [
    InvalidateAction.Rated('episode'),
    InvalidateAction.Rated('show'),
    InvalidateAction.Rated('movie'),
  ],
  dependencies: [],
  mapper: ([movies, shows, episodes]) => ({
    movies: toMap(movies, mapRatedItemResponse, (entry) => entry.id),
    shows: toMap(shows, mapRatedItemResponse, (entry) => entry.id),
    episodes: toMap(episodes, mapRatedItemResponse, (entry) => entry.id),
  }),
  schema: UserRatingsSchema,
  ttl: Infinity,
});
