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
      effectiveReleaseDate: new Date(Date.now() - time.years(1)),
      type: 'movie',
    } as unknown as MovieEntry;

    expect(getDisplayableRatings({ ratings, entry })).to.deep.equal(ratings);
  });

  it('should get empty ratings for unaired items', () => {
    const entry = {
      effectiveReleaseDate: new Date(Date.now() + time.years(1)),
      type: 'movie',
    } as unknown as MovieEntry;

    expect(getDisplayableRatings({ ratings, entry })).to.deep.equal(
      EMPTY_RATINGS,
    );
  });

  it('should get the ratings if a movie is released before the air date', () => {
    const entry = {
      effectiveReleaseDate: new Date(Date.now() + time.days(7)),
      type: 'movie',
      status: 'released',
    } as unknown as MovieEntry;

    expect(getDisplayableRatings({ ratings, entry })).to.deep.equal(ratings);
  });

  describe('tmdb votes', () => {
    const airedEntry = {
      effectiveReleaseDate: new Date(Date.now() - time.years(1)),
      type: 'movie',
    } as unknown as MovieEntry;

    const withTmdb = (tmdb: MediaRating['tmdb']): MediaRating => ({
      ...ratings,
      tmdb,
    });

    it('should hide tmdb when it has fewer votes than trakt', () => {
      const tmdbRatings = withTmdb({ rating: 8, votes: 2 });

      expect(getDisplayableRatings({ ratings: tmdbRatings, entry: airedEntry }))
        .to.deep.equal({ ...tmdbRatings, tmdb: undefined });
    });

    it('should get tmdb when it has more votes than trakt', () => {
      const tmdbRatings = withTmdb({ rating: 8, votes: 10 });

      expect(getDisplayableRatings({ ratings: tmdbRatings, entry: airedEntry }))
        .to.deep.equal(tmdbRatings);
    });

    it('should get tmdb when the vote counts are equal', () => {
      const tmdbRatings = withTmdb({ rating: 8, votes: 3 });

      expect(getDisplayableRatings({ ratings: tmdbRatings, entry: airedEntry }))
        .to.deep.equal(tmdbRatings);
    });

    it('should hide tmdb when its vote count is missing and trakt has votes', () => {
      const tmdbRatings = withTmdb({ rating: 8 });

      expect(getDisplayableRatings({ ratings: tmdbRatings, entry: airedEntry }))
        .to.deep.equal({ ...tmdbRatings, tmdb: undefined });
    });

    it('should get tmdb when there is no trakt rating', () => {
      const tmdbRatings: MediaRating = {
        ...withTmdb({ rating: 8, votes: 0 }),
        trakt: undefined,
      };

      expect(getDisplayableRatings({ ratings: tmdbRatings, entry: airedEntry }))
        .to.deep.equal(tmdbRatings);
    });
  });
});
