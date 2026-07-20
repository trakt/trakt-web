import type { UserLimits } from '$lib/requests/models/UserLimits.ts';

export const UserLimitsMappedMock: UserLimits = {
  history: { current: 1240, free: 1000, vip: 100000 },
  ratings: { current: 312, free: 1000, vip: 100000 },
  watchlistItems: { current: 48, free: 500, vip: 10000 },
  totalListItems: { current: 210, free: 1000, vip: 100000 },
  staticLists: { current: 2, free: 5, vip: 50 },
  dynamicLists: { current: 1, free: 3, vip: 50 },
  digitalLibrary: { current: 15, free: 50, vip: 10000 },
  totalNotes: { current: 6, free: 100, vip: 10000 },
  connectedApps: { current: 1, free: 1, vip: 50 },
};
