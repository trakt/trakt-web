import type { MediaRating } from '$lib/requests/models/MediaRating.ts';
import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import type { MovieEntry } from '../../../requests/models/MovieEntry.ts';
import {
  EMPTY_RATINGS,
  getDisplayableRatings,
} from './getDisplayableRatings.ts';

describe('getDisplayableRatings', () => {
  const ratings: MediaRating = {
    trakt: {
      rating: 10,
      votes: 3,
      distribution: {},
    },
    rotten: {
      critic: 90,
      audience: 10,
    },
    imdb: {
      rating: 3,
      votes: 5,
    },
  };

  it('should get the ratings if it has aired items', () => {
    const entry = {
      airDate: new Date(Date.now() - time.years(1)),
      type: 'movie',
    } as unknown as MovieEntry;

    expect(getDisplayableRatings({ ratings, entry })).to.deep.equal(ratings);
  });

  it('should get empty ratings for unaired items', () => {
    const entry = {
      airDate: new Date(Date.now() + time.years(1)),
      type: 'movie',
    } as unknown as MovieEntry;

    expect(getDisplayableRatings({ ratings, entry })).to.deep.equal(
      EMPTY_RATINGS,
    );
  });
});
