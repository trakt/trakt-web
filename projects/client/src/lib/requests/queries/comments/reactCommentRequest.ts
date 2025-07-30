import { api, type ApiParams } from '$lib/requests/api.ts';
import { type ReactionType } from '@trakt/api';

type ReactCommentParams = { id: number } & ReactionType & ApiParams;

export function reactCommentRequest(
  { fetch, id, reaction_type }: ReactCommentParams,
): Promise<boolean> {
  return api({ fetch })
    .comments
    .reactions
    .add({
      params: {
        id: `${id}`,
        reaction_type,
      },
    })
    .then(({ status }) => status === 201);
}
