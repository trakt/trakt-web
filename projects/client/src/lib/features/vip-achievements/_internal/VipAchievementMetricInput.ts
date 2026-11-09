import type { UserFavorites } from '$lib/features/auth/queries/currentUserFavoritesQuery.ts';
import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserCollection } from '$lib/features/auth/stores/useCurrentUserCollection.ts';
import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { UserStats } from '$lib/requests/models/UserStats.ts';
import type { VipAchievementMilestone } from '../models/VipAchievementMilestone.ts';

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
  /** Milestones other features have awarded the member. */
  milestones: ReadonlySet<VipAchievementMilestone> | Nil;
  /** Client-loaded favorite movies and shows. */
  favorites: UserFavorites | Nil;
  /** Client-loaded collection (movie and episode ids). */
  collection: UserCollection | Nil;
  /** When the member joined Trakt. */
  joinedAt: Date | Nil;
  /** Reference "now" as epoch milliseconds (for time-since-joining). */
  now: number;
  /**
   * Public achievements earned so far, filled in by the engine before it
   * resolves the achievements that count the others.
   */
  earnedAchievements?: number;
};
