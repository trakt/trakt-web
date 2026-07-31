import type { UserProfile } from '$lib/requests/models/UserProfile.ts';

/**
 * The minimal profile shape the achievements engine reads from. Kept narrow so
 * callers can pass the display-safe profile subset (which omits `id`, `private`,
 * etc.) without a cast.
 */
export type VipAchievementProfile = Pick<
  UserProfile,
  'isDirector' | 'joinedAt'
>;
