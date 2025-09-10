import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { reactionsSchema, type ReactionsSummaryResponse } from '@trakt/api';
import z from 'zod';
import { InvalidateAction } from '../../models/InvalidateAction.ts';

type CommentRepliesParams =
  & {
    id: number;
  }
  & ApiParams;

const ReactionsSummarySchema = z.object({
  count: z.number(),
  distribution: z.record(reactionsSchema, z.number()),
});

export type Reaction = z.infer<typeof reactionsSchema>;
export type ReactionsSummary = z.infer<typeof ReactionsSummarySchema>;

function mapToReactionsSummary(
  response: ReactionsSummaryResponse,
): ReactionsSummary {
  return {
    count: response.reaction_count,
    distribution: response.distribution,
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
    .summary({
      params: {
        id: `${id}`,
      },
    })
    .then((res) => {
      if (res.status === 404) {
        res.status = 201;
        res.body = {
          distribution: {},
          reaction_count: 0,
          user_count: 0,
        } as ReactionsSummaryResponse;
      }

      return res;
    });

export const commentReactionsQuery = defineQuery({
  key: 'commentReactions',
  invalidations: [InvalidateAction.React],
  dependencies: (params) => [params.id],
  request: commentReactionsRequest,
  mapper: (response) => mapToReactionsSummary(response.body),
  schema: ReactionsSummarySchema,
  ttl: time.minutes(30),
});
