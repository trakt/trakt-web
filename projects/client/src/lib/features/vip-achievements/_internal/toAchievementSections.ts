import type { VipAchievement } from '../models/VipAchievement.ts';
import type { VipAchievementCategory } from '../models/VipAchievementCategory.ts';
import { achievementCategories } from './achievementCategories.ts';

export type AchievementSection = {
  id: VipAchievementCategory;
  title: string;
  unlockedCount: number;
  totalCount: number;
  /** What the section lists: unlocked first, then locked when revealed. */
  achievements: ReadonlyArray<VipAchievement>;
};

type ToAchievementSectionsParams = {
  achievements: ReadonlyArray<VipAchievement>;
  showLocked: boolean;
};

/**
 * Group resolved achievements into the drawer's category sections. Revealing
 * the locked ones appends them after the unlocked ones rather than slotting
 * them back into catalog order, so rows already on screen stay put. Sections
 * with nothing to list are dropped.
 */
export function toAchievementSections({
  achievements,
  showLocked,
}: ToAchievementSectionsParams): AchievementSection[] {
  return achievementCategories
    .map((category) => {
      const members = achievements.filter(
        (achievement) => achievement.category === category.id,
      );
      const unlocked = members.filter((achievement) => achievement.isUnlocked);
      const locked = members.filter((achievement) => !achievement.isUnlocked);

      return {
        id: category.id,
        title: category.title(),
        unlockedCount: unlocked.length,
        totalCount: members.length,
        achievements: showLocked ? [...unlocked, ...locked] : unlocked,
      };
    })
    .filter((section) => section.achievements.length > 0);
}
