import type { VipAchievement } from '../models/VipAchievement.ts';
import { achievementCatalog } from './achievementCatalog.ts';
import { isStreakFrozen } from './isStreakFrozen.ts';
import { resolveThresholds } from './resolveThresholds.ts';
import type { VipAchievementMetricInput } from './VipAchievementMetricInput.ts';

/**
 * Resolve the full achievement catalog against the member's loaded client data.
 * Pure: same inputs (including `now`) yield the same output, so the whole engine
 * is unit-testable without any reactive plumbing.
 */
export function computeVipAchievements(
  input: VipAchievementMetricInput,
): VipAchievement[] {
  const frozen = isStreakFrozen({
    expiresAt: input.subscription?.expiresAt ?? null,
    now: input.now,
  });

  return achievementCatalog.map((definition) => {
    const value = definition.metric(input);
    const { tierIndex, nextThreshold, progress, isMaxed } = resolveThresholds({
      value,
      thresholds: definition.thresholds,
    });

    const isUnlocked = tierIndex >= 0;

    return {
      id: definition.id,
      bucket: definition.bucket,
      title: definition.title(),
      description: definition.description(),
      value,
      tierIndex,
      tierCount: definition.thresholds.length,
      thresholds: definition.thresholds,
      nextThreshold,
      progress,
      isUnlocked,
      isMaxed,
      isFrozen: definition.freezable && isUnlocked && frozen,
    };
  });
}
