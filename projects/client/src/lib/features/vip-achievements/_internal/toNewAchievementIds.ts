import type { VipAchievement } from '../models/VipAchievement.ts';
import type { VipAchievementId } from '../models/VipAchievementId.ts';
import type { SeenAchievementTiers } from './SeenAchievementTiers.ts';

type ToNewAchievementIdsParams = {
  achievements: ReadonlyArray<VipAchievement>;
  seen: SeenAchievementTiers;
};

/**
 * Achievements whose reached tier is higher than the last one the member saw
 * in the drawer: everything earned on a first visit, then only fresh unlocks
 * and tier-ups.
 */
export function toNewAchievementIds({
  achievements,
  seen,
}: ToNewAchievementIdsParams): ReadonlySet<VipAchievementId> {
  return new Set(
    achievements
      .filter(
        (achievement) =>
          achievement.isUnlocked &&
          achievement.tierIndex > (seen[achievement.id] ?? -1),
      )
      .map((achievement) => achievement.id),
  );
}
