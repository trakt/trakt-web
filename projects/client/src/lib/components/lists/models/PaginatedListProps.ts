import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginatableStore } from '$lib/sections/lists/drilldown/PaginatableStore.ts';
import type { Snippet } from 'svelte';

export type PaginatedListProps<T extends { key: string }, M> = {
  useList: PaginatableStore<T, M>;
  type: M;
  /** Receives the items, whether they are loading, and whether loading failed. */
  items: Snippet<[T[], boolean, boolean]>;
  target?: 'default' | 'parent';
} & FilterParams;
