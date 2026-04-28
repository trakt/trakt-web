import type {
  UserHistory,
} from '$lib/features/auth/queries/currentUserHistoryQuery.ts';

export const UserHistoryMappedMock: UserHistory = {
  'lastWatchedAt': new Date('2024-12-27T16:28:32.000Z'),
  'movies': new Map([
    [916302, {
      'id': 916302,
      'plays': 1,
      'watchedAt': new Date('2024-12-27T16:15:28.000Z'),
      'watchedDates': [new Date('2024-12-27T16:15:28.000Z')],
    }],
  ]),
  shows: new Map([
    [147971, {
      episodes: [
        {
          'episodeId': 1,
          'plays': 1,
          'season': 0,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episodeId': 1,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episodeId': 2,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episodeId': 3,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episodeId': 4,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episodeId': 5,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episodeId': 6,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episodeId': 7,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
        {
          'episodeId': 8,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
        },
      ],
      'id': 147971,
      'playsPerSeason': new Map([[0, 1], [1, 8]]),
      'watchedAt': new Date('2024-12-27T16:28:32.000Z'),
      'watchedDates': [
        new Date('2024-12-27T16:28:32.000Z'),
        new Date('2024-12-27T16:28:32.000Z'),
        new Date('2024-12-27T16:28:32.000Z'),
        new Date('2024-12-27T16:28:32.000Z'),
        new Date('2024-12-27T16:28:32.000Z'),
        new Date('2024-12-27T16:28:32.000Z'),
        new Date('2024-12-27T16:28:32.000Z'),
        new Date('2024-12-27T16:28:32.000Z'),
        new Date('2024-12-27T16:28:32.000Z'),
      ],
    }],
    [180770, {
      episodes: [
        {
          'episodeId': 1,
          'plays': 1,
          'season': 1,
          'watchedAt': new Date('2024-12-27T16:13:42.000Z'),
        },
      ],
      'id': 180770,
      'playsPerSeason': new Map([[1, 1]]),
      'watchedAt': new Date('2024-12-27T16:13:42.000Z'),
      'watchedDates': [new Date('2024-12-27T16:13:42.000Z')],
    }],
  ]),
};
