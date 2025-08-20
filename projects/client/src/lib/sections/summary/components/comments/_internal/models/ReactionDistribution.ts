import { type Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';

export type ReactionDistribution = Record<Reaction, number>;
