import type { MediaRating } from '$lib/requests/models/MediaRating';

type GetDisplayableRatingsProps = {
  ratings: MediaRating;
  airDate: Date;
};

export const EMPTY_RATINGS = Object.freeze({
  trakt: {
    rating: 0,
    votes: 0,
    distribution: {},
  },
  tmdb: {
    rating: 0,
    votes: 0,
  },
  rotten: {
    critic: 0,
    audience: 0,
  },
  imdb: {
    rating: 0,
    votes: 0,
  },
  metacritic: 0,
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
