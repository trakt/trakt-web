import type { VipAchievementCategory } from '../models/VipAchievementCategory.ts';
import type { VipAchievementId } from '../models/VipAchievementId.ts';
import type { VipAchievementMetricInput } from './VipAchievementMetricInput.ts';

/**
 * Static definition of an achievement: the category it's listed under, how to
 * read its metric, the ascending tier thresholds it's measured against, and its
 * localized copy.
 */
export type VipAchievementDefinition = {
  id: VipAchievementId;
  category: VipAchievementCategory;
  /** Localized title (deferred so it re-resolves on locale change). */
  title: () => string;
  /** Localized description. */
  description: () => string;
  /** Localized instruction for reaching a tier, given that tier's threshold. */
  step: (threshold: number) => string;
  /** Ascending, positive tier thresholds. A single entry = a binary badge. */
  thresholds: ReadonlyArray<number>;
  /** Pure extractor mapping the loaded client data to this metric's value. */
  metric: (input: VipAchievementMetricInput) => number;
  /** Shown as "???" until earned, and left out of the total until then. */
  isSecret?: boolean;
  /**
   * Counts the member's other earned achievements, so the engine resolves it
   * after everything else.
   */
  countsOthers?: boolean;
};
