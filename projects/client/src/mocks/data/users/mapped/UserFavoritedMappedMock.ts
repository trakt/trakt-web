import type { UserFavoritedEntry } from '$lib/features/auth/queries/currentUserFavoritesQuery.ts';

export const UserFavoritedMappedMock: {
  movies: Map<number, UserFavoritedEntry>;
  shows: Map<number, UserFavoritedEntry>;
} = {
  movies: new Map([
    [916302, {
      'favoritedAt': new Date('2025-01-16T17:37:18.000Z'),
      'id': 916302,
    }],
  ]),
  shows: new Map([
    [180770, {
      'favoritedAt': new Date('2025-01-16T17:37:41.000Z'),
      'id': 180770,
    }],
  ]),
};
