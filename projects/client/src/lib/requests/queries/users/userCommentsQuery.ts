import { defineInfiniteQuery } from '$lib/features/query/defineQuery.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { PaginatableSchemaFactory } from '$lib/requests/models/Paginatable.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { UserCommentResponse } from '@trakt/api';
import { z } from 'zod';
import type { PaginationParams } from '../../models/PaginationParams.ts';

type UserCommentsParams =
  & {
    slug: string;
  }
  & ApiParams
  & PaginationParams;

export const UserCommentEntrySchema = z.object({
  createdAt: z.date(),
  type: z.enum(['movie', 'show', 'season', 'episode']),
});
export type UserCommentEntry = z.infer<typeof UserCommentEntrySchema>;

const userCommentsRequest = (
  { fetch, slug, limit, page }: UserCommentsParams,
) =>
  api({ fetch }).users.comments({
    params: { id: slug, comment_type: 'all', type: 'all' },
    query: { page, limit },
  });

const mapToCommentEntry = (
  item: UserCommentResponse,
): UserCommentEntry => ({
  createdAt: new Date(item.comment.created_at),
  type: item.type as UserCommentEntry['type'],
});

export const userCommentsQuery = defineInfiniteQuery({
  key: 'userComments',
  invalidations: [],
  dependencies: (params: UserCommentsParams) => [
    params.slug,
    params.limit,
    params.page,
  ],
  request: userCommentsRequest,
  mapper: (response) => ({
    entries: (response.body as UserCommentResponse[]).map(mapToCommentEntry),
    page: extractPageMeta(response.headers),
  }),
  schema: PaginatableSchemaFactory(UserCommentEntrySchema),
  ttl: time.hours(1),
});
