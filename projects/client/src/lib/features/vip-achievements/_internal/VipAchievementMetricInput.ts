import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserPlexLibrary } from '$lib/features/auth/queries/currentUserPlexLibraryQuery.ts';
import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { UserLimits } from '$lib/requests/models/UserLimits.ts';
import type { UserStats } from '$lib/requests/models/UserStats.ts';
import type { VipSubscription } from '$lib/requests/models/VipSubscription.ts';
import type { VipAchievementProfile } from '../models/VipAchievementProfile.ts';

/**
 * Everything the metric extractors read from. All fields are already-loaded
 * client-side data; each is nullable because slices load independently, so
 * metrics must degrade to `0` when their source is absent.
 */
export type VipAchievementMetricInput = {
  subscription: VipSubscription | Nil;
  profile: VipAchievementProfile | Nil;
  /** Lifetime server-aggregated totals (`/users/:id/stats`; null for free). */
  stats: UserStats | Nil;
  /** Client-computed watch history (movies + shows/episodes). */
  history: UserHistory | Nil;
  /** Client-loaded ratings across movies/shows/seasons/episodes. */
  ratings: UserRatings | Nil;
  /** VIP usage counters + free/vip ceilings per domain. */
  limits: UserLimits | Nil;
  /** Synced Plex library ids. */
  plexLibrary: UserPlexLibrary | Nil;
  /** Reference "now" as epoch milliseconds (for tenure/grace metrics). */
  now: number;
};
