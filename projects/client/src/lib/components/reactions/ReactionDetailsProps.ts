import type { AnyReaction } from '$lib/requests/models/AnyReaction.ts';

export type ReactionDetailsProps<T extends AnyReaction> = {
  reaction: T;
  count: number;
  isCurrent: boolean;
  index: number;
  onRemove?: (reaction: T) => void;
};
