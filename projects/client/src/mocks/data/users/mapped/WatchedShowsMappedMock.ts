import type { WatchedShow } from '$lib/features/auth/queries/currentUserWatchedShowsQuery.ts';

export const WatchedShowsMappedMock: WatchedShow[] = [
  {
    id: 147971,
    watchedAt: new Date('2024-12-27T16:28:32.000Z'),
    episodes: [
      {
        season: 0,
        episodeId: 1,
        watchedAt: new Date('2024-12-27T16:28:32.000Z'),
        plays: 1,
      },
      {
        season: 1,
        episodeId: 1,
        watchedAt: new Date('2024-12-27T16:28:32.000Z'),
        plays: 1,
      },
      {
        season: 1,
        episodeId: 2,
        watchedAt: new Date('2024-12-27T16:28:32.000Z'),
        plays: 1,
      },
      {
        season: 1,
        episodeId: 3,
        watchedAt: new Date('2024-12-27T16:28:32.000Z'),
        plays: 1,
      },
      {
        season: 1,
        episodeId: 4,
        watchedAt: new Date('2024-12-27T16:28:32.000Z'),
        plays: 1,
      },
      {
        season: 1,
        episodeId: 5,
        watchedAt: new Date('2024-12-27T16:28:32.000Z'),
        plays: 1,
      },
      {
        season: 1,
        episodeId: 6,
        watchedAt: new Date('2024-12-27T16:28:32.000Z'),
        plays: 1,
      },
      {
        season: 1,
        episodeId: 7,
        watchedAt: new Date('2024-12-27T16:28:32.000Z'),
        plays: 1,
      },
      {
        season: 1,
        episodeId: 8,
        watchedAt: new Date('2024-12-27T16:28:32.000Z'),
        plays: 1,
      },
    ],
    watchedDates: [
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
    playsPerSeason: new Map([[0, 1], [1, 8]]),
  },
  {
    id: 180770,
    watchedAt: new Date('2024-12-27T16:13:42.000Z'),
    episodes: [
      {
        season: 1,
        episodeId: 1,
        watchedAt: new Date('2024-12-27T16:13:42.000Z'),
        plays: 1,
      },
    ],
    watchedDates: [new Date('2024-12-27T16:13:42.000Z')],
    playsPerSeason: new Map([[1, 1]]),
  },
];
