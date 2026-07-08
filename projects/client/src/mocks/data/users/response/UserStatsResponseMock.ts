import type { UserStatsResponse } from '$lib/requests/queries/users/userStatsQuery.ts';

export const UserStatsResponseMock: UserStatsResponse = {
  seasons: { ratings: 10, comments: 2 },
  shows: { ratings: 100, comments: 5, watched: 269 },
  movies: {
    ratings: 200,
    comments: 8,
    watched: 596,
    plays: 900,
    minutes: 60_000,
  },
  episodes: {
    ratings: 300,
    comments: 3,
    watched: 4900,
    plays: 5200,
    minutes: 200_000,
  },
  network: { followers: 10, following: 20 },
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
  progress: { started: 12, finished: 34, dropped: 5 },
  lists: 7,
  total_minutes: 260_000,
  total_plays: 6100,
};
