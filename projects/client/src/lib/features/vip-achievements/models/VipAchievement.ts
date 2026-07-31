import type { VipAchievementBucket } from './VipAchievementBucket.ts';
import type { VipAchievementId } from './VipAchievementId.ts';

/**
 * A VIP achievement resolved against the member's current metrics. Achievements
 * are tiered: `value` is measured against a chain of thresholds, and the card
 * shows the reached tier plus progress toward the next one. All labels are
 * localized and progress is precomputed.
 */
export type VipAchievement = {
  id: VipAchievementId;
  bucket: VipAchievementBucket;
  /** Localized achievement title. */
  title: string;
  /** Localized achievement description. */
  description: string;
  /** Raw metric value backing this achievement. */
  value: number;
  /** Zero-based index of the highest reached tier, or `-1` while locked. */
  tierIndex: number;
  /** Total number of tiers in this achievement's threshold chain. */
  tierCount: number;
  /** The full ascending tier threshold chain (for the "what's next" tooltip). */
  thresholds: ReadonlyArray<number>;
  /** Threshold of the next tier, or `null` once the top tier is reached. */
  nextThreshold: number | null;
  /** Progress toward the next tier, `0..1` (always `1` once maxed). */
  progress: number;
  /** `true` once at least the first tier is reached. */
  isUnlocked: boolean;
  /** `true` once the highest tier is reached. */
  isMaxed: boolean;
  /**
   * `true` when a lapsed membership's streak is temporarily protected during
   * the grace period. Only ever set on freezable achievements that are already
   * unlocked.
   */
  isFrozen: boolean;
};
