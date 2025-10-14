import type { Snippet } from 'svelte';

export type ListProps<T> = {
  id: string;
  title: string | Nil;
  items: T[];
  item: Snippet<[T]>;
  ctaItem?: Snippet;
  actions?: Snippet;
  dynamicActions?: Snippet;
  badge?: Snippet;
  drilldownLink?: string;
};
