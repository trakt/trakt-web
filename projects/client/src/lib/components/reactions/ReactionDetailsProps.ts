import type { AnyReaction } from '$lib/requests/models/AnyReaction.ts';

export type ReactionDetailsProps<T extends AnyReaction> = {
  reaction: T;
  value: string;
  isCurrent: boolean;
  index: number;
  onRemove?: (reaction: T) => void;
};
