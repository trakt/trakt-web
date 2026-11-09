import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { userStatsQuery } from '$lib/requests/queries/users/userStatsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import { computeVipAchievements } from '../_internal/computeVipAchievements.ts';
import type { VipAchievementMilestone } from '../models/VipAchievementMilestone.ts';

/**
 * Reactive achievement state for the signed-in member. Combines their lifetime
 * stats with the already-loaded `useUser` slices (history, ratings, favorites,
 * collection, account) and the milestones other features award, and resolves
 * the catalog client-side - no backend writes, no achievement table.
 */
export function useVipAchievements(
  milestones$: Observable<ReadonlySet<VipAchievementMilestone>>,
) {
  const stats = useQuery(userStatsQuery({ slug: 'me' }));
  const { user, history, ratings, favorites, collection } = useUser();

  const achievements = combineLatest([
    stats,
    user,
    history,
    ratings,
    favorites,
    collection,
    milestones$,
  ]).pipe(
    map(
      ([
        statsResult,
        user,
        history,
        ratings,
        favorites,
        collection,
        milestones,
      ]) =>
        computeVipAchievements({
          stats: statsResult.data,
          history,
          ratings,
          milestones,
          favorites,
          collection,
          joinedAt: user?.joinedAt,
          now: Date.now(),
        }),
    ),
  );

  return {
    achievements,
    isLoading: stats.pipe(map(toLoadingState)),
  };
}
