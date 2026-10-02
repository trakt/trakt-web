import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MediaReactionSchema } from '$lib/requests/models/MediaReaction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import {
  type UserMediaReaction,
  UserMediaReactionSchema,
} from '$lib/requests/models/UserMediaReaction.ts';
import {
  type UserMediaReactionsResponse,
  UserMediaReactionsResponseSchema,
} from '$lib/requests/models/UserMediaReactionsResponse.ts';
import { time } from '$lib/utils/timing/time.ts';

type UserMediaReactionsParams = {
  type: MediaType;
  id: number;
} & ApiParams;

function mapToUserMediaReactions(
  response: UserMediaReactionsResponse,
): ReadonlyArray<UserMediaReaction> {
  return response.flatMap(({ id, reaction }) => {
    const parsed = MediaReactionSchema.safeParse(reaction.type);

    return parsed.success ? [{ id, reaction: parsed.data }] : [];
  });
}

const userMediaReactionsRequest = async (
  { fetch, type, id }: UserMediaReactionsParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/${type}/${id}`,
  });

  return response.ok
    ? {
      body: UserMediaReactionsResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: [] as UserMediaReactionsResponse, status: 200 };
};

export const userMediaReactionsQuery = defineQuery({
  key: 'userMediaReactions',
  invalidations: [
    InvalidateAction.MediaReact('movie'),
    InvalidateAction.MediaReact('show'),
  ],
  dependencies: (params) => [params.type, params.id],
  request: userMediaReactionsRequest,
  mapper: (response) => mapToUserMediaReactions(response.body),
  schema: UserMediaReactionSchema.array().readonly(),
  ttl: time.minutes(5),
});
