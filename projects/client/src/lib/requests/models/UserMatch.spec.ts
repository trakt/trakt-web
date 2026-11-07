import { describe, expect, it } from 'vitest';
import { UserMatchSchema } from './UserMatch.ts';

const baseMatch = {
  score: 84,
  breakdown: { subgenres: 70, favorites: 20 },
  shared: {
    subgenres: [],
    favorites: { movies: [481], shows: [180770] },
  },
};

describe('UserMatchSchema', () => {
  it('accepts a response without shared.watched', () => {
    const result = UserMatchSchema.parse(baseMatch);

    expect(result.shared.watched).toBeUndefined();
    expect(result.shared.favorites.movies).toEqual([481]);
  });

  it('accepts a response with shared.watched', () => {
    const result = UserMatchSchema.parse({
      ...baseMatch,
      shared: {
        ...baseMatch.shared,
        watched: { movies: [481, 16662], shows: [180770] },
      },
    });

    expect(result.shared.watched).toEqual({
      movies: [481, 16662],
      shows: [180770],
    });
  });

  it('rejects a shared.watched with a missing axis', () => {
    const result = UserMatchSchema.safeParse({
      ...baseMatch,
      shared: { ...baseMatch.shared, watched: { movies: [481] } },
    });

    expect(result.success).toBe(false);
  });
});
