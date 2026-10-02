import {
  type MediaReaction,
  MediaReactionSchema,
} from '$lib/requests/models/MediaReaction.ts';
import type { ReactionDistribution } from '$lib/requests/models/ReactionDistribution.ts';

export function toMediaReactionDistribution(
  counts: Partial<Record<string, number>>,
): ReactionDistribution<MediaReaction> {
  return Object.fromEntries(
    MediaReactionSchema.options.map((reaction) => [
      reaction,
      counts[reaction] ?? 0,
    ]),
  ) as ReactionDistribution<MediaReaction>;
}
