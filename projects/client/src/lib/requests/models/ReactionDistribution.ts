import { type Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';

/** How many of each reaction something has - a review, or a title. */
export type ReactionDistribution = Record<Reaction, number>;
