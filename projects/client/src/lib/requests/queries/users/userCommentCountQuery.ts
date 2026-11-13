import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

type UserCommentCountParams = { slug: string } & ApiParams;

const userCommentCountRequest = async ({
  fetch,
  slug,
}: UserCommentCountParams) => {
  const response = await rawApiFetch({
    fetch,
    path: `/users/${slug}/comments/all/all?include_replies=true&limit=1`,
  });

  const header = response.ok
    ? response.headers.get('x-pagination-item-count')
    : null;
  const count = Number.parseInt(header ?? '', 10);

  return {
    body: Number.isNaN(count) ? null : count,
    status: 200 as const,
  };
};

export const userCommentCountQuery = defineQuery({
  key: 'userCommentCount',
  invalidations: [
    InvalidateAction.Comment.Post('movie'),
    InvalidateAction.Comment.Post('show'),
    InvalidateAction.Comment.Post('episode'),
    InvalidateAction.Comment.Post('season'),
    InvalidateAction.Comment.Reply('movie'),
    InvalidateAction.Comment.Reply('show'),
    InvalidateAction.Comment.Reply('episode'),
    InvalidateAction.Comment.Reply('season'),
  ],
  dependencies: (params) => [params.slug],
  request: userCommentCountRequest,
  mapper: (response) => response.body,
  schema: z.number().nullable(),
  ttl: time.minutes(30),
});
