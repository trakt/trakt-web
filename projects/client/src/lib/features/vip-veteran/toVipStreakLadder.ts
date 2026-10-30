import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import type { MemberLadderTier } from './MemberLadderTier.ts';
import { toVipVeteranRung } from './toVipVeteranRung.ts';
import { VIP_VETERAN_LADDER } from './VIP_VETERAN_LADDER.ts';
import type { VipStreakRung } from './VipStreakRung.ts';

type VipStreakLadder = {
  rungs: ReadonlyArray<VipStreakRung>;
  next: {
    tier: number;
    memberTier: MemberLadderTier;
    yearsLeft: number;
  } | null;
};

export function toVipStreakLadder(veteran: VipVeteran): VipStreakLadder {
  const current = toVipVeteranRung(veteran);
  const rungs = VIP_VETERAN_LADDER.map((rung) => ({
    ...rung,
    isReached: veteran.years >= rung.tier,
    isCurrent: current?.tier === rung.tier,
  }));

  const next = VIP_VETERAN_LADDER.find((rung) => rung.tier > veteran.years);

  return {
    rungs,
    next: next
      ? {
          tier: next.tier,
          memberTier: next.memberTier,
          yearsLeft: next.tier - veteran.years,
        }
      : null,
  };
}
