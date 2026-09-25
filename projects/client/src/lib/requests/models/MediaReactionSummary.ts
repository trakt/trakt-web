import type { Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import type { ReactionDistribution } from './ReactionDistribution.ts';

/**
 * How a title was reacted to, in aggregate.
 *
 * Named for the media rather than plain `ReactionSummary`, which the comment
 * stack already owns for a review's equivalent - same taxonomy, different
 * subject, and the two must not read as interchangeable.
 */
export type MediaReactionSummary = {
  totalCount: number;
  distribution: ReactionDistribution;
  /** Most-used first, at most three - what the badge prints. */
  top: ReadonlyArray<Reaction>;
};
