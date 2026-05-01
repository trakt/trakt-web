import type { WatchedMovie } from '$lib/features/auth/queries/currentUserWatchedMoviesQuery.ts';

export const WatchedMoviesMappedMock: WatchedMovie[] = [
  {
    id: 916302,
    plays: 1,
    watchedAt: new Date('2024-12-27T16:15:28.000Z'),
    watchedDates: [new Date('2024-12-27T16:15:28.000Z')],
  },
];
