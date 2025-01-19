import type { ActiveWatcher } from '$lib/models/ActiveWatcher.ts';
import type { MediaIntl } from '$lib/models/MediaIntl.ts';
import type { MediaRating } from '$lib/models/MediaRating.ts';
import type { MediaStats } from '$lib/models/MediaStats';
import type { Snippet } from 'svelte';

export type MediaSummaryProps<T> = {
  media: T;
  ratings: MediaRating;
  watchers: ActiveWatcher[];
  stats: MediaStats;
  intl: MediaIntl;
  actions?: Snippet;
};
