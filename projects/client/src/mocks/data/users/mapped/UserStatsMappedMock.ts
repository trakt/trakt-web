import type { UserStats } from '$lib/requests/models/UserStats.ts';

export const UserStatsMappedMock: UserStats = {
  movies: {
    plays: 900,
    watched: 596,
    minutes: 60_000,
    ratings: 200,
    comments: 8,
  },
  shows: {
    watched: 269,
    ratings: 100,
    comments: 5,
  },
  seasons: {
    ratings: 10,
    comments: 2,
  },
  episodes: {
    plays: 5200,
    watched: 4900,
    minutes: 200_000,
    ratings: 300,
    comments: 3,
  },
  network: {
    followers: 10,
    following: 20,
  },
  ratings: {
    total: 600,
    distribution: {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
    },
  },
  progress: {
    started: 12,
    finished: 34,
    dropped: 5,
  },
  lists: 7,
  totalMinutes: 260_000,
  totalPlays: 6100,
};
