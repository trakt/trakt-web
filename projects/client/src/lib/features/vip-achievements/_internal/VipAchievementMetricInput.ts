import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { UserStats } from '$lib/requests/models/UserStats.ts';

/**
 * Everything the metric extractors read from. All fields are already-loaded
 * client-side data; each is nullable because slices load independently, so
 * metrics must degrade to `0` when their source is absent.
 */
export type VipAchievementMetricInput = {
  /** Lifetime server-aggregated totals (`/users/me/stats`). */
  stats: UserStats | Nil;
  /** Client-computed watch history (movies + shows/episodes). */
  history: UserHistory | Nil;
  /** Client-loaded ratings across movies/shows/seasons/episodes. */
  ratings: UserRatings | Nil;
};
