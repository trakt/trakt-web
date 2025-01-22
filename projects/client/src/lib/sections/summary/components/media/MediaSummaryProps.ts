import type { ActiveWatcher } from '$lib/requests/models/ActiveWatcher';
import type { MediaIntl } from '$lib/requests/models/MediaIntl';
import type { MediaRating } from '$lib/requests/models/MediaRating';
import type { MediaStats } from '$lib/requests/models/MediaStats';
import type { Snippet } from 'svelte';

export type MediaSummaryProps<T> = {
  media: T;
  ratings: MediaRating;
  watchers: ActiveWatcher[];
  stats: MediaStats;
  intl: MediaIntl;
  actions?: Snippet;
};
