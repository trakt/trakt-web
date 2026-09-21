import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { ReactionTarget } from '$lib/requests/models/ReactionTarget.ts';
import { toReactionsPath } from './_internal/toReactionsPath.ts';

type RemoveMediaReactionParams = {
  target: ReactionTarget;
  /** A `reaction_media` row id, from `userMediaReactionsQuery`. */
  id: number;
} & ApiParams;

export function removeMediaReactionRequest(
  { fetch, target, id }: RemoveMediaReactionParams,
): Promise<boolean> {
  return rawApiFetch({
    fetch,
    path: `${toReactionsPath(target)}/${id}`,
    init: { method: 'DELETE' },
  }).then(({ status }) => status === 204);
}
