import type { UserMatch } from '$lib/requests/models/UserMatch.ts';
import { describe, expect, it } from 'vitest';
import { buildMatchStrip } from './buildMatchStrip.ts';

const shared = (
  overrides: Partial<UserMatch['shared']> = {},
): UserMatch['shared'] => ({
  subgenres: [],
  favorites: { movies: [], shows: [] },
  ...overrides,
});

describe('buildMatchStrip', () => {
  it('returns nothing when there are no watched titles and no favorites', () => {
    expect(buildMatchStrip(shared())).toEqual([]);
  });

  it('interleaves movies and shows, movie first', () => {
    const result = buildMatchStrip(
      shared({ watched: { movies: [1, 2, 3], shows: [10, 20, 30] } }),
    );

    expect(result.map((entry) => entry.key)).toEqual([
      'movie-1',
      'show-10',
      'movie-2',
      'show-20',
      'movie-3',
      'show-30',
    ]);
  });

  it('appends the longer side once the shorter one runs out', () => {
    const result = buildMatchStrip(
      shared({ watched: { movies: [1, 2, 3, 4], shows: [10] } }),
    );

    expect(result.map((entry) => entry.key)).toEqual([
      'movie-1',
      'show-10',
      'movie-2',
      'movie-3',
      'movie-4',
    ]);
  });

  it('marks watched titles that are also favorites and lists them first', () => {
    const result = buildMatchStrip(
      shared({
        watched: { movies: [1, 2], shows: [10, 20] },
        favorites: { movies: [2], shows: [20] },
      }),
    );

    expect(result.map((entry) => [entry.key, entry.isFavorite])).toEqual([
      ['movie-2', true],
      ['show-20', true],
      ['movie-1', false],
      ['show-10', false],
    ]);
  });

  it('does not match a movie favorite against a show with the same id', () => {
    const result = buildMatchStrip(
      shared({
        watched: { movies: [5], shows: [5] },
        favorites: { movies: [5], shows: [] },
      }),
    );

    expect(result.map((entry) => [entry.key, entry.isFavorite])).toEqual([
      ['movie-5', true],
      ['show-5', false],
    ]);
  });

  it('falls back to favorites when watched is missing', () => {
    const result = buildMatchStrip(
      shared({ favorites: { movies: [1, 2, 3], shows: [10, 20, 30] } }),
    );

    expect(result).toHaveLength(6);
    expect(result.every((entry) => entry.isFavorite)).toBe(true);
  });

  it('does not fall back to favorites when watched is present but empty', () => {
    const result = buildMatchStrip(
      shared({
        watched: { movies: [], shows: [] },
        favorites: { movies: [1], shows: [] },
      }),
    );

    expect(result).toEqual([]);
  });

  it('keeps favorites when the cap drops the rest', () => {
    const movies = Array.from({ length: 20 }, (_, index) => index + 1);
    const result = buildMatchStrip(
      shared({
        watched: { movies, shows: [] },
        favorites: { movies: [19, 20], shows: [] },
      }),
      12,
    );

    expect(result).toHaveLength(12);
    expect(result.slice(0, 2).map((entry) => entry.id)).toEqual([19, 20]);
  });
});
