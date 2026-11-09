import { describe, expect, it } from 'vitest';
import type { VipAchievement } from '../models/VipAchievement.ts';
import { achievementCatalog } from './achievementCatalog.ts';
import { achievementCategories } from './achievementCategories.ts';
import { toAchievementSections } from './toAchievementSections.ts';

function makeAchievement(
  overrides: Partial<VipAchievement> & Pick<VipAchievement, 'id' | 'category'>,
): VipAchievement {
  return {
    title: overrides.id,
    description: '',
    nextStep: null,
    value: 0,
    tierIndex: -1,
    tierCount: 1,
    thresholds: [1],
    nextThreshold: 1,
    progress: 0,
    isUnlocked: false,
    isMaxed: false,
    isHidden: false,
    ...overrides,
  };
}

const achievements: VipAchievement[] = [
  makeAchievement({ id: 'century-club', category: 'watching' }),
  makeAchievement({
    id: 'show-completionist',
    category: 'watching',
    isUnlocked: true,
  }),
  makeAchievement({ id: 'daily-streak', category: 'habits' }),
  makeAchievement({ id: 'list-maker', category: 'lists', isUnlocked: true }),
];

describe('util: toAchievementSections', () => {
  it('should give every catalog category a drawer section', () => {
    const sectionIds = new Set(
      achievementCategories.map((category) => category.id),
    );

    achievementCatalog.forEach((definition) => {
      expect(sectionIds.has(definition.category)).toBe(true);
    });
  });

  it('should list sections in category order with their counts', () => {
    const sections = toAchievementSections({ achievements, showLocked: true });

    expect(sections.map((section) => section.id)).toEqual([
      'watching',
      'habits',
      'lists',
    ]);
    expect(sections.at(0)?.unlockedCount).toBe(1);
    expect(sections.at(0)?.totalCount).toBe(2);
  });

  it('should put unlocked achievements before locked ones', () => {
    const sections = toAchievementSections({ achievements, showLocked: true });

    expect(sections.at(0)?.achievements.map((a) => a.id)).toEqual([
      'show-completionist',
      'century-club',
    ]);
  });

  it('should hide locked achievements and empty sections when asked', () => {
    const sections = toAchievementSections({ achievements, showLocked: false });

    expect(sections.map((section) => section.id)).toEqual([
      'watching',
      'lists',
    ]);
    expect(sections.at(0)?.achievements.map((a) => a.id)).toEqual([
      'show-completionist',
    ]);
    expect(sections.at(0)?.totalCount).toBe(2);
  });
});
