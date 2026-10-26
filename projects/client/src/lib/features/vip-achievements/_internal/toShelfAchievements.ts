import type { VipAchievement } from '../models/VipAchievement.ts';
import type { VipAchievementId } from '../models/VipAchievementId.ts';

type ToShelfAchievementsParams = {
  achievements: ReadonlyArray<VipAchievement>;
  newIds: ReadonlySet<VipAchievementId>;
  limit: number;
};

const tierShare = (achievement: VipAchievement) =>
  (achievement.tierIndex + 1) / achievement.tierCount;

/**
 * The few earned pins the drawer's summary shows off: fresh unlocks first,
 * then the ones furthest up their tiers, in catalog order on a tie. A fixed
 * handful, so the summary reads the same at 13 achievements or 100.
 */
export function toShelfAchievements({
  achievements,
  newIds,
  limit,
}: ToShelfAchievementsParams): ReadonlyArray<VipAchievement> {
  return achievements
    .map((achievement, order) => ({ achievement, order }))
    .filter(({ achievement }) => achievement.isUnlocked)
    .toSorted(
      (a, b) =>
        Number(newIds.has(b.achievement.id)) -
          Number(newIds.has(a.achievement.id)) ||
        tierShare(b.achievement) - tierShare(a.achievement) ||
        a.order - b.order,
    )
    .slice(0, limit)
    .map(({ achievement }) => achievement);
}
