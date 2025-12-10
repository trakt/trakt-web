import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import type { ReactedCommentResponse } from '@trakt/api';
import { reactionsSchema } from '@trakt/api';
import { z } from 'zod';
import { api, type ApiParams } from '../../../requests/api.ts';

const UserReactionsSchema = z.map(
  z.number(),
  z.object({
    id: z.number(),
    reaction: reactionsSchema,
  }),
);

export type UserReactions = z.infer<typeof UserReactionsSchema>;

function mapToReaction(response: ReactedCommentResponse) {
  return {
    id: response.comment.id,
    reaction: response.reaction.type,
  };
}

const currentUserCommentReactionsRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .reactions
    .comments({
      query: {
        limit: 'all',
        extended: 'min',
      },
    });

export const currentUserCommentReactionsQuery = defineQuery({
  key: 'currentUserReactions',
  request: (params) => currentUserCommentReactionsRequest(params),
  invalidations: [InvalidateAction.React],
  dependencies: [],
  mapper: (response) =>
    toMap(
      response.body,
      mapToReaction,
      (entry) => entry.id,
    ),
  schema: UserReactionsSchema,
  ttl: Infinity,
});
