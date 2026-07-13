import type { UserStatsResponse } from '@trakt/api';

export const UserStatsResponseMock: UserStatsResponse = {
  seasons: { ratings: 10, comments: 2 },
  shows: { ratings: 100, comments: 5, watched: 269, collected: 50 },
  movies: {
    ratings: 200,
    comments: 8,
    watched: 596,
    collected: 120,
    plays: 900,
    minutes: 60_000,
  },
  episodes: {
    ratings: 300,
    comments: 3,
    watched: 4900,
    collected: 0,
    plays: 5200,
    minutes: 200_000,
  },
  network: { friends: 0, followers: 10, following: 20 },
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
};
