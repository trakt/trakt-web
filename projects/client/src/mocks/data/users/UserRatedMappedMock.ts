import type { RatedMedia } from '$lib/features/auth/queries/currentUserRatingsQuery';

export const UserRatedMappedMock: {
  movies: Map<number, RatedMedia>;
  episodes: Map<number, RatedMedia>;
} = {
  movies: new Map([
    [916302, {
      'id': 916302,
      'ratedAt': new Date('2025-01-16T17:39:23.000Z'),
      'rating': 10,
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
