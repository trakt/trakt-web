import { m } from '$lib/features/i18n/messages.ts';
import type { VipAchievement } from '../models/VipAchievement.ts';
import { achievementCatalog } from './achievementCatalog.ts';
import { resolveThresholds } from './resolveThresholds.ts';
import type { VipAchievementDefinition } from './VipAchievementDefinition.ts';
import type { VipAchievementMetricInput } from './VipAchievementMetricInput.ts';

const resolveAchievement = (
  definition: VipAchievementDefinition,
  input: VipAchievementMetricInput,
): VipAchievement => {
  const value = definition.metric(input);
  const { tierIndex, nextThreshold, progress, isMaxed } = resolveThresholds({
    value,
    thresholds: definition.thresholds,
  });
  const isUnlocked = tierIndex >= 0;
  // A secret still to be found gives nothing away: no name, no hint.
  const isHidden = Boolean(definition.isSecret) && !isUnlocked;

  return {
    id: definition.id,
    category: definition.category,
    title: isHidden ? m.vip_achievements_secret_title() : definition.title(),
    description: isHidden
      ? m.vip_achievements_secret_description()
      : definition.description(),
    nextStep:
      isHidden || nextThreshold === null
        ? null
        : definition.step(nextThreshold),
    value,
    tierIndex,
    tierCount: definition.thresholds.length,
    thresholds: definition.thresholds,
    nextThreshold,
    progress,
    isUnlocked,
    isMaxed,
    isHidden,
  };
};

/**
 * Resolve the full achievement catalog against the member's loaded client data.
 * Achievements that count the others resolve last, from what the rest earned.
 * Pure: same inputs yield the same output, so the whole engine is unit-testable
 * without any reactive plumbing.
 */
export function computeVipAchievements(
  input: VipAchievementMetricInput,
): VipAchievement[] {
  const resolved = new Map(
    achievementCatalog
      .filter((definition) => !definition.countsOthers)
      .map((definition) => [
        definition.id,
        resolveAchievement(definition, input),
      ]),
  );

  const earnedAchievements = achievementCatalog.filter(
    (definition) =>
      !definition.isSecret && resolved.get(definition.id)?.isUnlocked,
  ).length;

  return achievementCatalog.map(
    (definition) =>
      resolved.get(definition.id) ??
      resolveAchievement(definition, { ...input, earnedAchievements }),
  );
}
