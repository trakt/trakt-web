import type { MediaIntl } from '$lib/requests/models/MediaIntl.ts';
import type { MediaRating } from '$lib/requests/models/MediaRating.ts';
import type { MediaStats } from '$lib/requests/models/MediaStats.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import type { Snippet } from 'svelte';

export type MediaSummaryProps<T> = {
  media: T;
  ratings: MediaRating;
  watchers: UserProfile[];
  stats: MediaStats;
  intl: MediaIntl;
  actions?: Snippet;
};
