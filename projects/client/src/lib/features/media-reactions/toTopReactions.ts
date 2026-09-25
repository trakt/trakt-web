import { reactionsInOrder } from '$lib/components/reactions/reactionsInOrder.ts';
import type { ReactionDistribution } from '$lib/requests/models/ReactionDistribution.ts';
import type { Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';

/**
 * The reactions a title is best known for - at most three, most-used first.
 *
 * It holds whether or not the viewer has reacted: the row reports what everyone
 * else felt, and replacing it with the viewer's own pick loses the only reading
 * of the room on the page. Their pick is already legible from the mark beside
 * it.
 *
 * Unused reactions are dropped rather than padding the row out to three, so a
 * title with a single reaction shows one emoji instead of one and two lies.
 */
const PREVIEW_LIMIT = 3;

export function toTopReactions(
  distribution: ReactionDistribution,
): Reaction[] {
  return reactionsInOrder
    .filter((reaction) => distribution[reaction] > 0)
    .sort((a, b) => distribution[b] - distribution[a])
    .slice(0, PREVIEW_LIMIT);
}
