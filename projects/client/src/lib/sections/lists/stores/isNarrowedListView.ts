import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';

type NarrowedListViewParams = {
  type?: DiscoverMode;
  filter?: Record<string, unknown>;
};

/*
 * Pagination headers always report the unfiltered list total, so a narrowed
 * view (a specific media type or active filters) cannot rely on them for
 * item counts.
 */
export function isNarrowedListView({ type, filter }: NarrowedListViewParams) {
  const hasTypeNarrowing = type != null && type !== 'media';
  const hasFilterNarrowing = Object.keys(filter ?? {}).length > 0;

  return hasTypeNarrowing || hasFilterNarrowing;
}
