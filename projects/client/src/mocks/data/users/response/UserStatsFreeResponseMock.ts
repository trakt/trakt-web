import type { UserStatsResponse } from '$lib/requests/queries/users/userStatsQuery.ts';

export const UserStatsFreeResponseMock: UserStatsResponse = {
  seasons: { ratings: 0, comments: 0 },
  shows: { ratings: 0, comments: 0, watched: 1 },
  movies: {
    ratings: 1,
    comments: 0,
    watched: 1,
    plays: 1,
    minutes: 109,
  },
  episodes: {
    ratings: 0,
    comments: 0,
    watched: 1,
    plays: 1,
    minutes: 66,
  },
  network: { followers: 0, following: 0 },
  ratings: {
    total: 1,
    distribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 1,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    },
  },
};
