import { describe, expect, it } from 'vitest';
import { mapToYirDetail, type RawYirResponse } from './mapToYirDetail.ts';

function rawStats() {
  return { total: 0, yearly: 0, monthly: 0, weekly: 0, daily: 0 };
}

function rawCategory(
  overrides: Partial<RawYirResponse['stats']['shows']> = {},
) {
  return {
    minutes: rawStats(),
    play_counts: rawStats(),
    collected_counts: rawStats(),
    ratings_counts: rawStats(),
    comments_counts: rawStats(),
    ...overrides,
  };
}

function baseResponse(overrides: Partial<RawYirResponse> = {}): RawYirResponse {
  return {
    stats: {
      all: { ...rawCategory(), lists_counts: rawStats() },
      shows: rawCategory(),
      movies: rawCategory(),
    },
    images: { cover: 'cover.jpg', story: 'story.jpg' },
    first_watched: null,
    last_watched: null,
    most_watched: { shows: [], movies: [] },
    genres: {
      shows: { item_count: 0, genres: [] },
      movies: { item_count: 0, genres: [] },
    },
    networks: [],
    production_companies: [],
    top_rated: { shows: [], movies: [] },
    ...overrides,
  };
}

describe('mapToYirDetail', () => {
  describe('all-time fields', () => {
    it('should map release_years years and decades per type', () => {
      const result = mapToYirDetail(baseResponse({
        release_years: {
          shows: {
            years: [{ year: 2010, count: 3 }, { year: 2011, count: 5 }],
            decades: [{ decade: 2010, count: 8 }],
          },
          movies: {
            years: [{ year: 1999, count: 2 }],
            decades: [{ decade: 1990, count: 2 }],
          },
        },
      }));

      expect(result.releaseYears?.shows.years).toEqual([
        { year: 2010, count: 3 },
        { year: 2011, count: 5 },
      ]);
      expect(result.releaseYears?.shows.decades).toEqual([
        { decade: 2010, count: 8 },
      ]);
      expect(result.releaseYears?.movies.years).toEqual([
        { year: 1999, count: 2 },
      ]);
    });

    it('should map list_progress entries per type', () => {
      const result = mapToYirDetail(baseResponse({
        list_progress: {
          shows: [{
            id: 1,
            site: 'trakt',
            title: 'Trakt Top 250',
            logo: 'https://assets.trakt.tv/lists/trakt/logo.png',
            total: 250,
            watched: 120,
            percentage: 48,
          }],
          movies: [],
        },
      }));

      expect(result.listProgress?.shows).toEqual([{
        id: 1,
        site: 'trakt',
        title: 'Trakt Top 250',
        logo: 'https://assets.trakt.tv/lists/trakt/logo.png',
        total: 250,
        watched: 120,
        percentage: 48,
      }]);
      expect(result.listProgress?.movies).toEqual([]);
    });

    it('should pass through the yearly plays distribution', () => {
      const result = mapToYirDetail(baseResponse({
        stats: {
          all: { ...rawCategory(), lists_counts: rawStats() },
          shows: rawCategory({
            distributions: {
              weekly: [],
              monthly: [],
              days: [],
              yearly: [{ year: 2010, count: 5 }, { year: 2011, count: 9 }],
            },
          }),
          movies: rawCategory(),
        },
      }));

      expect(result.stats.shows.distributions?.yearly).toEqual([
        { year: 2010, count: 5 },
        { year: 2011, count: 9 },
      ]);
    });

    it('should pass through the per-type ratings distribution', () => {
      const result = mapToYirDetail(baseResponse({
        stats: {
          all: { ...rawCategory(), lists_counts: rawStats() },
          shows: rawCategory({
            ratings_distribution: [
              { rating: 8, count: 12 },
              { rating: 10, count: 30 },
            ],
          }),
          movies: rawCategory(),
        },
      }));

      expect(result.stats.shows.ratingsDistribution).toEqual([
        { rating: 8, count: 12 },
        { rating: 10, count: 30 },
      ]);
    });

    it('should leave all-time fields undefined when absent (yearly view)', () => {
      const result = mapToYirDetail(baseResponse());

      expect(result.releaseYears).toBeUndefined();
      expect(result.listProgress).toBeUndefined();
      expect(result.globalTop).toBeUndefined();
      expect(result.stats.shows.distributions).toBeUndefined();
      expect(result.stats.shows.ratingsDistribution).toBeUndefined();
    });
  });
});
