import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { USER_TIER_LADDER } from './USER_TIER_LADDER.ts';
import type { UserTierRung } from './UserTierRung.ts';
import { toLadderTier } from './toLadderTier.ts';
import type { VipStreakRung } from './VipStreakRung.ts';

type VipStreakLadder = {
  rungs: ReadonlyArray<VipStreakRung>;
  next: (UserTierRung & { yearsLeft: number }) | null;
};

export function toVipStreakLadder(veteran: VipVeteran): VipStreakLadder {
  const current = toLadderTier(veteran.title);
  const currentIndex = USER_TIER_LADDER.findIndex(
    (rung) => rung.userTier === current,
  );
  const rungs = USER_TIER_LADDER.map((rung, index) => ({
    ...rung,
    isReached: index <= currentIndex,
    isCurrent: index === currentIndex,
  }));

  const next = USER_TIER_LADDER.at(currentIndex + 1);

  return {
    rungs,
    next: next
      ? { ...next, yearsLeft: Math.max(next.tier - veteran.years, 0) }
      : null,
  };
}
