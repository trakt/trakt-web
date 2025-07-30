import type {
  Reaction,
  UserReaction,
} from '$lib/requests/queries/comments/commentReactionsQuery.ts';

const MAX_TOP_REACTIONS = 3;

export function getTopReactions(reactions: UserReaction[]): Reaction[] {
  const reactionCounts = Object.entries(
    reactions.reduce<Record<string, number>>((acc, item) => {
      acc[item.reaction] = (acc[item.reaction] || 0) + 1;
      return acc;
    }, {}),
  );

  return reactionCounts
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_TOP_REACTIONS)
    .map(([reaction]) => reaction as Reaction);
}
