import type { SearchResultPosition } from '$lib/features/search/models/SearchResultPosition.ts';
import type { Snippet } from 'svelte';

export type BaseItemProps = {
  badge?: Snippet;
  action?: Snippet;
  tag?: Snippet;
  style?: 'cover' | 'summary' | 'compact' | 'minimal';
  source?: string;
  position?: SearchResultPosition;
  popupActions?: Snippet;
  indicators?: Snippet;
  coverWrapper?: Snippet<[Snippet]>;
};
