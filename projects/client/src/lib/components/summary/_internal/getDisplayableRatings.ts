import type { MediaRating } from '$lib/requests/models/MediaRating.ts';

type GetDisplayableRatingsProps = {
  ratings: MediaRating;
  airDate: Date;
};

export const EMPTY_RATINGS = Object.freeze({
  trakt: undefined,
  rotten: undefined,
  imdb: undefined,
});

export function getDisplayableRatings({
  ratings,
  airDate,
}: GetDisplayableRatingsProps): MediaRating {
  if (airDate < new Date()) {
    return ratings;
  }

  return EMPTY_RATINGS;
}
