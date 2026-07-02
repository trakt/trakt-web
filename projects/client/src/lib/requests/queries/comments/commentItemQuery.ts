import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import {
  type DirectCommentTarget,
  DirectCommentTargetSchema,
} from '$lib/requests/models/DirectCommentTarget.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  episodeResponseSchema,
  listResponseSchema,
  movieResponseSchema,
  seasonResponseSchema,
  showResponseSchema,
} from '@trakt/api';
import { z } from 'zod';

const CommentItemResponseSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('movie'),
    movie: movieResponseSchema,
  }),
  z.object({
    type: z.literal('show'),
    show: showResponseSchema,
  }),
  z.object({
    type: z.literal('season'),
    show: showResponseSchema,
    season: seasonResponseSchema,
  }),
  z.object({
    type: z.literal('episode'),
    show: showResponseSchema,
    episode: episodeResponseSchema,
  }),
  z.object({
    type: z.literal('list'),
    list: listResponseSchema,
  }),
]);

type CommentItemResponse = z.infer<typeof CommentItemResponseSchema>;

type CommentItemParams =
  & {
    id: number;
  }
  & ApiParams;

const commentItemRequest = async ({ fetch, id }: CommentItemParams) => {
  const response = await rawApiFetch({
    fetch,
    path: `/comments/${id}/item`,
  });

  if (!response.ok) {
    return {
      body: null,
      status: response.status,
    };
  }

  return {
    body: CommentItemResponseSchema.parse(await response.json()),
    status: response.status,
  };
};

function mapToDirectCommentTarget(
  response: CommentItemResponse | null,
): DirectCommentTarget {
  if (response == null) {
    throw new Error('Comment item response body is missing');
  }

  switch (response.type) {
    case 'movie':
      return { type: response.type, slug: response.movie.ids.slug };
    case 'show':
      return { type: response.type, slug: response.show.ids.slug };
    case 'season':
      return {
        type: response.type,
        slug: response.show.ids.slug,
        season: response.season.number,
      };
    case 'episode':
      return {
        type: response.type,
        slug: response.show.ids.slug,
        season: response.episode.season,
        episode: response.episode.number,
      };
    case 'list':
      return {
        type: response.type,
        user: response.list.user.ids.slug ?? response.list.user.username,
        list: response.list.ids.slug,
      };
  }
}

export const commentItemQuery = defineQuery({
  key: 'commentItem',
  invalidations: [],
  dependencies: (params) => [params.id],
  enabled: (params) => Number.isFinite(params.id),
  request: commentItemRequest,
  mapper: (response) => mapToDirectCommentTarget(response.body),
  schema: DirectCommentTargetSchema,
  ttl: time.hours(12),
});
