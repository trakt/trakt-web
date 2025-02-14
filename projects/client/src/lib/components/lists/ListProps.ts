import type { Snippet } from 'svelte';

export type ListProps<T> = {
  id: string;
  title: string;
  items: T[];
  item: Snippet<[T]>;
  actions?: Snippet;
  dynamicActions?: Snippet;
};
