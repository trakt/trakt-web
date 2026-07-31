import type { VipAchievementBucket } from '../models/VipAchievementBucket.ts';
import type { VipAchievementId } from '../models/VipAchievementId.ts';
import type { VipAchievementMetricInput } from './VipAchievementMetricInput.ts';

/**
 * Static definition of a VIP achievement: which bucket it lives in, how to read
 * its metric, the ascending tier thresholds it's measured against, whether its
 * streak can be frozen during the grace period, and its localized copy.
 */
export type VipAchievementDefinition = {
  id: VipAchievementId;
  bucket: VipAchievementBucket;
  /** Localized title (deferred so it re-resolves on locale change). */
  title: () => string;
  /** Localized description. */
  description: () => string;
  /** Ascending, positive tier thresholds. A single entry = a binary badge. */
  thresholds: ReadonlyArray<number>;
  /** Whether this achievement's streak is protected during the grace period. */
  freezable: boolean;
  /** Pure extractor mapping the loaded client data to this metric's value. */
  metric: (input: VipAchievementMetricInput) => number;
};
