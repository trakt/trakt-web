import type { MediaIntl } from '$lib/models/MediaIntl.ts';
import type { MediaRating } from '$lib/models/MediaRating.ts';

export type MediaSummaryProps<T> = {
  media: T;
  ratings: MediaRating;
};
