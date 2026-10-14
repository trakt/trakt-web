import type { AnyReaction } from '$lib/requests/models/AnyReaction.ts';

export type ReactionsDistributionProps<T extends AnyReaction> = {
  reactions: ReadonlyArray<T>;
  distribution?: Readonly<Partial<Record<T, number>>>;
  current: ReadonlyArray<T>;
  isLoading: boolean;
  title: string;
  order?: 'canonical' | 'ranked';
  pageSize?: number;
  format?: 'count' | 'share';
  limit?: number;
  onRemove?: (reaction: T) => void;
  onAdd?: (reaction: T) => void;
};
