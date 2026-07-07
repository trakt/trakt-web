import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { RatedItemResponse } from '@trakt/api';
import { z } from 'zod';
import { time } from '../../../utils/timing/time.ts';

export const RatedMediaSchema = z.object({
  rating: z.number(),
  ratedAt: z.date(),
  id: z.number(),
});
export type RatedEntry = z.infer<typeof RatedMediaSchema>;

const RatedSeasonResponseSchema = z.object({
  rated_at: z.string().datetime(),
  rating: z.number().int().min(1).max(10),
  type: z.literal('season'),
  season: z.object({
    ids: z.object({
      trakt: z.number().int(),
    }).passthrough(),
  }).passthrough().nullish(),
}).passthrough();
const RatedSeasonsResponseSchema = z.array(RatedSeasonResponseSchema);
type RatedSeasonResponse = z.infer<typeof RatedSeasonResponseSchema>;

function mapRatedItemResponse(response: RatedItemResponse): RatedEntry {
  const common = {
    rating: response.rating,
    ratedAt: new Date(response.rated_at),
  };

  switch (response.type) {
    case 'movie':
      return {
        ...common,
        id: assertDefined(response.movie, 'Expected movie in RatedItemResponse')
          .ids.trakt,
      };
    case 'show':
      return {
        ...common,
        id:
          assertDefined(response.show, 'Expected show in RatedItemResponse').ids
            .trakt,
      };
    case 'episode':
      return {
        ...common,
        id: assertDefined(
          response.episode,
          'Expected episode in RatedItemResponse',
        ).ids.trakt,
      };
    case 'season':
      return {
        ...common,
        id: assertDefined(
          response.season,
          'Expected season in RatedItemResponse',
        ).ids.trakt,
      };
  }
}

function mapRatedSeasonResponse(response: RatedSeasonResponse): RatedEntry {
  return {
    rating: response.rating,
    ratedAt: new Date(response.rated_at),
    id: assertDefined(
      response.season,
      'Expected season in RatedSeasonResponse',
    ).ids.trakt,
  };
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

const currentUserRatedSeasonsRequest = async ({ fetch }: ApiParams) => {
  const response = await rawApiFetch({
    fetch,
    path: '/users/me/ratings/seasons',
  });

  return response.ok
    ? {
      body: RatedSeasonsResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: [], status: 200 };
};

const UserRatingsSchema = z.object({
  movies: z.map(z.number(), RatedMediaSchema),
  shows: z.map(z.number(), RatedMediaSchema),
  seasons: z.map(z.number(), RatedMediaSchema),
  episodes: z.map(z.number(), RatedMediaSchema),
});
export type UserRatings = z.infer<typeof UserRatingsSchema>;

export const currentUserRatingsQuery = defineQuery({
  key: 'currentUserRatings',
  request: (params) =>
    Promise.all([
      currentUserRatedMoviesRequest(params),
      currentUserRatedShowsRequest(params),
      currentUserRatedSeasonsRequest(params),
      currentUserRatedEpisodesRequest(params),
    ]),
  invalidations: [
    InvalidateAction.Rated('episode'),
    InvalidateAction.Rated('season'),
    InvalidateAction.Rated('show'),
    InvalidateAction.Rated('movie'),
  ],
  dependencies: [],
  mapper: (
    [moviesResponse, showsResponse, seasonsResponse, episodesResponse],
  ) => ({
    movies: toMap(
      moviesResponse.body,
      mapRatedItemResponse,
      (entry) => entry.id,
    ),
    shows: toMap(showsResponse.body, mapRatedItemResponse, (entry) => entry.id),
    seasons: toMap(
      seasonsResponse.body,
      mapRatedSeasonResponse,
      (entry) => entry.id,
    ),
    episodes: toMap(
      episodesResponse.body,
      mapRatedItemResponse,
      (entry) => entry.id,
    ),
  }),
  schema: UserRatingsSchema,
  ttl: time.hours(12),
});
