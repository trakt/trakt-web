import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { LikedItemResponse } from '@trakt/api';
import { z } from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';

const UserLikeSchema = z.object({
  type: z.enum(['comment', 'list']),
  id: z.number(),
});

export type UserLike = z.infer<typeof UserLikeSchema>;

function mapRatedItemResponse(response: LikedItemResponse): UserLike {
  return {
    type: response.type,
    id: response.type === 'comment' ? response.comment.id : response.list.id,
  };
}

const currentUserCommentLikesRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .likes({
      params: {
        type: 'comments',
      },
      query: {
        limit: 'all',
        extended: 'min',
      },
    });

export const currentUserLikesQuery = defineQuery({
  key: 'currentUserLikes',
  request: () => currentUserCommentLikesRequest({ fetch }),
  invalidations: [InvalidateAction.Like],
  dependencies: [],
  mapper: (response) => response.body.map(mapRatedItemResponse),
  schema: UserLikeSchema.array(),
  ttl: Infinity,
});
