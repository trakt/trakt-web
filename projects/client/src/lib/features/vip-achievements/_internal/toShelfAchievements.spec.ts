import { describe, expect, it } from 'vitest';
import type { VipAchievement } from '../models/VipAchievement.ts';
import { toShelfAchievements } from './toShelfAchievements.ts';

function makeAchievement(
  overrides: Pick<VipAchievement, 'id' | 'tierIndex' | 'tierCount'>,
): VipAchievement {
  return {
    category: 'watching',
    title: overrides.id,
    description: '',
    nextStep: null,
    value: 0,
    thresholds: [],
    nextThreshold: null,
    progress: 0,
    isUnlocked: overrides.tierIndex >= 0,
    isMaxed: overrides.tierIndex === overrides.tierCount - 1,
    isHidden: false,
    ...overrides,
  };
}

const achievements = [
  makeAchievement({ id: 'century-club', tierIndex: 1, tierCount: 4 }),
  makeAchievement({ id: 'time-spent-episodes', tierIndex: 1, tierCount: 3 }),
  makeAchievement({ id: 'scribe', tierIndex: -1, tierCount: 4 }),
  makeAchievement({ id: 'opening-credits', tierIndex: 0, tierCount: 1 }),
  makeAchievement({ id: 'daily-streak', tierIndex: 1, tierCount: 4 }),
];

const ids = (shelf: ReadonlyArray<VipAchievement>) =>
  shelf.map((achievement) => achievement.id);

describe('util: toShelfAchievements', () => {
  it('should show the pins furthest up their tiers', () => {
    expect(
      ids(toShelfAchievements({ achievements, newIds: new Set(), limit: 3 })),
    ).toEqual(['opening-credits', 'time-spent-episodes', 'century-club']);
  });

  it('should put fresh unlocks first', () => {
    expect(
      ids(
        toShelfAchievements({
          achievements,
          newIds: new Set(['daily-streak']),
          limit: 3,
        }),
      ),
    ).toEqual(['daily-streak', 'opening-credits', 'time-spent-episodes']);
  });

  it('should never show a locked achievement', () => {
    expect(
      ids(toShelfAchievements({ achievements, newIds: new Set(), limit: 10 })),
    ).not.toContain('scribe');
  });
});
