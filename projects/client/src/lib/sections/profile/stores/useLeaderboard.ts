import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { LeaderboardEntry } from '$lib/requests/models/LeaderboardEntry.ts';
import { userLeaderboardQuery } from '$lib/requests/queries/users/userLeaderboardQuery.ts';
import { userStatsQuery } from '$lib/requests/queries/users/userStatsQuery.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, map } from 'rxjs';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { toViewerProfile } from './_internal/toViewerProfile.ts';

type UseLeaderboardProps = {
  slug: string;
  limit: number;
};

// Slot the VIP viewer among the ranked entries by minutes (matching the
// server's ranking), then renumber the ranked rows so the viewer gets a real
// position and the follows below shift down by one. Locked/free rows stay
// unranked. Free viewers are not woven in - they get the pinned card instead.
function injectViewer(
  entries: LeaderboardEntry[],
  viewer: LeaderboardEntry,
): LeaderboardEntry[] {
  const metricOf = (entry: LeaderboardEntry) => entry.totalMinutes ?? 0;
  const viewerMetric = viewer.totalMinutes ?? 0;

  const match = entries.findIndex(
    (entry) => entry.locked || metricOf(entry) < viewerMetric,
  );
  const insertAt = match === -1 ? entries.length : match;

  const combined = [
    ...entries.slice(0, insertAt),
    viewer,
    ...entries.slice(insertAt),
  ];

  let position = 0;
  return combined.map((entry) => {
    if (entry.locked) {
      return entry;
    }
    position += 1;
    return { ...entry, rank: position };
  });
}

function weaveViewer(
  entries: LeaderboardEntry[],
  viewer: LeaderboardEntry | null,
): LeaderboardEntry[] {
  if (!viewer) {
    return entries;
  }

  // Defensive: if the viewer somehow appears in the payload, highlight that row
  // rather than duplicating.
  const ownIndex = entries.findIndex(
    (entry) => entry.user.id === viewer.user.id,
  );
  if (ownIndex !== -1) {
    return entries.map((entry, index) =>
      index === ownIndex ? { ...entry, isViewer: true } : entry
    );
  }

  return injectViewer(entries, viewer);
}

export function useLeaderboard({ slug, limit }: UseLeaderboardProps) {
  const {
    list,
    isLoading: listLoading,
    hasNextPage,
    fetchNextPage,
  } = usePaginatedListQuery(userLeaderboardQuery({ slug, limit }));

  const { user } = useUser();
  const { isAuthorized } = useAuth();

  // Only VIP viewers are woven into the ranking - their minutes come from their
  // own `/stats` (the same metric the leaderboard ranks by). Free viewers 404
  // there and are surfaced via the pinned card (`useLeaderboardViewer`) instead.
  const ownStats = useQuery(userStatsQuery({ slug: 'me' }));

  const listWithViewer = combineLatest([list, user, isAuthorized, ownStats])
    .pipe(
      map(([loaded, currentUser, authorized, stats]): LeaderboardEntry[] => {
        // Hold the list until the viewer's own stats settle, so the woven VIP
        // row is painted in its final sorted position instead of popping in
        // and re-sorting the list.
        if (toLoadingState(stats)) {
          return [];
        }

        const viewer: LeaderboardEntry | null =
          authorized && currentUser && stats.data
            ? {
              key: 'leaderboard-viewer',
              rank: null,
              user: toViewerProfile(currentUser),
              totalMinutes: stats.data.totalMinutes,
              totalPlays: stats.data.totalPlays,
              locked: false,
              isViewer: true,
            }
            : null;

        return weaveViewer(loaded, viewer);
      }),
      multicast(),
    );

  // Keep the spinner up until both the list and the viewer's stats are ready,
  // so nothing paints in a half-sorted state.
  const isLoading = combineLatest([listLoading, ownStats]).pipe(
    map(([loading, stats]) => loading || toLoadingState(stats)),
  );

  return { list: listWithViewer, isLoading, hasNextPage, fetchNextPage };
}
