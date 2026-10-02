import type { AnyReaction } from '$lib/requests/models/AnyReaction.ts';

type ToTopReactionsParams<T extends AnyReaction> = {
  distribution: Partial<Record<T, number>>;
  reactions: ReadonlyArray<T>;
};

const PREVIEW_LIMIT = 3;

export function toTopReactions<T extends AnyReaction>(
  { distribution, reactions }: ToTopReactionsParams<T>,
): ReadonlyArray<T> {
  const countOf = (reaction: T) => distribution[reaction] ?? 0;

  return reactions
    .filter((reaction) => countOf(reaction) > 0)
    .toSorted((a, b) => countOf(b) - countOf(a))
    .slice(0, PREVIEW_LIMIT);
}
