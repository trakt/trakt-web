import type { RatingsResponse } from '@trakt/api';
import { describe, expect, it } from 'vitest';
import { mapToMediaRating } from './mapToMediaRating.ts';

const baseResponse: RatingsResponse = {
  trakt: {
    rating: 8,
    votes: 100,
    distribution: {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 50,
      '9': 30,
      '10': 20,
    },
  },
  metascore: { rating: null, link: null },
};

describe('util: mapToMediaRating', () => {
  it('should map the MyAnimeList block when a rating is present', () => {
    const result = mapToMediaRating({
      ...baseResponse,
      mal: {
        rating: 8.8,
        votes: 421000,
        link: 'myanimelist.net/anime/199',
      },
    });

    expect(result.mal).to.deep.equal({
      rating: 8.8,
      votes: 421000,
      url: 'https://myanimelist.net/anime/199',
    });
  });

  it('should map the Letterboxd block when a rating is present', () => {
    const result = mapToMediaRating({
      ...baseResponse,
      letterboxd: {
        rating: 4.4,
        votes: 89000,
        link: 'letterboxd.com/film/spirited-away',
      },
    });

    expect(result.letterboxd).to.deep.equal({
      rating: 4.4,
      votes: 89000,
      url: 'https://letterboxd.com/film/spirited-away',
    });
  });

  it('should leave MAL and Letterboxd undefined when absent', () => {
    const result = mapToMediaRating(baseResponse);

    expect(result.mal).to.equal(undefined);
    expect(result.letterboxd).to.equal(undefined);
  });

  it('should treat a null MAL rating as absent (non-anime)', () => {
    const result = mapToMediaRating({
      ...baseResponse,
      mal: { rating: null, votes: null, link: null },
    });

    expect(result.mal).to.equal(undefined);
  });
});
