import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';

export type ListMetaProps = {
  // Owner and like rendering require a list; count-only usages (e.g. the
  // watchlist) can omit it and pass `itemCount` directly.
  list?: MediaListSummary;
  // Display override for the item count (e.g. filter-adjusted totals on the
  // list detail page). Falls back to the list's total count.
  itemCount?: number;
  // Marks `itemCount` as covering only the loaded pages (rendered as "N+").
  isPartialCount?: boolean;
  showOwner?: boolean;
  showLike?: boolean;
  // Leading text rendered before the meta items (e.g. the discover mode).
  metaText?: string;
  // When provided, the item count links to this URL.
  countUrl?: string;
  onCountClick?: () => void;
};
