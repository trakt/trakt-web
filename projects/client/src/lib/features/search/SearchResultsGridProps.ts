import type { Snippet } from 'svelte';
import type { SearchItem } from './models/SearchItem.ts';

export type SearchResultsGridProps = {
  title?: string;
  empty?: Snippet;
  leadingItem?: Snippet;
  items: Array<SearchItem>;
  onclick?: (item: SearchItem) => void;
  type: 'media' | 'people' | 'lists';
  source?: string;
  trackPosition?: boolean;
};
