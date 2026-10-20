import type { VipAchievement } from '../models/VipAchievement.ts';
import { achievementCatalog } from './achievementCatalog.ts';
import { resolveThresholds } from './resolveThresholds.ts';
import type { VipAchievementMetricInput } from './VipAchievementMetricInput.ts';

/**
 * Resolve the full achievement catalog against the member's loaded client data.
 * Pure: same inputs yield the same output, so the whole engine is unit-testable
 * without any reactive plumbing.
 */
export function computeVipAchievements(
  input: VipAchievementMetricInput,
): VipAchievement[] {
  return achievementCatalog.map((definition) => {
    const value = definition.metric(input);
    const { tierIndex, nextThreshold, progress, isMaxed } = resolveThresholds({
      value,
      thresholds: definition.thresholds,
    });

    return {
      id: definition.id,
      category: definition.category,
      title: definition.title(),
      description: definition.description(),
      nextStep: nextThreshold === null ? null : definition.step(nextThreshold),
      value,
      tierIndex,
      tierCount: definition.thresholds.length,
      thresholds: definition.thresholds,
      nextThreshold,
      progress,
      isUnlocked: tierIndex >= 0,
      isMaxed,
    };
  });
}
