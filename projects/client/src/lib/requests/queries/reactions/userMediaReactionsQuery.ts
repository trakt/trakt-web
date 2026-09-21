import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ReactionTarget } from '$lib/requests/models/ReactionTarget.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';

// Rows from `/users/me/:media_type/:media_id`. The row id is what a DELETE is
// addressed by, so it travels with the type.
const UserMediaReactionsResponseSchema = z.array(
  z.object({
    id: z.number().int(),
    reaction: z.object({ type: z.string() }),
  }),
);

export const UserMediaReactionSchema = z.object({
  id: z.number(),
  type: z.string(),
});

export type UserMediaReaction = z.infer<typeof UserMediaReactionSchema>;

type UserMediaReactionsParams = { target: ReactionTarget } & ApiParams;

const userMediaReactionsRequest = async (
  { fetch, target }: UserMediaReactionsParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/${target.type}/${target.id}`,
  });

  return {
    body: response.ok
      ? UserMediaReactionsResponseSchema.parse(await response.json())
      : [],
    status: 200,
  };
};

export const userMediaReactionsQuery = defineQuery({
  key: 'userMediaReactions',
  invalidations: [InvalidateAction.ReactMedia],
  dependencies: (params) => [params.target.type, params.target.id],
  request: userMediaReactionsRequest,
  mapper: (response) =>
    response.body.map((row) => ({ id: row.id, type: row.reaction.type })),
  schema: z.array(UserMediaReactionSchema),
  ttl: time.minutes(30),
});
