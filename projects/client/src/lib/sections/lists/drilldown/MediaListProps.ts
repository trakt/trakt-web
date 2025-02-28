import type { MediaStore } from '$lib/sections/lists/drilldown/MediaStore.ts';
import type { Snippet } from 'svelte';

export type MediaListProps<T, M> = {
  id: string;
  title: string;
  type: M;
  item: Snippet<[T]>;
  useList: MediaStore<T, M>;
  actions?: Snippet<[T[], M]>;
  empty?: Snippet;
  badge?: Snippet;
};
