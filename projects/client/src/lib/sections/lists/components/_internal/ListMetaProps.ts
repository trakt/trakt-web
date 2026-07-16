import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';

export type ListMetaProps = {
  list?: MediaListSummary;
  itemCount?: number;
  type?: DiscoverMode;
  showOwner?: boolean;
  metaText?: string;
  countUrl?: string;
  onCountClick?: () => void;
};
