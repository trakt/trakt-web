import { describe, expect, it } from 'vitest';
import { filterActiveFavorites } from './filterActiveFavorites.ts';

describe('util: filterActiveFavorites', () => {
  it('should filter out favorite slugs not present in active country sources', () => {
    const favorites = ['us-netflix', 'us-amazon_prime_video', 'us-disney_plus'];
    const activeSources = [
      { source: 'netflix' },
      { source: 'disney_plus' },
    ];

    const result = filterActiveFavorites({
      favorites,
      country: 'us',
      activeSources,
    });

    expect(result).to.deep.equal(['netflix', 'disney_plus']);
  });

  it('should return all country slugs when activeSources is not loaded (null/undefined)', () => {
    const favorites = ['us-netflix', 'us-amazon_prime_video'];

    const resultNull = filterActiveFavorites({
      favorites,
      country: 'us',
      activeSources: null,
    });
    const resultUndefined = filterActiveFavorites({
      favorites,
      country: 'us',
      activeSources: undefined,
    });

    expect(resultNull).to.deep.equal(['netflix', 'amazon_prime_video']);
    expect(resultUndefined).to.deep.equal(['netflix', 'amazon_prime_video']);
  });

  it('should return empty array when activeSources is loaded but empty ([])', () => {
    const favorites = ['us-netflix', 'us-amazon_prime_video'];

    const resultEmpty = filterActiveFavorites({
      favorites,
      country: 'us',
      activeSources: [],
    });

    expect(resultEmpty).to.deep.equal([]);
  });

  it('should return empty array when favorites is empty', () => {
    const result = filterActiveFavorites({
      favorites: [],
      country: 'us',
      activeSources: [{ source: 'netflix' }],
    });
    expect(result).to.deep.equal([]);
  });

  it('should ignore favorites from other countries', () => {
    const favorites = ['us-netflix', 'tr-blutv', 'us-disney_plus'];
    const activeSources = [
      { source: 'netflix' },
      { source: 'disney_plus' },
    ];

    const result = filterActiveFavorites({
      favorites,
      country: 'us',
      activeSources,
    });

    expect(result).to.deep.equal(['netflix', 'disney_plus']);
  });

  it('should handle duplicate favorite slugs by preserving them', () => {
    const favorites = ['us-netflix', 'us-netflix', 'us-disney_plus'];
    const activeSources = [
      { source: 'netflix' },
      { source: 'disney_plus' },
    ];

    const result = filterActiveFavorites({
      favorites,
      country: 'us',
      activeSources,
    });

    expect(result).to.deep.equal(['netflix', 'netflix', 'disney_plus']);
  });
});
