import { describe, expect, it } from 'vitest';
import { toSmartListRecipe } from './toSmartListRecipe.ts';

describe('toSmartListRecipe', () => {
  it('should describe the source and media type', () => {
    const recipe = toSmartListRecipe({
      source: 'discover',
      mediaType: 'movies',
      filters: {},
    });

    expect(recipe).toEqual({
      source: 'All titles',
      mediaType: 'Movies',
      includes: [],
      limits: [],
      hidden: [],
    });
  });

  it('should split excluded values from included ones', () => {
    const { includes } = toSmartListRecipe({
      source: 'trending',
      mediaType: 'media',
      filters: { genres: ['action', '-horror'] },
    });

    expect(includes.at(0)?.values).toEqual([
      { key: 'action', label: 'Action', isExcluded: false },
      { key: '-horror', label: 'Horror', isExcluded: true },
    ]);
  });

  it('should state how multiple values are matched', () => {
    const { includes } = toSmartListRecipe({
      source: 'trending',
      mediaType: 'movies',
      filters: {
        keywords: ['time-travel', 'heist'],
        keywords_operator: 'and',
        genres: ['action', 'comedy'],
      },
    });

    expect(includes.map(({ label, details }) => ({ label, details }))).toEqual([
      { label: 'Genre', details: ['Match: Any'] },
      { label: 'Keywords', details: ['Match: All'] },
    ]);
  });

  it('should skip the match detail for a single value', () => {
    const { includes } = toSmartListRecipe({
      source: 'trending',
      mediaType: 'movies',
      filters: { genres: ['action'], genres_operator: 'and' },
    });

    expect(includes.at(0)?.details).toEqual([]);
  });

  it('should state the role people are matched on', () => {
    const { includes } = toSmartListRecipe({
      source: 'discover',
      mediaType: 'movies',
      filters: { people: ['keanu-reeves'], people_role: 'cast' },
    });

    expect(includes.at(0)).toEqual({
      key: 'people',
      label: 'People',
      values: [
        { key: 'keanu-reeves', label: 'Keanu Reeves', isExcluded: false },
      ],
      details: ['Role: Cast'],
    });
  });

  it('should list ranges as limits and toggles as hidden', () => {
    const recipe = toSmartListRecipe({
      source: 'discover',
      mediaType: 'movies',
      filters: {
        ratings: [70, 100],
        imdb_votes: [5000, 999_999_999],
        ignore_watched: true,
        ignore_watchlisted: false,
      },
    });

    expect(recipe.limits.map(({ label }) => label)).toEqual([
      'Trakt 70% to 100%',
      '5,000+ IMDb votes',
    ]);
    expect(recipe.hidden).toEqual([
      {
        key: 'ignore_watched',
        label: 'Watched',
      },
    ]);
  });

  it('should show a value saved twice only once', () => {
    const { includes } = toSmartListRecipe({
      source: 'discover',
      mediaType: 'movies',
      filters: { genres: ['action', 'comedy', 'action'] },
    });

    expect(includes.at(0)?.values.map(({ key }) => key)).toEqual([
      'action',
      'comedy',
    ]);
  });

  it('should skip the match detail for a value saved twice', () => {
    const { includes } = toSmartListRecipe({
      source: 'discover',
      mediaType: 'movies',
      filters: { genres: ['action', 'action'] },
    });

    expect(includes.at(0)?.details).toEqual([]);
  });

  it('should key values on the raw filter value', () => {
    const { includes } = toSmartListRecipe({
      source: 'discover',
      mediaType: 'movies',
      filters: { genres: ['action', '-action'] },
    });

    expect(includes.at(0)?.values.map(({ key }) => key)).toEqual([
      'action',
      '-action',
    ]);
  });
});
