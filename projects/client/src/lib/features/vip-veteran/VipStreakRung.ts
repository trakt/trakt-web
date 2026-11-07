import type { UserTierRung } from './UserTierRung.ts';

export type VipStreakRung = UserTierRung & {
  isReached: boolean;
  isCurrent: boolean;
};
