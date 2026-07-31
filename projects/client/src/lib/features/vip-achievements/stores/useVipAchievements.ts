import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { userStatsQuery } from '$lib/requests/queries/users/userStatsQuery.ts';
import { vipSubscriptionQuery } from '$lib/requests/vip/vipSubscriptionQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import { computeVipAchievements } from '../_internal/computeVipAchievements.ts';
import type { VipAchievementProfile } from '../models/VipAchievementProfile.ts';

/**
 * Reactive VIP achievement state for the current member. Combines the member's
 * own VIP subscription and lifetime stats with the already-loaded `useUser`
 * slices (history, ratings, limits, Plex library) and resolves the catalog
 * client-side - no backend writes, no achievement table.
 *
 * Follows the repo convention for query-driving hooks: the profile arrives as
 * an `Observable` (lift a rune with `fromRune`), never a bare value.
 */
export function useVipAchievements(
  profile$: Observable<VipAchievementProfile | Nil>,
) {
  const subscription = useQuery(vipSubscriptionQuery());
  const stats = useQuery(userStatsQuery({ slug: 'me' }));
  const { history, ratings, limits, plexLibrary } = useUser();

  const achievements = combineLatest([
    subscription,
    profile$,
    stats,
    history,
    ratings,
    limits,
    plexLibrary,
  ]).pipe(
    map((
      [
        subscriptionResult,
        profile,
        statsResult,
        history,
        ratings,
        limits,
        plex,
      ],
    ) =>
      computeVipAchievements({
        subscription: subscriptionResult.data,
        profile,
        stats: statsResult.data,
        history,
        ratings,
        limits,
        plexLibrary: plex,
        now: Date.now(),
      })
    ),
  );

  return {
    achievements,
    isLoading: subscription.pipe(map(toLoadingState)),
  };
}
