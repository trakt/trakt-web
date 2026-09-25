import type { Snippet } from 'svelte';
import type { ListSearch } from './ListSearch.ts';
import type { ListSearchCopy } from './ListSearchCopy.ts';

export type ListSearchLayoutProps = {
  search: ListSearch;
  copy: ListSearchCopy;
  /**
   * The field is rendered inside the navbar's content toggle instead (desktop),
   * so the page only needs to clear the room the expanded toggle takes up.
   */
  isEmbedded: boolean;
  children: Snippet;
};
