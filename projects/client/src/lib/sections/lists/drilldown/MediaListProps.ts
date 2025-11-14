import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginatableStore } from '$lib/sections/lists/drilldown/PaginatableStore.ts';
import type { Snippet } from 'svelte';

export type MediaListProps<T, M> = {
  id: string;
  title: string;
  type: M;
  item: Snippet<[T]>;
  ctaItem?: Snippet;
  useList: PaginatableStore<T, M>;
  actions?: Snippet<[T[], M]>;
  empty?: Snippet;
  badge?: Snippet;
  metaInfo?: Snippet;
  drilldownLink?: string;
  variant?: 'portrait' | 'landscape';
} & FilterParams;
