import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { combineLatest, map } from 'rxjs';
import { computeUserStats } from './_internal/computeUserStats.ts';
import { toViewerProfile } from './_internal/toViewerProfile.ts';

export type LeaderboardViewer = {
  user: UserProfile;
  plays: number;
};

/**
 * The free viewer's own leaderboard card: their profile + locally computed
 * plays. VIP viewers are ranked in the list instead, so they return `null`.
 */
export function useLeaderboardViewer() {
  const { user, history, ratings } = useUser();
  const { isAuthorized } = useAuth();

  const viewer = combineLatest([user, isAuthorized, history, ratings]).pipe(
    map(
      (
        [currentUser, authorized, userHistory, userRatings],
      ): LeaderboardViewer | null => {
        if (!authorized || !currentUser || currentUser.isVip) {
          return null;
        }

        if (!userHistory || !userRatings) {
          return null;
        }

        const { totalPlays } = computeUserStats({
          history: userHistory,
          ratings: userRatings,
        });

        return { user: toViewerProfile(currentUser), plays: totalPlays };
      },
    ),
    multicast(),
  );

  return { viewer };
}
