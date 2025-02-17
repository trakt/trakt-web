import type { RatedEntry } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';

export const UserRatedMappedMock: {
  movies: Map<number, RatedEntry>;
  shows: Map<number, RatedEntry>;
  episodes: Map<number, RatedEntry>;
} = {
  movies: new Map([
    [916302, {
      'id': 916302,
      'ratedAt': new Date('2025-01-16T17:39:23.000Z'),
      'rating': 10,
    }],
  ]),
  shows: new Map([
    [180770, {
      'id': 180770,
      'ratedAt': new Date('2025-01-16T17:39:23.000Z'),
      'rating': 9,
    }],
  ]),
  episodes: new Map([
    [5165667, {
      'id': 5165667,
      'ratedAt': new Date('2025-01-16T17:40:52.000Z'),
      'rating': 10,
    }],
  ]),
};
