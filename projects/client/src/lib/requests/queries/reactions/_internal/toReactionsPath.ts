import type { ReactionTarget } from '$lib/requests/models/ReactionTarget.ts';

export function toReactionsPath(target: ReactionTarget) {
  const reference = target.type === 'episode' ? target.id : target.slug;
  return `/v3/${target.type}s/${reference}/reactions`;
}
