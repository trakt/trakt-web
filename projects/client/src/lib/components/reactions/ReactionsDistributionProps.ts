import type { AnyReaction } from '$lib/requests/models/AnyReaction.ts';

export type ReactionsDistributionProps = {
  reactions: ReadonlyArray<AnyReaction>;
  distribution?: Partial<Record<AnyReaction, number>>;
  current: ReadonlyArray<AnyReaction>;
  isLoading: boolean;
  title: string;
  order?: 'canonical' | 'ranked';
  pageSize?: number;
};
