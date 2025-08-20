import { type Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import type { ReactionDistribution } from './ReactionDistribution.ts';

export type ReactionSummary = {
  count: number;
  top: Array<Reaction>;
  distribution: ReactionDistribution;
};
