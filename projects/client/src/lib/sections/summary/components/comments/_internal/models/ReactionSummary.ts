import { type Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import type { ReactionDistribution } from '$lib/requests/models/ReactionDistribution.ts';

export type ReactionSummary = {
  count: number;
  top: Array<Reaction>;
  distribution: ReactionDistribution;
};
