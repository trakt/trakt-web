import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import type { RatedItemResponse } from '@trakt/api';
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
    });

const currentUserRatedShowsRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .ratings
    .shows({
      params: { id: 'me' },
    });

const currentUserRatedEpisodesRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .ratings
    .episodes({
      params: { id: 'me' },
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
  mapper: ([moviesResponse, showsResponse, episodesResponse]) => ({
    movies: toMap(
      moviesResponse.body,
      mapRatedItemResponse,
      (entry) => entry.id,
    ),
    shows: toMap(showsResponse.body, mapRatedItemResponse, (entry) => entry.id),
    episodes: toMap(
      episodesResponse.body,
      mapRatedItemResponse,
      (entry) => entry.id,
    ),
  }),
  schema: UserRatingsSchema,
  ttl: Infinity,
});
