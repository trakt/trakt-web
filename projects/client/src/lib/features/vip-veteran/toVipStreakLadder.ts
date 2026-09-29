import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { VIP_VETERAN_LADDER } from './VIP_VETERAN_LADDER.ts';
import type { VipStreakRung } from './VipStreakRung.ts';

type VipStreakLadder = {
  rungs: ReadonlyArray<VipStreakRung>;
  next: { tier: number; title: VipVeteran['title']; yearsLeft: number } | null;
};

export function toVipStreakLadder(veteran: VipVeteran): VipStreakLadder {
  const rungs = VIP_VETERAN_LADDER.map((rung) => ({
    ...rung,
    isReached: veteran.years >= rung.tier,
    isCurrent: veteran.tier === rung.tier,
  }));

  const next = VIP_VETERAN_LADDER.find((rung) => rung.tier > veteran.years);

  return {
    rungs,
    next: next
      ? {
        tier: next.tier,
        title: next.title,
        yearsLeft: next.tier - veteran.years,
      }
      : null,
  };
}
