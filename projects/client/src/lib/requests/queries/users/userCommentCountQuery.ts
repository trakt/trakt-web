import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

type UserCommentCountParams = { slug: string } & ApiParams;

function toItemCount(headers: Headers, fallback: number): number {
  const count = parseInt(headers.get('x-pagination-item-count') ?? '');
  return isNaN(count) ? fallback : count;
}

const userCommentCountRequest = ({ fetch, slug }: UserCommentCountParams) =>
  api({ fetch })
    .users
    .comments({
      params: { id: slug, comment_type: 'all', type: 'all' },
      query: { page: 1, limit: 1 },
    });

/**
 * Counts every comment a member wrote, list and season comments included.
 * `userCommentsQuery` drops the types it cannot render, so it cannot answer
 * "has this member ever commented".
 */
export const userCommentCountQuery = defineQuery({
  key: 'userCommentCount',
  invalidations: [
    InvalidateAction.Comment.Post('movie'),
    InvalidateAction.Comment.Post('show'),
    InvalidateAction.Comment.Post('season'),
    InvalidateAction.Comment.Post('episode'),
  ],
  dependencies: (params) => [params.slug],
  request: userCommentCountRequest,
  mapper: (response) => toItemCount(response.headers, response.body.length),
  schema: z.number(),
  ttl: time.minutes(30),
});
