import { describe, expect, it } from 'vitest';
import type { VipAchievement } from '../models/VipAchievement.ts';
import { toNewAchievementIds } from './toNewAchievementIds.ts';

function makeAchievement(
  overrides: Pick<VipAchievement, 'id' | 'tierIndex'>,
): VipAchievement {
  return {
    category: 'watching',
    title: overrides.id,
    description: '',
    nextStep: null,
    value: 0,
    tierCount: 4,
    thresholds: [1, 2, 3, 4],
    nextThreshold: null,
    progress: 0,
    isUnlocked: overrides.tierIndex >= 0,
    isMaxed: false,
    isHidden: false,
    ...overrides,
  };
}

const achievements = [
  makeAchievement({ id: 'century-club', tierIndex: 1 }),
  makeAchievement({ id: 'list-maker', tierIndex: 0 }),
  makeAchievement({ id: 'scribe', tierIndex: -1 }),
];

describe('util: toNewAchievementIds', () => {
  it('should treat everything earned as new on a first visit', () => {
    expect([...toNewAchievementIds({ achievements, seen: {} })]).toEqual([
      'century-club',
      'list-maker',
    ]);
  });

  it('should flag only unlocks and tier-ups since the last visit', () => {
    const seen = { 'century-club': 0, 'list-maker': 0 };

    expect([...toNewAchievementIds({ achievements, seen })]).toEqual([
      'century-club',
    ]);
  });

  it('should never flag a locked achievement', () => {
    expect(toNewAchievementIds({ achievements, seen: {} }).has('scribe')).toBe(
      false,
    );
  });
});
