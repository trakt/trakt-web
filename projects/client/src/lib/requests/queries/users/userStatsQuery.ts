import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserStats } from '$lib/requests/_internal/mapToUserStats.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import {
  RatingDistributionSchema,
  UserStatsSchema,
} from '$lib/requests/models/UserStats.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

const simpleStatsSchema = z.object({
  ratings: z.number().int(),
  comments: z.number().int(),
});

const showStatsSchema = simpleStatsSchema.extend({
  watched: z.number().int(),
});

const mediaStatsSchema = showStatsSchema.extend({
  plays: z.number().int(),
  minutes: z.number().int(),
});

export const UserStatsResponseSchema = z.object({
  movies: mediaStatsSchema,
  shows: showStatsSchema,
  seasons: simpleStatsSchema,
  episodes: mediaStatsSchema,
  network: z.object({
    followers: z.number().int(),
    following: z.number().int(),
  }),
  ratings: z.object({
    total: z.number().int(),
    distribution: RatingDistributionSchema,
  }),
  progress: z.object({
    started: z.number().int(),
    finished: z.number().int(),
    dropped: z.number().int(),
  }),
  lists: z.number().int(),
  total_minutes: z.number().int(),
  total_plays: z.number().int(),
});

export type UserStatsResponse = z.infer<typeof UserStatsResponseSchema>;

type UserStatsParams = { slug: string } & ApiParams;

// A `404` means the user has no precomputed stats row (free account) or a
// hidden/private profile. That is expected, not an error, so short-circuit to
// an empty body instead of letting `isValidResponse` throw a fetch error.
const userStatsRequest = async (
  { fetch, slug }: UserStatsParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/users/${slug}/stats`,
  });

  return response.ok
    ? {
      body: UserStatsResponseSchema.parse(await response.json()),
      status: 200 as const,
    }
    : { body: undefined, status: 200 as const };
};

export const userStatsQuery = defineQuery({
  key: 'userStats',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: userStatsRequest,
  mapper: (response) => response.body ? mapToUserStats(response.body) : null,
  schema: UserStatsSchema.nullable(),
  ttl: time.minutes(30),
});
