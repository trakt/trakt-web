import type { MediaRating } from '$lib/requests/models/MediaRating.ts';
import type { EpisodeEntry } from '../../../requests/models/EpisodeEntry.ts';
import type { MediaEntry } from '../../../requests/models/MediaEntry.ts';
import { hasAired } from '../../../utils/media/hasAired.ts';

type GetDisplayableRatingsProps = {
  ratings: MediaRating;
  entry: MediaEntry | EpisodeEntry;
};

export const EMPTY_RATINGS = Object.freeze({
  trakt: undefined,
  rotten: undefined,
  imdb: undefined,
});

export function getDisplayableRatings({
  ratings,
  entry,
}: GetDisplayableRatingsProps): MediaRating {
  if (hasAired(entry)) {
    return ratings;
  }

  return EMPTY_RATINGS;
}
