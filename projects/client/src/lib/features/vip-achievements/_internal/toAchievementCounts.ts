import type { VipAchievement } from '../models/VipAchievement.ts';

type AchievementCounts = {
  earned: number;
  total: number;
};

/**
 * Earned out of total, as the header link and the drawer show it. A secret
 * still to be found is left out of both, so finding one grows the total.
 */
export function toAchievementCounts(
  achievements: ReadonlyArray<VipAchievement>,
): AchievementCounts {
  const counted = achievements.filter((achievement) => !achievement.isHidden);

  return {
    earned: counted.filter((achievement) => achievement.isUnlocked).length,
    total: counted.length,
  };
}
