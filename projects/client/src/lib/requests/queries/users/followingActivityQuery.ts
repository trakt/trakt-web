import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToSeason } from '$lib/requests/_internal/mapToSeason.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import {
  type FollowingActivity,
  FollowingActivitySchema,
} from '$lib/requests/models/FollowingActivity.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  episodeResponseSchema,
  movieResponseSchema,
  profileResponseSchema,
  seasonResponseSchema,
  showResponseSchema,
} from '@trakt/api';
import { z } from 'zod';

type FollowingActivityAction = FollowingActivity['detail']['action'];

type FollowingActivityWindow =
  | { startDate: Date; endDate: Date }
  | { startDate?: never; endDate?: never };

type FollowingActivityParams =
  & PaginationParams
  & ApiParams
  & FollowingActivityWindow
  & { actions?: ReadonlyArray<FollowingActivityAction> };

const BaseResponseSchema = z.object({
  id: z.number(),
  activity_at: z.string(),
  user: profileResponseSchema,
  type: z.enum(['movie', 'show', 'season', 'episode']),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
  season: seasonResponseSchema.nullish(),
  episode: episodeResponseSchema.nullish(),
});

const FollowingActivityResponseSchema = z.discriminatedUnion('action', [
  BaseResponseSchema.extend({
    action: z.literal('watch'),
    method: z.string().nullish(),
  }),
  BaseResponseSchema.extend({
    action: z.literal('rating'),
    rating: z.number(),
  }),
  BaseResponseSchema.extend({
    action: z.literal('comment'),
    comment: z.object({
      id: z.number(),
      comment: z.string(),
      gif: z.object({
        url: z.string(),
        width: z.number().nullish(),
        height: z.number().nullish(),
      }).nullish(),
      spoiler: z.boolean(),
      review: z.boolean(),
      likes: z.number(),
      replies: z.number(),
    }),
  }),
]);

type FollowingActivityResponse = z.infer<
  typeof FollowingActivityResponseSchema
>;

function mapToTarget(
  response: FollowingActivityResponse,
): FollowingActivity['target'] | null {
  const { movie, show, season, episode } = response;

  switch (response.type) {
    case 'movie':
      return movie ? { type: 'movie', movie: mapToMovieEntry(movie) } : null;
    case 'show':
      return show ? { type: 'show', show: mapToShowEntry(show) } : null;
    case 'season':
      return show && season
        ? {
          type: 'season',
          show: mapToShowEntry(show),
          season: mapToSeason(season),
        }
        : null;
    case 'episode':
      return show && episode
        ? {
          type: 'episode',
          show: mapToShowEntry(show),
          episode: mapToEpisodeEntry(episode),
        }
        : null;
  }
}

function mapToDetail(
  response: FollowingActivityResponse,
): FollowingActivity['detail'] {
  switch (response.action) {
    case 'watch':
      return { action: 'watch' };
    case 'rating':
      return { action: 'rating', rating: response.rating };
    case 'comment': {
      const { comment } = response;
      const { gif } = comment;
      return {
        action: 'comment',
        comment: {
          id: comment.id,
          text: comment.comment,
          gif: gif ? { url: gif.url } : null,
          isSpoiler: comment.spoiler,
          isReview: comment.review,
          likeCount: comment.likes,
          replyCount: comment.replies,
        },
      };
    }
  }
}

function mapToFollowingActivity(
  response: FollowingActivityResponse,
): FollowingActivity | null {
  const target = mapToTarget(response);
  if (!target) return null;

  return {
    key: `${response.action}:${response.id}`,
    activityAt: new Date(response.activity_at),
    user: mapToUserProfile(response.user),
    target,
    detail: mapToDetail(response),
  };
}

function toSearch(
  { startDate, endDate, actions, page, limit }: FollowingActivityParams,
) {
  const search = new URLSearchParams({ extended: 'full,images' });

  if (startDate && endDate) {
    search.set('start_at', startDate.toISOString());
    search.set('end_at', endDate.toISOString());
  }

  if (actions?.length) search.set('action', actions.join(','));
  if (page) search.set('page', `${page}`);
  if (limit) search.set('limit', `${limit}`);

  return search.toString();
}

function parseEntries(body: unknown): FollowingActivityResponse[] {
  if (!Array.isArray(body)) return [];

  return body.flatMap((entry) => {
    const parsed = FollowingActivityResponseSchema.safeParse(entry);
    return parsed.success ? [parsed.data] : [];
  });
}

const followingActivityRequest = async (params: FollowingActivityParams) => {
  const response = await rawApiFetch({
    fetch: params.fetch,
    path: `/v3/users/me/following/activities?${toSearch(params)}`,
  });

  return {
    headers: response.headers,
    status: 200 as const,
    body: response.ok ? parseEntries(await response.json()) : [],
  };
};

export const followingActivityQuery = defineInfiniteQuery({
  key: 'followingActivity',
  invalidations: [InvalidateAction.User.Follow],
  dependencies: (params) => [
    params.startDate?.toISOString(),
    params.endDate?.toISOString(),
    params.actions?.join(','),
    params.page,
    params.limit,
  ],
  request: followingActivityRequest,
  mapper: (response, { page = 1 }) => ({
    entries: response.body
      .map(mapToFollowingActivity)
      .filter((activity) => activity != null),
    page: extractPageMeta(response.headers, page),
  }),
  schema: PaginatableSchemaFactory(FollowingActivitySchema),
  ttl: time.minutes(15),
});
