import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { userStatsQuery } from '$lib/requests/queries/users/userStatsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, map } from 'rxjs';
import { computeVipAchievements } from '../_internal/computeVipAchievements.ts';

/**
 * Reactive achievement state for the signed-in member. Combines their lifetime
 * stats with the already-loaded `useUser` slices (history, ratings) and
 * resolves the catalog client-side - no backend writes, no achievement table.
 */
export function useVipAchievements() {
  const stats = useQuery(userStatsQuery({ slug: 'me' }));
  const { history, ratings } = useUser();

  const achievements = combineLatest([stats, history, ratings]).pipe(
    map(([statsResult, history, ratings]) =>
      computeVipAchievements({
        stats: statsResult.data,
        history,
        ratings,
      }),
    ),
  );

  return {
    achievements,
    isLoading: stats.pipe(map(toLoadingState)),
  };
}
