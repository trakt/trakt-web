import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { ReactionTarget } from '$lib/requests/models/ReactionTarget.ts';
import { toReactionsPath } from './_internal/toReactionsPath.ts';

type ReactMediaParams = {
  target: ReactionTarget;
  type: string;
} & ApiParams;

export function reactMediaRequest(
  { fetch, target, type }: ReactMediaParams,
): Promise<boolean> {
  return rawApiFetch({
    fetch,
    path: `${toReactionsPath(target)}/${type}`,
    init: { method: 'PUT' },
  }).then(({ status }) => status === 204);
}
