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
  tmdb: undefined,
  mal: undefined,
  letterboxd: undefined,
});

export function getDisplayableRatings({
  ratings,
  entry,
}: GetDisplayableRatingsProps): MediaRating {
  if (!hasAired(entry)) {
    return EMPTY_RATINGS;
  }

  const { tmdb, trakt } = ratings;

  // A TMDB score backed by fewer votes than our own is too low-confidence to
  // sit next to the Trakt rating.
  if (tmdb != null && (tmdb.votes ?? 0) < (trakt?.votes ?? 0)) {
    return { ...ratings, tmdb: undefined };
  }

  return ratings;
}
