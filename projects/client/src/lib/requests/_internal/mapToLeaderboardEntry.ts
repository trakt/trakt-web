import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import type { LeaderboardEntry } from '$lib/requests/models/LeaderboardEntry.ts';
import type { LeaderboardEntryResponse } from '$lib/requests/queries/users/userLeaderboardQuery.ts';
import type { ProfileResponse } from '@trakt/api';

export function mapToLeaderboardEntry(
  response: LeaderboardEntryResponse,
): LeaderboardEntry {
  // The leaderboard `user` object is the standard v2 Trakt user object, so it
  // maps through the same profile mapper as `/users/:id`.
  const user = mapToUserProfile(response.user as unknown as ProfileResponse);

  return {
    key: `leaderboard-${user.id}`,
    rank: response.rank,
    user,
    totalMinutes: response.total_minutes,
    totalPlays: response.total_plays,
    locked: response.locked,
    isViewer: false,
  };
}
