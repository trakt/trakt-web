import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { isStreakAnniversary } from './isStreakAnniversary.ts';
import { toVipTierTitle } from './toVipTierTitle.ts';
import { VIP_VETERAN_LADDER } from './VIP_VETERAN_LADDER.ts';
import type { VipVeteranCelebration } from './VipVeteranCelebration.ts';
import type { VipTierTitle } from './VipTierTitle.ts';
import type { VipVeteranMemory } from './VipVeteranMemory.ts';

type SelectCelebrationParams = {
  veteran: VipVeteran;
  memory: VipVeteranMemory | null;
  today: Date;
};

type SelectedCelebration = {
  celebration: VipVeteranCelebration | null;
  memory: VipVeteranMemory;
};

const EMPTY_MEMORY: VipVeteranMemory = {
  title: null,
  anniversaryYear: null,
  graceShownOn: null,
};

function toRank(title: VipTierTitle | null) {
  return VIP_VETERAN_LADDER.findIndex((rung) => rung.title === title);
}

function highestTitle(
  a: VipTierTitle | null,
  b: VipTierTitle | null,
): VipVeteranMemory['title'] {
  return (toRank(a) >= toRank(b) ? a : b) ?? null;
}

function isAnniversaryDue({ veteran, memory, today }: SelectCelebrationParams) {
  return (
    veteran.years >= 1 &&
    memory?.anniversaryYear !== today.getUTCFullYear() &&
    isStreakAnniversary(veteran.since, today)
  );
}

export function selectVipVeteranCelebration(
  params: SelectCelebrationParams,
): SelectedCelebration {
  const { veteran, memory, today } = params;
  const title = toVipTierTitle(veteran.tier);
  const previous = memory ?? EMPTY_MEMORY;
  const isAnniversary = isAnniversaryDue(params);
  const isPromotion = memory != null && toRank(title) > toRank(memory.title);

  const next: VipVeteranMemory = {
    ...previous,
    title: highestTitle(title, previous.title),
    anniversaryYear: isAnniversary
      ? today.getUTCFullYear()
      : previous.anniversaryYear,
  };

  if (isPromotion) {
    return {
      celebration: { kind: 'promotion', from: previous.title },
      memory: next,
    };
  }

  if (isAnniversary) {
    return { celebration: { kind: 'anniversary' }, memory: next };
  }

  return { celebration: null, memory: next };
}
