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
  onRemove?: (reaction: T) => void;
};
