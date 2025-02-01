import type {
  WatchedMovie,
  WatchedShow,
} from '$lib/features/auth/queries/currentUserHistoryQuery';

export const UserHistoryMappedMock: {
  movies: Map<number, WatchedMovie>;
  shows: Map<number, WatchedShow>;
} = {
  'movies': new Map([
    [916302, {
      'id': 916302,
      'plays': 1,
      'watchedAt': new Date('2024-12-27T16:15:28.000Z'),
    }],
  ]),
  shows: new Map([
    [147971, {
      episodes: [
        {
          'episode': 1,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episode': 2,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episode': 3,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episode': 4,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episode': 5,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episode': 6,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episode': 7,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episode': 8,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
      ],
      'id': 147971,
      'isWatched': true,
      'plays': 8,
      'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
    }],
    [180770, {
      episodes: [
        {
          'episode': 1,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:13:42.000Z'),
        },
      ],
      'id': 180770,
      'isWatched': false,
      'plays': 1,
      'watchedAt': new Date('2024-12-27T16:13:42.000Z'),
    }],
  ]),
};
