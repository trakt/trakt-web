import { type Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';
import type { AnyReaction } from './AnyReaction.ts';

export type ReactionDistribution<T extends AnyReaction = Reaction> = Record<
  T,
  number
>;
