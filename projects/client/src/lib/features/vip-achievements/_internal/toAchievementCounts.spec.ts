import { describe, expect, it } from 'vitest';
import type { VipAchievement } from '../models/VipAchievement.ts';
import { toAchievementCounts } from './toAchievementCounts.ts';

function makeAchievement(
  overrides: Pick<VipAchievement, 'id' | 'isUnlocked' | 'isHidden'>,
): VipAchievement {
  return {
    category: 'watching',
    title: overrides.id,
    description: '',
    nextStep: null,
    value: 0,
    tierIndex: overrides.isUnlocked ? 0 : -1,
    tierCount: 1,
    thresholds: [1],
    nextThreshold: null,
    progress: 0,
    isMaxed: false,
    ...overrides,
  };
}

describe('util: toAchievementCounts', () => {
  it('should leave secrets still to be found out of the total', () => {
    const counts = toAchievementCounts([
      makeAchievement({
        id: 'century-club',
        isUnlocked: true,
        isHidden: false,
      }),
      makeAchievement({ id: 'list-maker', isUnlocked: false, isHidden: false }),
      makeAchievement({ id: 'countdown', isUnlocked: false, isHidden: true }),
    ]);

    expect(counts).toEqual({ earned: 1, total: 2 });
  });

  it('should count a found secret in both', () => {
    const counts = toAchievementCounts([
      makeAchievement({
        id: 'century-club',
        isUnlocked: true,
        isHidden: false,
      }),
      makeAchievement({ id: 'countdown', isUnlocked: true, isHidden: false }),
    ]);

    expect(counts).toEqual({ earned: 2, total: 2 });
  });
});
