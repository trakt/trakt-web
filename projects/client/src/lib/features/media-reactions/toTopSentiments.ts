import type { ReactionMetric } from '$lib/requests/models/ReactionMetric.ts';
import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';

/**
 * The reactions a title is best known for - at most three, most-used first.
 *
 * It holds whether or not the viewer has reacted: the row reports what everyone
 * else felt, and replacing it with the viewer's own pick loses the only reading
 * of the room on the page. Their pick is already legible from the mark beside
 * it.
 *
 * Unused sentiments are dropped rather than padding the row out to three, so a
 * title with a single reaction shows one emoji instead of one and two lies.
 */
const PREVIEW_LIMIT = 3;

export function toTopSentiments(
  metrics: ReadonlyArray<ReactionMetric>,
): ReactionSentiment[] {
  return [...metrics]
    .filter((metric) => metric.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, PREVIEW_LIMIT)
    .map((metric) => metric.sentiment);
}
