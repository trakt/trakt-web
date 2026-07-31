/**
 * The archetype an achievement belongs to. Buckets are the browsing axis in the
 * achievements drawer and are designed to grow - more achievements get added
 * under each over time.
 */
export type VipAchievementBucket =
  | 'volume'
  | 'binge'
  | 'timing'
  | 'ratings'
  | 'curation'
  | 'prestige';
