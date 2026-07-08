import type { UserStats } from '$lib/requests/models/UserStats.ts';

export const UserStatsFreeMappedMock: UserStats = {
  movies: {
    plays: 1,
    watched: 1,
    minutes: 109,
    ratings: 1,
    comments: 0,
  },
  shows: {
    watched: 1,
    ratings: 0,
    comments: 0,
  },
  seasons: {
    ratings: 0,
    comments: 0,
  },
  episodes: {
    plays: 1,
    watched: 1,
    minutes: 66,
    ratings: 0,
    comments: 0,
  },
  network: {
    followers: 0,
    following: 0,
  },
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
  progress: null,
  lists: null,
  totalMinutes: 175,
  totalPlays: 2,
};
