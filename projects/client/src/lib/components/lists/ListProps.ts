import type { Snippet } from 'svelte';

export type ListProps<T> = {
  title: string;
  items: T[];
  item: Snippet<[T]>;
  actions?: Snippet;
};
