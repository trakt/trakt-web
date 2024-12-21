import type { ActiveWatcher } from '$lib/models/ActiveWatcher.ts';
import type { MediaIntl } from '$lib/models/MediaIntl.ts';
import type { MediaRating } from '$lib/models/MediaRating.ts';

export type MediaSummaryProps<T> = {
  media: T;
  ratings: MediaRating;
  watchers: ActiveWatcher[];
  intl: MediaIntl;
};
