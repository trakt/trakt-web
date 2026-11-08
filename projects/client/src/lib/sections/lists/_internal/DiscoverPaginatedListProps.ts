import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode';
import type { Snippet } from 'svelte';

export type DiscoverPaginatedListProps = {
  title?: string;
  type: DiscoverMode;
  actions?: Snippet;
  search?: Record<string, string>;
};
