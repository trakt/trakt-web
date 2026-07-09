import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { mapToLeaderboardEntry } from '$lib/requests/_internal/mapToLeaderboardEntry.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { LeaderboardEntrySchema } from '$lib/requests/models/LeaderboardEntry.ts';
import {
  type PageMeta,
  PaginatableSchemaFactory,
} from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

const rawUserSchema = z.object({
  ids: z.object({
    slug: z.string().nullish(),
    trakt: z.number(),
  }).passthrough(),
  images: z.object({
    avatar: z.object({ full: z.string().nullish() }).passthrough(),
  }).passthrough().nullish(),
  username: z.string(),
  name: z.string().nullish(),
  private: z.boolean(),
  deleted: z.boolean(),
  joined_at: z.string().nullish(),
  location: z.string().nullish(),
  about: z.string().nullish(),
  vip: z.boolean().nullish(),
  vip_ep: z.boolean().nullish(),
  vip_cover_image: z.string().nullish(),
  director: z.boolean().nullish(),
}).passthrough();

const leaderboardEntryResponseSchema = z.object({
  rank: z.number().nullable(),
  user: rawUserSchema,
  total_minutes: z.number().nullable(),
  total_plays: z.number().nullable(),
  locked: z.boolean(),
});

const LeaderboardResponseSchema = z.array(leaderboardEntryResponseSchema);

export type LeaderboardEntryResponse = z.infer<
  typeof leaderboardEntryResponseSchema
>;

type UserLeaderboardParams = { slug: string } & PaginationParams & ApiParams;

function toPageMeta(headers: Headers, page: number, limit: number): PageMeta {
  const total = Number(headers.get('x-total-count') ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  return { type: 'paginated', current: page, total: totalPages };
}

// The leaderboard is viewer-only: a non-self or unauthenticated request `404`s.
// Treat that as an empty page rather than a fetch error.
const userLeaderboardRequest = async (
  { fetch, slug, page = 1, limit = 10 }: UserLeaderboardParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/users/${slug}/leaderboard?page=${page}&limit=${limit}`,
  });

  return {
    headers: response.headers,
    status: 200 as const,
    body: response.ok
      ? LeaderboardResponseSchema.parse(await response.json())
      : [],
  };
};

export const userLeaderboardQuery = defineInfiniteQuery({
  key: 'userLeaderboard',
  invalidations: [],
  dependencies: (params) => [params.slug, params.limit],
  request: userLeaderboardRequest,
  mapper: (response, { page = 1, limit = 10 }) => ({
    entries: response.body.map(mapToLeaderboardEntry),
    page: toPageMeta(response.headers, page, limit),
  }),
  schema: PaginatableSchemaFactory(LeaderboardEntrySchema),
  enabled: (params) => Boolean(params.slug),
  ttl: time.minutes(15),
});
