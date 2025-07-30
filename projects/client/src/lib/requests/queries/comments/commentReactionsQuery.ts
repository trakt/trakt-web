import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { type ReactionsResponse, reactionsSchema } from '@trakt/api';
import z from 'zod';
import { mapToUserProfile } from '../../_internal/mapToUserProfile.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { UserProfileSchema } from '../../models/UserProfile.ts';

type CommentRepliesParams =
  & {
    id: number;
  }
  & ApiParams;

const ReactionSchema = z.object({
  reactedAt: z.date(),
  reaction: reactionsSchema,
  user: UserProfileSchema,
});

export type Reaction = z.infer<typeof reactionsSchema>;
export type UserReaction = z.infer<typeof ReactionSchema>;

function mapToReaction(
  reactionResponse: ReactionsResponse,
): UserReaction {
  return {
    reactedAt: new Date(reactionResponse.reacted_at),
    reaction: reactionResponse.reaction.type,
    user: mapToUserProfile(reactionResponse.user),
  };
}

const commentReactionsRequest = (
  {
    fetch,
    id,
  }: CommentRepliesParams,
) =>
  api({ fetch })
    .comments
    .reactions
    .all({
      params: {
        id: `${id}`,
      },
      query: {
        limit: 'all',
      },
    });

export const commentReactionsQuery = defineQuery({
  key: 'commentReactions',
  invalidations: [InvalidateAction.React],
  dependencies: (params) => [params.id],
  request: commentReactionsRequest,
  mapper: (response) => response.body.map(mapToReaction),
  schema: z.array(ReactionSchema),
  ttl: time.minutes(30),
});
